/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Loader2, MapPinned } from "lucide-react";
import { Page } from "@/components/app/layout";
import { useReport } from "@/services/report/hooks";
import type { OutletMapRow } from "@/services/types";
import { currencyFormat } from "@/utils";
import clsx from "clsx";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

// History marker color — latest point gets a distinct (red) color like ShipmentMap.
const HISTORY_COLOR = "#10b981";
const LATEST_COLOR = "#ef4444";

const validPoints = (row: OutletMapRow | undefined) =>
  (row?.historys ?? []).filter(
    (p) =>
      typeof p.latitude === "number" && typeof p.longitude === "number",
  );

// Reusable popup HTML, styled like ShipmentMap.
const buildPopupHtml = ({
  outletName,
  idx,
  createdAt,
  isLast,
  color,
}: {
  outletName: string;
  idx: number;
  createdAt: string;
  isLast: boolean;
  color: string;
}) => `
  <div style="padding: 16px; font-family: 'Inter', sans-serif;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 8px; padding-right: 28px;">
      <div style="font-size: 14px; font-weight: 900; color: #111827; letter-spacing: -0.02em;">${outletName}</div>
      ${isLast ? `<div style="font-size: 10px; font-weight: 800; color: ${color}; background: ${color}15; padding: 4px 8px; border-radius: 8px; text-transform: uppercase; border: 1px solid ${color}30; white-space: nowrap;">Posisi Terakhir</div>` : ""}
    </div>
    <div style="display: flex; gap: 10px; align-items: flex-start;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 3px;">
        <div style="width: 9px; height: 9px; border-radius: 50%; background: ${color}; box-shadow: 0 0 0 3px ${color}22;"></div>
      </div>
      <div style="flex: 1;">
        <div style="font-size: 10px; font-weight: 800; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Titik History</div>
        <div style="font-size: 13px; font-weight: 700; color: #1f2937; line-height: 1.4;">Titik #${idx + 1}</div>
        <div style="font-size: 11px; font-weight: 500; color: #6b7280; margin-top: 2px;">${createdAt}</div>
      </div>
    </div>
  </div>
`;

export default function OutletMapPage() {
  const { outletMap, outletMapResult } = useReport();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const raw = outletMapResult?.data as any;
  const rows = useMemo<OutletMapRow[]>(() => {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    return [];
  }, [raw]);

  // Fetch on mount, then auto-refresh every 1 hour.
  useEffect(() => {
    outletMap();
    const timer = setInterval(() => outletMap(), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Default to first outlet; user click overrides. Fallback if selected gone.
  const activeId =
    selectedId && rows.some((r) => r.outlet === selectedId)
      ? selectedId
      : (rows[0]?.outlet ?? null);

  const selected = rows.find((r) => r.outlet === activeId);
  const points = validPoints(selected);
  const center: [number, number] =
    points.length > 0
      ? [points[0].longitude, points[0].latitude]
      : [106.8166667, -6.2];

  const isLoading = outletMapResult?.isLoading;

  // Map lifecycle — one init per mount.
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasInitializedLayers = useRef(false);

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
  }, []);

  // Draw trail + markers whenever points / selected outlet change.
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    const mapInstance = map.current;

    const markerFeatures: GeoJSON.Feature[] = [];
    const trailFeatures: GeoJSON.Feature[] = [];

    points.forEach((p, idx) => {
      const isLast = idx === points.length - 1;
      const color = isLast ? LATEST_COLOR : HISTORY_COLOR;
      markerFeatures.push({
        type: "Feature",
        properties: {
          idx,
          isLast,
          color,
          outletName: selected?.outlet_name ?? "Outlet",
          createdAt: p.created_at,
        },
        geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
      });

      if (idx > 0) {
        const prev = points[idx - 1];
        trailFeatures.push({
          type: "Feature",
          properties: { color: HISTORY_COLOR },
          geometry: {
            type: "LineString",
            coordinates: [
              [prev.longitude, prev.latitude],
              [p.longitude, p.latitude],
            ],
          },
        });
      }
    });

    // Clean up previous layers/sources.
    ["outlet-trail", "outlet-markers", "outlet-markers-labels"].forEach(
      (layerId) => {
        if (mapInstance.getLayer(layerId)) mapInstance.removeLayer(layerId);
      },
    );
    ["outlet-trail", "outlet-markers"].forEach((sourceId) => {
      if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId);
    });

    if (markerFeatures.length === 0) return;

    if (trailFeatures.length > 0) {
      mapInstance.addSource("outlet-trail", {
        type: "geojson",
        data: { type: "FeatureCollection", features: trailFeatures },
      });
      mapInstance.addLayer({
        id: "outlet-trail",
        type: "line",
        source: "outlet-trail",
        paint: {
          "line-color": HISTORY_COLOR,
          "line-width": 3,
          "line-opacity": 0.8,
          "line-dasharray": [4, 3],
        },
      });
    }

    mapInstance.addSource("outlet-markers", {
      type: "geojson",
      data: { type: "FeatureCollection", features: markerFeatures },
    });

    mapInstance.addLayer({
      id: "outlet-markers",
      type: "circle",
      source: "outlet-markers",
      paint: {
        "circle-radius": ["case", ["get", "isLast"], 12, 8],
        "circle-color": ["get", "color"],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    mapInstance.addLayer({
      id: "outlet-markers-labels",
      type: "symbol",
      source: "outlet-markers",
      layout: {
        "text-field": ["case", ["get", "isLast"], "●", ""],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 9,
        "text-anchor": "center",
        "text-ignore-placement": true,
      },
      paint: { "text-color": "#ffffff" },
    });

    const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["outlet-markers"],
      });
      if (!features || features.length === 0) return;

      const feature = features[0];
      const props = feature.properties as any;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      const html = buildPopupHtml({
        outletName: props.outletName,
        idx: props.idx,
        createdAt: props.createdAt,
        isLast: props.isLast,
        color: props.color,
      });

      if (popup.current) {
        popup.current.setLngLat(coordinates).setHTML(html).addTo(mapInstance);
      }
    };

    const onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["outlet-markers"],
      });
      mapInstance.getCanvas().style.cursor =
        features.length > 0 ? "pointer" : "";
    };

    mapInstance.on("click", onMapClick);
    mapInstance.on("mousemove", onMapMouseMove);

    // Fit bounds once per outlet selection.
    if (!hasInitializedLayers.current && markerFeatures.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markerFeatures.forEach((f) => {
        const coords = (f.geometry as GeoJSON.Point).coordinates as [
          number,
          number,
        ];
        bounds.extend(coords);
      });
      mapInstance.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      hasInitializedLayers.current = true;
    }

    return () => {
      mapInstance.off("click", onMapClick);
      mapInstance.off("mousemove", onMapMouseMove);
    };
  }, [points, selected, isLoaded]);

  // Refit when switching outlet.
  useEffect(() => {
    hasInitializedLayers.current = false;
  }, [activeId]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Outlet Maps"
        subtitle="Laporan posisi dan jejak outlet berdasarkan history GPS."
      />
      <Page.Body className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Left — outlet list */}
        <div className="w-full md:w-[380px] shrink-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <MapPinned className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Daftar Outlet</h3>
            <span className="ml-auto text-[11px] font-semibold text-slate-400">
              {rows.length} outlet
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <MapPin className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium">Belum ada data</p>
              </div>
            ) : (
              rows.map((row) => {
                const count = validPoints(row).length;
                const active = row.outlet === activeId;
                return (
                  <button
                    key={row.outlet}
                    onClick={() => setSelectedId(row.outlet)}
                    className={clsx(
                      "w-full text-left px-5 py-3.5 border-b border-slate-50 transition-colors cursor-pointer",
                      active
                        ? "bg-emerald-50/70 border-l-[3px] border-l-emerald-500"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {row.outlet_name}
                      </p>
                      <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                        {count} titik
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Total Charges:{" "}
                      <span className="font-bold text-emerald-600">
                        {currencyFormat(row.total_charges)}
                      </span>
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right — map */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              {selected?.outlet_name ?? "Peta Outlet"}
            </h3>
            <span className="ml-auto text-[11px] font-semibold text-slate-400">
              {points.length} history
            </span>
          </div>

          <div className="flex-1 min-h-0 relative">
            {MAPBOX_TOKEN ? (
              <div
                ref={mapContainer}
                className="absolute inset-0 w-full h-full"
                style={{ minHeight: 400 }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-200 m-4 rounded-2xl h-[400px]">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">
                    Mapbox token belum dikonfigurasi
                  </p>
                  <code className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    VITE_MAPBOX_TOKEN
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
