import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  InventoryCatalogForm,
  type InventoryCatalogFormData,
} from "./components/inventoryCatalogForm";

export function InventoryCatalogCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useInventoryCatalog();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Katalog Inventaris berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/inventory/catalog");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: InventoryCatalogFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="Tambah Katalog Inventaris"
        subtitle="Buat katalog produk inventaris baru untuk dipasok to outlet."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="inventory-catalog-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Katalog
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <InventoryCatalogForm
          id="inventory-catalog-form"
          onSubmit={handleSubmit}
        />
      </Page.Body>
    </Page>
  );
}

export default InventoryCatalogCreate;
