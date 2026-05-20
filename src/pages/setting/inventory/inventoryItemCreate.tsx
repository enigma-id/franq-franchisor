import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useInventoryItem } from "@/services/inventory/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  InventoryItemForm,
  type InventoryItemFormData,
} from "./components/inventoryItemForm";

export function InventoryItemCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useInventoryItem();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  // Navigate on success
  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Item Inventori berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/inventory/item");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: InventoryItemFormData) => {
    // API expects is_stockable as 1/0, is_vatable as 1/0
    const payload = {
      ...data,
      is_stockable: data.is_stockable ? 1 : 0,
      is_vatable: data.is_vatable ? 1 : 0,
    };
    create(payload);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Tambah Item"
        subtitle="Tambah item inventori baru."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="inventory-item-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-6">
        <InventoryItemForm
          id="inventory-item-form"
          onSubmit={handleSubmit}
        />
      </Page.Body>
    </Page>
  );
}

export default InventoryItemCreate;
