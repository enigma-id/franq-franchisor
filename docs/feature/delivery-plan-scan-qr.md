# Frontend Franchisor — Scan QR Delivery Plan (Global, Hardware Barcode Scanner)

**Date:** 2026-09-23
**Status:** Draft (menunggu review sebelum implementasi)
**Repo:** `franq-franchisor` (React + Vite + Redux/RTK Query)
**Backend spec:** tidak ada perubahan BE — memakai endpoint existing `GET /delivery/plan?ref_code=...`

---

## Problem

Operator (gudang/outlet) memegang cetakan **Delivery Plan** yang punya QR. Ingin scan QR tersebut dari portal franchisor agar **langsung masuk ke halaman detail Delivery Plan**-nya, tanpa mencari manual di list.

QR yang dicetak oleh komponen print berisi **`ref_code`**, dan di backend `ref_code` Delivery Plan diisi dari **`code` Sales Order** (mis. `SO00000001`). Jadi hasil scan = SO code, yang sekaligus menjadi kunci lookup plan.

---

## Keputusan (hasil klarifikasi)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Metode scan | **Hardware barcode scanner** (HID keyboard-wedge: "mengetik" kode + Enter ke elemen yang fokus). Tanpa kamera, tanpa library baru. |
| 2 | Entry point | **Tanpa tombol, tanpa halaman baru.** Listener global — begitu ada scan langsung diproses. |
| 3 | Area aktif | **Global, semua halaman** (di dalam `AuthorizedLayout`, setelah login). |
| 4 | Lookup | Endpoint existing `GET /delivery/plan?ref_code=<hasil scan>` (exact match). Tidak ada perubahan service/BE. |
| 5 | Ketemu | Langsung `navigate('/warehouse/delivery-plan/:id')` ke detail yang sudah ada. |
| 6 | Tidak ketemu | Tampilkan **modal "Data Tidak Ditemukan"** saja. |
| 7 | Gate permission | Listener hanya aktif untuk user yang punya `MENU.deliveryPlan` (`useCan`). |
| 8 | Feedback sukses | Tidak ada toast — langsung redirect. |

---

## Konteks (fakta yang diverifikasi)

- Fitur scan **belum ada** di repo ini maupun sibling repo (`franq-wms`, `franq-franchisee`, `franq-franchisorder`) — nol library kamera/scanner.
- `GET /delivery/plan` menerima param `ref_code` (exact match) → response `{ data: DeliveryPlanDetail[], meta }`.
  - Handler BE: `backend/franchisor/src/handler/rest/delivery/plan/request_get.go`.
  - Filter usecase: `delivery_plan.ref_code = ?` (`backend/warehouse/src/usecase/delivery_plan.go`).
  - RPC: `ListDeliveryPlans` (`DeliveryPlanRequest.ref_code`), bukan `GetDeliveryPlanByRefCode` (RPC terakhir khusus POS & self-pickup).
- `ref_code` plan diisi dari `so.Code` oleh subscriber `SubscribeSalesOrderPaided` / `SubscribeSalesOrderCreatedWithSaldo` (`backend/warehouse/src/event/subscriber/delivery_plan.go`).
- QR dicetak = `data.ref_code` (`src/components/app/print/delivery-plan.tsx`). Konsisten dengan nilai yang di-scan.
- Format SO code: `SO` + 8 digit (`SO00000001`).
- Tidak ada global `keydown` listener lain di app (hanya Escape di `Modal.Wrapper` & `Drawer`) → tidak bentrok.
- Pola yang dipakai ulang: `Modal` / `Button` (`@/components/ui`), `useDeliveryPlan().get()` (`src/services/warehouse/hooks.tsx`), `useCan` (`src/utils/permission.ts`), `MENU.deliveryPlan` (`src/utils/permissions.ts`).

---

## Perubahan per Area

### A. Hook detektor keyboard-wedge — `src/hooks/useBarcodeScanner.ts` (baru)

Hook generik yang membedakan "burst" scanner dari ketikan manusia.

- Signature: `useBarcodeScanner({ onScan, enabled, maxIntervalMs = 80, minLength = 4, bufferResetMs = 300 })`.
- Pasang `document.addEventListener('keydown', handler)` lewat `useEffect`.
- Aturan deteksi:
  - Abaikan bila `!enabled` atau ada modifier (`ctrlKey`/`altKey`/`metaKey`).
  - `Enter`: bila `buffer.length >= minLength` → `preventDefault()` (cegah submit form) → `onScan(buffer)` → reset. Bila kurang → reset.
  - Karakter printable (`e.key.length === 1`): bila `now - lastKeyTime > maxIntervalMs` → reset buffer (burst baru); append; update timestamp.
  - Timer `bufferResetMs`: tidak ada key selama itu → buffer dikosongkan.
- Buffer disimpan di `useRef` (tanpa re-render).

### B. Komponen global — `src/components/app/DeliveryPlanScanner.tsx` (baru)

- `const canScan = useCan(MENU.deliveryPlan);`
- `const { get } = useDeliveryPlan();`
- `handleScan(code)`:
  - Guard `busyRef` (cegah lookup dobel).
  - `const res = await get({ ref_code: code, page: 1, limit: 1 });`
  - Bila `res?.data?.[0]` ada → `navigate('/warehouse/delivery-plan/' + id)`.
  - Selain itu (kosong / error) → `setNotFoundCode(code)`.
- `useBarcodeScanner({ onScan: handleScan, enabled: canScan })`.
- Render `Modal.Wrapper` "Data Tidak Ditemukan" (menampilkan kode hasil scan + tombol Tutup).

### C. Mount global — `src/components/app/route-layout/AuthorizedLayout.tsx` (ubah)

- Render `<DeliveryPlanScanner />` **sekali** di dalam root layout (dekat `<Outlet/>`). Modal pakai portal ke `document.body`.
- Tidak ada perubahan menu/route/permission.

### D. Barrel export

- `src/hooks/index.ts` → `export { useBarcodeScanner } from './useBarcodeScanner';`
- `src/components/app/index.ts` → `export { DeliveryPlanScanner } from "./DeliveryPlanScanner";`

---

## File yang Dibuat / Diubah

### Dibuat

| File | Isi |
|---|---|
| `src/hooks/useBarcodeScanner.ts` | Detektor keyboard-wedge generik. |
| `src/components/app/DeliveryPlanScanner.tsx` | Listener global + lookup `ref_code` + redirect + modal not-found. |

### Diubah

| File | Perubahan |
|---|---|
| `src/components/app/route-layout/AuthorizedLayout.tsx` | +render `<DeliveryPlanScanner />` (global). |
| `src/hooks/index.ts` | +export `useBarcodeScanner`. |
| `src/components/app/index.ts` | +export `DeliveryPlanScanner`. |

**Tidak ada** perubahan: `warehouseApi`, types, route, permission slug, maupun backend.

---

## Verifikasi

1. `npm run build` (tsc + vite) dan `npm run lint` bersih.
2. **Fungsional** — buka halaman mana pun, scan QR cetakan Delivery Plan (atau simulasi: ketik `SO00000001` cepat lalu Enter) → langsung pindah ke `/warehouse/delivery-plan/:id`.
3. **Not found** — scan kode yang tak ada plan-nya → modal "Data Tidak Ditemukan"; Tutup modal, bisa scan lagi.
4. **Tidak ganggu normal** — ketik biasa di input + Enter (lambat) tidak memicu lookup; Enter tidak tiba-tiba submit form.
5. **Permission** — user tanpa `MENU.deliveryPlan` → scan tidak memicu apa-apa.

---

## Catatan / Risiko

- **Karakter ter-inject ke field fokus:** listener tidak mem-`preventDefault` karakter printable, jadi bila user sedang fokus di `<input>` saat scan, teks kode bisa tersisip ke field tersebut. Pola pakai normal = scan tanpa field fokus. Mitigasi (opsional): saat deteksi scan, bersihkan `buffer.length` karakter terakhir dari `document.activeElement` bila berupa input/textarea.
- **Threshold timing** (`maxIntervalMs`) mungkin perlu disetel sesuai scanner lapangan (Bluetooth bisa lebih lambat). Default 80ms, `minLength` 4.
- **Duplikat `ref_code`:** satu SO bisa memunculkan >1 plan (paid + created-with-saldo). Diambil hasil pertama; opsional urutkan `order_by` terbaru.
- **`ref_code` kosong** pada plan buatan manual → tidak match; ditangani modal not-found.
- **Tanpa toast sukses** — langsung redirect. Opsional tambah toast "Delivery plan ditemukan" bila perlu feedback.
