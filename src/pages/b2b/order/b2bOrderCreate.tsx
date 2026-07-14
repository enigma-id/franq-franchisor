/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useB2BOrder } from "@/services/b2b/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { B2BOrderForm } from "./components/b2bOrderForm";

export function B2BOrderCreate() {
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const { create, createResult } = useB2BOrder();
  const { isLoading: isCreating, isSuccess, data: responseData } = createResult;

  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "B2B Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/b2b/order/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Tambah B2B Order"
        subtitle="Buat order B2B baru untuk pelanggan."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="b2b-order-form"
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
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <B2BOrderForm
          id="b2b-order-form"
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
}

export default B2BOrderCreate;
