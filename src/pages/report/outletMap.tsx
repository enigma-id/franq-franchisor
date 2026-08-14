/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  AttributionControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Loader2, MapPinned } from "lucide-react";
import { Page } from "@/components/app/layout";
import { useReport } from "@/services/report/hooks";
import type { OutletMapRow, OutletMapHistory } from "@/services/types";
import { currencyFormat } from "@/utils";
import clsx from "clsx";

// Custom divIcon marker (inline SVG) — avoids bundler path issues with
// Leaflet's default marker images that break in Vite dev/build.
const historyIcon = L.divIcon({
  className: "",
  html: `<svg width="26" height="38" viewBox="0 0 30 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 29 15 29s15-17.75 15-29C30 6.716 23.284 0 15 0z" fill="#10b981" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="15" cy="15" r="7" fill="#ffffff"/>
  </svg>`,
  iconSize: [26, 38],
  iconAnchor: [13, 38],
  popupAnchor: [0, -34],
});

// Distinct marker for the LATEST history point — bigger, red pin.
const latestIcon = L.divIcon({
  className: "",
  html: `<svg width="36" height="50" viewBox="0 0 30 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 29 15 29s15-17.75 15-29C30 6.716 23.284 0 15 0z" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
    <circle cx="15" cy="15" r="8" fill="#ffffff"/>
  </svg>`,
  iconSize: [36, 50],
  iconAnchor: [18, 50],
  popupAnchor: [0, -44],
});

// Fit map bounds to selected outlet's trail.
function FitBounds({ points }: { points: OutletMapHistory[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(
      points.map((p) => [p.latitude, p.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

const validPoints = (row: OutletMapRow | undefined) =>
  (row?.historys ?? []).filter(
    (p) =>
      typeof p.latitude === "number" && typeof p.longitude === "number",
  );

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
  const path = points.map((p) => [p.latitude, p.longitude] as [number, number]);
  const center: [number, number] =
    path.length > 0 ? path[0] : [-6.2, 106.8166667];

  const isLoading = outletMapResult?.isLoading;

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
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Outlet
            </h3>
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

          <div className="flex-1 min-h-0 relative outlet-map">
            {!isLoading && rows.length > 0 ? (
              <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
                style={{ minHeight: 400 }}
                attributionControl={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AttributionControl position="bottomright" prefix={false} />
                {path.length > 1 && (
                  <Polyline
                    positions={path}
                    pathOptions={{
                      color: "#10b981",
                      weight: 3,
                      opacity: 0.8,
                      dashArray: "6 6",
                    }}
                  />
                )}
                {points.map((p, idx) => {
                  const isLast = idx === points.length - 1;
                  return (
                    <Marker
                      key={idx}
                      position={[p.latitude, p.longitude]}
                      icon={isLast ? latestIcon : historyIcon}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold text-slate-800">
                            {selected?.outlet_name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Titik {idx + 1} · {p.created_at}
                          </p>
                          {isLast && (
                            <p className="text-[11px] font-bold text-red-500 mt-1">
                              Posisi Terakhir
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                <FitBounds points={points} />
              </MapContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-200 m-4 rounded-2xl h-[400px]">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">
                    {isLoading ? "Memuat peta..." : "Data peta tidak tersedia"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
