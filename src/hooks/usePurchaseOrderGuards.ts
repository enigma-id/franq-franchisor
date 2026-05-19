import { useMemo } from "react";
import type { PurchaseOrder } from "@/services/types/purchase";
import * as poGuards from "@/utils/guards/purchase";

export function usePurchaseOrderGuards(po?: PurchaseOrder) {
  return useMemo(() => {
    if (!po) {
      return {
        canPublish: false,
        canEdit: false,
        canDelete: false,
        canPay: false,
      };
    }
    return {
      canPublish: poGuards.canPublishPo(po),
      canEdit: poGuards.canEditPo(po),
      canDelete: poGuards.canDeletePo(po),
      canPay: poGuards.canPayPo(po),
    };
  }, [po]);
}
