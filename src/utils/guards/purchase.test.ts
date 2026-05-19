import { describe, it, expect } from "vitest";
import { canPublishPo, canEditPo, canDeletePo, canPayPo } from "./purchase";
import type { PurchaseOrder } from "@/services/types/purchase";

describe("Purchase Order Guards", () => {
  const createMockPo = (docStatus: any, payStatus: any): PurchaseOrder => ({
    id: 1,
    code: "PO-001",
    document_status: docStatus,
    delivery_status: "pending",
    payment_status: payStatus,
    shipping_date: "2026-05-18",
    payment_expired_at: "2026-05-25",
  });

  it("should allow publish, edit, and delete ONLY when status is pending", () => {
    const pendingPo = createMockPo("pending", "void");
    expect(canPublishPo(pendingPo)).toBe(true);
    expect(canEditPo(pendingPo)).toBe(true);
    expect(canDeletePo(pendingPo)).toBe(true);

    const publishedPo = createMockPo("published", "void");
    expect(canPublishPo(publishedPo)).toBe(false);
    expect(canEditPo(publishedPo)).toBe(false);
    expect(canDeletePo(publishedPo)).toBe(false);
  });

  it("should allow pay ONLY when status is not pending and payment is void", () => {
    const pendingVoid = createMockPo("pending", "void");
    expect(canPayPo(pendingVoid)).toBe(false); // blocked because it is pending

    const publishedVoid = createMockPo("published", "void");
    expect(canPayPo(publishedVoid)).toBe(true); // allowed

    const publishedPaid = createMockPo("published", "paid");
    expect(canPayPo(publishedPaid)).toBe(false); // blocked because paid
  });
});
