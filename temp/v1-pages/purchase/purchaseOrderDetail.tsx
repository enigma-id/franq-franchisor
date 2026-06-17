import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Page } from "@/components/app/layout";
import { Loading, Button, Badge, Modal } from "@/components/ui";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { formatCurrency, formatDate, getStatusVariant } from "@/utils";
import { usePurchaseOrderGuards } from "@/hooks";
import { GuardedButton } from "@/components/app";
import {
  ArrowLeft,
  Store,
  Hash,
  AlertCircle,
  Wallet,
  ClipboardList,
  Check,
  CreditCard,
  Trash2,
  Edit,
  Printer,
} from "lucide-react";

// Helper to get item type label
const getItemTypeLabel = (item: any) => {
  return item.item?.default_fraction || item.fraction?.name || "PCS";
};

// Helper to get item name
const getItemName = (item: any) => {
  return item.item?.name || item.catalog?.name || "-";
};

export function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    show,
    showResult,
    approve,
    approveResult,
    payment,
    paymentResult,
    remove,
    removeResult,
  } = usePurchaseOrder();
  const order = showResult?.data?.data as any;
  const isLoading = showResult?.isLoading || showResult?.isFetching;

  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "error";
  } | null>(null);

  const guards = usePurchaseOrderGuards(order);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  useEffect(() => {
    if (paymentResult.isSuccess) {
      setConfirmModal(null);
      if (id) show({ id });
      paymentResult.reset?.();
    }
  }, [paymentResult.isSuccess, id, show, paymentResult]);

  useEffect(() => {
    if (removeResult.isSuccess) {
      setConfirmModal(null);
      removeResult.reset?.();
      navigate("/purchase/order");
    }
  }, [removeResult.isSuccess, navigate, removeResult]);

  const handleApprove = async () => {
    if (id) {
      await approve({ id });
      show({ id });
    }
  };

  const handlePayment = () => {
    setConfirmModal({
      title: "Konfirmasi Pembayaran",
      message:
        "Apakah Anda yakin ingin memproses pembayaran untuk Purchase Order ini?",
      variant: "primary",
      onConfirm: () => {
        if (id) payment({ id });
      },
    });
  };

  const handleDelete = () => {
    setConfirmModal({
      title: "Hapus Purchase Order",
      message:
        "Apakah Anda yakin ingin menghapus Purchase Order ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "error",
      onConfirm: () => {
        if (id) remove({ id });
      },
    });
  };

  if (isLoading) {
    return (
      <Page className="h- full flex flex- col min- h-0 bg-slate-50">
        <Page.Header category="Operations" title="Purchase Order Detail" />
        <Page.Body>
          <div className="flex-1 flex items- center justify-center min- h-64">
            <Loading size="lg" variant="spinner" />
          </div>
        </Page.Body>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Header category="Operations" title="Purchase Order Detail" />
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 mb-2">
                Order tidak ditemukan
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/purchase/order")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </Page.Body>
      </Page>
    );
  }

  const totalQty =
    order.purchase_order_items?.reduce(
      (sum: number, item: any) => sum + (item.quantity_ordered || 0),
      0,
    ) || 0;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title={`Order #${order.id}`}
        backTo={() => navigate(-1)}
        action={
          <div className="flex gap-2">
            <GuardedButton
              allowed={guards.canPublish}
              reason="Hanya order dengan status pending yang dapat disetujui."
              variant="success"
              onClick={handleApprove}
              isLoading={approveResult.isLoading}
              title="Setujui (Approve)"
            >
              <Check className="w-4 h-4" />
            </GuardedButton>

            {/* Print Button if not pending */}
            {order.document_status !== "PENDING" && (
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(`/purchase/order/print/${id}`, "_blank")
                }
                title="Cetak Purchase Order"
              >
                <Printer className="w-4 h-4" />
              </Button>
            )}
            <GuardedButton
              allowed={guards.canPay}
              reason="Hanya order yang sudah disetujui dan belum lunas yang dapat dibayar."
              variant="primary"
              onClick={handlePayment}
              isLoading={paymentResult.isLoading}
              title="Bayar (Pay)"
            >
              <CreditCard className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canEdit}
              reason="Hanya order dengan status pending yang dapat diubah."
              variant="warning"
              onClick={() => navigate(`/purchase/order/update/${id}`)}
              title="Ubah"
            >
              <Edit className="w-4 h-4" />
            </GuardedButton>
            <GuardedButton
              allowed={guards.canDelete}
              reason="Hanya order dengan status pending yang dapat dihapus."
              variant="error"
              onClick={handleDelete}
              isLoading={removeResult.isLoading}
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </GuardedButton>
          </div>
        }
      />
      <Page.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Supplier Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Store size={18} />
              </div>
              <h2 className="card-section-title">Informasi Supplier</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Nama Supplier</dt>
                <dd className="info-value">{order.recipient_name}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Kontak</dt>
                <dd className="info-value">{order.recipient_phone}</dd>
              </div>
              <div className="info-row flex-col items-start gap-1">
                <dt className="info-label">Alamat</dt>
                <dd className="info-value text-left w-full wrap-break-word mt-0.5">
                  {order.address}
                </dd>
              </div>
            </dl>
          </div>

          {/* Order Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Hash size={18} />
              </div>
              <h2 className="card-section-title">Informasi Pesanan</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Kode</dt>
                <dd className="info-value">{order.code}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Tanggal Order</dt>
                <dd className="info-value">
                  {formatDate(order.ordered_at, "DD MMM YYYY, HH:mm")}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Estimasi Tanggal Kirim</dt>
                <dd className="info-value">
                  {formatDate(order.eta_date, "DD MMM YYYY")}
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Document Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.document_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.document_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Payment Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.payment_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.payment_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Receiving Status</dt>
                <dd className="info-value">
                  <Badge
                    variant={getStatusVariant(order.receiving_status)}
                    size="xs"
                    className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
                  >
                    {order.receiving_status?.toLowerCase()}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment Info */}
          <div className="card-info card-animate p-6">
            <div className="card-section-header">
              <div className="card-section-icon">
                <Wallet size={18} />
              </div>
              <h2 className="card-section-title">Pembayaran</h2>
            </div>
            <dl className="space-y-1">
              <div className="info-row">
                <dt className="info-label">Bank</dt>
                <dd className="info-value">{order.bank?.name}</dd>
              </div>
              <div className="info-row">
                <dt className="info-label">Jatuh Tempo</dt>
                <dd className="info-value">
                  {formatDate(order.payment_expired_at, "DD MMM YYYY, HH:mm")}
                </dd>
              </div>
              {order.paid_at && order.paid_at !== "0001-01-01T00:00:00Z" && (
                <div className="info-row">
                  <dt className="info-label">Dibayar</dt>
                  <dd className="info-value">
                    {formatDate(order.paid_at, "DD MMM YYYY, HH:mm")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="card-table card-animate mt-6">
          <div className="table-header p-6!">
            <div className="table-header-icon">
              <ClipboardList size={16} />
            </div>
            <h2 className="table-header-title">
              Order Items ({order.purchase_order_items?.length || 0})
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table
              className="table-hover table-vcenter datatable table"
              width="100%"
            >
              <thead>
                <tr>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Produk
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Tipe
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Qty
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Harga
                  </th>
                  <th className="px-4 py-4 text-right text-[11px] font-bold tracking-wider text-[#8B95A5] uppercase select-none">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.purchase_order_items?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-base-content/50"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  order.purchase_order_items?.map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {getItemName(item)}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700">
                        {getItemTypeLabel(item)}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                        {item.quantity_ordered}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                        {formatCurrency(item.unit_nett || 0)}
                      </td>
                      <td className="px-4 py-3 align-middle text-[13px] font-medium text-gray-700 text-right">
                        {formatCurrency(item.total_nett || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="border-t border-slate-200">
                {/* Subtotal */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-600" colSpan={3}>
                    Subtotal
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {totalQty} item(s)
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.subtotal || order.subtotal_nett || 0)}
                  </td>
                </tr>
                {/* Shipping Charges */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td
                    className="px-4 py-3 text-slate-600 text-right"
                    colSpan={5}
                  >
                    Shipping Charges
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.shipping_charges || 0)}
                  </td>
                </tr>
                {/* Tax (PPN) */}
                <tr className="bg-slate-50/50 font-semibold border-b border-slate-100">
                  <td
                    className="px-4 py-3 text-slate-600 text-right"
                    colSpan={5}
                  >
                    Tax
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800 mono">
                    {formatCurrency(order.subtotal_tax || 0)}
                  </td>
                </tr>
                {/* Total Bill */}
                <tr className="bg-slate-100 font-bold border-t border-slate-200">
                  <td
                    className="px-4 py-3.5 text-slate-800 text-right text-[14px]"
                    colSpan={5}
                  >
                    Total Bill
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-900 text-[14px] mono">
                    {formatCurrency(order.total_bill || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
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
          <Button onClick={() => setConfirmModal(null)} variant="default">
            Batal
          </Button>
          <Button
            onClick={() => {
              if (confirmModal) {
                confirmModal.onConfirm();
              }
            }}
            variant={confirmModal?.variant === "error" ? "error" : "primary"}
            isLoading={paymentResult.isLoading || removeResult.isLoading}
          >
            Konfirmasi
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
}

export default PurchaseOrderDetail;
