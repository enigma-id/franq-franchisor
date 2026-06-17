import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { Save, RefreshCw } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  PurchaseOrderForm,
  type PurchaseOrderFormData,
} from "./components/purchaseOrderForm";

export function PurchaseOrderUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = usePurchaseOrder();
  const { isLoading: isLoadingDetail, data: detailData } = showResult;
  const { isLoading: isUpdating, isSuccess } = updateResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Purchase Order berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/purchase/order/${id}`, { replace: true });
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, id, updateResult, showToast]);

  const handleSubmit = (formData: PurchaseOrderFormData) => {
    if (id) {
      update({ id, payload: { ...formData } });
    }
  };

  const initialData = detailData?.data as any;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Ubah Purchase Order"
        subtitle={
          initialData
            ? `Perbarui pesanan dengan referensi: ${initialData.code || initialData.reff_code || id}`
            : "Perbarui transaksi pengadaan bahan baku."
        }
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="purchase-order-form"
            disabled={isUpdating || isLoadingDetail}
            variant="success"
          >
            {isUpdating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        {isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Memuat detail purchase order...
            </p>
          </div>
        ) : (
          <PurchaseOrderForm
            id="purchase-order-form"
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default PurchaseOrderUpdate;
