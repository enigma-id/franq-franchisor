import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { SupplierForm, type SupplierFormData } from "./components/supplierForm";
import { useSupplier } from "@/services/supplier/hooks";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function SupplierCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useSupplier();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.supplier);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Supplier berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/purchase/supplier");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: SupplierFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase"
        title="Tambah Supplier"
        subtitle="Registrasikan supplier logistik & bahan baku baru."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="supplier-form"
              disabled={isCreating}
              variant="success"
            >
              {isCreating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Supplier
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <SupplierForm id="supplier-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}
