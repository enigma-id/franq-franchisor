/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "@/utils";

interface ReceivingPlanPrintProps {
  data?: any;
}

const ReceivingPlanPrint = ({ data }: ReceivingPlanPrintProps) => {
  if (!data) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    data.ref_code || "",
  )}`;

  return (
    <div className='sheet page-break' style={{ padding: "15px" }}>
      <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <h4 style={{ margin: "10px 0", fontSize: "12px", fontWeight: "bold" }}>
          RECEIVING PLAN
        </h4>
        <div style={{ borderBottom: "1px dashed #000", margin: "5px 0" }}></div>
      </div>

      {/* Info Section */}
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
            <td style={{ verticalAlign: "top" }}>Ref Code</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td style={{ fontWeight: "bold" }}>{data.ref_code || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Pengirim</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.sender_name || "-"}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Tanggal Rencana</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{formatDate(data.plan_date)}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Warehouse</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{data.warehouse?.name || "-"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}></div>

      {/* Status */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}
        >
          Penerimaan:
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "10px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "35%" }}>Status Dokumen</td>
              <td style={{ width: "5%" }}>:</td>
              <td
                style={{ width: "60%", textTransform: "capitalize" }}
              >{`${data.document_status?.replace(/_/g, " ") || "-"}`}</td>
            </tr>
            <tr>
              <td>Status Penerimaan</td>
              <td>:</td>
              <td style={{ textTransform: "capitalize" }}>
                {data.receiving_status?.replace(/_/g, " ") || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
                <th style={{ textAlign: "left", width: "70%" }}>Item</th>
                <th style={{ textAlign: "right", width: "30%" }}>Qty</th>
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
                    <span>{item.item?.name || item.item?.alias_name || "-"}</span>
                    {item.item?.code && (
                      <>
                        <br />
                        <span>{item.item.code}</span>
                      </>
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
                    {`${item.quantity_planned || 0} ${item.item?.default_fraction ?? ""}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontStyle: "italic", margin: "0", fontSize: "9px" }}>
            No items assigned
          </p>
        )}
      </div>

      {/* QR Code and Footer */}
      {data.ref_code && (
        <>
          <div
            style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}
          ></div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <img
              src={qrCodeUrl}
              alt={data.ref_code}
              style={{ width: "100px", height: "100px", marginBottom: "6px" }}
            />
            <span style={{ fontSize: "9px", fontWeight: "bold" }}>
              {data.ref_code}
            </span>
            <div
              style={{
                borderBottom: "1px dashed #000",
                width: "100%",
                margin: "8px 0",
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceivingPlanPrint;
