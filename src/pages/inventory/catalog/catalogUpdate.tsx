/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { InventoryCatalogForm } from "./components/catalogForm";
import { useInventoryCatalog } from "@/services/inventory/hooks";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save, RefreshCw } from "lucide-react";
import type { InventoryCatalogDetail } from "@/services/types";

const InventoryCatalogUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useInventoryCatalog();
  const { showToast } = useEnigmaUI();
  const { isLoading: isUpdating, isSuccess } = updateResult;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Katalog berhasil diperbarui",
        type: "success",
      });
      navigate("/inventory/catalog");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  const data = showResult.data?.data as InventoryCatalogDetail;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Inventory"
        title="Update Katalog"
        subtitle={
          showResult.data?.data
            ? `Perbarui katalog: ${data.name}`
            : "Perbarui informasi katalog produk."
        }
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="inventory-catalog-form"
            disabled={isUpdating || showResult.isLoading}
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
        {showResult.isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Memuat detail katalog...
            </p>
          </div>
        ) : (
          <InventoryCatalogForm
            id="inventory-catalog-form"
            initialData={data}
            onSubmit={(data) => update({ id: id!, payload: data as any })}
            isLoading={isUpdating}
          />
        )}
      </Page.Body>
    </Page>
  );
};

export default InventoryCatalogUpdatePage;
