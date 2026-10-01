import { dateFormat, currencyFormat } from "./common";

// Re-export everything from submodules
export {
  currencyFormat,
  dateFormat,
  postedAgo,
  updateAt,
  extractIds,
  capitalizeFirst,
  findByKeyValue,
} from "./common";
export { withGuard } from "./guard";
export * from "./url";
export * from "./permission";
export * from "./errors";
export * from "./cn";
export * from "./deviceStatus";

// Convenience alias
export const formatCurrency = currencyFormat;

// Date helpers used by pages
export function formatDate(
  v?: string | Date | null,
  format = "DD/MM/YYYY",
): string {
  return dateFormat(v, format, "-");
}

export function formatTime(v?: string | Date | null): string {
  return dateFormat(v, "HH:mm", "-");
}

export function formatDateTime(v?: string | Date | null): string {
  return dateFormat(v, "DD/MM/YYYY HH:mm", "-");
}

// A "never logged in" date is 0001-01-01 or 1970-01-01
export function isNeverLoggedIn(date: string | null | undefined): boolean {
  if (!date) return true;
  return date.includes("0001-01-01") || date.includes("1970-01-01");
}

// An "ongoing" session has no real finished_at date
export function isOngoing(date: string | null | undefined): boolean {
  if (!date) return true;
  return date.includes("0001-01-01") || date.includes("1970-01-01");
}

// Display payment method name or fallback
export function displayPaymentMethod(name: string | null): string {
  if (!name) return "-";
  return name;
}

// Map any system status to a premium Badge variant
export function getStatusVariant(
  status?: string | null,
):
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error" {
  const normalized = status?.toLowerCase() || "";
  const variantMap: Record<
    string,
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
  > = {
    // default
    draft: "default",
    none: "default",

    confirmed: "primary",
    active: "primary",
    published: "primary",

    // warning
    pending: "warning",
    process: "warning",
    awaiting_approval: "warning",
    partial: "warning",

    // secondary
    processing: "secondary",

    // accent
    refunded: "accent",
    shipped: "accent",

    // success
    settled: "success",
    delivered: "success",
    received: "success",
    completed: "success",
    approved: "success",
    paid: "success",
    finished: "success",

    // info
    shipping: "info",
    submitted: "info",
    invoiced: "info",

    // error
    unpaid: "error",
    void: "error",
    cancelled: "error",
    rejected: "error",
    disputed: "error",
  };
  return variantMap[normalized] || "default";
}

// Map any system type to a premium Badge variant
export function getTypeVariant(
  type?: string | null,
):
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error" {
  const normalized = type?.toLowerCase() || "";
  const variantMap: Record<
    string,
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
  > = {
    // production plan type
    mitra: "success",
    b2b: "default",
    sukabread: "warning",

    // item type
    raw_material: "default",
    finished_goods: "warning",
  };
  return variantMap[normalized] || "default";
}
