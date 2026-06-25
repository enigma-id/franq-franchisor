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
        canPaid: false,
      };
    }
    return {
      canPublish: poGuards.canPublishPo(po),
      canEdit: poGuards.canEditPo(po),
      canDelete: poGuards.canDeletePo(po),
      canPaid: poGuards.canPayPo(po),
    };
  }, [po]);
}
