import type { PurchaseOrder } from "@/services/types/purchase";

/**
 * Validates if a Purchase Order can be approved/published.
 * In legacy Vue client: `this.purchaseOrder.document_status === 'pending'`
 */
export const canPublishPo = (po: PurchaseOrder): boolean => {
  return po.document_status === "pending";
};

/**
 * Validates if a Purchase Order can be updated/edited.
 * In legacy Vue client: `this.purchaseOrder.document_status === 'pending'`
 */
export const canEditPo = (po: PurchaseOrder): boolean => {
  return po.document_status === "pending";
};

/**
 * Validates if a Purchase Order can be deleted.
 * In legacy Vue client: `this.purchaseOrder.document_status === 'pending'`
 */
export const canDeletePo = (po: PurchaseOrder): boolean => {
  return po.document_status === "pending";
};

/**
 * Validates if a payment can be made for the Purchase Order.
 * In legacy Vue client: `this.purchaseOrder.document_status !== 'pending' && this.purchaseOrder.payment_status === 'void'`
 */
export const canPayPo = (po: PurchaseOrder): boolean => {
  return po.document_status !== "pending" && po.payment_status === "void";
};
