/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import { CentralKitchenForm } from "./components/centralKitchenForm";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

export function CentralKitchenCreate() {
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
        message: "Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/central-kitchen/${resData.data.id}`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Produksi'
        title='Tambah Produksi'
        subtitle='Buat order pengadaan baru untuk outlet waralaba.'
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type='submit'
              form='central-kitchen-form'
              disabled={isCreating}
              variant='success'
            >
              {isCreating ? (
                <Loading size='sm' variant='spinner' />
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Simpan Order
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        <CentralKitchenForm
          id='central-kitchen-form'
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
}
export default CentralKitchenCreate;
