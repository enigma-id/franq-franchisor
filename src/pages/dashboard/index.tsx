/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Loading, MonthPicker } from "@/components/ui";
import {
  TrendingUp,
  Package,
  CreditCard,
  Store,
  Wallet,
  Clock,
  CheckCircle2,
  FileText,
  PieChart,
  ConciergeBell,
  Receipt,
  Users,
  Medal,
  TriangleAlert,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { formatCurrency } from "@/utils";
import { SummaryCard } from "@/components/app";
import { useDashboard } from "@/services/dashboard/hooks";
import SalesChart from "./components/SalesChart";
import OutletMap from "./components/OutletMap";

const THEMES = {
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  purple: { text: "text-violet-500", iconBg: "#ede9fe", wave: "#8b5cf6" },
  rose: { text: "text-rose-500", iconBg: "#ffe4e6", wave: "#f43f5e" },
  teal: { text: "text-teal-500", iconBg: "#ccfbf1", wave: "#14b8a6" },
  indigo: { text: "text-indigo-500", iconBg: "#e0e7ff", wave: "#6366f1" },
  amber: { text: "text-amber-500", iconBg: "#fef3c7", wave: "#f59e0b" },
};

const PipelineCard = ({
  title,
  data,
  icon: Icon,
  theme,
  onClick,
}: {
  title: string;
  data: any;
  icon: any;
  theme: any;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/20 border border-slate-100 h-full ${
      onClick
        ? "cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-150 group"
        : ""
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: theme.iconBg }}
      >
        <Icon className={`w-5 h-5 ${theme.text}`} />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-slate-500">Pending</span>
        </div>
        <span className="text-xs font-bold text-slate-800">
          {data?.pending || 0}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-slate-500">Published</span>
        </div>
        <span className="text-xs font-bold text-slate-800">
          {data?.published || 0}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-700">Completed</span>
        </div>
        <span className="text-xs font-bold text-emerald-600">
          {data?.completed || 0}
        </span>
      </div>
    </div>
  </div>
);

const CompositionCard = ({
  data,
  onClick,
}: {
  data: any;
  onClick?: () => void;
}) => {
  const total = data?.data?.reduce((a: number, b: number) => a + b, 0) || 0;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/20 border border-slate-100 h-full ${
        onClick
          ? "cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-150 group"
          : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-lg shadow-indigo-100">
          <PieChart className="w-5 h-5 text-indigo-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Komposisi Pendapatan
        </h3>
      </div>
      <div className="space-y-3">
        {!data?.labels || data.labels.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm italic">
            Data tidak tersedia
          </div>
        ) : (
          data.labels.map((label: string, i: number) => {
            const value = data.data?.[i] || 0;
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{label}</span>
                  <span>{formatCurrency(value)}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const TopListCard = ({
  title,
  items,
  icon: Icon,
  theme,
  valueLabel,
  onClick,
}: {
  title: string;
  items?: { name: string; qty?: number; revenue: number }[];
  icon: any;
  theme: any;
  valueLabel?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/20 border border-slate-100 h-full ${
      onClick
        ? "cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-150 group"
        : ""
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: theme.iconBg }}
      >
        <Icon className={`w-5 h-5 ${theme.text}`} />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {!items || items.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-slate-400 text-sm italic">
          Data tidak tersedia
        </div>
      ) : (
        items.map((item, i) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-2 min-w-0">
              <Icon className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-medium text-slate-500 truncate">
                {item.name}
              </span>
            </div>
            <div className="flex flex-col items-end leading-tight shrink-0 ml-2">
              {item.qty != null && (
                <span className="text-[10px] text-slate-500">
                  {item.qty} {valueLabel}
                </span>
              )}
              <span className="text-xs font-bold text-slate-800">
                {formatCurrency(item.revenue)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [periode, setPeriode] = React.useState(dayjs().format("YYYY-MM"));
  const { get, getResult } = useDashboard();
  const { data: response, isLoading } = getResult;

  // The API returns the dashboard data directly at the root
  const data = response?.data as any;

  const go = (path: string) => () => navigate(path);

  const fetchData = useCallback(() => {
    get({ periode });
  }, [periode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Main Menu"
        title="Dashboard"
        subtitle="Ringkasan performa bisnis Anda."
        action={<MonthPicker value={periode} onChange={setPeriode} />}
      />

      <Page.Body className="flex flex-col gap-6 pb-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <>
            {/* Sales Chart + Outlet Map — side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <SalesChart
                  data={data?.sales_graph}
                  isLoading={isLoading}
                  title="Performa Penjualan Multi-Saluran"
                />
              </div>
              <div>
                <OutletMap outlets={data?.outlet_map} isLoading={isLoading} />
              </div>
            </div>

            {/* Omset */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SummaryCard
                label="Omset Total"
                value={formatCurrency(data?.omset_total || 0)}
                icon={TrendingUp}
                theme={THEMES.indigo}
              />
              <SummaryCard
                label="Omset POS"
                value={formatCurrency(data?.pos_summary?.omset || 0)}
                icon={TrendingUp}
                theme={THEMES.blue}
                onClick={go(`/report/pos/settlement/daily?periode=${periode}`)}
              />
              <SummaryCard
                label="Omset Franchise"
                value={formatCurrency(data?.omset_franchise || 0)}
                icon={TrendingUp}
                theme={THEMES.purple}
                onClick={go("/report/inventory/product-sales")}
              />
              <SummaryCard
                label="Omset B2B"
                value={formatCurrency(data?.b2b_summary?.omset || 0)}
                icon={TrendingUp}
                theme={THEMES.indigo}
                onClick={go(`/report/b2b/settlement/daily?periode=${periode}`)}
              />
              <SummaryCard
                label="Omset Bahan Baku"
                value={formatCurrency(data?.omset_bahan_baku || 0)}
                icon={Package}
                theme={THEMES.orange}
                onClick={go("/report/inventory/material-sales")}
              />
            </div>

            {/* Middle Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                label="Outstanding POS"
                value={formatCurrency(data?.pos_summary?.outstanding || 0)}
                icon={Receipt}
                theme={THEMES.rose}
                onClick={go("/report/pos/outstanding")}
              />
              <SummaryCard
                label="Outstanding B2B"
                value={formatCurrency(data?.b2b_summary?.outstanding || 0)}
                icon={Receipt}
                theme={THEMES.rose}
                onClick={go("/b2b/order")}
              />
              <SummaryCard
                label="Stok Menipis"
                value={data?.stock_kritis || 0}
                icon={Package}
                theme={THEMES.rose}
                onClick={go("/report/inventory/warehouse-stock")}
              />
              <SummaryCard
                label="Withdrawal Pending"
                value={formatCurrency(data?.withdrawal_pending || 0)}
                icon={Wallet}
                theme={THEMES.amber}
                onClick={go("/withdrawal")}
              />
              <SummaryCard
                label="Outlet Aktif"
                value={`${data?.outlet_aktif || 0} / ${data?.total_outlet || 0}`}
                icon={Store}
                theme={THEMES.teal}
                onClick={go("/setting/outlet")}
              />
              <SummaryCard
                label="Total Saldo Membership"
                value={formatCurrency(data?.total_saldo_membership || 0)}
                icon={Users}
                theme={THEMES.purple}
              />
              <SummaryCard
                label="Rencana Produksi"
                value={`${data?.production_plan_summary?.completed || 0} / ${data?.production_plan_summary?.plan || 0}`}
                icon={Package}
                theme={THEMES.indigo}
                onClick={go("/production/plan")}
              />
            </div>

            {/* Top Menu / Top Member / Top Outlet / Top Outstanding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TopListCard
                title="Top Menu"
                items={data?.top_menu?.map((m: any) => ({
                  name: m.menu_name,
                  qty: m.total_qty,
                  revenue: m.total_revenue,
                }))}
                icon={ConciergeBell}
                theme={THEMES.orange}
                valueLabel="ORDER"
              />
              <TopListCard
                title="Top Member"
                items={data?.top_member?.map((mb: any) => ({
                  name: mb.member_name,
                  revenue: mb.saldo,
                }))}
                icon={Medal}
                theme={THEMES.green}
              />
              <TopListCard
                title="Top Outlet"
                items={data?.top_outlet?.map((o: any) => ({
                  name: o.outlet_name,
                  qty: o.total_qty,
                  revenue: o.total_revenue,
                }))}
                icon={Store}
                theme={THEMES.teal}
                valueLabel="ORDER"
              />
              <TopListCard
                title="Top Outstanding Bills"
                items={data?.top_outstanding_outlets?.map((o: any) => ({
                  name: o.outlet_name,
                  qty: o.order_count,
                  revenue: o.total_outstanding,
                }))}
                icon={TriangleAlert}
                theme={THEMES.rose}
                valueLabel="ORDER"
              />
            </div>

            {/* Pipeline & Composition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PipelineCard
                title="Pipeline Sales Order"
                data={data?.so_pipeline}
                icon={TrendingUp}
                theme={THEMES.indigo}
                onClick={go("/sales/order")}
              />
              <PipelineCard
                title="Pipeline Purchase Order"
                data={data?.po_pipeline}
                icon={CreditCard}
                theme={THEMES.rose}
                onClick={go("/purchase/order")}
              />
              <CompositionCard data={data?.revenue_composition} />
            </div>

          </>
        )}
      </Page.Body>
    </Page>
  );
};

export default DashboardPage;
