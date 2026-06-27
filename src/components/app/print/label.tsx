import img from "../../../../public/logo.png";
import { currencyFormat, formatDate } from "@/utils";

const Label = ({
  data,
  channel_prices,
}: {
  data: any;
  channel_prices?: any;
}) => {
  return (
    <div
      className="sheet"
      style={{
        padding: "10px",
      }}
    >
      <div
        style={{
          borderWidth: 1,
          borderColor: "#000",
          borderStyle: "solid",
          borderRadius: 5,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <img src={img} style={{ height: 50, width: "auto" }} />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: "#e0e0e0",
            margin: "10px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18, lineHeight: 1.1 }}>
            {data?.name}
          </div>
          <div style={{ fontWeight: "bold", fontSize: 16, lineHeight: 1.1 }}>
            {channel_prices
              ? currencyFormat(channel_prices.price)
              : currencyFormat(data?.base_price)}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.1, marginTop: 5 }}>
            Tanggal Produksi: {formatDate(data?.created_at)}
          </div>
        </div>

        <div
          style={{
            height: 1,
            backgroundColor: "#e0e0e0",
            margin: "10px 0",
          }}
        />
        <div style={{ marginBottom: 5 }}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 5,
            }}
          >
            Informasi Alergen
          </div>
          <div>Produk ini mengandung :</div>
        </div>

        <div>
          {data?.ingredients?.map((ing: any, i: number) => (
            <div key={i}>
              <div style={{ fontWeight: "bold", fontSize: 11 }}>
                &#8226; {ing?.catalog?.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Label;
