/* eslint-disable @typescript-eslint/no-explicit-any */
import rabbitLogo from "../../../../public/rabbit.png"; // New logo
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const useAutoFontSize = (
  text: string,
  maxSize: number,
  minSize = 3,
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

const Card = ({
  data,
  plan,
}: {
  data: any; // ProductionPlanItem
  plan?: any; // ProductionPlanDetail
  channel_prices?: any;
}) => {
  const name = data?.item?.name;
  const itemSize = `${data.item.weight} GRAMS`;
  const brandName = "SBCOFFEECO.";
  const prodDate = plan?.production_date || data?.created_at;
  const displayProdDate = prodDate ? dayjs(prodDate).format("DD/MM/YYYY") : "-";

  const descriptionText =
    "FRESHLY BAKED SETIAP HARI DIBUAT TANPA BAHAN PENGAWET. UNTUK DIKONSUMSI LANGSUNG ATAU DIHANGATKAN KEMBALI SEBELUM DINIKMATI.";

  const [nameFontSize, bindNameRef] = useAutoFontSize(name, 16, 9);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        fontFamily: "'Inter', sans-serif",
        color: "#000",
        overflow: "hidden",
      }}
    >
      {/* Row 1: Product Name & Logo */}
      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          minHeight: "29mm",
          borderBottom: "1px solid #000",
        }}
      >
        {/* Top Left: Product Name */}
        <div
          style={{
            flex: 1,
            padding: "2mm 2.5mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            ref={bindNameRef}
            style={{
              fontWeight: "550",
              fontSize: nameFontSize,
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              overflowWrap: "break-word",
            }}
          >
            {name}
          </div>
        </div>

        {/* Top Right: Logo */}
        <div
          style={{
            width: "28mm",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: "1.5mm",
          }}
        >
          <img
            src={rabbitLogo}
            alt="Logo"
            style={{
              maxHeight: "18mm",
              maxWidth: "24mm",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* Row 2: Weight & Brand */}
      <div
        style={{
          display: "flex",
          height: "7mm",
          borderBottom: "1px solid #000",
        }}
      >
        {/* Middle Left: Size / Weight */}
        <div
          style={{
            flex: 1,
            padding: "0 2.5mm",
            fontSize: "9pt",
            textTransform: "uppercase",
            borderRight: "1px solid #000",
            alignItems: "center",
            alignContent: "center",
            fontWeight: "550",
          }}
        >
          {itemSize}
        </div>

        {/* Middle Right: Brand Name */}
        <div
          style={{
            width: "28mm",
            padding: "0 1.5mm",
            fontSize: "9pt",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.2px",
            alignItems: "center",
            alignContent: "center",
            fontWeight: "550",
          }}
        >
          {brandName}
        </div>
      </div>

      {/* Row 3: Description & Production Date */}
      <div style={{ display: "flex", flex: "1 1 auto", minHeight: "10mm" }}>
        {/* Bottom Left: Description */}
        <div
          style={{
            flex: 1,
            padding: "1.5mm",
            fontSize: "5.5pt",
            lineHeight: 1.25,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {descriptionText}
        </div>

        {/* Bottom Right: Prod Date */}
        <div
          style={{
            width: "28mm",
            borderLeft: "1.5px solid #000",
            padding: "1.5mm",
            display: "flex",
            flexDirection: "column",
            fontSize: "5.5pt",
          }}
        >
          <div>PROD DATE:</div>
          <div
            style={{
              marginTop: "3px",
              fontSize: "8pt",
            }}
          >
            {displayProdDate}
          </div>
        </div>
      </div>
    </div>
  );
};

const Plan = ({
  data,
  plan,
  repeatCount = 1,
}: {
  data: any;
  plan?: any;
  channel_prices?: any;
  repeatCount?: number;
}) => {
  return Array.from({ length: repeatCount }).map((_, idx) => (
    <div key={idx} className="sheet plan-sheet">
      <div className="plan-label">
        <Card data={data} plan={plan} />
      </div>
    </div>
  ));
};

export default Plan;
