import { useMemo } from "react";
import {
  Banknote,
  CreditCard,
  Wallet,
  Users,
  BarChart3,
  QrCode,
  ConciergeBell,
  CircleDollarSign,
} from "lucide-react";
import { currencyFormat } from "@/utils";
import { SummaryCard } from "./SummaryCard";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const getCardMeta = (method: string) => {
  const lower = method.toLowerCase();
  if (lower === "total")
    return { section: "overview", icon: BarChart3, color: "orange" };
  if (lower === "outstanding")
    return { section: "lainnya", icon: Wallet, color: "red" };
  if (lower === "cash")
    return { section: "pembayaran", icon: Banknote, color: "green" };
  if (lower.includes("qris") || lower.includes("qr"))
    return { section: "pembayaran", icon: QrCode, color: "blue" };
  if (
    lower.includes("kredit") ||
    lower.includes("credit") ||
    lower.includes("card")
  )
    return { section: "pembayaran", icon: CreditCard, color: "blue" };
  if (lower.includes("service"))
    return { section: "lainnya", icon: ConciergeBell, color: "blue" };
  if (lower.includes("ent"))
    return { section: "lainnya", icon: ConciergeBell, color: "blue" };
  if (lower === "member")
    return { section: "lainnya", icon: Users, color: "blue" };

  return { section: "pembayaran", icon: CircleDollarSign, color: "blue" };
};

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
      {title}
    </span>
  </div>
);

export function SettlementSummaryCards({ summary }: { summary: any[] }) {
  const categorized = useMemo(() => {
    const overview: any[] = [];
    const pembayaran: any[] = [];
    const lainnya: any[] = [];

    summary.forEach((item: any) => {
      const meta = getCardMeta(item.method);
      const enriched = { ...item, ...meta };
      if (meta.section === "overview") overview.push(enriched);
      else if (meta.section === "lainnya") lainnya.push(enriched);
      else pembayaran.push(enriched);
    });

    return { overview, pembayaran, lainnya };
  }, [summary]);

  const getGridCols = (length: number) => {
    if (length === 1) return "grid-cols-1";
    if (length === 2) return "grid-cols-1 sm:grid-cols-2";
    if (length === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  };

  if (!summary || summary.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mb-6 shrink-0">
      {categorized.overview.length > 0 && (
        <div>
          <SectionTitle title="OVERVIEW" />
          <div
            className={`grid gap-4 ${getGridCols(categorized.overview.length)}`}
          >
            {categorized.overview.map((item, i) => {
              const theme = THEMES[item.color] || THEMES.orange;
              return (
                <SummaryCard
                  key={i}
                  variant="primary"
                  label={item.method}
                  value={currencyFormat(item.total)}
                  icon={item.icon}
                  theme={theme}
                />
              );
            })}
          </div>
        </div>
      )}

      {categorized.pembayaran.length > 0 && (
        <div>
          <SectionTitle title="PEMBAYARAN" />
          <div
            className={`grid gap-4 ${getGridCols(categorized.pembayaran.length)}`}
          >
            {categorized.pembayaran.map((item, i) => {
              const theme = THEMES[item.color] || THEMES.blue;
              return (
                <SummaryCard
                  key={i}
                  label={item.method}
                  value={currencyFormat(item.total)}
                  icon={item.icon}
                  theme={theme}
                />
              );
            })}
          </div>
        </div>
      )}

      {categorized.lainnya.length > 0 && (
        <div>
          <SectionTitle title="LAINNYA" />
          <div
            className={`grid gap-4 ${getGridCols(categorized.lainnya.length)}`}
          >
            {categorized.lainnya.map((item, i) => {
              const theme = THEMES[item.color] || THEMES.blue;
              return (
                <SummaryCard
                  key={i}
                  label={item.method}
                  value={currencyFormat(item.total)}
                  icon={item.icon}
                  theme={theme}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
