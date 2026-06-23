import type { SalesOrderDetail } from "@/services/types/sales";

/**
 * Validates if a Sales Order can be approved/published.
 * API fields: document_status (not order_status), order_type (not type)
 */
export const canPublishSo = (so: SalesOrderDetail): boolean => {
  return so.document_status === "pending";
};

/**
 * Validates if a Sales Order can be updated/edited.
 * API fields: document_status (not order_status), order_type (not type)
 */
export const canEditSo = (so: SalesOrderDetail): boolean => {
  return so.document_status === "pending";
};

/**
 * Validates if a Sales Order can be updated/edited.
 * API fields: document_status (not order_status), order_type (not type)
 */
export const canCancelSo = (so: SalesOrderDetail): boolean => {
  return so.document_status === "published" && so.payment_status === "unpaid";
};

/**
 * Validates if a Sales Order can be deleted.
 * API fields: document_status (not order_status), order_type (not type)
 */
export const canDeleteSo = (so: SalesOrderDetail): boolean => {
  return so.document_status === "pending";
};

/**
 * Validates if payment can be received/marked paid for a Sales Order.
 * API fields: document_status (not order_status), order_type (not type)
 */
export const canPaySo = (so: SalesOrderDetail): boolean => {
  if (so.payment_status !== "unpaid") return false;

  return so.document_status === "published";
};
