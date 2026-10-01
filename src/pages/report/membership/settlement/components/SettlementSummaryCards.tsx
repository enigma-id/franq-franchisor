/* eslint-disable @typescript-eslint/no-explicit-any */
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import {
  Banknote,
  BarChart3,
  CircleDollarSign,
  Gift,
  ListOrdered,
  Wallet,
} from "lucide-react";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  indigo: { text: "text-indigo-500", iconBg: "#e0e7ff", wave: "#6366f1" },
};

/** Summary cards Membership Settlement — dipakai list dan detail. */
export function SettlementSummaryCards({ data }: { data: any | null }) {
  if (!data) return null;

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6'>
      <SummaryCard
        label='Topup Cash'
        value={currencyFormat(data.topup_cash ?? 0)}
        icon={Banknote}
        theme={THEMES.green}
      />

      <SummaryCard
        label='Payment Saldo'
        value={currencyFormat(data.payment_saldo ?? 0)}
        icon={Wallet}
        theme={THEMES.indigo}
      />
      <SummaryCard
        label='Payment Point'
        value={currencyFormat(data.payment_point ?? 0)}
        icon={Gift}
        theme={THEMES.purple}
      />
      <SummaryCard
        label='Payment Total'
        value={currencyFormat(data.payment_total ?? 0)}
        icon={BarChart3}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Net'
        value={currencyFormat(data.net_amount ?? 0)}
        icon={CircleDollarSign}
        theme={THEMES.red}
      />
      <SummaryCard
        label='Total Data'
        value={data.total_data ?? 0}
        icon={ListOrdered}
        theme={THEMES.orange}
      />
    </div>
  );
}

export default SettlementSummaryCards;
