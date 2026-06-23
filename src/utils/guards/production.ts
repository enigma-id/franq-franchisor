import type { ProductionPlanDetail } from "@/services/types";

/**
 * Validates if a Production Plan can be published.
 */
export const canPublishPlan = (plan: ProductionPlanDetail): boolean => {
  return plan.document_status === "pending";
};

/**
 * Validates if a Production Plan can be deleted.
 */
export const canDeletePlan = (plan: ProductionPlanDetail): boolean => {
  return plan.document_status === "pending";
};

/**
 * Validates if a Production Plan can be completed.
 */
export const canCompletePlan = (plan: ProductionPlanDetail): boolean => {
  return plan.document_status === "process";
};
