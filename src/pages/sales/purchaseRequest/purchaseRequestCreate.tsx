/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { PurchaseRequestForm } from "./components/purchaseRequestForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function PurchaseRequestCreate() {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.purchaseRequest);
  const { create, createResult } = useSalesOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;

  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Purchase Request berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/sales/purchase-request/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Tambah Purchase Request"
        subtitle="Buat permintaan pembelian baru dari outlet."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="purchase-request-form"
              disabled={isCreating}
              variant="success"
            >
              {isCreating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Request
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <PurchaseRequestForm
          id="purchase-request-form"
          onSubmit={(data) => create({ ...data, order_type: "request" } as any)}
        />
      </Page.Body>
    </Page>
  );
}
