import { useMemo } from "react";
import { formatCurrency, formatDate } from "@/utils";
import type { B2BOrderDetail } from "@/services/types";

interface Props {
  order: B2BOrderDetail;
}

export function B2BInvoicePrint({ order }: Props) {
  const items = order.items ?? [];
  const limit = 30;
  const firstPage = items.length >= 21 && items.length <= 25 ? items.length - 1 : 25;

  const pages = useMemo(() => {
    if (items.length <= firstPage) return [items];
    const first = items.slice(0, firstPage);
    const rest = items.slice(firstPage);
    const chunks: typeof items[] = [first];
    for (let i = 0; i < rest.length; i += limit) {
      chunks.push(rest.slice(i, i + limit));
    }
    return chunks;
  }, [items, firstPage, limit]);

  const pageNumber = (pageIdx: number, itemIdx: number) => {
    if (pageIdx === 0) return itemIdx + 1;
    return firstPage + (pageIdx - 1) * limit + itemIdx + 1;
  };

  return (
    <>
      {pages.map((page, pageIdx) => (
        <section key={pageIdx} className="sheet A4" style={{ padding: "40px 60px" }}>
          {/* Header - only on first page */}
          {pageIdx === 0 && (
            <>
              <table className="header" cellSpacing="0" cellPadding="2">
                <tbody>
                  <tr>
                    <td style={{ width: "50%", verticalAlign: "middle" }} />
                    <td style={{ verticalAlign: "bottom", textAlign: "center" }}>
                      <pre style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 2, margin: 0, fontFamily: "inherit" }}>
                        SALES INVOICE
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table cellSpacing="0" cellPadding="3">
                <tbody>
                  <tr>
                    <td style={{ width: "50%", verticalAlign: "top" }}>
                      <table className="body center" cellSpacing="0" cellPadding="3">
                        <thead className="bg-section">
                          <tr>
                            <th className="center border-top border-left border-right" style={{ width: "50%" }}>#SO CODE</th>
                            <th className="center border-top border-right" style={{ width: "50%" }}>CUSTOMER</th>
                          </tr>
                          <tr>
                            <td className="center border-left border-right border-bottom">
                              <span className="center">{order.code}</span>
                            </td>
                            <td className="center border-right border-bottom">
                              <span>{order.customer_name}</span>
                            </td>
                          </tr>
                        </thead>
                      </table>
                    </td>
                    <td style={{ width: "50%", verticalAlign: "top" }}>
                      <table className="body center" cellSpacing="0" cellPadding="3">
                        <thead className="bg-section">
                          <tr>
                            <th className="center border-top border-left border-right" style={{ width: "50%" }}>DATE</th>
                            <th className="center border-top border-right" style={{ width: "50%" }}>REFF</th>
                          </tr>
                          <tr>
                            <td className="center border-left border-right border-bottom">
                              <span className="center">{formatDate(order.created_at, "DD/MM/YYYY")}</span>
                            </td>
                            <td className="center border-right border-bottom"><span className="center">-</span></td>
                          </tr>
                        </thead>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {/* Items table */}
          <table className="body" cellSpacing="0" cellPadding="5" style={{ marginTop: 10 }}>
            <thead className="bg-section">
              <tr>
                <th style={{ width: "5%", fontSize: 10 }} className="center border-top border-left">NO</th>
                <th style={{ width: "35%", fontSize: 10 }} className="border-top border-left">ITEM</th>
                <th style={{ width: "15%", fontSize: 10 }} className="center border-top border-left">QTY</th>
                <th style={{ width: "18%", fontSize: 10 }} className="center border-top border-left">NETT PRICE (RP)</th>
                <th style={{ width: "17%", fontSize: 10 }} className="center border-top border-left border-right">SUBTOTAL (RP)</th>
              </tr>
            </thead>
            <tbody>
              {page.map((row: any, i: number) => (
                <tr key={i}>
                  <td className="center border-bottom border-left" style={{ fontSize: 9 }}>
                    {pageNumber(pageIdx, i)}
                  </td>
                  <td className="border-bottom border-left" style={{ fontSize: 9 }}>{row.menu_name}</td>
                  <td className="border-bottom border-left right" style={{ fontSize: 9 }}>{row.quantity}</td>
                  <td className="border-bottom border-left right" style={{ fontSize: 9 }}>{formatCurrency(row.unit_nett || 0)}</td>
                  <td className="border-bottom border-left border-right right" style={{ fontSize: 9 }}>
                    {formatCurrency((row.unit_nett || 0) * (row.quantity || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer - only on last page */}
          {pageIdx === pages.length - 1 && (
            <table className="body" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ width: "50%", verticalAlign: "top", paddingRight: 10 }}>
                    <table className="body" cellSpacing="0" cellPadding="5" style={{ marginTop: 10 }}>
                      <thead className="bg-section">
                        <tr>
                          <th className="center border-left border-right border-top">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-left border-right" style={{ height: 50 }}>{order.note || ""}</td>
                        </tr>
                        <tr>
                          <td className="center border-bottom border-left border-right">&nbsp;</td>
                        </tr>
                        <tr>
                          <td>
                            <span style={{ fontSize: 7 }}>
                              This is a computer generated document and requires no signature.
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ width: "50%", verticalAlign: "top" }}>
                    <table className="body" cellSpacing="0" cellPadding="5" style={{ marginTop: 10 }}>
                      <thead className="bg-section">
                        {(order.discount_value > 0 || order.service_charge_value > 0) && (
                          <>
                            <tr>
                              <td className="border-top border-left" style={{ fontWeight: 600, width: "40%" }}>
                                Subtotal
                              </td>
                              <td className="border-top border-left border-right right" style={{ fontSize: 10 }}>
                                Rp. {formatCurrency(order.subtotal_nett || 0)}
                              </td>
                            </tr>
                            {order.discount_value > 0 && (
                              <tr>
                                <td className="border-top border-left" style={{ fontWeight: 600, width: "40%" }}>Discount</td>
                                <td className="border-left border-top border-right right" style={{ fontSize: 10 }}>
                                  Rp. {formatCurrency(order.discount_value)}
                                </td>
                              </tr>
                            )}
                            {order.service_charge_value > 0 && (
                              <tr>
                                <td className="border-top border-left" style={{ fontWeight: 600, width: "40%" }}>Service</td>
                                <td className="border-left border-top border-right right" style={{ fontSize: 10 }}>
                                  Rp. {formatCurrency(order.service_charge_value)}
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                        <tr>
                          <td className="border-top border-left border-bottom" style={{ fontWeight: 600, width: "40%" }}>
                            Total Charges
                          </td>
                          <td className="border-left border-top border-bottom border-right right" style={{ fontSize: 10 }}>
                            Rp. {formatCurrency(order.total_charges || 0)}
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="footer">Page {pageIdx + 1} of {pages.length}</div>
        </section>
      ))}
    </>
  );
}
