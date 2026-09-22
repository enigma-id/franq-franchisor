/* eslint-disable @typescript-eslint/no-explicit-any */
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import {
  CalendarClock,
  Receipt,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  indigo: { text: "text-indigo-500", iconBg: "#e0e7ff", wave: "#6366f1" },
};

/** Summary cards Laporan Outlet — dipakai list (brand-wide) dan detail (per-outlet). */
export function OutletSummaryCards({ data }: { data: any | null }) {
  if (!data) return null;

  return (
    <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6'>
      <SummaryCard
        label='Total Outlet'
        value={data.total_outlet ?? 0}
        icon={Store}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Omzet'
        value={currencyFormat(data.total_omzet ?? 0)}
        icon={TrendingUp}
        theme={THEMES.indigo}
      />
      <SummaryCard
        label='Total Sales'
        value={data.total_sales ?? 0}
        icon={ShoppingCart}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Outstanding'
        value={currencyFormat(data.outstanding_amount ?? 0)}
        icon={Receipt}
        theme={THEMES.red}
      />
      <SummaryCard
        label='Total Session'
        value={data.total_session ?? 0}
        icon={CalendarClock}
        theme={THEMES.purple}
      />
    </div>
  );
}

export default OutletSummaryCards;
