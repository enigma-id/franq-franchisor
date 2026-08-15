/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { formatCurrency, formatDateTime } from "@/utils";
import type { B2BOrderDetail } from "@/services/types";
import logoImg from "../../../../../public/logo.png";

interface Props {
  order: B2BOrderDetail;
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as const,
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as const,
  logoImg: {
    height: 48,
    width: "auto",
  } as const,
  invoiceTitle: {
    textAlign: "right" as const,
  },
  invoiceH1: {
    margin: 0,
    fontSize: 22,
    fontWeight: "bold",
    color: "#303030",
  } as const,
  invoiceCode: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#555",
  } as const,
  info: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 28,
  } as const,
  infoBlock: {
    fontSize: 12,
  } as const,
  infoLabel: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
    color: "#303030",
  } as const,
  infoText: {
    margin: 0,
    lineHeight: 1.6,
    fontSize: 12,
    color: "#555",
  } as const,
  dates: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    gap: "6px 24px",
    fontSize: 12,
    textAlign: "right" as const,
    alignContent: "start",
  } as const,
  table: {
    width: "100%",
    borderCollapse: "separate" as const,
    borderSpacing: 0,
    marginTop: 28,
    border: "1px solid #eee",
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
  } as const,
  th: {
    fontSize: 11,
    color: "#888",
    fontWeight: 600,
    textAlign: "left" as const,
    padding: "10px 12px",
    background: "#fafafa",
  } as const,
  td: {
    padding: "10px 12px",
    fontSize: 12,
    borderTop: "1px solid #eee",
  } as const,
  tableWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  } as const,
  summary: {
    width: 240,
    marginLeft: "auto",
    fontSize: 12,
  } as const,
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  } as const,
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 13,
    paddingTop: 8,
    borderTop: "2px solid #303030",
  } as const,
  note: {
    fontSize: 11,
    color: "#666",
  } as const,
  pageNum: {
    textAlign: "center",
    fontSize: 9,
    color: "#bbb",
    marginTop: 12,
    paddingTop: 6,
    borderTop: "1px solid #eee",
  } as const,
} as const;

export function B2BInvoicePrint({ order }: Props) {
  const items = order.items ?? [];
  const limit = 28;
  const firstPage = 22;

  const pages = useMemo(() => {
    if (items.length <= firstPage) return [items];
    const first = items.slice(0, firstPage);
    const rest = items.slice(firstPage);
    const chunks: (typeof items)[] = [first];
    for (let i = 0; i < rest.length; i += limit) {
      chunks.push(rest.slice(i, i + limit));
    }
    return chunks;
  }, [items, firstPage, limit]);

  const pageNumber = (pageIdx: number, itemIdx: number) => {
    if (pageIdx === 0) return itemIdx + 1;
    return firstPage + (pageIdx - 1) * limit + itemIdx + 1;
  };

  const numberCol = { textAlign: "center" as const, width: 36 };
  const qtyCol = { textAlign: "center" as const, width: 48 };
  const priceCol = { textAlign: "right" as const, width: 90 };

  return (
    <>
      {pages.map((page, pageIdx) => (
        <section key={pageIdx} className='sheet A4'>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logoArea}>
              <img src={logoImg} alt='logo' style={styles.logoImg} />
            </div>
            <div style={styles.invoiceTitle}>
              <div style={styles.invoiceH1}>INVOICE</div>
            </div>
          </div>

          {/* Code row */}
          <div
            style={{
              textAlign: "right",
              fontSize: 13,
              color: "#444",
              marginTop: 2,
            }}
          >
            #{order.code}
          </div>

          {/* Customer + Dates */}
          <div style={styles.info}>
            <div style={styles.infoBlock}>
              <div style={styles.infoLabel}>Kepada Yth:</div>
              <p style={styles.infoText}>
                <b>{order.customer_name}</b>
                <br />
                {order.customer_address || "-"}
              </p>
            </div>
            <div style={styles.dates}>
              <strong>Tanggal:</strong>
              <span>{formatDateTime(order.created_at)}</span>
              <strong>Payment Ref:</strong>
              <span>{order.payment_ref || "-"}</span>
            </div>
          </div>

          {/* Items Table */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, ...numberCol }}>NO</th>
                  <th style={styles.th}>ITEM</th>
                  <th style={{ ...styles.th, ...qtyCol }}>QTY</th>
                  <th style={{ ...styles.th, ...priceCol }}>HARGA</th>
                  <th style={{ ...styles.th, ...priceCol }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {page.map((row: any, i: number) => (
                  <tr key={i}>
                    <td style={{ ...styles.td, ...numberCol, color: "#999" }}>
                      {pageNumber(pageIdx, i)}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>
                      {row.menu_name}
                    </td>
                    <td style={{ ...styles.td, ...qtyCol }}>{row.quantity}</td>
                    <td style={{ ...styles.td, ...priceCol }}>
                      {formatCurrency(row.unit_nett || row.unit_base || 0)}
                    </td>
                    <td style={{ ...styles.td, ...priceCol }}>
                      {formatCurrency(
                        (row.unit_nett || row.unit_base || 0) *
                          (row.quantity || 0),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary + Note (last page only) */}
            {pageIdx === pages.length - 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginTop: 20,
                }}
              >
                <div style={styles.note}>
                  {order.note && (
                    <div style={{ marginBottom: 10 }}>
                      Cattan:
                      <span
                        style={{
                          marginTop: 5,
                          display: "block",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {order.note}
                      </span>
                    </div>
                  )}
                </div>
                <div style={styles.summary}>
                  <div style={styles.summaryRow}>
                    <b>Subtotal:</b>
                    <span>{formatCurrency(order.subtotal_nett || 0)}</span>
                  </div>
                  {order.discount_value > 0 && (
                    <div style={styles.summaryRow}>
                      <b>Diskon:</b>
                      <span>({formatCurrency(order.discount_value)})</span>
                    </div>
                  )}
                  {order.service_charge_value > 0 && (
                    <div style={styles.summaryRow}>
                      <b>Service Charge:</b>
                      <span>{formatCurrency(order.service_charge_value)}</span>
                    </div>
                  )}
                  <div style={styles.summaryTotal}>
                    <span>Total:</span>
                    <span>{formatCurrency(order.total_charges || 0)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
