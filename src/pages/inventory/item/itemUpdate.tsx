import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useInventoryItem } from "@/services/inventory/hooks";
import { Save, RefreshCw } from "lucide-react";
import { useEnigmaUI } from "@/components";
import type {
  InventoryItemDetail,
  InventoryItemUpdateRequest,
} from "@/services/types";
import { InventoryItemForm } from "./components/itemForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export function InventoryItemUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useInventoryItem();
  const { isLoading: isLoadingDetail, data: detailData } = showResult;
  const { isLoading: isUpdating, isSuccess } = updateResult;
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.inventory);

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
      navigate("/inventory/item");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  const handleSubmit = (formData: InventoryItemUpdateRequest) => {
    if (id) {
      const payload = {
        ...formData,
      };
      update({ id, payload });
    }
  };

  const detail = detailData?.data as InventoryItemDetail;
  const initialData = detail || undefined;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory & Warehouse"
        title="Ubah Item Inventori"
        subtitle={
          initialData
            ? `Perbarui item: ${initialData.name}`
            : "Perbarui detail item inventori."
        }
        backTo={() => navigate(-1)}
        action={
          canManage && (
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
          )
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
            initialData={initialData}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default InventoryItemUpdate;
