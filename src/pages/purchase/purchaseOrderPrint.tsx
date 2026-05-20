import { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useParams } from "react-router-dom";
import { usePurchaseOrder } from "@/services/purchase/hooks";
import { formatCurrency, formatDate } from "@/utils";
import Print from "@/utils/print";
import { useAppSelector } from "@/hooks";

const getItemName = (item: any) => {
  return item.item?.name || item.catalog?.name || "-";
};

const getItemTypeLabel = (item: any) => {
  return item.item?.default_fraction || item.fraction?.name || "PCS";
};

export const PurchaseOrderPrint = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);

  const { show: showOrder, showResult: showOrderResult } = usePurchaseOrder();
  const Profile = useAppSelector((state) => state.auth.session);

  useEffect(() => {
    if (!id) return;
    showOrder({ id: id as string });
  }, [id]);

  useEffect(() => {
    if (showOrderResult?.isLoading || showOrderResult?.isFetching) return;
    const orderData = showOrderResult?.data?.data;
    if (orderData) {
      setData(orderData);
      setLoaded(true);
    }
  }, [showOrderResult]);

  if (
    showOrderResult?.isLoading ||
    showOrderResult?.isFetching ||
    !data ||
    !loaded
  ) {
    return null;
  }

  const totalQty =
    data.purchase_order_items?.reduce(
      (sum: number, item: any) => sum + (item.quantity_ordered || 0),
      0,
    ) || 0;

  const printedAt = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <Print
        title={`Purchase Order - ${data?.code}`}
        size="A4"
        content={renderToString(
          <section
            className="sheet page-break"
            style={{ padding: "36px 44px", position: "relative" }}
          >

            {/* ── HEADER ── */}
            <table className="body" style={{ marginBottom: 0 }}>
              <tr style={{ verticalAlign: "bottom" }}>
                <td style={{ width: "60%" }}>
                  <img
                    src={window.location.origin + "/logo.png"}
                    alt="Logo"
                    height="38px"
                    style={{ marginBottom: 8, display: "block" }}
                  />
                  <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 1 }}>
                    Franchisor Portal
                  </p>
                  <p style={{ fontSize: 10, color: "#9ca3af" }}>
                    Dicetak oleh {Profile?.user?.name || "Admin"} · {printedAt}
                  </p>
                </td>
                <td style={{ width: "40%", textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#111827",
                      letterSpacing: "-0.5px",
                      marginBottom: 4,
                    }}
                  >
                    PURCHASE ORDER
                  </p>
                  <p style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    {data?.code}
                  </p>
                </td>
              </tr>
            </table>

            {/* ── TOP DIVIDER ── */}
            <div
              style={{
                height: 2,
                background: "#111827",
                marginTop: 16,
                marginBottom: 24,
              }}
            />

            {/* ── SUPPLIER + ORDER META ── */}
            <table className="body" style={{ marginBottom: 28 }}>
              <tr style={{ verticalAlign: "top" }}>
                {/* Supplier */}
                <td style={{ width: "50%", paddingRight: 24 }}>
                  <p
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Supplier / Vendor
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 3,
                    }}
                  >
                    {data?.recipient_name || data?.supplier?.name || "-"}
                  </p>
                  {(data?.recipient_phone || data?.supplier?.phone) && (
                    <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>
                      {data?.recipient_phone || data?.supplier?.phone}
                    </p>
                  )}
                  {data?.address && (
                    <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.6 }}>
                      {data.address}
                    </p>
                  )}
                </td>

                {/* Order meta */}
                <td style={{ width: "50%" }}>
                  <p
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Detail Pesanan
                  </p>
                  <table className="body" style={{ width: "100%" }}>
                    <tr>
                      <td style={{ fontSize: 10, color: "#6b7280", paddingBottom: 5, width: "44%" }}>
                        Tanggal Order
                      </td>
                      <td style={{ fontSize: 10, fontWeight: 600, color: "#111827", paddingBottom: 5 }}>
                        {formatDate(data?.ordered_at, "DD MMM YYYY")}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontSize: 10, color: "#6b7280", paddingBottom: 5 }}>
                        Est. Pengiriman
                      </td>
                      <td style={{ fontSize: 10, fontWeight: 600, color: "#111827", paddingBottom: 5 }}>
                        {formatDate(data?.eta_date, "DD MMM YYYY")}
                      </td>
                    </tr>
                    {data?.reff_code && (
                      <tr>
                        <td style={{ fontSize: 10, color: "#6b7280", paddingBottom: 5 }}>
                          No. Referensi
                        </td>
                        <td style={{ fontSize: 10, fontWeight: 600, color: "#111827", paddingBottom: 5 }}>
                          {data.reff_code}
                        </td>
                      </tr>
                    )}
                    {data?.bank?.name && (
                      <tr>
                        <td style={{ fontSize: 10, color: "#6b7280", paddingBottom: 5 }}>
                          Bank
                        </td>
                        <td style={{ fontSize: 10, fontWeight: 600, color: "#111827", paddingBottom: 5 }}>
                          {data.bank.name}
                        </td>
                      </tr>
                    )}
                    {data?.payment_expired_at && (
                      <tr>
                        <td style={{ fontSize: 10, color: "#6b7280" }}>
                          Jatuh Tempo
                        </td>
                        <td style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>
                          {formatDate(data.payment_expired_at, "DD MMM YYYY")}
                        </td>
                      </tr>
                    )}
                  </table>
                </td>
              </tr>
            </table>

            {/* ── ITEMS TABLE ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0 }}>
              <thead>
                <tr style={{ borderTop: "1px solid #d1d5db", borderBottom: "1px solid #d1d5db" }}>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "4%",
                      textAlign: "center",
                    }}
                  >
                    No
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "38%",
                    }}
                  >
                    Nama Produk
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "10%",
                      textAlign: "center",
                    }}
                  >
                    Satuan
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "10%",
                      textAlign: "center",
                    }}
                  >
                    Qty
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "18%",
                      textAlign: "right",
                    }}
                  >
                    Harga Satuan
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: "20%",
                      textAlign: "right",
                    }}
                  >
                    Total
                  </td>
                </tr>
              </thead>
              <tbody>
                {data?.purchase_order_items?.map((item: any, i: number) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <td style={{ padding: "9px 6px", fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: "9px 6px" }}>
                      <p className="mb-0 bold" style={{ fontSize: 11, color: "#111827" }}>
                        {getItemName(item)}
                      </p>
                    </td>
                    <td style={{ padding: "9px 6px", fontSize: 10, color: "#6b7280", textAlign: "center" }}>
                      {getItemTypeLabel(item)}
                    </td>
                    <td style={{ padding: "9px 6px", fontSize: 11, fontWeight: 600, color: "#111827", textAlign: "center" }}>
                      {item.quantity_ordered}
                    </td>
                    <td style={{ padding: "9px 6px", fontSize: 10, color: "#374151", textAlign: "right" }}>
                      {formatCurrency(item.unit_nett || 0)}
                    </td>
                    <td style={{ padding: "9px 6px", fontSize: 11, fontWeight: 700, color: "#111827", textAlign: "right" }}>
                      {formatCurrency(item.total_nett || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── TOTALS ── */}
            <table className="body" style={{ marginTop: 0 }}>
              <tr style={{ verticalAlign: "top" }}>
                {/* spacer */}
                <td style={{ width: "55%" }} />
                {/* totals block */}
                <td style={{ width: "45%", borderTop: "2px solid #111827" }}>
                  <table className="body" style={{ width: "100%" }}>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#6b7280" }}>
                        Subtotal ({totalQty} item)
                      </td>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#111827", fontWeight: 600, textAlign: "right" }}>
                        {formatCurrency(data?.subtotal_nett || data?.subtotal || 0)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#6b7280" }}>
                        Ongkos Kirim
                      </td>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#111827", fontWeight: 600, textAlign: "right" }}>
                        {formatCurrency(data?.shipping_charges || 0)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#6b7280" }}>
                        Pajak (PPN)
                      </td>
                      <td style={{ padding: "6px 0", fontSize: 10, color: "#111827", fontWeight: 600, textAlign: "right" }}>
                        {formatCurrency(data?.subtotal_tax || 0)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 0 4px", fontSize: 13, fontWeight: 800, color: "#111827" }}>
                        Total Tagihan
                      </td>
                      <td style={{ padding: "10px 0 4px", fontSize: 13, fontWeight: 800, color: "#111827", textAlign: "right" }}>
                        {formatCurrency(data?.total_bill || 0)}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* ── THIN RULE ── */}
            <div style={{ height: 1, background: "#e5e7eb", margin: "28px 0 24px" }} />

            {/* ── SIGNATURES ── */}
            <table className="body" style={{ width: "100%" }}>
              <tr>
                {[
                  { role: "Dibuat oleh", name: Profile?.user?.name || "Admin" },
                  { role: "Disetujui oleh", name: "" },
                  { role: "Diterima oleh", name: "" },
                ].map(({ role, name }, i) => (
                  <td
                    key={i}
                    style={{
                      width: "33%",
                      textAlign: "center",
                      padding: "0 8px",
                    }}
                  >
                    <p style={{ fontSize: 9, color: "#9ca3af", marginBottom: 48 }}>{role}</p>
                    <div style={{ borderTop: "1px solid #374151", marginBottom: 6 }} />
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>
                      {name || "\u00a0"}
                    </p>
                  </td>
                ))}
              </tr>
            </table>

            {/* ── FOOTER ── */}
            <div style={{ height: 1, background: "#e5e7eb", margin: "20px 0 12px" }} />
            <p
              style={{
                fontSize: 8,
                color: "#d1d5db",
                textAlign: "center",
              }}
            >
              Dokumen ini digenerate secara otomatis · Franchisor Portal · {data?.code} · {printedAt}
            </p>

          </section>,
        )}
      />
    </div>
  );
};

export default PurchaseOrderPrint;
