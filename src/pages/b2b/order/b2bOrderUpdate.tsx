/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useB2BOrder } from "@/services/b2b/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { B2BOrderForm } from "./components/b2bOrderForm";

export function B2BOrderUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();

  const { update, updateResult, show, showResult } = useB2BOrder();
  const { data: initialData, isLoading: isLoadingData } = showResult;
  const { isLoading: isUpdating, isSuccess, data: responseData } = updateResult;

  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "B2B Order berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/b2b/order/${resData.data.id}`);
      updateResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, updateResult, showToast]);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Sales"
        title="Edit B2B Order"
        subtitle="Perbarui pesanan B2B."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="b2b-order-form"
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
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        {isLoadingData ? (
          <div className="flex justify-center items-center h-full">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <B2BOrderForm
            id="b2b-order-form"
            initialData={initialData?.data as any}
            onSubmit={(data) => update({ id: id as string, payload: data } as any)}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default B2BOrderUpdate;
