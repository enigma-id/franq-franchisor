/* eslint-disable @typescript-eslint/no-explicit-any */
import img from "../../../../public/sb-logo.png";
import { currencyFormat } from "@/utils";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const useAutoFontSize = (
  text: string,
  maxSize: number,
  minSize = 8,
): [number, (el: HTMLDivElement | null) => void] => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    const obs = new ResizeObserver(() => {
      const avail = el.clientWidth;
      // measure intrinsic width at current size by cloning without a width constraint
      const probe = el.cloneNode(true) as HTMLDivElement;
      probe.style.width = "auto";
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      document.body.appendChild(probe);
      const intrinsic = probe.scrollWidth;
      probe.remove();
      const scale = avail / intrinsic;
      setSize(
        Math.round(Math.max(minSize, Math.min(maxSize, maxSize * scale))),
      );
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, maxSize, minSize]);

  return [size, (el) => (ref.current = el)];
};

// ponytail: freshness hardcoded to 6 days to match label; make per-item config when variable
const FRESHNESS_DAYS = 6;

const Divider = () => (
  <div style={{ height: 1, backgroundColor: "#000", margin: "8px 0" }} />
);

const Name = ({ text }: { text: string }) => {
  const [size, bind] = useAutoFontSize(text, 20);
  if (!text) return null;
  return (
    <div
      ref={bind}
      style={{
        fontWeight: "bold",
        fontSize: size,
        lineHeight: 1.1,
        overflowWrap: "anywhere",
      }}
    >
      {text}
    </div>
  );
};

const Card = ({
  data,
  plan,
  channel_prices,
}: {
  data: any;
  plan?: any;
  channel_prices?: any;
}) => {
  const name = data?.item?.name || data?.name || "";
  const price = currencyFormat(
    data?.item?.base_price ?? channel_prices?.price ?? data?.base_price,
  );
  const batch = plan?.code || "-";
  const prodDate = plan?.production_date || data?.created_at;
  const expDate = prodDate
    ? dayjs(prodDate)
        .add(FRESHNESS_DAYS, "day")
        .format("DD MMM YY")
        .toUpperCase()
    : "-";

  return (
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
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Name text={name} />
          {(data?.item?.base_price ??
            channel_prices?.price ??
            data?.base_price) > 0 && (
            <div
              style={{
                textAlign: "left",
                fontWeight: "bold",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {price}
            </div>
          )}
        </div>
        <img src={img} style={{ height: 40, width: "auto" }} />
      </div>

      <Divider />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          fontWeight: "bold",
        }}
      >
        <div style={{ gap: 10, display: "flex", flexDirection: "column" }}>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 10 }}>BATCH NO.</div>
            <div style={{ fontWeight: "bold", fontSize: 14, marginTop: 2 }}>
              {batch}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 10 }}>EXP DATE</div>
            <div style={{ fontWeight: "bold", fontSize: 14, marginTop: 2 }}>
              {expDate}
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#F3F3F3",
            padding: 8,
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 10 }}>
            FRESHNESS ({FRESHNESS_DAYS} DAYS)
          </span>
          <div
            style={{
              marginTop: 5,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              fontSize: 11,
              gap: 5,
            }}
          >
            {/* <div style={{ fontSize: 11, textAlign: "center", lineHeight: 1.4 }}> */}
            {Array.from({ length: FRESHNESS_DAYS }, (_, i) => (
              <span
                key={i}
                style={{
                  textAlign: "center",
                  padding: "2px 0px",
                  border: "1px solid #000",
                }}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 10,
          lineHeight: 1.4,
        }}
      >
        <div>WAJIB DISIMPAN DI SUHU DINGIN</div>
        <div>BAIK DI KONSUMSI LANGSUNG</div>
      </div>
    </div>
  );
};

const Plan = ({
  data,
  plan,
  channel_prices,
  repeatCount = 1,
}: {
  data: any;
  plan?: any;
  channel_prices?: any;
  repeatCount?: number;
}) => {
  return Array.from({ length: repeatCount }).map((_, idx) => (
    <div
      key={idx}
      className="sheet"
      style={{
        padding: "10px",
      }}
    >
      <Card data={data} plan={plan} channel_prices={channel_prices} />
    </div>
  ));
};

export default Plan;
