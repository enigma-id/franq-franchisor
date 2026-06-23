import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useProductionPlan } from "@/services/production/hooks";
import { ProductionPlanForm } from "./components/planForm";
import { useEnigmaUI } from "@/components";
import { Button, Loading } from "@/components/ui";
import { Save } from "lucide-react";

const ProductionPlanCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = useProductionPlan();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Rencana produksi berhasil dibuat",
        type: "success",
      });
      navigate("/production/plan");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Production"
        title="Buat Rencana Produksi"
        subtitle="Input data rencana produksi harian untuk outlet."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="production-plan-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </>
            )}
          </Button>
        }
      />

      <Page.Body>
        <div className="mx-auto py-6">
          <ProductionPlanForm
            id="production-plan-form"
            onSubmit={(data) => create(data)}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default ProductionPlanCreatePage;
