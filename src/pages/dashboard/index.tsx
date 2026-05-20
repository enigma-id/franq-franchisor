import React, { useCallback } from "react";
import dayjs from "dayjs";
import { useDashboard } from "../../services/dashboard/hooks";
import { Loading, MonthPicker } from "@/components/ui";
import {
  ShoppingBag,
  Wallet,
  Package,
  Award,
  TrendingUp,
  CreditCard,
  BarChart2,
  Store,
  Layers,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { formatCurrency } from "@/utils";
import { SalesChart } from "@/components/dashboard";
import { SummaryCard } from "@/components/app";

const THEMES = {
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  purple: { text: "text-violet-500", iconBg: "#ede9fe", wave: "#8b5cf6" },
  rose: { text: "text-rose-500", iconBg: "#ffe4e6", wave: "#f43f5e" },
  teal: { text: "text-teal-500", iconBg: "#ccfbf1", wave: "#14b8a6" },
};

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
      <Icon className="w-4 h-4 text-slate-600" strokeWidth={2} />
    </div>
    <div>
      <h2 className="text-[15px] font-bold text-slate-800 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

// ─── Top Item Row ────────────────────────────────────────────────────────────
const TopItemRow = ({
  rank,
  name,
  quantity,
  omset,
  maxOmset,
}: {
  rank: number;
  name: string;
  quantity: number;
  omset: number;
  maxOmset: number;
}) => {
  const pct = maxOmset > 0 ? Math.round((omset / maxOmset) * 100) : 0;
  const rankColors = ["text-amber-500", "text-slate-400", "text-orange-400"];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <span
        className={`w-5 text-center text-xs font-bold shrink-0 ${rankColors[rank - 1] ?? "text-slate-300"}`}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-700 truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">{pct}%</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[13px] font-bold text-slate-800">
          {formatCurrency(omset)}
        </p>
        <p className="text-[10px] text-slate-400">{quantity} pcs</p>
      </div>
    </div>
  );
};

// ─── Dashboard page ──────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [periode, setPeriode] = React.useState(dayjs().format("YYYY-MM"));

  const {
    getCommission,
    getSales,
    getItem,
    getGraph,
    sales,
    isLoadingSales,
    item,
    isLoadingItem,
    commission,
    isLoadingCommission,
    graph,
    isLoadingGraph,
  } = useDashboard();

  const fetchData = useCallback(() => {
    const params = { periode };
    getSales(params);
    getItem(params);
    getGraph(params);
    getCommission(params);
  }, [periode]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // API shapes
  const salesData = (sales as any)?.data;
  const itemData = (item as any)?.data;
  const commissionData = (commission as any)?.data;

  const totalOmset: number = salesData?.total_omset ?? 0;
  const saldo = salesData?.overview_saldo ?? {};
  const topItems: { name: string; quantity: number; omset: number }[] =
    salesData?.top_item_profitable ?? [];
  const posReport = salesData?.pos_report ?? {};
  const topSalesItems: { name: string; quantity: number; omset: number }[] =
    Array.isArray(posReport?.top_sales_item) ? posReport.top_sales_item : [];
  const topSalesOutlets: { name: string; quantity: number; omset: number }[] =
    Array.isArray(posReport?.top_sales_outlet) ? posReport.top_sales_outlet : [];
  const inventoryValue: number = itemData?.total_inventory_value ?? 0;
  const totalCommission: number = commissionData?.total_commission ?? 0;

  const maxOmset = topItems.reduce((m, i) => Math.max(m, i.omset), 0);
  const maxSalesItemOmset = topSalesItems.reduce((m, i) => Math.max(m, i.omset), 0);
  const maxSalesOutletOmset = topSalesOutlets.reduce((m, i) => Math.max(m, i.omset), 0);

  const isLoading = isLoadingSales || isLoadingItem || isLoadingCommission;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Main Menu"
        title="Dashboard"
        subtitle="Ringkasan performa bisnis Anda."
        action={<MonthPicker value={periode} onChange={setPeriode} />}
      />

      <Page.Body className="flex flex-col gap-6">
        {/* ── Sales Chart ── */}
        <SalesChart
          data={graph?.data}
          isLoading={isLoadingGraph}
          selectedYear={parseInt(periode.split("-")[0])}
          selectedMonth={periode.split("-")[1]}
          onYearChange={(year) =>
            setPeriode(`${year}-${periode.split("-")[1]}`)
          }
          onMonthChange={(month) =>
            setPeriode(`${periode.split("-")[0]}-${month}`)
          }
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <>
            {/* ── Row 1: Key Metrics ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SummaryCard
                label="Total Omset"
                value={formatCurrency(totalOmset)}
                icon={TrendingUp}
                theme={THEMES.green}
                variant="primary"
              />
              <SummaryCard
                label="Inventory Value"
                value={formatCurrency(inventoryValue)}
                icon={Package}
                theme={THEMES.blue}
                variant="primary"
              />
              <SummaryCard
                label="Total Komisi"
                value={formatCurrency(totalCommission)}
                icon={Award}
                theme={THEMES.purple}
                variant="primary"
              />
              <SummaryCard
                label="Omset POS"
                value={formatCurrency(posReport?.total_omset ?? 0)}
                icon={ShoppingBag}
                theme={THEMES.orange}
                variant="primary"
              />
              <SummaryCard
                label="Hutang Dagang"
                value={formatCurrency(saldo?.hutang_dagang ?? 0)}
                icon={CreditCard}
                theme={THEMES.rose}
                variant="primary"
              />
            </div>

            {/* ── Row 2: Saldo Overview ── */}
            <div>
              <SectionHeader
                icon={Wallet}
                title="Overview Saldo"
                subtitle="Posisi saldo periode ini"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                  label="Saldo Working Capital"
                  value={formatCurrency(saldo?.saldo_working_capital ?? 0)}
                  icon={Layers}
                  theme={THEMES.teal}
                  variant="primary"
                />
                <SummaryCard
                  label="Saldo Komisi"
                  value={formatCurrency(saldo?.saldo_commission ?? 0)}
                  icon={Award}
                  theme={THEMES.purple}
                  variant="primary"
                />
                <SummaryCard
                  label="Hutang Dagang"
                  value={formatCurrency(saldo?.hutang_dagang ?? 0)}
                  icon={CreditCard}
                  theme={THEMES.rose}
                  variant="primary"
                />
              </div>
            </div>

            {/* ── Row 3: Top Rankings (3 equal cards) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Item Profitable */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <SectionHeader
                  icon={BarChart2}
                  title="Top Item Profitable"
                  subtitle="Produk dengan omset tertinggi periode ini"
                />
                {topItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <Package className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Belum ada data produk</p>
                  </div>
                ) : (
                  <div>
                    {topItems.map((item, i) => (
                      <TopItemRow
                        key={i}
                        rank={i + 1}
                        name={item.name}
                        quantity={item.quantity}
                        omset={item.omset}
                        maxOmset={maxOmset}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Top Sales Item */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <SectionHeader
                  icon={Award}
                  title="Top Sales Item"
                  subtitle="Item terlarik dari Point of Sale"
                />
                {topSalesItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <Package className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Belum ada data item</p>
                  </div>
                ) : (
                  <div>
                    {topSalesItems.map((item, i) => (
                      <TopItemRow
                        key={i}
                        rank={i + 1}
                        name={item.name}
                        quantity={item.quantity}
                        omset={item.omset}
                        maxOmset={maxSalesItemOmset}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Top Sales Outlet */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <SectionHeader
                  icon={Store}
                  title="Top Sales Outlet"
                  subtitle="Outlet dengan penjualan tertinggi"
                />
                {topSalesOutlets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                    <Store className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Belum ada data outlet</p>
                  </div>
                ) : (
                  <div>
                    {topSalesOutlets.map((item, i) => (
                      <TopItemRow
                        key={i}
                        rank={i + 1}
                        name={item.name}
                        quantity={item.quantity}
                        omset={item.omset}
                        maxOmset={maxSalesOutletOmset}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 4: POS Report ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <SectionHeader
                icon={ShoppingBag}
                title="POS Report"
                subtitle="Ringkasan penjualan dari Point of Sale"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-orange-500" strokeWidth={2} />
                    </div>
                    <p className="text-[13px] font-semibold text-slate-600">Total Omset POS</p>
                  </div>
                  <p className="text-[14px] font-extrabold text-slate-800">
                    {formatCurrency(posReport?.total_omset ?? 0)}
                  </p>
                </div>

                {!posReport?.sales_graph && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-dashed border-slate-200">
                    <BarChart2 className="w-4 h-4 text-slate-300 shrink-0" />
                    <p className="text-[12px] text-slate-300">
                      Grafik penjualan POS belum tersedia untuk periode ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Page.Body>
    </Page>
  );
};

export default DashboardPage;
