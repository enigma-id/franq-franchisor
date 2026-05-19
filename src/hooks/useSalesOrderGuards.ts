import { useMemo } from "react";
import type { SalesOrderDetail } from "@/services/types/sales";
import * as soGuards from "@/utils/guards/sales";

export function useSalesOrderGuards(so?: SalesOrderDetail) {
  return useMemo(() => {
    if (!so) {
      return {
        canPublish: false,
        canEdit: false,
        canDelete: false,
        canPay: false,
      };
    }
    return {
      canPublish: soGuards.canPublishSo(so),
      canEdit: soGuards.canEditSo(so),
      canDelete: soGuards.canDeleteSo(so),
      canPay: soGuards.canPaySo(so),
    };
  }, [so]);
}
