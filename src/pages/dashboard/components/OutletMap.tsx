/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import type { OutletMapItem } from "@/services/types";

const DEFAULT_ZOOM = 10;

// Custom divIcon marker (inline SVG) — avoids bundler path issues with
// Leaflet's default marker images that break in Vite dev/build.
const outletIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="44" viewBox="0 0 30 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 29 15 29s15-17.75 15-29C30 6.716 23.284 0 15 0z" fill="#10b981" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="15" cy="15" r="7" fill="#ffffff"/>
  </svg>`,
  iconSize: [30, 44],
  iconAnchor: [15, 44],
  popupAnchor: [0, -40],
});

interface OutletMapProps {
  outlets?: OutletMapItem[];
  isLoading?: boolean;
}

export const OutletMap: React.FC<OutletMapProps> = ({
  outlets,
  isLoading,
}) => {
  const markers = outlets?.filter(
    (o) => typeof o.latitude === "number" && typeof o.longitude === "number",
  );

  if (isLoading) {
    return (
      <div className="w-full h-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl animate-pulse m-4" />
      </div>
    );
  }

  if (!markers || markers.length === 0) {
    return (
      <div className="w-full h-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Peta Outlet</h3>
        </div>
        <div className="flex-1 bg-slate-50/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 m-4">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">
              Data peta tidak tersedia
            </p>
          </div>
        </div>
      </div>
    );
  }

  const center: [number, number] = [
    markers[0].latitude,
    markers[0].longitude,
  ];

  return (
    <div className="w-full h-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Peta Outlet</h3>
          <p className="text-xs text-slate-400 font-medium">
            {markers.length} outlet terhubung
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative outlet-map">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ minHeight: 260 }}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AttributionControl position="bottomright" prefix={false} />
          {markers.map((outlet) => (
            <Marker
              key={outlet.outlet_id}
              position={[outlet.latitude, outlet.longitude]}
              icon={outletIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-slate-800">
                    {outlet.outlet_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Terakhir aktif: {outlet.last_seen}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default OutletMap;
