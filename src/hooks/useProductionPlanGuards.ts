import { useMemo } from "react";
import type { ProductionPlanDetail } from "@/services/types";
import * as planGuards from "@/utils/guards/production";

export function useProductionPlanGuards(plan?: ProductionPlanDetail) {
  return useMemo(() => {
    if (!plan) {
      return {
        canPublish: false,
        canDelete: false,
        canComplete: false,
      };
    }
    return {
      canPublish: planGuards.canPublishPlan(plan),
      canDelete: planGuards.canDeletePlan(plan),
      canComplete: planGuards.canCompletePlan(plan),
    };
  }, [plan]);
}
