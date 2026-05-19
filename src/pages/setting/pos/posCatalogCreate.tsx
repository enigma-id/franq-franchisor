import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { usePOSCatalog } from "@/services/pos/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  PosCatalogForm,
  type PosCatalogFormData,
} from "./components/posCatalogForm";

export function PosCatalogCreate() {
  const navigate = useNavigate();
  const { create, createResult } = usePOSCatalog();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Katalog POS berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/pos/catalog");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: PosCatalogFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="Tambah Katalog POS"
        subtitle="Registrasikan produk menu kasir POS baru."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="pos-catalog-form"
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
        <PosCatalogForm id="pos-catalog-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}

export default PosCatalogCreate;
