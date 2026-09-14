/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import type { CashierMapItem, OutletMapHistory } from "@/services/types";
import {
  DEVICE_STATUS_COLOR,
  DEVICE_STATUS_LABEL,
  currencyFormat,
  deviceStatusColor,
  deviceStatusFromRow,
} from "@/utils";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

/**
 * Warna titik history lama & garis jejak — sengaja biru agar tidak ketuker
 * dengan marker "offline" (abu-abu).
 */
const HISTORY_COLOR = "#3b82f6";

/** Radius marker (px). Semua titik sama besar. */
const MARKER_RADIUS = 12;

const validHistory = (row?: CashierMapItem): OutletMapHistory[] =>
  (row?.historys ?? []).filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  );

/**
 * Titik yang digambar untuk satu baris: jejak `historys` kalau ada, kalau tidak
 * satu titik di posisi device terakhir (`last_latitude`/`last_longitude`).
 */
const rowPoints = (row: CashierMapItem): OutletMapHistory[] => {
  const history = validHistory(row);
  if (history.length > 0) return history;

  const { last_latitude, last_longitude } = row;
  if (!last_latitude || !last_longitude) return [];

  return [
    {
      latitude: last_latitude,
      longitude: last_longitude,
      created_at: row.last_activity_at ?? "",
    },
  ];
};

const escapeHtml = (value: unknown) =>
  String(value ?? "-").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

/** Satu titik GPS milik seorang operator. */
interface CashierPoint {
  row: CashierMapItem;
  point: OutletMapHistory;
  /** Urutan titik pada history operator (0-based). */
  index: number;
  /** Titik terakhir = posisi terkini operator. */
  isLatest: boolean;
  /** Status terkini operator (dari `status` BE / log terakhir) — warna marker terkini. */
  status: string;
  /** Kunci unik fitur di map (operator + urutan titik). */
  key: string;
}

const buildPopupHtml = ({ row, point, index, isLatest }: CashierPoint) => {
  return `
  <div style="padding: 14px 16px; font-family: 'Inter', sans-serif; min-width: 210px;">
    <div style="font-size: 14px; font-weight: 800; color: #111827; margin-bottom: 4px; padding-right: 24px;">${escapeHtml(
      row.cashier_name,
    )}</div>
    ${
      row.outlet_name
        ? `<div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">${escapeHtml(row.outlet_name)}</div>`
        : ""
    }

    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #4b5563;">
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Titik</span>
        <span style="font-weight: 700; color: #1f2937;">
          #${index + 1}${isLatest ? " (terkini)" : ""}
        </span>
      </div>
      ${
        point.created_at
          ? `<div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #9ca3af;">Waktu</span>
              <span style="font-weight: 600; color: #6b7280;">${escapeHtml(point.created_at)}</span>
            </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Battery</span>
        <span style="font-weight: 700; color: #1f2937;">${escapeHtml(
          point.battery_health || row.last_battery_health || "-",
        )}</span>
      </div>
      ${
        point.total_transactions != null
          ? `<div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #9ca3af;">Transaksi di titik ini</span>
              <span style="font-weight: 700; color: #1f2937;">${point.total_transactions}</span>
            </div>`
          : ""
      }
      ${
        point.total_charges != null
          ? `<div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #9ca3af;">Omset di titik ini</span>
              <span style="font-weight: 800; color: #047857;">${escapeHtml(
                currencyFormat(point.total_charges),
              )}</span>
            </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; gap: 12px;">
        <span style="color: #9ca3af;">Posisi</span>
        <span style="font-weight: 600; color: #6b7280;">${point.latitude.toFixed(
          5,
        )}, ${point.longitude.toFixed(5)}</span>
      </div>
    </div>
  </div>`;
};

interface CashierLiveMapProps {
  /** Baris yang digambar: operator dengan jejak `historys` atau hanya posisi terakhir. */
  items: CashierMapItem[];
  /** ID operator yang jejaknya digambar. */
  selectedId?: string | null;
  /** Dipanggil saat marker operator diklik. */
  onSelect?: (cashierId: string) => void;
  className?: string;
}

/**
 * Peta live posisi device operator. Setiap titik history digambar sebagai marker:
 * titik terkini berwarna sesuai status device, titik sebelumnya biru. Tooltip berisi
 * info titik (waktu, battery, transaksi/omset, posisi) tanpa label status. Jejak
 * (garis) operator terpilih digambar di atasnya.
 *
 * Komponen ini memuat `mapbox-gl`, jadi konsumennya WAJIB lazy-load.
 */
export function CashierLiveMap({
  items,
  selectedId,
  onSelect,
  className,
}: CashierLiveMapProps) {
  const points = useMemo<CashierPoint[]>(
    () =>
      items.flatMap((row) => {
        const history = rowPoints(row);
        const status = deviceStatusFromRow(
          row.status,
          row.last_activity_at ?? history[history.length - 1]?.created_at,
        );
        return history.map((point, index) => ({
          row,
          point,
          index,
          status,
          isLatest: index === history.length - 1,
          key: `${row.cashier_id}-${index}`,
        }));
      }),
    [items],
  );

  const trail = useMemo(
    () =>
      selectedId
        ? validHistory(items.find((r) => r.cashier_id === selectedId))
        : [],
    [items, selectedId],
  );

  const firstPoint = points[0];
  const center: [number, number] = firstPoint
    ? [firstPoint.point.longitude, firstPoint.point.latitude]
    : [106.8166667, -6.2];

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Signature titik — dipakai untuk refit bounds saat sebaran posisi berubah.
  const boundsSignature = useMemo(
    () =>
      points
        .map((p) => `${p.point.longitude},${p.point.latitude}`)
        .sort()
        .join("|"),
    [points],
  );
  const lastBoundsSignature = useRef<string>("");

  // Map lifecycle — init sekali per mount.
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 12,
      interactive: true,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 15,
      maxWidth: "280px",
      className: "outlet-mapbox-popup",
    });

    map.current.on("load", () => setIsLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gambar ulang marker + jejak setiap data berubah.
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    const mapInstance = map.current;

    const markerFeatures: GeoJSON.Feature[] = points.map(
      ({ row, point, key, isLatest, status }) => ({
        type: "Feature",
        properties: {
          key,
          cashierId: row.cashier_id,
          // Posisi terkini pakai warna status device; titik lama pakai warna
          // history (biru) supaya operator kelihatan sudah berpindah.
          color: isLatest ? deviceStatusColor(status) : HISTORY_COLOR,
          radius: MARKER_RADIUS,
          opacity: isLatest ? 1 : 0.85,
          // Label nama hanya di titik terkini → satu label per operator.
          label: isLatest ? row.cashier_name : "",
        },
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
      }),
    );

    const trailFeatures: GeoJSON.Feature[] = [];
    trail.forEach((p, idx) => {
      if (idx === 0) return;
      const prev = trail[idx - 1];
      trailFeatures.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [prev.longitude, prev.latitude],
            [p.longitude, p.latitude],
          ],
        },
      });
    });

    ["cashier-trail", "cashier-markers", "cashier-markers-labels"].forEach(
      (layerId) => {
        if (mapInstance.getLayer(layerId)) mapInstance.removeLayer(layerId);
      },
    );
    ["cashier-trail", "cashier-markers"].forEach((sourceId) => {
      if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId);
    });

    if (markerFeatures.length === 0) return;

    if (trailFeatures.length > 0) {
      mapInstance.addSource("cashier-trail", {
        type: "geojson",
        data: { type: "FeatureCollection", features: trailFeatures },
      });
      mapInstance.addLayer({
        id: "cashier-trail",
        type: "line",
        source: "cashier-trail",
        paint: {
          "line-color": HISTORY_COLOR,
          "line-width": 3,
          "line-opacity": 0.75,
          "line-dasharray": [4, 3],
        },
      });
    }

    mapInstance.addSource("cashier-markers", {
      type: "geojson",
      data: { type: "FeatureCollection", features: markerFeatures },
    });

    mapInstance.addLayer({
      id: "cashier-markers",
      type: "circle",
      source: "cashier-markers",
      paint: {
        "circle-radius": ["get", "radius"],
        "circle-color": ["get", "color"],
        "circle-opacity": ["get", "opacity"],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": ["get", "opacity"],
      },
    });

    // Nama kasir di titik terkini — supaya jelas pin ini milik operator siapa.
    mapInstance.addLayer({
      id: "cashier-markers-labels",
      type: "symbol",
      source: "cashier-markers",
      layout: {
        "text-field": ["get", "label"],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 12,
        "text-anchor": "top",
        "text-offset": [0, 1.3],
        "text-allow-overlap": false,
        "text-padding": 4,
      },
      paint: {
        "text-color": "#0f172a",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-halo-blur": 0.5,
      },
    });

    const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["cashier-markers", "cashier-markers-labels"],
      });
      if (!features || features.length === 0) return;

      const props = features[0].properties as any;
      const found = points.find((p) => p.key === props.key);
      if (!found) return;

      const coordinates = (features[0].geometry as GeoJSON.Point)
        .coordinates as [number, number];

      if (popup.current) {
        popup.current
          .setLngLat(coordinates)
          .setHTML(buildPopupHtml(found))
          .addTo(mapInstance);
      }

      if (found.row.cashier_id) onSelect?.(found.row.cashier_id);
    };

    const onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["cashier-markers", "cashier-markers-labels"],
      });
      mapInstance.getCanvas().style.cursor =
        features.length > 0 ? "pointer" : "";
    };

    mapInstance.on("click", onMapClick);
    mapInstance.on("mousemove", onMapMouseMove);

    return () => {
      mapInstance.off("click", onMapClick);
      mapInstance.off("mousemove", onMapMouseMove);
    };
  }, [points, trail, isLoaded, onSelect]);

  // Refit bounds hanya ketika sebaran titik berubah (bukan tiap re-render).
  useEffect(() => {
    if (!map.current || !isLoaded || points.length === 0) return;
    if (lastBoundsSignature.current === boundsSignature) return;

    const bounds = new mapboxgl.LngLatBounds();
    points.forEach(({ point }) =>
      bounds.extend([point.longitude, point.latitude]),
    );
    // Padding bawah lebih besar: label nama digambar di bawah marker.
    map.current.fitBounds(bounds, {
      padding: { top: 60, bottom: 90, left: 60, right: 60 },
      maxZoom: 15,
    });
    lastBoundsSignature.current = boundsSignature;
  }, [boundsSignature, points, isLoaded]);

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-xl bg-slate-100",
        className,
      )}
    >
      {MAPBOX_TOKEN ? (
        <div
          ref={mapContainer}
          className='absolute inset-0 h-full w-full'
          style={{ minHeight: 200 }}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center border-2 border-dashed border-slate-200'>
          <div className='text-center'>
            <MapPin className='mx-auto mb-2 h-7 w-7 text-slate-300' />
            <p className='text-xs font-medium text-slate-400'>
              Mapbox token belum dikonfigurasi
            </p>
            <code className='text-[10px] text-slate-400'>
              VITE_MAPBOX_TOKEN
            </code>
          </div>
        </div>
      )}

      {MAPBOX_TOKEN && points.length === 0 && (
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-slate-50/85'>
          <MapPin className='mb-2 h-7 w-7 text-slate-300' />
          <p className='text-xs font-medium text-slate-400'>
            Belum ada posisi device
          </p>
        </div>
      )}

      <div className='absolute bottom-2 left-2 z-10 space-y-1 rounded-lg bg-white/90 px-2.5 py-1.5 shadow-sm'>
        {(["online", "stale", "offline"] as const).map((status) => (
          <div key={status} className='flex items-center gap-1.5'>
            <span
              className='h-3 w-3 rounded-full border-2 border-white shadow-sm'
              style={{ background: DEVICE_STATUS_COLOR[status] }}
            />
            <span className='text-[10px] font-semibold text-slate-600'>
              {DEVICE_STATUS_LABEL[status]}
            </span>
          </div>
        ))}
        <div className='flex items-center gap-1.5 border-t border-slate-200 pt-1'>
          <span
            className='h-3 w-3 rounded-full border-2 border-white shadow-sm'
            style={{ background: HISTORY_COLOR }}
          />
          <span className='text-[10px] font-semibold text-slate-600'>
            Titik sebelumnya
          </span>
        </div>
      </div>
    </div>
  );
}

export default CashierLiveMap;
