/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { formatDate, formatDateTime } from "@/utils";
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
  footer: {
    marginTop: 20,
  } as const,
  note: {
    fontSize: 11,
    color: "#666",
  } as const,
  signature: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 11,
  } as const,
  signCol: {
    textAlign: "center" as const,
    width: "33%",
  } as const,
  signLabel: {
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  } as const,
  signLine: {
    borderTop: "1px solid #222",
    paddingTop: 4,
    margin: "0 20px",
  } as const,
  signSub: {
    fontSize: 8,
    color: "#999",
    marginTop: 4,
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

export function B2BDOPrint({ order }: Props) {
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
              <div style={styles.invoiceH1}>DELIVERY ORDER</div>
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
              <strong>Tgl Order:</strong>
              <span>{formatDateTime(order.created_at)}</span>
              <strong>Tgl Kirim:</strong>
              <span>{formatDate(order.shipping_date, "DD/MM/YYYY")}</span>
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
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer — last page only */}
            {pageIdx === pages.length - 1 && (
              <div style={styles.footer}>
                <div style={styles.note}>
                  {order.note && (
                    <div style={{ marginBottom: 10 }}>
                      Cattan:
                      <span
                        style={{
                          display: "block",
                          whiteSpace: "pre-wrap",
                          lineHeight: "2.5",
                        }}
                      >
                        {order.note}
                      </span>
                    </div>
                  )}
                </div>
                <table style={styles.signature}>
                  <tbody>
                    <tr>
                      <td style={styles.signCol}>
                        <div style={styles.signLabel}>PENGIRIM</div>
                        <div style={{ height: 55 }}>&nbsp;</div>
                        <div style={styles.signLine}>&nbsp;</div>
                        <div style={styles.signSub}>&nbsp; </div>
                      </td>
                      <td style={styles.signCol}>
                        <div style={styles.signLabel}>PENERIMA</div>
                        <div style={{ height: 55 }}>&nbsp;</div>
                        <div style={styles.signLine}>&nbsp;</div>
                        <div style={styles.signSub}>
                          Diterima dalam kondisi baik
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
