/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Loading, Button, Badge, Modal } from "@/components/ui";
import { useB2BOrder } from "@/services/b2b/hooks";
import { useEnigmaUI } from "@/components";
import { formatCurrency, formatDate, formatDateTime, getStatusVariant } from "@/utils";
import { usePrintWindow } from "@/utils/usePrintWindow";
import { B2BInvoicePrint } from "./components/B2BInvoicePrint";
import { B2BDOPrint } from "./components/B2BDOPrint";
import {
  AlertCircle,
  Store,
  ListOrdered,
  FileText,
  CreditCard,
  Trash2,
  Edit,
  Printer,
  Send,
  Receipt,
} from "lucide-react";
import type { B2BOrderDetail } from "@/services/types";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const B2BOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canManage = useCan(ACTION.b2b);

  const { showToast } = useEnigmaUI();
  const {
    show,
    showResult,
    ship,
    shipResult,
    invoice,
    invoiceResult,
    pay,
    payResult,
    remove,
    removeResult,
  } = useB2BOrder();
  const order = showResult?.data?.data as B2BOrderDetail | undefined;
  const orderItems = order?.items ?? [];
  const isLoading = showResult?.isLoading || showResult?.isFetching;
  const printInvoice = usePrintWindow({
    width: 800,
    height: 900,
    title: "B2B Invoice",
  });
  const printDO = usePrintWindow({
    width: 800,
    height: 900,
    title: "Delivery Order",
  });

  const [confirmModal, setConfirmModal] = useState<{
    type: "ship" | "invoice" | "pay" | "delete";
    title: string;
    message: string;
    variant: "primary" | "error";
  } | null>(null);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  // Close modal + refetch on success
  const activeResult =
    confirmModal?.type === "ship"
      ? shipResult
      : confirmModal?.type === "invoice"
        ? invoiceResult
        : confirmModal?.type === "pay"
          ? payResult
          : confirmModal?.type === "delete"
            ? removeResult
            : null;

  useEffect(() => {
    if (activeResult?.isSuccess) {
      showToast({
        message: "Berhasil",
        type: "success",
        position: "bottom-center",
      });
      setConfirmModal(null);
      activeResult.reset?.();
      if (confirmModal?.type === "delete") {
        navigate("/b2b/order");
      } else if (id) {
        show({ id });
      }
    }
  }, [
    activeResult?.isSuccess,
    confirmModal?.type,
    id,
    navigate,
    show,
    showToast,
  ]);

  const handleAction = async () => {
    if (!id || !confirmModal) return;
    switch (confirmModal.type) {
      case "ship":
        await ship({ id });
        break;
      case "invoice":
        await invoice({ id });
        break;
      case "pay":
        await pay({ id });
        break;
      case "delete":
        await remove({ id });
        break;
    }
  };

  const openConfirm = (type: "ship" | "invoice" | "pay" | "delete") => {
    if (!canTransition[type]) return;
    const labels: Record<
      string,
      { title: string; message: string; variant: "primary" | "error" }
    > = {
      ship: {
        title: "Konfirmasi Ship",
        message: "Apakah Anda yakin ingin memproses ship untuk order ini?",
        variant: "primary",
      },

      invoice: {
        title: "Konfirmasi Invoice",
        message: "Apakah Anda yakin ingin memproses invoice untuk order ini?",
        variant: "primary",
      },
      pay: {
        title: "Konfirmasi Payment",
        message:
          "Apakah Anda yakin ingin memproses pembayaran untuk order ini?",
        variant: "primary",
      },
      delete: {
        title: "Hapus Order",
        message:
          "Apakah Anda yakin ingin menghapus order ini? Tindakan ini tidak dapat dibatalkan.",
        variant: "error",
      },
    };
    setConfirmModal({ type, ...labels[type] });
  };

  if (isLoading) {
    return (
      <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
        <Page.Body>
          <div className='flex-1 flex items-center justify-center min-h-64'>
            <Loading size='lg' variant='spinner' />
          </div>
        </Page.Body>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
        <Page.Body>
          <div className='flex-1 flex items-center justify-center min-h-64'>
            <div className='text-center'>
              <AlertCircle className='w-16 h-16 text-slate-300 mx-auto mb-4' />
              <p className='text-lg font-medium text-slate-600 mb-2'>
                Order tidak ditemukan
              </p>
              <Button variant='primary' onClick={() => navigate(-1)}>
                Kembali
              </Button>
            </div>
          </div>
        </Page.Body>
      </Page>
    );
  }

  const isPending = order.document_status === "pending";
  const isUnpaid = order.payment_status === "unpaid";
  const isInvoiced = order.payment_status === "invoiced";

  // State transition guards: prevents API calls if state has already changed
  const canTransition: Record<string, boolean> = {
    ship: isPending,
    invoice: isUnpaid,
    pay: isInvoiced,
    delete: isPending,
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Sales'
        title='B2B Order Detail'
        subtitle={order.code}
        backTo={() => navigate(-1)}
        action={
          <div className='flex gap-2'>
            <Button
              variant='info'
              onClick={() =>
                printInvoice.open(<B2BInvoicePrint order={order} />)
              }
              title='Print Invoice'
            >
              <Printer className='w-4 h-4' />
            </Button>
            <Button
              variant='info'
              onClick={() => printDO.open(<B2BDOPrint order={order} />)}
              title='Print DO'
            >
              <FileText className='w-4 h-4' />
            </Button>
            {canManage && (
              <>
                {isPending && (
                  <>
                    <Button
                      variant='primary'
                      onClick={() => navigate(`/b2b/order/update/${order.id}`)}
                      title='Edit'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='primary'
                      onClick={() => openConfirm("ship")}
                      isLoading={shipResult.isLoading}
                      disabled={!canTransition.ship}
                      title='Ship'
                    >
                      <Send className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='error'
                      onClick={() => openConfirm("delete")}
                      isLoading={removeResult.isLoading}
                      disabled={!canTransition.delete}
                      title='Hapus'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </>
                )}
                {isUnpaid && (
                  <Button
                    variant='success'
                    onClick={() => openConfirm("invoice")}
                    isLoading={invoiceResult.isLoading}
                    disabled={!canTransition.invoice}
                    title='Invoice'
                  >
                    <Receipt className='w-4 h-4' />
                  </Button>
                )}
                {isInvoiced && (
                  <Button
                    variant='success'
                    onClick={() => openConfirm("pay")}
                    isLoading={payResult.isLoading}
                    disabled={!canTransition.pay}
                    title='Pay'
                  >
                    <CreditCard className='w-4 h-4' />
                  </Button>
                )}
              </>
            )}
          </div>
        }
      />
      <Page.Body>
        <div className='grid grid-cols-1 gap-6'>
          {/* Customer & Order Info */}
          <div className='card-info card-animate p-6'>
            <div className='card-section-header'>
              <div className='card-section-icon'>
                <Store size={18} />
              </div>
              <h2 className='card-section-title'>Informasi Pesanan</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left: Customer Info */}
              <dl className='space-y-1'>
                <div className='info-row'>
                  <dt className='info-label'>Nama</dt>
                  <dd className='info-value'>{order.customer_name}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Telepon</dt>
                  <dd className='info-value'>{order.customer_phone || "-"}</dd>
                </div>
                <div className='info-row flex-col items-start gap-1'>
                  <dt className='info-label'>Alamat</dt>
                  <dd className='info-value text-left w-full wrap-break-words mt-0.5'>
                    {order.customer_address || "-"}
                  </dd>
                </div>
              </dl>

              {/* Right: Order Info */}
              <dl className='space-y-1'>
                <div className='info-row'>
                  <dt className='info-label'>Kode</dt>
                  <dd className='info-value'>{order.code}</dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Tanggal Order</dt>
                  <dd className='info-value'>
                    {formatDateTime(order.created_at)}
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Tanggal Kirim</dt>
                  <dd className='info-value'>
                    {formatDate(order.shipping_date)}
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Document Status</dt>
                  <dd className='info-value'>
                    <Badge
                      variant={getStatusVariant(order.document_status)}
                      size='xs'
                      className='px-2.5 font-semibold text-[10px] tracking-wider'
                    >
                      {order.document_status?.toLowerCase()}
                    </Badge>
                  </dd>
                </div>
                <div className='info-row'>
                  <dt className='info-label'>Payment Status</dt>
                  <dd className='info-value'>
                    <Badge
                      variant={getStatusVariant(order.payment_status)}
                      size='xs'
                      className='px-2.5 font-semibold text-[10px] tracking-wider'
                    >
                      {order.payment_status?.toLowerCase()}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className='card-table card-animate mt-6'>
          <div className='table-header p-6!'>
            <div className='table-header-icon'>
              <ListOrdered size={16} />
            </div>
            <h2 className='table-header-title'>
              Order Items ({orderItems.length})
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
                    #
                  </th>
                  <th className='px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                    Menu
                  </th>
                  <th className='px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                    Qty
                  </th>
                  <th className='px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                    Harga
                  </th>
                  <th className='px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-4 py-12 text-center text-base-content/50'
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className='hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors'
                    >
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {idx + 1}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700'>
                        {item.menu_name}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right'>
                        {item.quantity}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right'>
                        {formatCurrency(item.unit_nett || 0)}
                      </td>
                      <td className='px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right'>
                        {formatCurrency(
                          (item.unit_nett || 0) * (item.quantity || 0),
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Note (left) + Nominal Summary (right) */}
          <div className='flex flex-col md:flex-row gap-6 p-5 border-t border-slate-100'>
            <div className='flex-1'>
              <span className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                Catatan
              </span>
              <p className='mt-1 text-sm text-slate-700 whitespace-pre-wrap'>
                {order.note || "-"}
              </p>
            </div>
            <div className='md:w-80 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Subtotal</span>
                <span className='font-semibold text-slate-800 mono'>
                  {formatCurrency(order.subtotal_nett || 0)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Discount</span>
                <span className='font-semibold text-slate-800 mono'>
                  -{formatCurrency(order.discount_value || 0)}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Service Charge</span>
                <span className='font-semibold text-slate-800 mono'>
                  {formatCurrency(order.service_charge_value || 0)}
                </span>
              </div>
              <div className='flex justify-between text-sm pt-2 border-t border-slate-200'>
                <span className='text-base font-bold text-slate-800'>
                  Total Bill
                </span>
                <span className='text-base font-bold text-slate-900 mono'>
                  {formatCurrency(order.total_charges || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Page.Body>

      <Modal.Wrapper
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
      >
        <Modal.Header>{confirmModal?.title}</Modal.Header>
        <Modal.Body>{confirmModal?.message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmModal(null)} variant='default'>
            Batal
          </Button>
          <Button
            onClick={handleAction}
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={!!activeResult?.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default B2BOrderDetailPage;
