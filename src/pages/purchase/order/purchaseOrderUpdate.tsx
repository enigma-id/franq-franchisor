/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { PurchaseOrderForm } from "./components/orderForm";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { useEnigmaUI } from "@/components";

import { Save, RefreshCw } from "lucide-react";
import { Button, Loading } from "@/components/ui";

const PurchaseOrderUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = usePurchaseOrder();
  const { showToast } = useEnigmaUI();
  const { isLoading: isUpdating, isSuccess } = updateResult;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Purchase Order berhasil diperbarui",
        type: "success",
      });
      navigate("/purchase/order");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase Order"
        title="Update PO"
        subtitle="Perbarui informasi pesanan pembelian"
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="purchase-order-form"
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
      <Page.Body>
        <div className="mx-auto py-6">
          {showResult.isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Memuat detail PO...
              </p>
            </div>
          ) : (
            <PurchaseOrderForm
              id="purchase-order-form"
              initialData={showResult.data?.data}
              onSubmit={(data) => update({ id: id!, payload: data as any })}
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default PurchaseOrderUpdatePage;
