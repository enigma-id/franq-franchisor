/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { PackageOpen } from "lucide-react";

import { DatePicker, Input, RemoteSelect } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import {
  useLazyGetItemFractionsQuery,
  useLazyGetItemQuery,
} from "@/services/inventory/api";
import { useItemBatch } from "@/services/warehouse/hooks";
import type {
  ItemBatch,
  ItemFraction,
  Receiving,
  ReceivingPlanDetail,
  ReceivingRequest,
} from "@/services/types";
import { PhotoUpload } from "./photoUpload";

type RowState = {
  planItemId: string;
  /** ID receiving_item dari dokumen (null = item baru, BE akan insert). */
  receivingItemId: string | null;
  /** ID item di warehouse (dipakai endpoint batch). */
  itemId: string;
  /** ID item di franchisor (item.ref_id — dipakai endpoint inventory/fraction). */
  refId: string;
  name: string;
  code: string;
  quantityPlanned: number;
  quantityReceivedBefore: number;
  quantityReceived: number;
  receivedFraction: ItemFraction | null;
  quantityDefect: number;
  defectFraction: ItemFraction | null;
  batch: ItemBatch | null;
  note: string;
};

interface ReceivingFormProps {
  id?: string;
  plan?: ReceivingPlanDetail;
  data?: Receiving;
  onSubmit: (payload: ReceivingRequest) => void;
}

const toNumber = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function ReceivingForm({
  id = "receiving-form",
  plan,
  data,
  onSubmit,
}: ReceivingFormProps) {
  const { showToast } = useEnigmaUI();

  const [getFractions] = useLazyGetItemFractionsQuery();
  const [getItem] = useLazyGetItemQuery();
  const { get: getBatches, getResult: batchesResult } = useItemBatch();

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<string>(dayjs().format("HH:mm"));
  const [note, setNote] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);

  const [fractionsCache, setFractionsCache] = useState<
    Record<string, ItemFraction[]>
  >({});
  const [batchTracking, setBatchTracking] = useState<Record<string, boolean>>(
    {},
  );

  // ── Init baris dari plan (create) / dokumen (edit) ──────────────────────
  useEffect(() => {
    if (!plan?.items) return;

    setRows(
      plan.items.map((pi) => {
        const existing = data?.items?.find((di) => di.plan_item_id === pi.id);
        const frac = existing?.received_fraction ?? null;
        const rawReceived = toNumber(existing?.quantity_received);
        // Prefill sisa dari plan hanya saat create; update ikut dokumen apa adanya.
        const receivedQty = existing
          ? frac?.quantity
            ? rawReceived / frac.quantity
            : rawReceived
          : data
            ? 0
            : Math.max(
                0,
                toNumber(pi.quantity_planned) - toNumber(pi.quantity_received),
              );

        const defectFrac = existing?.defect_fraction ?? null;
        const rawDefect = toNumber(existing?.quantity_defect);
        const defectQty = defectFrac?.quantity
          ? rawDefect / defectFrac.quantity
          : rawDefect;

        // Batch ber-id kosong/null-UUID berarti batch dibuat baru (batch_identifier).
        const rawBatch = existing?.batch ?? null;
        const isEmptyBatch =
          !!rawBatch &&
          (!rawBatch.id ||
            rawBatch.id === "00000000-0000-0000-0000-000000000000");
        const batch: ItemBatch | null = rawBatch
          ? isEmptyBatch
            ? {
                id: "",
                code: rawBatch.code,
                expired_at: rawBatch.expired_at,
                entry_at: rawBatch.entry_at,
                is_createable: true,
              }
            : rawBatch
          : null;

        return {
          planItemId: pi.id,
          receivingItemId: existing?.id ?? null,
          itemId: pi.item_id,
          refId: pi.item?.ref_id ?? "",
          name: pi.item?.name ?? "-",
          code: (pi.item as any)?.code ?? "",
          quantityPlanned: toNumber(pi.quantity_planned),
          quantityReceivedBefore: toNumber(pi.quantity_received),
          quantityReceived: receivedQty,
          receivedFraction: frac,
          quantityDefect: defectQty,
          defectFraction: defectFrac,
          batch,
          note: existing?.note ?? "",
        };
      }),
    );
  }, [plan, data]);

  // ── Ambil fraction + meta item (batch tracking) per item ────────────────
  useEffect(() => {
    if (!plan?.items) return;

    Array.from(
      new Set(
        plan.items.map((pi) => pi.item?.ref_id).filter((v): v is string => !!v),
      ),
    ).forEach(async (itemId) => {
      try {
        const [fr, it] = await Promise.all([
          getFractions({ id: itemId }).unwrap(),
          getItem({ id: itemId }).unwrap(),
        ]);
        setFractionsCache((prev) => ({
          ...prev,
          [itemId]: ((fr as any)?.data ?? []) as ItemFraction[],
        }));
        setBatchTracking((prev) => ({
          ...prev,
          [itemId]: !!(it as any)?.data?.is_batch_tracking,
        }));
      } catch {
        // Item/fraction tidak tersedia — form tetap jalan tanpa opsi.
      }
    });
  }, [plan]);

  // ── Selaraskan fraction baris dengan opsi franchisor ────────────────────
  // Fraction dari dokumen (mode edit) memakai id warehouse — opsi di form
  // memakai id franchisor, jadi dicocokkan lewat ref_id.
  useEffect(() => {
    setRows((prev) =>
      prev.map((r) => {
        const fractions = fractionsCache[r.refId];
        if (!fractions?.length) return r;

        const toFranchisor = (f: ItemFraction | null) =>
          f
            ? (fractions.find((x) => x.id === f.id) ??
              fractions.find((x) => x.id === f.ref_id) ??
              f)
            : f;

        // Item dengan satu satuan dipilihkan saat create; update ikut dokumen.
        const receivedFraction =
          toFranchisor(r.receivedFraction) ??
          (!data && fractions.length === 1 ? fractions[0] : null);
        const defectFraction = toFranchisor(r.defectFraction);

        if (
          receivedFraction === r.receivedFraction &&
          defectFraction === r.defectFraction
        ) {
          return r;
        }

        return { ...r, receivedFraction, defectFraction };
      }),
    );
  }, [fractionsCache, data]);

  const updateRow = (index: number, patch: Partial<RowState>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const active = rows.filter(
      (r) => toNumber(r.quantityReceived) > 0 || toNumber(r.quantityDefect) > 0,
    );

    if (!active.length) {
      showToast({
        message: "Minimal satu item harus diterima atau defect.",
        type: "error",
        position: "bottom-center",
      });
      return;
    }

    for (const r of active) {
      if (toNumber(r.quantityReceived) > 0 && !r.receivedFraction) {
        showToast({
          message: `Satuan penerimaan wajib dipilih untuk ${r.name}.`,
          type: "error",
          position: "bottom-center",
        });
        return;
      }
      if (toNumber(r.quantityDefect) > 0 && !r.defectFraction) {
        showToast({
          message: `Satuan defect wajib dipilih untuk ${r.name}.`,
          type: "error",
          position: "bottom-center",
        });
        return;
      }
      if (batchTracking[r.itemId] && !r.batch) {
        showToast({
          message: `Batch wajib diisi untuk ${r.name}.`,
          type: "error",
          position: "bottom-center",
        });
        return;
      }
    }

    onSubmit({
      plan_id: plan?.id,
      receive_date: date ? date.format("YYYY-MM-DD") : "",
      receive_time: `${time} ${dayjs().format("Z")}`,
      note,
      photos,
      items: rows.map((r) => ({
        id: r.receivingItemId,
        plan_item_id: r.planItemId,
        received_fraction_id: r.receivedFraction?.id,
        quantity_received: toNumber(r.quantityReceived),
        defect_fraction_id: r.defectFraction?.id,
        quantity_defect: toNumber(r.quantityDefect),
        batch_id: r.batch && !r.batch.is_createable ? r.batch.id : null,
        batch_identifier: r.batch?.is_createable ? r.batch.code : null,
        note: r.note,
      })),
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className='flex flex-col gap-4'>
      {/* Informasi Penerimaan */}
      <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
        <h3 className='text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2'>
          <PackageOpen size={16} className='text-primary' />
          Informasi Penerimaan
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <DatePicker
            label='Tanggal Terima'
            required
            mode='single'
            value={date || undefined}
            onChange={(d) => {
              const next = Array.isArray(d) ? d[0] : d;
              setDate(next ?? null);
            }}
            placeholder='Pilih tanggal'
          />
          <Input
            label='Jam Terima'
            required
            type='time'
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <div className='sm:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <Input
              label='Catatan'
              type='textarea'
              placeholder='Catatan penerimaan...'
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <PhotoUpload
              photos={photos}
              maxPhotos={3}
              onPhotosChange={setPhotos}
            />
          </div>
        </div>
      </div>

      {/* Item */}
      <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
        <h3 className='text-sm font-bold text-slate-700 uppercase mb-4'>
          Item Diterima ({rows.length})
        </h3>

        <div className='flex flex-col gap-3'>
          {rows.map((row, i) => (
            <div
              key={row.planItemId}
              className='rounded-xl border border-slate-200 overflow-hidden'
            >
              <div className='px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3'>
                <div className='flex-1 min-w-[180px]'>
                  <div className='text-sm font-medium text-slate-700'>
                    {row.name}
                  </div>
                  <div className='text-[11px] text-slate-400'>
                    {row.code} · Rencana {row.quantityPlanned} · Diterima{" "}
                    {row.quantityReceivedBefore}
                  </div>
                </div>
                {batchTracking[row.refId] && (
                  <div className='w-full lg:w-56'>
                    <RemoteSelect<ItemBatch>
                      placeholder='Pilih Batch'
                      value={row.batch}
                      onChange={(b) => updateRow(i, { batch: b })}
                      onClear={() => updateRow(i, { batch: null })}
                      getLabel={(b) => b?.code ?? ""}
                      getValue={(b) => b?.id ?? b?.code ?? ""}
                      renderItem={(b) => (
                        <div>
                          <div>{b?.code}</div>
                          <div className='text-xs text-slate-400'>
                            {dayjs(b?.expired_at || b?.entry_at).format(
                              "DD/MM/YYYY",
                            )}
                          </div>
                        </div>
                      )}
                      fetchData={(page, search) =>
                        getBatches({ page, search, item_id: row.itemId })
                      }
                      hook={batchesResult as any}
                      is_createable
                      onCreate={(val) =>
                        updateRow(i, {
                          batch: {
                            id: "",
                            code: val.label,
                            is_createable: true,
                          },
                        })
                      }
                      watchKey={row.itemId}
                    />
                  </div>
                )}
              </div>

              <div className='p-4 grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Qty Diterima */}
                <div>
                  <div className='text-xs font-medium text-slate-500 mb-2'>
                    Qty Diterima (Bagus)
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='Qty'
                      value={row.quantityReceived}
                      onChange={(e) =>
                        updateRow(i, {
                          quantityReceived: toNumber(e.target.value),
                        })
                      }
                    />
                    <RemoteSelect<ItemFraction>
                      placeholder='Satuan'
                      data={fractionsCache[row.refId] || []}
                      value={row.receivedFraction}
                      onChange={(f) => updateRow(i, { receivedFraction: f })}
                      onClear={() => updateRow(i, { receivedFraction: null })}
                      getLabel={(f) => `${f?.name} (${f?.quantity})`}
                      getValue={(f) => f?.id}
                    />
                  </div>
                </div>

                {/* Qty Defect */}
                <div>
                  <div className='text-xs font-medium text-slate-500 mb-2'>
                    Qty Defect
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='Qty'
                      value={row.quantityDefect}
                      onChange={(e) =>
                        updateRow(i, {
                          quantityDefect: toNumber(e.target.value),
                        })
                      }
                    />
                    <RemoteSelect<ItemFraction>
                      placeholder='Satuan'
                      data={fractionsCache[row.refId] || []}
                      value={row.defectFraction}
                      onChange={(f) => updateRow(i, { defectFraction: f })}
                      onClear={() => updateRow(i, { defectFraction: null })}
                      getLabel={(f) => `${f?.name} (${f?.quantity})`}
                      getValue={(f) => f?.id}
                    />
                  </div>
                </div>

                <div className='lg:col-span-2'>
                  <Input
                    type='textarea'
                    label='Catatan Item'
                    placeholder='Catatan untuk item ini...'
                    value={row.note}
                    onChange={(e) => updateRow(i, { note: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}

          {!rows.length && (
            <div className='py-8 text-center text-slate-400'>
              Tidak ada item pada receiving plan ini.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default ReceivingForm;
