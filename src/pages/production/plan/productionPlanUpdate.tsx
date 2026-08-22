/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useProductionPlan } from "@/services/production/hooks";
import { ProductionPlanForm } from "./components/planForm";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save, RefreshCw } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const ProductionPlanUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canManage = useCan(ACTION.production);
  const { show, showResult, update, updateResult } = useProductionPlan();
  const { isLoading: isSaving, isSuccess } = updateResult;
  const { showToast } = useEnigmaUI();

  const { data, isLoading } = showResult;

  const plan = data?.data;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Rencana produksi berhasil diperbarui",
        type: "success",
      });
      navigate("/production/plan");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title="Edit Rencana Produksi"
        subtitle={"Perbarui data rencana produksi."}
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="production-plan-form"
              disabled={isSaving || isLoading}
              variant="success"
              shape="wide"
            >
              {isSaving ? (
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

      <Page.Body>
        <div className="mx-auto py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Memuat detail rencana produksi...
              </p>
            </div>
          ) : (
            <ProductionPlanForm
              id="production-plan-form"
              initialData={plan as any}
              onSubmit={(data) => update({ id: id!, payload: data })}
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default ProductionPlanUpdatePage;
