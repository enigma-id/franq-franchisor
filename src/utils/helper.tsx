import { Badge, type BadgeVariant } from "@/components";
import type { ReactNode } from "react";

export const toNum = (val: string | number | null | undefined) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val;
  if (val.trim() === "") return null;
  const parsed = Number(val);
  return isNaN(parsed) ? null : parsed;
};

const statusVariant: Record<string, BadgeVariant> = {
  new: "default",
  process: "info",
  published: "info",
  active: "success",
  inactive: "default",
  disputed: "error",
  completed: "success",
  received: "success",
  pending: "warning",
  cancelled: "error",
  canceled: "error",
  draft: "default",
  open: "info",
  closed: "success",
  rejected: "error",
  approved: "success",
  failed: "error",
};

const typeVariant: Record<string, BadgeVariant> = {
  logistic: "warning",
  inhouse: "info",
  shipment: "primary",
  defect: "error",
  transfer: "warning",
  putaway: "success",
  picking: "info",
  opname: "success",
  adjustment: "primary",
  by_location: "secondary",
  by_items: "accent",
};

const pickingStrategyVariant: Record<string, BadgeVariant> = {
  fifo: "success",
  lifo: "warning",
  fefo: "info",
  manual: "default",
};

const refTypeVariant: Record<string, BadgeVariant> = {
  receiving: "info",
  delivery_plan_published: "info",
  delivery_plan_completed: "success",
  fulfilled: "success",
  stock_opnmae: "accent",
  stock_adjustment: "primary",
  tasklist_putaway: "success",
  tasklist_defect: "error",
  tasklist_picking: "info",
  tasklist_adjustment: "primary",
  tasklist_opname: "accent",
};

export function statusBadge(status: string): ReactNode {
  const normalized = status.toLowerCase();
  const variant = statusVariant[normalized] || "default";
  const label = normalized.replace(/_/g, " ");

  return (
    <Badge
      variant={variant}
      size="md"
      className="capitalize! rounded-full!"
      appearance="outline"
    >
      {label}
    </Badge>
  );
}

export function typeBadge(type: string): ReactNode {
  const normalized = type.toLowerCase().replace(/_/g, " ");
  const variant = typeVariant[type] || "default";

  return (
    <Badge variant={variant} size="xs" className="capitalize! rounded!">
      {normalized}
    </Badge>
  );
}

export function pickingStrategyBadge(strategy: string): ReactNode {
  const normalized = strategy.toLowerCase().replace(/_/g, " ");
  const variant = pickingStrategyVariant[strategy] || "default";

  return (
    <Badge variant={variant} size="xs" className="uppercase! rounded!">
      {normalized}
    </Badge>
  );
}

export function refTypeBadge(refType: string): ReactNode {
  const normalized = refType.toLowerCase();
  const variant = refTypeVariant[normalized] || "default";
  const label = normalized.replace(/_/g, " ");

  return (
    <Badge variant={variant} size="xs" className="capitalize! rounded!">
      {label}
    </Badge>
  );
}

export function getOptionByValue<T extends { value: unknown }>(
  options: T[],
  value: unknown,
): T | null {
  return options.find((o) => o.value === value) || null;
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 250,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
