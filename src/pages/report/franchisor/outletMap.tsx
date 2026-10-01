/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import clsx from "clsx";
import { Page } from "@/components/app/layout";
import { RemoteSelect } from "@/components/ui";
import { useReport } from "@/services/report/hooks";
import { useOutlet, useOutletType } from "@/services/outlet/hooks";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useLazyListFranchisorsQuery } from "@/services/franchisor/api";
import { useAppSelector } from "@/hooks";
import { useIsSuperuser } from "@/utils/permission";
import {
  deviceStatusColor,
  deviceStatusFromTime,
  formatDate,
  formatDateTime,
  isOngoing,
} from "@/utils";
import type {
  CashierMapItem,
  OutletMapHistory,
  OutletMapRow,
  ReportSessionRow,
} from "@/services/types";

// Lazy — peta memuat mapbox-gl yang besar, jangan masuk bundle utama.
const CashierLiveMap = lazy(() =>
  import("@/components/app/CashierLiveMap").then((m) => ({
    default: m.CashierLiveMap,
  })),
);

const validPoints = (points?: OutletMapHistory[]): OutletMapHistory[] =>
  (points ?? []).filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  );

/** Titik trail per kasir — response BE sudah dikelompokkan di `cashiers[]`. */
const buildCashierItems = (row?: OutletMapRow): CashierMapItem[] =>
  (row?.cashiers ?? [])
    .map((c) => {
      const points = validPoints(c.historys);
      const last = points[points.length - 1];
      return {
        cashier_id: c.cashier_id,
        cashier_name: c.cashier_name,
        outlet_name: row?.outlet_name,
        historys: points,
        last_activity_at: last?.created_at,
        last_battery_health: last?.battery_health ?? "",
        last_latitude: last?.latitude,
        last_longitude: last?.longitude,
      } as CashierMapItem;
    })
    .filter((item) => (item.historys?.length ?? 0) > 0);

const countPoints = (items: CashierMapItem[]) =>
  items.reduce((acc, i) => acc + (i.historys?.length ?? 0), 0);

/** Titik device yang jatuh di rentang waktu sesi (format `YYYY-MM-DD HH:MM:SS`). */
const withinSession = (p: OutletMapHistory, s: ReportSessionRow) => {
  if (!p.created_at || !s.started_at) return false;
  if (p.created_at < s.started_at) return false;
  if (s.finished_at && p.created_at > s.finished_at) return false;
  return true;
};

/** Card peta satu outlet — header + select sesi + chip kasir + peta (per `cashier_id`). */
function CashierMapPanel({
  outletId,
  outletName,
  items,
  isLoading,
  selectedSessionId,
  onSessionSelect,
}: {
  outletId?: string;
  outletName?: string;
  items: CashierMapItem[];
  isLoading?: boolean;
  /** Sesi terpilih — dikelola parent agar ikut dikirim sebagai query `sales_session_id`. */
  selectedSessionId?: string | null;
  onSessionSelect?: (sessionId: string | null) => void;
}) {
  const { sessionReport, sessionReportResult } = useReport();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Daftar sesi outlet (sumber: GET /report/franchise/session).
  useEffect(() => {
    if (!outletId) return;
    sessionReport({ outlet_id: outletId, page: 1, limit: 50 });
  }, [outletId]);

  const sessions = useMemo<ReportSessionRow[]>(() => {
    const raw = sessionReportResult?.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [sessionReportResult?.data]);

  const activeSession =
    sessions.find((s) => s.session_id === selectedSessionId) ?? null;

  // Default = kasir dengan titik terbanyak supaya jejaknya langsung kelihatan
  // (grup pertama hasil group-by belum tentu punya banyak titik).
  const defaultId = useMemo(() => {
    if (items.length === 0) return null;
    return [...items].sort(
      (a, b) => (b.historys?.length ?? 0) - (a.historys?.length ?? 0),
    )[0].cashier_id;
  }, [items]);

  const activeId = activeSession
    ? activeSession.cashier_id
    : selectedId && items.some((i) => i.cashier_id === selectedId)
      ? selectedId
      : defaultId;

  // Kalau ada sesi terpilih → peta cuma gambar kasir + titik di rentang sesi itu.
  const mapItems = useMemo(() => {
    if (!activeSession) return items;
    const base = items.find((i) => i.cashier_id === activeSession.cashier_id);
    if (!base) return [];
    return [
      {
        ...base,
        historys: (base.historys ?? []).filter((p) =>
          withinSession(p, activeSession),
        ),
      },
    ];
  }, [items, activeSession]);

  const selected = mapItems.find((i) => i.cashier_id === activeId);

  const sessionLabel = (s: ReportSessionRow) =>
    `${s.cashier_name || "-"} • ${formatDate(s.started_at)}`;

  const sessionTimes = (s: ReportSessionRow) =>
    `${formatDateTime(s.started_at)} – ${
      isOngoing(s.finished_at) ? "Sekarang" : formatDateTime(s.finished_at)
    }`;

  /** Label nilai terpilih di select: kasir • rentang waktunya. */
  const sessionValueLabel = (s: ReportSessionRow) =>
    `${s.cashier_name || "-"} • ${sessionTimes(s)}`;

  return (
    <div className='flex-1 min-w-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
      <div className='px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 shrink-0'>
        <MapPin className='w-4 h-4 text-emerald-600 shrink-0' />
        <h3 className='text-sm font-bold text-slate-800'>
          {outletName ?? "Peta Outlet"}
        </h3>
        <span className='ml-auto text-[11px] font-semibold text-slate-400'>
          {items.length} kasir • {countPoints(items)} titik
        </span>
        {sessions.length > 0 && (
          <RemoteSelect<ReportSessionRow>
            placeholder='Semua Sesi'
            value={activeSession}
            onChange={(row) => onSessionSelect?.(row.session_id)}
            onClear={() => onSessionSelect?.(null)}
            data={sessions}
            getLabel={sessionValueLabel}
            renderItem={(row) => (
              <div className='flex items-start justify-between gap-3'>
                <div className='flex flex-col'>
                  <span className='text-xs font-semibold text-slate-700'>
                    {sessionLabel(row)}
                  </span>
                  <span className='text-[10px] text-slate-500'>
                    {sessionTimes(row)}
                  </span>
                </div>
                <span
                  className={clsx(
                    "mt-0.5 text-[10px] font-bold uppercase",
                    row.status === "opened"
                      ? "text-emerald-600"
                      : "text-slate-400",
                  )}
                >
                  {row.status}
                </span>
              </div>
            )}
            inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm w-[280px]'
          />
        )}
      </div>

      {/* Chip per kasir — klik untuk lihat jejaknya (sekaligus lepas pilihan sesi). */}
      {items.length > 0 && (
        <div className='px-5 py-2.5 border-b border-slate-50 flex flex-wrap gap-1.5 shrink-0'>
          {items.map((item) => {
            const active = item.cashier_id === activeId;
            return (
              <button
                key={item.cashier_id}
                onClick={() => {
                  onSessionSelect?.(null);
                  setSelectedId(item.cashier_id);
                }}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer",
                  active
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <span
                  className='h-2 w-2 rounded-full'
                  style={{
                    background: deviceStatusColor(
                      deviceStatusFromTime(item.last_activity_at),
                    ),
                  }}
                />
                {item.cashier_name}
                <span className='text-slate-400'>
                  ({item.historys?.length ?? 0})
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className='flex-1 min-h-0 relative'>
        {isLoading && !selected ? (
          <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
            <Loader2 className='w-5 h-5 animate-spin' />
          </div>
        ) : (
          <Suspense
            fallback={<div className='h-full min-h-[420px] bg-slate-100' />}
          >
            <CashierLiveMap
              items={mapItems}
              selectedId={activeId}
              onSelect={setSelectedId}
              className='h-full min-h-[420px] rounded-none'
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

/**
 * Body report reusable — dipakai halaman Peta Outlet standalone dan tab di detail
 * Rekap Outlet. Daftar outlet diambil dari `GET /outlet`; trail diambil per outlet
 * terpilih dan dipisah per kasir (`cashier_id`). Saat `outletId` diisi (mode tab),
 * daftar disembunyikan dan peta langsung menampilkan outlet tersebut.
 */
export function OutletMapReport({ outletId }: { outletId?: string }) {
  const lockOutlet = !!outletId;

  const { outletMap, outletMapResult } = useReport();
  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
  const { get: getOutletType, getResult: getOutletTypeResult } = useOutletType();
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();

  const [franchisor, setFranchisor] = useState<any | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Sesi terpilih pada select sesi → dikirim sebagai query `sales_session_id`.
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  // Tipe outlet "Mitra" — daftar outlet Peta Outlet dibatasi ke tipe ini.
  const outletTypeId = useMemo(() => {
    const items = getOutletTypeResult?.data?.data as any[] | undefined;
    return items?.length === 1 ? (items[0].id as string) : null;
  }, [getOutletTypeResult]);

  // Resolve outlet type "Mitra" (pola sama dengan report Mitra lain).
  useEffect(() => {
    if (lockOutlet) return;
    getOutletType({ search: "Mitra" });
  }, [lockOutlet]);

  // Daftar franchisor (khusus superuser) — untuk mempersempit daftar outlet.
  useEffect(() => {
    if (lockOutlet || !isSuperuser) return;
    getFranchisors({ page: 1, limit: 20 });
  }, [lockOutlet, isSuperuser]);

  // Nama brand per outlet: pakai relasi `franchisor` dari response kalau di-embed
  // BE; kalau belum, fallback dari daftar franchisor (superuser) + session (user brand).
  const sessionFranchisor = useAppSelector(
    (s) => s.auth.session?.user?.franchisor,
  );
  const [triggerFranchisorMap, { data: franchisorMapResponse }] =
    useLazyListFranchisorsQuery();

  useEffect(() => {
    if (lockOutlet || !isSuperuser) return;
    triggerFranchisorMap({ page: 1, limit: 100 });
  }, [lockOutlet, isSuperuser]);

  const brandById = useMemo(() => {
    const map = new Map<string, string>();
    const raw = franchisorMapResponse?.data;
    if (Array.isArray(raw)) {
      raw.forEach((f: any) => {
        if (f?.id) map.set(f.id, f.name);
      });
    }
    return map;
  }, [franchisorMapResponse]);

  const brandName = (o: any): string =>
    o?.franchisor?.name ??
    brandById.get(o?.franchisor_id) ??
    (sessionFranchisor?.id === o?.franchisor_id
      ? (sessionFranchisor?.name ?? "")
      : "");

  // Daftar outlet dari endpoint outlet (bukan dari report), dibatasi ke tipe
  // outlet "Mitra" via `outlet_type_id`.
  useEffect(() => {
    if (lockOutlet || !outletTypeId) return;
    getOutlet({
      page: 1,
      limit: 50,
      status: "active",
      franchisor_id: franchisor?.id,
      outlet_type_id: outletTypeId,
    });
  }, [lockOutlet, franchisor?.id, outletTypeId]);

  // Ganti franchisor → lepas pilihan outlet lama (beda brand), lihat onChange
  // filter franchisor di bawah.

  const outlets = useMemo(() => {
    const raw = getOutletResult?.data?.data;
    return Array.isArray(raw) ? (raw as any[]) : [];
  }, [getOutletResult?.data]);

  const activeId = lockOutlet
    ? (outletId ?? null)
    : (selectedId ?? outlets[0]?.id ?? null);

  // Trail per outlet terpilih — refresh tiap 1 jam. Bila sesi dipilih, batasi
  // ke sesi itu (`sales_session_id`) — filter outlet/charges/history ada di BE.
  useEffect(() => {
    if (!activeId) return;
    const params: any = { outlet_id: activeId };
    if (selectedSessionId) params.sales_session_id = selectedSessionId;
    outletMap(params);
    const timer = setInterval(() => outletMap(params), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [activeId, selectedSessionId]);

  const raw = outletMapResult?.data as any;
  const rows = useMemo<OutletMapRow[]>(() => {
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    return [];
  }, [raw]);

  const selected = rows.find((r) => r.outlet === activeId) ?? rows[0];
  const items = useMemo(() => buildCashierItems(selected), [selected]);
  const isLoading = outletMapResult?.isLoading;

  const activeOutletName = lockOutlet
    ? selected?.outlet_name
    : (outlets.find((o) => o.id === activeId)?.name ?? selected?.outlet_name);

  // Mode tab (outlet terkunci): hanya peta, tanpa daftar outlet.
  if (lockOutlet) {
    return (
      <CashierMapPanel
        outletId={activeId ?? undefined}
        outletName={activeOutletName}
        items={items}
        isLoading={isLoading}
        selectedSessionId={selectedSessionId}
        onSessionSelect={setSelectedSessionId}
      />
    );
  }

  return (
    <div className='flex-1 flex flex-col md:flex-row gap-4 min-h-0'>
      {/* Kiri — daftar outlet (dari GET /outlet) */}
      <div className='w-full md:w-[340px] shrink-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
        <div className='px-5 py-4 border-b border-slate-100'>
          <div className='flex items-center gap-2.5'>
            <MapPin className='w-4 h-4 text-emerald-600' />
            <h3 className='text-sm font-bold text-slate-800'>Daftar Outlet</h3>
            <span className='ml-auto text-[11px] font-semibold text-slate-400'>
              {outlets.length} outlet
            </span>
          </div>
          {isSuperuser && (
            <div className='mt-3'>
              <RemoteSelect
                label=''
                placeholder='Semua Franchisor'
                value={franchisor}
                onChange={(val) => {
                  setFranchisor(val);
                  setSelectedId(null);
                  setSelectedSessionId(null);
                }}
                onClear={() => {
                  setFranchisor(null);
                  setSelectedId(null);
                  setSelectedSessionId(null);
                }}
                fetchData={(page, search) =>
                  getFranchisors({ page: page || 1, limit: 20, search })
                }
                hook={getFranchisorsResult as any}
                getLabel={(item: any) => item?.name ?? ""}
                renderItem={(item: any) => item?.name}
                getValue={(item: any) => item.id}
              />
            </div>
          )}
        </div>

        <div className='flex-1 overflow-y-auto min-h-0'>
          {outlets.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-slate-400'>
              <MapPin className='w-8 h-8 text-slate-300 mb-2' />
              <p className='text-sm font-medium'>Belum ada outlet</p>
            </div>
          ) : (
            outlets.map((o) => {
              const active = o.id === activeId;
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedId(o.id);
                    setSelectedSessionId(null);
                  }}
                  className={clsx(
                    "w-full text-left px-5 py-3.5 border-b border-slate-50 transition-colors cursor-pointer",
                    active
                      ? "bg-emerald-50/70 border-l-[3px] border-l-emerald-500"
                      : "hover:bg-slate-50",
                  )}
                >
                  <p className='text-sm font-bold text-slate-800 truncate'>
                    {o.name}
                  </p>
                  {brandName(o) && (
                    <p className='text-[11px] text-slate-400 font-medium truncate mt-0.5'>
                      {brandName(o)}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Kanan — peta per kasir */}
      <CashierMapPanel
        outletId={activeId ?? undefined}
        outletName={activeOutletName}
        items={items}
        isLoading={isLoading}
        selectedSessionId={selectedSessionId}
        onSessionSelect={setSelectedSessionId}
      />
    </div>
  );
}

export default function OutletMapPage() {
  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Peta Outlet'
        subtitle='Rekap posisi dan jejak outlet berdasarkan history GPS.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OutletMapReport />
      </Page.Body>
    </Page>
  );
}
