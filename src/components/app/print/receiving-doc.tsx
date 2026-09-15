/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "@/utils";

interface ReceivingDocPrintProps {
  data?: any;
}

const ReceivingDocPrint = ({ data }: ReceivingDocPrintProps) => {
  if (!data) return null;

  return (
    <div className='sheet page-break' style={{ padding: "15px" }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h4 style={{ margin: "10px 0", fontSize: "12px", fontWeight: "bold" }}>
          RECEIVING DOCUMENT
        </h4>
        <div style={{ borderBottom: "1px dashed #000", margin: "5px 0" }}></div>
      </div>

      {/* Detail Information */}
      <table
        style={{
          width: "100%",
          marginBottom: "8px",
          borderCollapse: "collapse",
          fontSize: "10px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "35%", verticalAlign: "top" }}>Code</td>
            <td style={{ width: "5%", verticalAlign: "top" }}>:</td>
            <td style={{ width: "60%", fontWeight: "bold" }}>{data.code}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Plan Code</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.plan?.code || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Ref Code</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.plan?.ref_code || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Warehouse</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.warehouse?.name || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Received At</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{formatDate(data.received_at, "DD/MM/YYYY HH:mm")}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Received By</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.received_by || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Sender</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.plan?.sender_name || "-"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}></div>

      {/* Items Section */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}
        >
          Items:
        </div>
        {data.items && data.items.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #000" }}>
                <th style={{ textAlign: "left", width: "45%" }}>Item</th>
                <th style={{ textAlign: "left", width: "30%" }}>Batch/Exp</th>
                <th style={{ textAlign: "right", width: "25%" }}>Qty Recvd</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any, index: number) => (
                <tr
                  key={item.id || index}
                  style={{ borderBottom: "1px dashed #eee" }}
                >
                  <td
                    style={{
                      padding: "3px 0",
                      verticalAlign: "top",
                      fontSize: "9px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {item.plan_item?.item?.code || "-"}
                    </span>
                    <br />
                    <span>
                      {item.plan_item?.item?.alias_name ||
                        item.plan_item?.item?.name ||
                        "-"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "3px 0",
                      verticalAlign: "top",
                      fontSize: "9px",
                    }}
                  >
                    {item.batch?.code ? (
                      <>
                        <span style={{ fontWeight: "bold" }}>
                          Batch: {item.batch.code}
                        </span>
                        {item.batch?.expired_at && (
                          <>
                            <br />
                            <span>
                              Exp: {formatDate(item.batch.expired_at)}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "3px 0",
                      verticalAlign: "top",
                      textAlign: "right",
                      fontSize: "9px",
                    }}
                  >
                    {item.quantity_received || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontStyle: "italic", margin: "0", fontSize: "9px" }}>
            No items received
          </p>
        )}
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}></div>

      {/* QR Code and Footer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        {data.code && (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
              data.code,
            )}`}
            alt={data.code}
            style={{ width: "100px", height: "100px", marginBottom: "6px" }}
          />
        )}
        <span style={{ fontSize: "9px", fontWeight: "bold" }}>{data.code}</span>
      </div>
    </div>
  );
};

export default ReceivingDocPrint;
