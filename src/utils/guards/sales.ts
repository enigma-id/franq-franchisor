import type { SalesOrderDetail } from "@/services/types/sales";

/**
 * Validates if a Sales Order can be approved/published.
 * In legacy Vue client: `this.salesOrder.order_status === 'pending' && this.salesOrder.type === 'default'`
 */
export const canPublishSo = (so: SalesOrderDetail): boolean => {
  return so.order_status === "pending" && so.type === "default";
};

/**
 * Validates if a Sales Order can be updated/edited.
 * In legacy Vue client: `this.salesOrder.order_status === 'pending' && this.salesOrder.type === 'default'`
 */
export const canEditSo = (so: SalesOrderDetail): boolean => {
  return so.order_status === "pending" && so.type === "default";
};

/**
 * Validates if a Sales Order can be deleted.
 * In legacy Vue client: `this.salesOrder.order_status === 'pending' && this.salesOrder.type === 'default'`
 */
export const canDeleteSo = (so: SalesOrderDetail): boolean => {
  return so.order_status === "pending" && so.type === "default";
};

/**
 * Validates if payment can be received/marked paid for a Sales Order.
 * In legacy Vue client:
 * `((order_status === 'active' && type === 'default') || ((order_status === 'pending' || order_status === 'void') && type === 'outlet')) && payment_status === 'void'`
 */
export const canPaySo = (so: SalesOrderDetail): boolean => {
  if (so.payment_status !== "void") return false;

  const isDefaultActive = so.order_status === "active" && so.type === "default";
  const isOutletPendingOrVoid = (so.order_status === "pending" || so.order_status === "void") && so.type === "outlet";

  return isDefaultActive || isOutletPendingOrVoid;
};
