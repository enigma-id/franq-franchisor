import { describe, it, expect } from "vitest";
import { canPublishSo, canEditSo, canDeleteSo, canPaySo } from "./sales";
import type { SalesOrderDetail } from "@/services/types/sales";

describe("Sales Order Guards", () => {
  const createMockSo = (
    orderStatus: string,
    type: string,
    paymentStatus: string,
  ): SalesOrderDetail =>
    ({
      id: 1,
      code: "SO-001",
      order_status: orderStatus,
      type: type,
      payment_status: paymentStatus,
      delivery_status: "pending",
      subtotal_nett: 100000,
      shipping_charges: 0,
      total_bill: 100000,
      ordered_at: "2026-05-18T00:00:00Z",
    }) as any;

  it("should allow publish, edit, and delete ONLY when status is pending and type is default", () => {
    const defaultPending = createMockSo("pending", "default", "void");
    expect(canPublishSo(defaultPending)).toBe(true);
    expect(canEditSo(defaultPending)).toBe(true);
    expect(canDeleteSo(defaultPending)).toBe(true);

    const defaultActive = createMockSo("active", "default", "void");
    expect(canPublishSo(defaultActive)).toBe(false);
    expect(canEditSo(defaultActive)).toBe(false);
    expect(canDeleteSo(defaultActive)).toBe(false);

    const outletPending = createMockSo("pending", "outlet", "void");
    expect(canPublishSo(outletPending)).toBe(false);
    expect(canEditSo(outletPending)).toBe(false);
    expect(canDeleteSo(outletPending)).toBe(false);
  });

  it("should allow pay ONLY under specific status and type combinations with void payment", () => {
    // 1. Regular/default type: must be active
    const defaultActiveVoid = createMockSo("active", "default", "void");
    expect(canPaySo(defaultActiveVoid)).toBe(true);

    const defaultPendingVoid = createMockSo("pending", "default", "void");
    expect(canPaySo(defaultPendingVoid)).toBe(false);

    const defaultActivePaid = createMockSo("active", "default", "paid");
    expect(canPaySo(defaultActivePaid)).toBe(false);

    // 2. Outlet type: must be pending or void
    const outletPendingVoid = createMockSo("pending", "outlet", "void");
    expect(canPaySo(outletPendingVoid)).toBe(true);

    const outletVoidVoid = createMockSo("void", "outlet", "void");
    expect(canPaySo(outletVoidVoid)).toBe(true);

    const outletActiveVoid = createMockSo("active", "outlet", "void");
    expect(canPaySo(outletActiveVoid)).toBe(false);
  });
});
