/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { CentralKitchenForm } from "./components/centralKitchenForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export function CentralKitchenUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.salesOrder);

  const { update, updateResult, show, showResult } = useSalesOrder();
  const { data: initialData, isLoading: isLoadingData } = showResult;
  const { isLoading: isUpdating, isSuccess, data: responseData } = updateResult;

  // Decoupled useEffect on mutation success
  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Order berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/central-kitchen/${resData.data.id}`);
      updateResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, updateResult, showToast]);

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id]);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Produksi'
        title='Edit Produksi'
        subtitle='Perbarui order pengadaan untuk outlet waralaba.'
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type='submit'
              form='central-kitchen-form'
              disabled={isUpdating || isLoadingData}
              variant='success'
            >
              {isUpdating ? (
                <Loading size='sm' variant='spinner' />
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Simpan Perubahan
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        {isLoadingData ? (
          <div className='flex justify-center items-center h-full'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : (
          <CentralKitchenForm
            id='central-kitchen-form'
            initialData={initialData?.data as any}
            onSubmit={(data) =>
              update({ id: id as string, payload: data } as any)
            }
          />
        )}
      </Page.Body>
    </Page>
  );
}
export default CentralKitchenUpdate;
