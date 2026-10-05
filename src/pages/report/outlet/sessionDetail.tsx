import {
  CalendarDays,
  CreditCard,
  ListOrdered,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components/ui";
import { useReport } from "@/services/report/hooks";
import type { ReportSessionDetail } from "@/services/types";
import {
  currencyFormat,
  displayPaymentMethod,
  formatDate,
  formatDateTime,
  formatTime,
  isOngoing,
} from "@/utils";

export default function OutletSessionDetailPage() {
  const { outletId, sessionId } = useParams<{
    outletId: string;
    sessionId: string;
  }>();
  const navigate = useNavigate();
  const { sessionDetail, sessionDetailResult } = useReport();

  useEffect(() => {
    if (sessionId) sessionDetail(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const session = sessionDetailResult?.data?.data as
    | ReportSessionDetail
    | undefined;

  if (sessionDetailResult?.isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Loading size='lg' variant='spinner' />
      </div>
    );
  }

  if (!session) {
    return (
      <div className='text-center py-12 text-slate-400'>
        Sesi tidak ditemukan
      </div>
    );
  }

  const sales = session.summary?.sales;
  const grandTotal = sales?.grand_total ?? 0;
  const subtotalNettSales = sales?.subtotal_nett_bagi_hasil ?? 0;
  const totalService = sales?.total_service ?? 0;
  const totalDiscount = sales?.total_discount ?? 0;
  const totalSales = sales?.total_sales ?? 0;
  const afterDiscount = sales?.total_after_discount ?? 0;
  const outstandingBill = sales?.outstanding_bill ?? 0;
  const expectedCash = session.summary?.cash?.expected_cash ?? 0;
  const topupCash = session.summary?.cash?.topup_cash ?? 0;
  const topups = session.summary?.topups ?? [];
  const paymentMethods = session.summary?.payment_methods ?? [];
  const categorySolds = session.summary?.category_solds ?? [];
  const orders = session.orders ?? [];

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`Detail Sesi #${session.id.split("-").pop()}`}
        subtitle={session.outlet?.name}
        backTo={() => navigate(`/report/outlet/${outletId}`)}
      />
      <Page.Body>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Session Info */}
          <div className='card-info card-animate p-4'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <CalendarDays size={18} />
              </div>
              <h2 className='card-section-title'>Session Info</h2>
            </div>
            <dl className='space-y-1'>
              <div className='info-row'>
                <dt className='info-label'>Session No.</dt>
                <dd className='info-value'>{session.id.split("-").pop()}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Cashier</dt>
                <dd className='info-value'>{session.cashier?.name ?? "-"}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Tanggal</dt>
                <dd className='info-value'>
                  {formatDate(session.transaction_date)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Awal Session</dt>
                <dd className='info-value'>
                  <span className='whitespace-nowrap'>
                    {formatDate(session.started_at)}
                    <span className='text-slate-400'> · </span>
                    {formatTime(session.started_at)}
                  </span>
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Akhir Session</dt>
                <dd className='info-value'>
                  {isOngoing(session.finished_at) ? (
                    <span className='text-amber-600 font-medium'>
                      (Ongoing)
                    </span>
                  ) : (
                    <span className='whitespace-nowrap'>
                      {formatDate(session.finished_at)}
                      <span className='text-slate-400'> · </span>
                      {formatTime(session.finished_at)}
                    </span>
                  )}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Starting Cash</dt>
                <dd className='info-value mono'>
                  {currencyFormat(session.cash_started)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Ending Cash</dt>
                <dd className='info-value mono'>
                  {currencyFormat(session.cash_finished)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Expected Cash</dt>
                <dd className='info-value mono'>
                  {currencyFormat(expectedCash)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Topup Cash</dt>
                <dd className='info-value mono'>{currencyFormat(topupCash)}</dd>
              </div>
            </dl>
          </div>

          {/* Sales Info */}
          <div className='card-info card-animate p-4'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <TrendingUp size={18} />
              </div>
              <h2 className='card-section-title'>Sales Info</h2>
            </div>
            <dl className='space-y-1'>
              <div className='info-row'>
                <dt className='info-label'>Total Sales (Nett)</dt>
                <dd className='info-value mono'>{currencyFormat(totalSales)}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Total Discount</dt>
                <dd className='info-value mono text-red-500'>
                  {currencyFormat(-totalDiscount)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Total After Discount</dt>
                <dd className='info-value mono'>
                  {currencyFormat(afterDiscount)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Total Service</dt>
                <dd className='info-value mono'>
                  {currencyFormat(totalService)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Grand Total</dt>
                <dd className='info-value mono'>{currencyFormat(grandTotal)}</dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Subtotal Nett Sales</dt>
                <dd className='info-value mono'>
                  {currencyFormat(subtotalNettSales)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Outstanding Bills</dt>
                <dd className='info-value mono'>
                  {currencyFormat(outstandingBill)}
                </dd>
              </div>
              <div className='info-row'>
                <dt className='info-label'>Outstanding Bill Payments</dt>
                <dd className='info-value mono'>
                  {currencyFormat(sales?.outstanding_bill_payment ?? 0)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Pembayaran */}
          <div className='card-info card-animate p-4'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <CreditCard size={18} />
              </div>
              <h2 className='card-section-title'>Pembayaran</h2>
            </div>
            {paymentMethods.length === 0 && topups.length === 0 ? (
              <p className='text-sm text-slate-400'>Tidak ada data</p>
            ) : (
              <dl className='space-y-1'>
                {paymentMethods.map((pm, i) => (
                  <div key={pm.id ?? i} className='info-row'>
                    <dt className='info-label'>{pm.name ?? "Cash"}</dt>
                    <dd className='info-value mono'>
                      {currencyFormat(pm.total_paid)}
                    </dd>
                  </div>
                ))}
                {topups.map((tp, i) => (
                  <div key={i} className='info-row'>
                    <dt className='info-label'>Topup {tp.type}</dt>
                    <dd className='info-value mono'>
                      {currencyFormat(tp.total_nominal)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Kategori */}
          <div className='card-info card-animate p-4'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <Tag size={18} />
              </div>
              <h2 className='card-section-title'>Kategori</h2>
            </div>
            {categorySolds.length === 0 ? (
              <p className='text-sm text-slate-400'>Tidak ada data</p>
            ) : (
              <dl className='space-y-1'>
                {categorySolds.map((cat, i) => (
                  <div key={i} className='info-row'>
                    <dt className='info-label'>{cat.category_name}</dt>
                    <div className='flex items-center gap-2'>
                      <span className='category-tag'>{cat.total_qty}</span>
                      <span className='info-value mono text-xs'>
                        {currencyFormat(cat.total_charges)}
                      </span>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* Transaction Table */}
        <div className='card-table card-animate mt-6'>
          <div className='table-header p-6!'>
            <div className='table-header-icon'>
              <ListOrdered size={16} />
            </div>
            <h2 className='table-header-title'>Transaksi</h2>
          </div>
          <div className='flex-1 overflow-auto'>
            <table
              className='table-hover table-vcenter datatable table'
              width='100%'
            >
              <thead>
                <tr>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    #
                  </th>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Tanggal
                  </th>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Code
                  </th>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Channel
                  </th>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Pembayaran
                  </th>
                  <th className='px-4 py-4 text-right text-[11px] font-bold tracking-[0.05em] text-[#8B95A5] uppercase select-none'>
                    Total Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-4 py-12 text-center text-slate-400'
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className='border-b border-gray-100 last:border-0'
                    >
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {idx + 1}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {order.paid_at && !isOngoing(order.paid_at)
                          ? formatDateTime(order.paid_at)
                          : "-"}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {order.code?.toUpperCase()}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {displayPaymentMethod(order.sales_channel?.name ?? null)}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {displayPaymentMethod(order.payment_method?.name ?? null)}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right'>
                        {currencyFormat(order.total_charges)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
