/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { InventoryItemForm } from "./components/itemForm";
import { useInventoryItem } from "@/services/inventory/hooks";
import { useNavigate } from "react-router-dom";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";

const InventoryItemCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { create, createResult } = useInventoryItem();
  const { isLoading: isCreating, isSuccess } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Item berhasil dibuat",
        type: "success",
      });
      navigate("/inventory/item");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Tambah Barang Baru"
        subtitle="Daftarkan barang inventaris baru."
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
      <Page.Body>
        <div className="mx-auto py-6">
          <InventoryItemForm
            id="inventory-item-form"
            onSubmit={(data) => create(data as any)}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default InventoryItemCreatePage;
