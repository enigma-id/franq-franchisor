import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  PurchaseOrderForm,
  type PurchaseOrderFormData,
} from "./components/purchaseOrderForm";

export function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const { create, createResult } = usePurchaseOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Purchase Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/purchase/order/${resData.data.id}`, { replace: true });
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  const handleSubmit = (data: PurchaseOrderFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Operations"
        title="Tambah Purchase Order"
        subtitle="Buat transaksi pengadaan bahan baku ke supplier."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="purchase-order-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Order
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <PurchaseOrderForm id="purchase-order-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}
export default PurchaseOrderCreate;
