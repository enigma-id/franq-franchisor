/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "@/utils";

interface ProductionPlanThermalPrintProps {
  // Dipakai utk data production plan ATAU data order (dipetakan oleh pemanggil).
  data: any;
}

const ProductionPlanThermalPrint = ({
  data,
}: ProductionPlanThermalPrintProps) => {
  if (!data) return null;
  const items: any[] = data.items || [];

  return (
    <div className='sheet page-break' style={{ padding: "15px" }}>
      <div style={{ textAlign: "center", marginBottom: "5px" }}>
        <h4 style={{ margin: "10px 0", fontSize: "12px", fontWeight: "bold" }}>
          Central Kitchen
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
            <td style={{ verticalAlign: "top" }}>Outlet</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td style={{ textTransform: "capitalize" }}>
              {data.outlet?.name
                ? `${data.franchisor?.name ? data.franchisor.name + " - " : ""}${data.outlet.name}`
                : data.type?.replace("_", " ") || "-"}
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Tanggal Produksi</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>{formatDate(data.production_date)}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top" }}>Gudang Tujuan</td>
            <td style={{ verticalAlign: "top" }}>:</td>
            <td>
              {data.destination_warehouse?.name ||
                data.destination_warehouse_name ||
                "-"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Note */}
      {data.note && (
        <>
          <div
            style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}
          ></div>
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                fontSize: "10px",
              }}
            >
              Note:
            </div>
            <p style={{ margin: "0", fontSize: "10px", fontStyle: "italic" }}>
              {data.note}
            </p>
          </div>
        </>
      )}

      <div style={{ borderBottom: "1px dashed #000", margin: "8px 0" }}></div>

      {/* Items Section */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}
        >
          Items:
        </div>
        {items.length > 0 ? (
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
              {items.map((item, index) => (
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
                    <span>{item.item?.name || "-"}</span>
                    {item.item?.code && (
                      <>
                        <br />
                        <span>{item.item.code}</span>
                      </>
                    )}
                    {item.materials && item.materials.length > 0 && (
                      <div style={{ marginTop: "3px" }}>
                        {item.materials.map((mat: any, mIdx: number) => (
                          <div
                            key={mat.id || mIdx}
                            style={{ fontSize: "8px", color: "#444" }}
                          >
                            {mIdx + 1}. {mat.material?.name || "-"}:{" "}
                            {mat.quantity_used} / {mat.quantity_need}{" "}
                            {mat.measurement}
                          </div>
                        ))}
                      </div>
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
                    {item.quantity_produced > 0
                      ? item.quantity_produced
                      : item.quantity_planned || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontStyle: "italic", margin: "0", fontSize: "9px" }}>
            No items planned
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductionPlanThermalPrint;
