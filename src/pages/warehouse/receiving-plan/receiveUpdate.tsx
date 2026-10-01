/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { useReceiving, useReceivingPlan } from "@/services/warehouse/hooks";
import type {
  Receiving,
  ReceivingPlanDetail,
  ReceivingRequest,
} from "@/services/types";

import { ReceivingForm } from "./components/receivingForm";

export function ReceivingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();

  const { show: showPlan, showResult: planResult } = useReceivingPlan();
  const { show: showReceiving, showResult: receivingResult } = useReceiving();
  const { update, updateResult } = useReceiving();

  const plan = planResult?.data?.data as ReceivingPlanDetail | undefined;
  const receiving = receivingResult?.data?.data as Receiving | undefined;
  const isLoading =
    planResult?.isLoading ||
    planResult?.isFetching ||
    receivingResult?.isLoading ||
    receivingResult?.isFetching;

  useEffect(() => {
    if (id) showReceiving({ id });
  }, [id]);

  // Plan diambil dari dokumen penerimaan (tidak lagi dari param route).
  useEffect(() => {
    if (receiving?.plan_id) showPlan({ id: receiving.plan_id });
  }, [receiving?.plan_id]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Penerimaan berhasil diperbarui",
        type: "success",
        position: "bottom-center",
      });
      updateResult.reset?.();
      navigate(
        receiving?.plan_id
          ? `/warehouse/receiving-plan/${receiving.plan_id}`
          : "/warehouse/receiving-plan",
      );
    }
  }, [updateResult?.isSuccess]);

  const handleSubmit = (payload: ReceivingRequest) => {
    const { plan_id, ...rest } = payload;
    void plan_id;
    if (id) update({ id, payload: rest as any });
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Warehouse'
        title='Edit Penerimaan'
        subtitle={`Perbarui dokumen penerimaan ${receiving?.code ?? "-"}`}
        backTo={() => navigate(-1)}
        action={
          <Button
            type='submit'
            form='receiving-form'
            variant='success'
            disabled={updateResult?.isLoading || isLoading}
          >
            {updateResult?.isLoading ? (
              <Loading size='sm' variant='spinner' />
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' />
                Simpan Perubahan
              </>
            )}
          </Button>
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        {isLoading ? (
          <div className='flex justify-center items-center h-full'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : (
          <ReceivingForm
            id='receiving-form'
            plan={plan}
            data={receiving}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default ReceivingUpdatePage;
