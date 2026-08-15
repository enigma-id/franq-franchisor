import type { B2BOrderDetail } from "@/services/types";

export const canEditB2b = (order: B2BOrderDetail): boolean =>
  order.document_status === "pending";

export const canShipB2b = (order: B2BOrderDetail): boolean =>
  order.document_status === "pending";

export const canDeleteB2b = (order: B2BOrderDetail): boolean =>
  order.document_status === "pending";

export const canReceiveB2b = (order: B2BOrderDetail): boolean =>
  order.document_status === "shipped";

export const canInvoiceB2b = (order: B2BOrderDetail): boolean =>
  order.payment_status === "unpaid";

export const canPayB2b = (order: B2BOrderDetail): boolean =>
  order.payment_status === "invoiced";

export const canPrintInvoiceB2b = (order: B2BOrderDetail): boolean =>
  order.payment_status !== "unpaid";

export const canPrintDoB2b = (order: B2BOrderDetail): boolean =>
  order.document_status !== "pending";
