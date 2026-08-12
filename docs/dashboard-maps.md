# Technical Plan: Dashboard Maps Section (Peta Outlet)

**Task ID:** `dashboard-maps`
**Status:** Implemented
**Feature:** Menampilkan lokasi outlet pada peta interaktif di halaman Dashboard.

---

## 1. Context

Backend response `/dashboard` sekarang sudah menyertakan field **`outlet_map`** — array lokasi outlet dengan koordinat geografis. User ingin memvisualisasikannya sebagai section peta interaktif di dashboard.

Tidak ada library map yang terpasang sebelumnya. Dipilih **React Leaflet** (wrapper resmi untuk Leaflet) karena:

- **100% gratis** — memakai OpenStreetMap tiles, tanpa access token / akun / kartu kredit.
- **Interaktif** — zoom, pan, dan marker clickable dengan popup.
- **React 19 compatible** (`react-leaflet@^5`).

> Alternatif yang dipertimbangkan: **Mapbox GL JS** (free tier 50k map loads/bulan, butuh access token — ditolak), **Static SVG map** (tanpa tile asli — ditolak), **Google/OSM iframe embed** (kurang fleksibel untuk multi-marker — ditolak).

## 2. Data Contract

Response dashboard (excerpt):

```json
{
  "outlet_map": [
    {
      "outlet_id": "8056425b-5044-5a6e-ad14-e2e4d6d28376",
      "outlet_name": "REGULAR",
      "latitude": -6.1902869,
      "longitude": 106.7116815,
      "last_seen": "2026-08-12 11:03:39"
    }
  ]
}
```

| Field | Type | Keterangan |
| :--- | :--- | :--- |
| `outlet_id` | `string` | UUID outlet (dipakai sebagai React `key` marker). |
| `outlet_name` | `string` | Nama outlet (title marker + isi popup). |
| `latitude` / `longitude` | `number` | Koordinat marker. |
| `last_seen` | `string` | Timestamp aktivitas terakhir (ditampilkan di popup). |

## 3. Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| Map engine | Leaflet | `^1.9.4` |
| React wrapper | react-leaflet | `^5.0.0` |
| Types | @types/leaflet | `^1.x` (dev) |
| Map tiles | OpenStreetMap | — (gratis, tanpa token) |

```bash
npm i react-leaflet leaflet
npm i -D @types/leaflet
```

> Catatan: `leaflet@1.9.4` tidak menyertakan field `types` di package.json-nya, sehingga `@types/leaflet` wajib diinstall untuk type-safety.

## 4. Implementation

### 4.1 Types — `src/services/types/dashboard.ts`

```ts
export interface OutletMapItem {
  outlet_id: string;
  outlet_name: string;
  latitude: number;
  longitude: number;
  last_seen: string;
}
```

Ditambahkan ke `DashboardData`:

```ts
export interface DashboardData {
  // ...
  outlet_map: OutletMapItem[];
  // ...
}
```

### 4.2 Komponen baru — `src/pages/dashboard/components/OutletMap.tsx`

Struktur mengikuti pola card SalesChart (white `rounded-3xl`, header icon + title):

```tsx
interface OutletMapProps {
  outlets?: OutletMapItem[];
  isLoading?: boolean;
}
```

- `MapContainer` dengan `center` dari outlet pertama, `zoom` default `10`, `scrollWheelZoom={false}`, `attributionControl={false}`.
- `TileLayer` OSM: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
- `AttributionControl` custom `prefix={false}` — menghapus prefix "Leaflet", menyisakan "© OpenStreetMap contributors" (diwajibkan policy OSM, jadi tidak dihapus total).
- `Marker` + `Popup` per outlet (title = `outlet_name`, isi = nama + `last_seen`).
- **Empty state:** "Data peta tidak tersedia" bila `outlets` kosong.
- **Skeleton** saat `isLoading`.
- Header menampilkan counter: `"{n} outlet terhubung"`.

**Marker: `divIcon` SVG inline** (bukan default image Leaflet). Alasan: `import markerIcon from "leaflet/dist/images/marker-icon.png"` di Vite menghasilkan URL yang di-prepend ulang oleh Leaflet → path ganda (`.../images//node_modules/.../marker-icon.png`) → gambar rusak (`naturalWidth: 0`), pin tak tampil. `divIcon` dengan SVG inline bebas masalah path di dev & build:

```ts
const outletIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="44" viewBox="0 0 30 44" fill="none">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 29 15 29s15-17.75 15-29C30 6.716 23.284 0 15 0z" fill="#10b981" stroke="#fff" stroke-width="2.5"/>
    <circle cx="15" cy="15" r="7" fill="#ffffff"/>
  </svg>`,
  iconSize: [30, 44],
  iconAnchor: [15, 44],
  popupAnchor: [0, -40],
});
```

**Attribution styling** — CSS scoped di `src/index.css` (`.outlet-map .leaflet-control-attribution`): font 9px, warna abu `#94a3b8`, bg putih 65% blur, rounded — tampil samar tidak mengganggu.

**Wajib import CSS:**

```ts
import "leaflet/dist/leaflet.css";
```

### 4.3 Wiring — `src/pages/dashboard/index.tsx`

Sales Chart dan Peta Outlet ditampilkan **side-by-side** (grid 2 kolom, width sama besar — 50/50 pada `xl`, stack vertikal pada layar kecil):

```tsx
{/* Sales Chart + Outlet Map — side by side */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <div>
    <SalesChart ... />
  </div>
  <div>
    <OutletMap outlets={data?.outlet_map} isLoading={isLoading} />
  </div>
</div>
```

## 5. File Changes

| File | Perubahan |
| :--- | :--- |
| `package.json` / `package-lock.json` | Tambah `react-leaflet`, `leaflet`, `@types/leaflet` |
| `src/services/types/dashboard.ts` | Tambah `OutletMapItem` + field `outlet_map` |
| `src/pages/dashboard/components/OutletMap.tsx` | **Baru** — komponen peta (divIcon SVG marker, attribution samar) |
| `src/pages/dashboard/index.tsx` | Render section dalam grid side-by-side dengan Sales Chart |
| `src/index.css` | CSS scoped `.outlet-map .leaflet-control-attribution` |

## 6. Verification

1. `npx tsc --noEmit -p tsconfig.app.json` — tidak ada error type.
2. `npm run build` — bundling leaflet CSS + image marker sukses.
3. `npm run dev` → buka `/dashboard`:
   - Map muncul berdampingan (kiri) dengan Sales Chart (kanan).
   - Marker outlet tampil di koordinat yang benar (Jakarta).
   - Klik marker → popup menampilkan nama outlet + `last_seen`.
   - Kontrol zoom/pan berfungsi.
4. Cek console DevTools — tidak ada error icon marker / tile.
