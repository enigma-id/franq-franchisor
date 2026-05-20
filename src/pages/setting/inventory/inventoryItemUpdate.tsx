import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useInventoryItem } from "@/services/inventory/hooks";
import { Save, RefreshCw } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  InventoryItemForm,
  type InventoryItemFormData,
} from "./components/inventoryItemForm";

export function InventoryItemUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useInventoryItem();
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
        message: "Item Inventori berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/inventory/item");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  const handleSubmit = (formData: InventoryItemFormData) => {
    if (id) {
      const payload = {
        ...formData,
        id,
        is_stockable: formData.is_stockable ? 1 : 0,
        is_vatable: formData.is_vatable ? 1 : 0,
      };
      update({ id, payload });
    }
  };

  const detail = detailData?.data as any;
  const initialData = detail
    ? ({
        ...detail,
        is_stockable:
          detail.is_stockable === 1 ||
          detail.is_stockable === true,
        is_vatable:
          detail.is_vatable === 1 ||
          detail.is_vatable === true,
      } as any)
    : undefined;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Ubah Item Inventori"
        subtitle={
          initialData
            ? `Perbarui item: ${initialData.name}`
            : "Perbarui detail item inventori."
        }
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="inventory-item-form"
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
      <Page.Body className="flex-1 overflow-auto p-6">
        {isLoadingDetail ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Memuat detail item inventori...
            </p>
          </div>
        ) : (
          <InventoryItemForm
            id="inventory-item-form"
            initialData={initialData as any}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default InventoryItemUpdate;
