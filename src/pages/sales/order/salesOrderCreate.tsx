/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { SalesOrderForm } from "./components/orderForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export function SalesOrderCreate() {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.salesOrder);
  const { create, createResult } = useSalesOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;

  // Decoupled useEffect on mutation success
  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Sales Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/sales/order/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Tambah Sales Order"
        subtitle="Buat transaksi penjualan baru untuk outlet waralaba."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="sales-order-form"
              disabled={isCreating}
              variant="success"
            >
              {isCreating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Order
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <SalesOrderForm
          id="sales-order-form"
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
}
export default SalesOrderCreate;
