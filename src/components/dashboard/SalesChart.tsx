import React, { useMemo } from "react";
import dayjs from "dayjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Dropdown } from "@/components/ui";
import { formatCurrency } from "@/utils";
import { TrendingUp, TrendingDown, ChevronDown, Calendar } from "lucide-react";
import clsx from "clsx";

export interface GraphDataPoint {
  date: string;
  omset_franchise?: number;
  omset_pos?: number;
}

interface SalesChartProps {
  data?: GraphDataPoint[];
  isLoading?: boolean;
  title?: string;
  selectedYear?: number;
  selectedMonth?: string;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: string) => void;
}

// Month data for the filter
const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

// Premium glassmorphic tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);

    return (
      <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 ring-1 ring-black/5">
        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {label}
        </p>
        <div className="space-y-2.5">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {entry.name === "omset_franchise" ? "Franchise" : "POS"}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-sm font-bold text-slate-800">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Mini stat card for trend summary
const MiniStatCard = ({
  label,
  value,
  trend,
  trendValue,
}: {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
    <div
      className={clsx(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold",
        trend === "up"
          ? "bg-green-100 text-green-600"
          : trend === "down"
            ? "bg-red-100 text-red-600"
            : "bg-slate-100 text-slate-500",
      )}
    >
      {trend === "up" ? (
        <TrendingUp className="w-3 h-3" />
      ) : trend === "down" ? (
        <TrendingDown className="w-3 h-3" />
      ) : null}
      {trendValue}
    </div>
  </div>
);

// Period filter component - compact trigger with dropdown
export const PeriodFilter = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: {
  selectedYear: number;
  selectedMonth: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: string) => void;
}) => {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().format("MM");

  const selectedMonthLabel =
    MONTHS.find((m) => m.value === selectedMonth)?.label || "";
  const isCurrentMonth =
    selectedYear === currentYear && selectedMonth === currentMonth;

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onYearChange(currentYear);
    onMonthChange(currentMonth);
  };

  return (
    <Dropdown
      value={`${selectedYear}-${selectedMonth}`}
      onChange={() => {}}
      position="end"
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md rounded-xl transition-all duration-200 group">
          <Calendar className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700">
            {selectedMonthLabel} {selectedYear}
          </span>
          {!isCurrentMonth && (
            <button
              onClick={handleReset}
              className="w-5 h-5 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      }
      contentClassName="p-3 min-w-64"
    >
      {() => (
        <div className="flex flex-col gap-3">
          {/* Year Controls */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2">
            <button
              onClick={() => onYearChange(selectedYear - 1)}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-base font-bold text-slate-800 min-w-16 text-center">
              {selectedYear}
            </span>
            <button
              onClick={() => onYearChange(selectedYear + 1)}
              disabled={selectedYear >= currentYear}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* Month Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-1.5">
            {MONTHS.map((month) => {
              const monthDate = dayjs(`${selectedYear}-${month.value}-01`);
              const isFutureMonth =
                selectedYear === currentYear && monthDate.isAfter(dayjs());
              const isSelected = selectedMonth === month.value;

              return (
                <button
                  key={month.value}
                  onClick={() => !isFutureMonth && onMonthChange(month.value)}
                  disabled={isFutureMonth}
                  className={clsx(
                    "px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200",
                    isSelected
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : isFutureMonth
                        ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600",
                  )}
                >
                  {month.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Dropdown>
  );
};

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  isLoading,
  title = "Tren Penjualan",
}) => {
  // Calculate summary stats
  const stats = useMemo(() => {
    if (!data || data.length < 2) return null;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    const totalLatest = (latest.omset_franchise || 0) + (latest.omset_pos || 0);
    const totalPrevious =
      (previous.omset_franchise || 0) + (previous.omset_pos || 0);
    const totalChange =
      totalPrevious > 0
        ? ((totalLatest - totalPrevious) / totalPrevious) * 100
        : 0;

    const franchiseLatest = latest.omset_franchise || 0;
    const franchisePrevious = previous.omset_franchise || 0;
    const franchiseChange =
      franchisePrevious > 0
        ? ((franchiseLatest - franchisePrevious) / franchisePrevious) * 100
        : 0;

    const posLatest = latest.omset_pos || 0;
    const posPrevious = previous.omset_pos || 0;
    const posChange =
      posPrevious > 0 ? ((posLatest - posPrevious) / posPrevious) * 100 : 0;

    return {
      total: totalLatest,
      totalChange,
      franchise: franchiseLatest,
      franchiseChange,
      pos: posLatest,
      posChange,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="p-6">
          <div className="h-20 bg-slate-50 rounded-xl animate-pulse mb-4" />
          <div className="h-56 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6">
          <div className="h-72 bg-slate-50/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">
                Data grafik tidak tersedia
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
      {/* Premium Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniStatCard
              label="Total Hari Ini"
              value={formatCurrency(stats.total)}
              trend={stats.totalChange >= 0 ? "up" : "down"}
              trendValue={`${stats.totalChange >= 0 ? "+" : ""}${stats.totalChange.toFixed(1)}%`}
            />
            <MiniStatCard
              label="Franchise"
              value={formatCurrency(stats.franchise)}
              trend={stats.franchiseChange >= 0 ? "up" : "down"}
              trendValue={`${stats.franchiseChange >= 0 ? "+" : ""}${stats.franchiseChange.toFixed(1)}%`}
            />
            <MiniStatCard
              label="POS"
              value={formatCurrency(stats.pos)}
              trend={stats.posChange >= 0 ? "up" : "down"}
              trendValue={`${stats.posChange >= 0 ? "+" : ""}${stats.posChange.toFixed(1)}%`}
            />
          </div>
        )}

        {/* Chart */}
        <div className="h-56 w-full outline-none focus:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                {/* Rich premium gradients */}
                <linearGradient
                  id="franchiseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="posGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                {/* Glow effects */}
                <filter
                  id="franchiseGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="posGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Subtle grid */}
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="#e2e8f0"
                strokeOpacity={0.6}
              />
              {/* Clean X Axis */}
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                dy={8}
                tickMargin={8}
              />
              {/* Enhanced Y Axis */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                tickFormatter={(value) => {
                  if (value >= 10000000)
                    return `${(value / 10000000).toFixed(1)}Jt`;
                  if (value >= 1) return `${(value / 1).toFixed(0)}Rb`;
                  return value;
                }}
                dx={-8}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Premium legend */}
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: "12px",
                }}
                formatter={(value) => (
                  <span className="text-xs font-medium text-slate-500">
                    {value === "omset_franchise" ? "Franchise" : "POS"}
                  </span>
                )} // Changed line to remove syntax error
              />
              {/* Franchise Area - Purple */}
              <Area
                type="monotone"
                dataKey="omset_franchise"
                name="omset_franchise"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#franchiseGradient)"
                animationDuration={1200}
                animationEasing="ease-out"
                filter="url(#franchiseGlow)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#8b5cf6",
                  stroke: "#fff",
                  strokeWidth: 2,
                  filter: "url(#franchiseGlow)",
                }}
              />
              {/* POS Area - Blue */}
              <Area
                type="monotone"
                dataKey="omset_pos"
                name="omset_pos"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#posGradient)"
                animationDuration={1200}
                animationEasing="ease-out"
                filter="url(#posGlow)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 2,
                  filter: "url(#posGlow)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
