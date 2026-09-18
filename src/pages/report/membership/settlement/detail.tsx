/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button, Loading } from "@/components/ui";
import { useMembershipReport } from "@/services/report/hooks";
import type { MembershipSettlementRow } from "@/services/types";
import { currencyFormat, formatDate, formatDateTime } from "@/utils";
import { useCan, useIsSuperuser } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import SettlementActionModals from "./components/SettlementActionModals";
import type { SettlementAction } from "./table/settlement.config";
import { CheckCircle2, ListOrdered, RefreshCw, XCircle } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  topup_cash: "Topup Cash",
  topup_transfer: "Topup Transfer",
  payment_saldo: "Payment Saldo",
  payment_point: "Payment Point",
};

const DIRECTION_LABEL: Record<string, string> = {
  ho_to_outlet: "HO → Outlet",
  outlet_to_ho: "Outlet → HO",
};

/** Satu baris info: label di kiri, nilai di kanan. */
function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0'>
      <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-0.5'>
        {label}
      </span>
      <span className='text-sm text-slate-700 text-right break-words'>
        {value}
      </span>
    </div>
  );
}

/** Tanggal lokal (YYYY-MM-DD) — BE hanya mengizinkan settle untuk tanggal < hari ini. */
const todayString = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function MembershipSettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();
  const canSettleAction = useCan(ACTION.membershipSettlementSettle);
  // Aksi settle/unsettle/reconcile di BE: slug aksi + wajib superuser.
  const canSettle = isSuperuser && canSettleAction;

  const [action, setAction] = useState<SettlementAction | null>(null);

  const { settlementDetail, settlementDetailResult } = useMembershipReport();
  const detail = settlementDetailResult?.data?.data as
    | MembershipSettlementRow
    | undefined;

  const fetchDetail = () => {
    if (id) settlementDetail(id);
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const dateOnly = detail?.date?.slice(0, 10) ?? "";
  const items = detail?.items ?? [];
  const settled = detail?.status === "settled";
  const canSettleThisRow = !settled && !!dateOnly && dateOnly < todayString();

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`Settlement — ${detail?.outlet?.name ?? "-"}`}
        subtitle={`Settlement tanggal ${dateOnly ? formatDate(dateOnly) : "-"}.`}
        backTo={() => navigate("/report/membership/settlement")}
        action={
          detail &&
          canSettle && (
            <div className='flex items-center gap-2'>
              {canSettleThisRow && (
                <Button
                  variant='success'
                  size='sm'
                  onClick={() => setAction("settle")}
                >
                  <CheckCircle2 className='w-4 h-4 mr-1.5' />
                  Settle
                </Button>
              )}
              {settled && (
                <Button
                  variant='error'
                  size='sm'
                  onClick={() => setAction("unsettle")}
                >
                  <XCircle className='w-4 h-4 mr-1.5' />
                  Unsettle
                </Button>
              )}
              {!settled && (
                <Button
                  variant='warning'
                  size='sm'
                  onClick={() => setAction("reconcile")}
                >
                  <RefreshCw className='w-4 h-4 mr-1.5' />
                  Reconcile
                </Button>
              )}
            </div>
          )
        }
      />

      <Page.Body>
        {settlementDetailResult?.isLoading ? (
          <div className='flex-1 flex items-center justify-center min-h-64'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : !detail ? (
          <div className='bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center text-sm text-slate-500'>
            Data settlement tidak ditemukan.
          </div>
        ) : (
          <>
            {/* Dua section bersebelahan: Informasi Settlement (kiri) | Ringkasan Settlement (kanan) */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 shrink-0 items-start'>
              {/* Informasi settlement + audit */}
              <div className='bg-white border border-slate-200 rounded-xl shadow-sm p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <h2 className='font-bold text-slate-700 text-sm'>
                    Informasi Settlement
                  </h2>
                  <Badge variant={settled ? "success" : "warning"}>
                    {detail.status || "-"}
                  </Badge>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8'>
                  <InfoRow
                    label='Settled By'
                    value={detail.settled_by || "-"}
                  />
                  <InfoRow
                    label='Aksi'
                    value={DIRECTION_LABEL[detail.transfer_direction] || "-"}
                  />
                  <InfoRow
                    label='Settled At'
                    value={
                      detail.settled_at
                        ? formatDateTime(detail.settled_at)
                        : "-"
                    }
                  />
                  <InfoRow
                    label='Transfer Reference'
                    value={detail.transfer_reference || "-"}
                  />
                  <InfoRow
                    label='Transfer Note'
                    value={detail.transfer_note || "-"}
                  />
                  <InfoRow
                    label='Alasan Unsettle'
                    value={detail.unsettled_reason || "-"}
                  />
                </div>
              </div>

              {/* Ringkasan (dari header settlement) */}
              <div className='bg-white border border-slate-200 rounded-xl shadow-sm p-5'>
                <div className='flex items-center gap-3 mb-4'>
                  <h2 className='font-bold text-slate-700 text-sm'>
                    Ringkasan Settlement
                  </h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8'>
                  <InfoRow
                    label='Topup Cash'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(detail.topup_cash ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Topup Transfer'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(detail.topup_transfer ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Payment Saldo'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(detail.payment_saldo ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Payment Point'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(detail.payment_point ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Payment Total'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(detail.payment_total ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Net'
                    value={
                      <span
                        className={
                          (detail.net_amount ?? 0) < 0
                            ? "font-mono font-semibold text-red-500"
                            : "font-mono font-semibold text-green-600"
                        }
                      >
                        {currencyFormat(detail.net_amount ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Total Item'
                    value={
                      <span className='font-semibold'>{items.length}</span>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Item sumber settlement — dari response show, tidak dipaginasi */}
            <div className='card-table'>
              <div className='table-header p-6!'>
                <div className='table-header-icon'>
                  <ListOrdered size={16} />
                </div>
                <h2 className='table-header-title'>
                  Item Settlement ({items.length})
                </h2>
              </div>
              <div className='flex-1 overflow-auto'>
                <table
                  className='table-hover table-vcenter datatable table'
                  width='100%'
                >
                  <thead>
                    <tr>
                      <th className='px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                        Tanggal
                      </th>
                      <th className='px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                        Tipe
                      </th>
                      <th className='px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                        Jenis
                      </th>
                      <th className='px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                        Reference Code
                      </th>
                      <th className='px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                        Nominal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-4 py-12 text-center text-base-content/50'
                        >
                          Belum ada item
                        </td>
                      </tr>
                    ) : (
                      items.map((item: any) => (
                        <tr
                          key={item.id}
                          className='hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors'
                        >
                          <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                            {formatDateTime(item.created_at)}
                          </td>
                          <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                            {TYPE_LABEL[item.type] || item.type || "-"}
                          </td>
                          <td className='px-4 py-3 align-middle'>
                            <Badge
                              variant={
                                item.kind === "reversal" ? "warning" : "info"
                              }
                            >
                              {item.kind || "-"}
                            </Badge>
                          </td>
                          <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                            {item.reference_code || "-"}
                          </td>
                          <td
                            className={`px-4 py-3 align-middle text-[13px] font-mono font-semibold text-right ${
                              (item.amount ?? 0) < 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {currencyFormat(item.amount ?? 0)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Page.Body>

      {detail && action && (
        <SettlementActionModals
          key={`${detail.id}-${action}`}
          settlement={detail}
          action={action}
          onClose={() => setAction(null)}
          onSuccess={fetchDetail}
        />
      )}
    </Page>
  );
}
