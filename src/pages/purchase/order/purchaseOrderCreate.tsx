/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { PurchaseOrderForm } from "./components/orderForm";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { useNavigate } from "react-router-dom";
import { useEnigmaUI } from "@/components";

import { Save } from "lucide-react";
import { Button, Loading } from "@/components/ui";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const PurchaseOrderCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = usePurchaseOrder();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.purchaseOrder);
  const { isLoading: isCreating, isSuccess } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Purchase Order berhasil dibuat",
        type: "success",
      });
      navigate("/purchase/order");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase"
        title="Buat PO Baru"
        subtitle="Buat pesanan pembelian barang baru."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="purchase-order-form"
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
          <PurchaseOrderForm
            id="purchase-order-form"
            onSubmit={(data) => create(data as any)}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default PurchaseOrderCreatePage;
