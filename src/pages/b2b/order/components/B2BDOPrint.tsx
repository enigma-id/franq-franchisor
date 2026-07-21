import { useMemo } from "react";
import { formatDate } from "@/utils";
import type { B2BOrderDetail } from "@/services/types";

interface Props {
  order: B2BOrderDetail;
}

export function B2BDOPrint({ order }: Props) {
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
                        DELIVERY ORDER
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table cellSpacing="0" cellPadding="3">
                <tbody>
                  <tr>
                    <td style={{ width: "50%", verticalAlign: "top" }}>
                      <table className="body" cellSpacing="0" cellPadding="3">
                        <thead className="bg-section">
                          <tr>
                            <th className="center border-top border-left border-right" colSpan={2} style={{ width: "50%" }}>#SO CODE</th>
                          </tr>
                          <tr>
                            <td className="center border-bottom border-left border-right" colSpan={2}>{order.code}</td>
                          </tr>
                          <tr>
                            <th className="center border-left border-right" style={{ width: "50%" }}>CUSTOMER</th>
                            <th className="center border-right" style={{ width: "50%" }}>REFF</th>
                          </tr>
                          <tr>
                            <td className="border-bottom border-right border-left">{order.customer_name}</td>
                            <td className="border-bottom border-right">-</td>
                          </tr>
                        </thead>
                      </table>
                    </td>
                    <td style={{ width: "50%", verticalAlign: "top" }}>
                      <table className="body" cellSpacing="0" cellPadding="3">
                        <thead className="bg-section">
                          <tr>
                            <th className="center border-top border-left border-right" style={{ width: "50%" }}>ORDER DATE</th>
                            <th className="center border-top border-right" style={{ width: "50%" }}>ETD</th>
                          </tr>
                          <tr>
                            <td className="border-bottom border-right border-left">
                              {formatDate(order.created_at, "DD/MM/YYYY")}
                            </td>
                            <td className="border-bottom border-right">
                              {formatDate(order.shipping_date, "DD/MM/YYYY")}
                            </td>
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
                <th className="center border-top border-left border-right" style={{ fontSize: 10 }}>QTY</th>
              </tr>
            </thead>
            <tbody>
              {page.map((row: any, i: number) => (
                <tr key={i}>
                  <td className="center border-bottom border-left" style={{ fontSize: 9 }}>
                    {pageNumber(pageIdx, i)}
                  </td>
                  <td className="border-bottom border-left" style={{ fontSize: 9 }}>{row.menu_name}</td>
                  <td className="border-bottom border-left border-right right" style={{ fontSize: 9 }}>{row.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer - only on last page */}
          {pageIdx === pages.length - 1 && (
            <table className="body" cellSpacing="0" cellPadding="0">
              <tbody>
                <tr>
                  <td>
                    <table className="body" cellSpacing="0" cellPadding="5" style={{ marginTop: 10 }}>
                      <thead className="bg-section">
                        <tr>
                          <th className="left border-left border-right border-top" style={{ paddingLeft: 10 }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-left border-right" style={{ height: 20 }}>{order.note || ""}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table className="body" cellSpacing="0" cellPadding="5">
                      <thead className="bg-section">
                        <tr>
                          <th style={{ width: "50%" }} className="center border-left border-right border-top">PENGIRIM</th>
                          <th style={{ width: "50%" }} className="center border-right border-top">PENERIMA</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="center border-left border-right" style={{ height: 50 }}>&nbsp;</td>
                          <td className="center border-right" style={{ height: 50 }}>&nbsp;</td>
                        </tr>
                        <tr>
                          <td className="center border-bottom border-left border-right">&nbsp;</td>
                          <td className="center border-bottom border-right" style={{ fontStyle: "italic", fontSize: 10 }}>
                            Diterima dalam kondisi yang baik
                          </td>
                        </tr>
                      </tbody>
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
