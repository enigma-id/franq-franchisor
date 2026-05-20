import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { Save, RefreshCw } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  InventoryCatalogForm,
  type InventoryCatalogFormData,
} from "./components/inventoryCatalogForm";

export function InventoryCatalogUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useInventoryCatalog();
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
        message: "Katalog Barang berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/inventory/catalog");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  const handleSubmit = (formData: InventoryCatalogFormData) => {
    if (id) {
      update({ id, ...formData });
    }
  };

  const initialData = detailData?.data as any;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Ubah Katalog Barang"
        subtitle={
          initialData
            ? `Perbarui katalog barang: ${initialData.name}`
            : "Perbarui katalog produk barang."
        }
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="inventory-catalog-form"
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
              Memuat detail katalog...
            </p>
          </div>
        ) : (
          <InventoryCatalogForm
            id="inventory-catalog-form"
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default InventoryCatalogUpdate;
