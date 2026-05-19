import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { Save, RefreshCw } from "lucide-react";
import { useSupplier } from "@/services/purchase/hooks";
import { useEnigmaUI } from "@/components";
import { SupplierForm, type SupplierFormData } from "./components/supplierForm";

export function PurchaseSupplierUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useSupplier();
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
        message: "Supplier berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/purchase/supplier");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  const handleSubmit = (formData: SupplierFormData) => {
    if (id) {
      update({ id, ...formData });
    }
  };

  const initialData = detailData?.data as any;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="purchase"
        title="Ubah Supplier"
        subtitle={initialData ? `Perbarui profil supplier: ${initialData.name}` : "Perbarui profil supplier."}
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="supplier-form"
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
              Memuat detail supplier...
            </p>
          </div>
        ) : (
          <SupplierForm
            id="supplier-form"
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default PurchaseSupplierUpdate;
