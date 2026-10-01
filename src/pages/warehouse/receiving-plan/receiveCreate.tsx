/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { useReceiving, useReceivingPlan } from "@/services/warehouse/hooks";
import type { ReceivingPlanDetail, ReceivingRequest } from "@/services/types";

import { ReceivingForm } from "./components/receivingForm";

export function ReceivingCreatePage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();

  const { show: showPlan, showResult: planResult } = useReceivingPlan();
  const { create, createResult } = useReceiving();

  const plan = planResult?.data?.data as ReceivingPlanDetail | undefined;
  const isLoadingPlan = planResult?.isLoading || planResult?.isFetching;

  useEffect(() => {
    if (planId) showPlan({ id: planId });
  }, [planId]);

  useEffect(() => {
    if (createResult?.isSuccess) {
      showToast({
        message: "Penerimaan berhasil dibuat",
        type: "success",
        position: "bottom-center",
      });
      createResult.reset?.();
      navigate(`/warehouse/receiving-plan/${planId}`);
    }
  }, [createResult?.isSuccess]);

  const handleSubmit = (payload: ReceivingRequest) => {
    create(payload as any);
  };

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Warehouse'
        title='Receive Items'
        subtitle={`Catat barang diterima untuk plan ${plan?.code ?? "-"}`}
        backTo={() => navigate(-1)}
        action={
          <Button
            type='submit'
            form='receiving-form'
            variant='success'
            disabled={createResult?.isLoading || isLoadingPlan}
          >
            {createResult?.isLoading ? (
              <Loading size='sm' variant='spinner' />
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' />
                Simpan Penerimaan
              </>
            )}
          </Button>
        }
      />
      <Page.Body className='flex-1 overflow-auto p-4 md:p-6'>
        {isLoadingPlan ? (
          <div className='flex justify-center items-center h-full'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : (
          <ReceivingForm
            id='receiving-form'
            plan={plan}
            onSubmit={handleSubmit}
          />
        )}
      </Page.Body>
    </Page>
  );
}

export default ReceivingCreatePage;
