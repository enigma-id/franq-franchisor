/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { InventoryCatalogForm } from "./components/catalogForm";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { useNavigate } from "react-router-dom";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const InventoryCatalogCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = useInventoryCatalog();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.catalog);
  const { isLoading: isCreating, isSuccess } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Katalog berhasil dibuat",
        type: "success",
      });
      navigate("/inventory/catalog");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory & Warehouse"
        title="Tambah Katalog Baru"
        subtitle="Daftarkan katalog produk baru."
        backTo={() => navigate(-1)}
        action={
          canManage && (
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
                  Simpan
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body>
        <div className="mx-auto py-6">
          <InventoryCatalogForm
            id="inventory-catalog-form"
            onSubmit={(data) => create(data as any)}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default InventoryCatalogCreatePage;
