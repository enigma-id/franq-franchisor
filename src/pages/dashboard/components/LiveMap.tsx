/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { MapPinned } from "lucide-react";
import clsx from "clsx";
import { useDashboard } from "@/services/dashboard/hooks";
import { deviceStatusColor, deviceStatusFromRow } from "@/utils";
import type { CashierLiveMapItem, CashierMapItem } from "@/services/types";

// Lazy — widget peta memuat mapbox-gl yang besar, jangan masuk bundle utama.
const CashierLiveMap = lazy(() =>
  import("@/components/app/CashierLiveMap").then((m) => ({
    default: m.CashierLiveMap,
  })),
);

const POLL_MS = 30_000;

export const LiveMap: React.FC = () => {
  const { liveMap, liveMapResult } = useDashboard();
  const [selectedCashier, setSelectedCashier] = useState<string | null>(null);

  // `/dashboard/live-map` sudah membawa `historys` per operator, jadi trail
  // langsung dari sini (tanpa fetch outlet-maps).
  const rows = useMemo<CashierLiveMapItem[]>(() => {
    const raw = liveMapResult?.data as any;
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    return [];
  }, [liveMapResult?.data]);

  const items = useMemo<CashierMapItem[]>(() => rows, [rows]);

  // Poll posisi terkini setiap 30 detik.
  useEffect(() => {
    const fetchData = () => liveMap(undefined);
    fetchData();
    const timer = setInterval(fetchData, POLL_MS);
    return () => clearInterval(timer);
  }, []);

  // Default = operator dengan jejak terbanyak supaya garisnya langsung kelihatan.
  const defaultId = useMemo(() => {
    if (items.length === 0) return null;
    return [...items].sort(
      (a, b) => (b.historys?.length ?? 0) - (a.historys?.length ?? 0),
    )[0].cashier_id;
  }, [items]);

  const selectedId =
    selectedCashier && rows.some((r) => r.cashier_id === selectedCashier)
      ? selectedCashier
      : (defaultId ?? null);

  return (
    <div className='shrink-0 w-full bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/20 border border-slate-100'>
      <div className='flex flex-wrap items-center gap-3 mb-3'>
        <div className='w-9 h-9 rounded-2xl bg-cyan-50 flex items-center justify-center shadow-lg shadow-cyan-100'>
          <MapPinned className='w-5 h-5 text-cyan-500' />
        </div>
        <div>
          <h3 className='text-sm font-bold text-slate-800'>Live Maps Kasir</h3>
          <p className='text-[11px] text-slate-400 font-medium'>
            {rows.length} operator
          </p>
        </div>
      </div>

      {/* Chip per kasir — klik untuk lihat jejaknya. */}
      {rows.length > 0 && (
        <div className='flex flex-wrap gap-1.5 mb-3'>
          {rows.map((op) => (
            <button
              key={op.cashier_id}
              onClick={() => setSelectedCashier(op.cashier_id)}
              className={clsx(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer",
                op.cashier_id === selectedId
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <span
                className='h-2 w-2 rounded-full'
                style={{
                  background: deviceStatusColor(
                    deviceStatusFromRow(op.status, op.last_activity_at),
                  ),
                }}
              />
              {op.cashier_name}
            </button>
          ))}
        </div>
      )}

      <Suspense fallback={<div className='h-[520px] rounded-xl bg-slate-100' />}>
        <CashierLiveMap
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedCashier}
          className='h-[520px]'
        />
      </Suspense>
    </div>
  );
};

export default LiveMap;
