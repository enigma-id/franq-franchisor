export interface PurchaseOrder {
  id: number;
  code: string;
  document_status: "draft" | "submitted" | "confirmed" | "partial" | "received" | "paid" | "void" | "pending" | "published";
  order_status?: string;
  delivery_status: string;
  payment_status: "void" | "paid";
  shipping_date: string;
  payment_expired_at: string;
  paid_at?: string;
  subtotal?: number;
  shipping_charges?: number;
  total_bill?: number;
  supplier?: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  bank?: {
    id: number;
    name: string;
  };
  purchase_order_items?: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    item?: {
      name: string;
      default_fraction?: string;
    };
    fraction?: {
      name: string;
    };
  }>;
}
