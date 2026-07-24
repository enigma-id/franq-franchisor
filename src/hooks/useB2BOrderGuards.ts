import { useMemo } from "react";
import type { B2BOrderDetail } from "@/services/types";
import * as b2bGuards from "@/utils/guards/b2b";

export function useB2BOrderGuards(order?: B2BOrderDetail) {
  return useMemo(() => {
    if (!order) {
      return {
        canEdit: false,
        canShip: false,
        canDelete: false,
        canReceive: false,
        canInvoice: false,
        canPay: false,
        canPrintInvoice: false,
        canPrintDO: false,
      };
    }
    return {
      canEdit: b2bGuards.canEditB2b(order),
      canShip: b2bGuards.canShipB2b(order),
      canDelete: b2bGuards.canDeleteB2b(order),
      canReceive: b2bGuards.canReceiveB2b(order),
      canInvoice: b2bGuards.canInvoiceB2b(order),
      canPay: b2bGuards.canPayB2b(order),
      canPrintInvoice: b2bGuards.canPrintInvoiceB2b(order),
      canPrintDO: b2bGuards.canPrintDoB2b(order),
    };
  }, [order]);
}
