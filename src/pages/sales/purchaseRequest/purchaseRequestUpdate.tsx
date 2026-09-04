/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { PurchaseRequestForm } from "./components/purchaseRequestForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export default function PurchaseRequestUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.purchaseRequest);
  const { update, updateResult, show, showResult } = useSalesOrder();
  const { data: initialData, isLoading: isLoadingData } = showResult;
  const { isLoading: isUpdating, isSuccess, data: responseData } = updateResult;

  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Purchase Request berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/sales/purchase-request/${resData.data.id}`);
      updateResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, updateResult, showToast]);

  useEffect(() => {
    if (id) show({ id });
  }, [id]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Edit Purchase Request"
        subtitle="Perbarui permintaan pembelian dari outlet."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="purchase-request-form"
              disabled={isUpdating || isLoadingData}
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
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <PurchaseRequestForm
          id="purchase-request-form"
          initialData={(initialData as any)?.data}
          onSubmit={(data) => update({ id: id!, payload: data as any })}
        />
      </Page.Body>
    </Page>
  );
}
