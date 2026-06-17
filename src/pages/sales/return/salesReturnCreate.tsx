import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useSalesReturn } from "@/services/sales/hooks";
import { SalesReturnForm } from "./components/returnForm";
import type { SalesReturnRequest } from "@/services/types/sales";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";

const SalesReturnCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = useSalesReturn();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Return penjualan berhasil dibuat",
        type: "success",
      });
      navigate("/sales/return");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: SalesReturnRequest) => {
    create(data as unknown as Record<string, unknown>);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Buat Return Penjualan"
        subtitle="Input data pengembalian barang dari transaksi penjualan."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="sales-order-return"
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

      <Page.Body className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <SalesReturnForm
            id="sales-order-return"
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default SalesReturnCreatePage;
