/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { formatCurrency } from "@/utils";
import { TrendingUp, BarChart2 } from "lucide-react";
import type { SalesGraph } from "@/services/types";

interface SalesChartProps {
  data?: SalesGraph;
  isLoading?: boolean;
  title?: string;
  selectedYear?: number;
  selectedMonth?: string;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: string) => void;
}

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

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
                  {entry.name}
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

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  isLoading,
  title = "Tren Penjualan",
}) => {
  const chartData = useMemo(() => {
    if (!data?.labels || !data?.series) return [];
    return data.labels.map((label, index) => {
      const point: any = { date: label };

      // IMPORTANT:
      // Area uses dataKey={s.name}, so the object key here must match s.name exactly.
      data.series.forEach((s) => {
        point[s.name] = s.data[index] || 0;
      });

      return point;
    });
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

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        <div className="p-6">
          <div className="h-72 bg-slate-50/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-slate-300" />
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
    <div className="w-full rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden min-h-fit">
      <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-white to-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
          </div>
        </div>
      </div>

      <div className="p-6 pt-4">
        <div className="h-72 w-full outline-none focus:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                {data.series.map((_s, i) => (
                  <React.Fragment key={i}>
                    <linearGradient
                      id={`gradient-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={COLORS[i % COLORS.length]}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="50%"
                        stopColor={COLORS[i % COLORS.length]}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="100%"
                        stopColor={COLORS[i % COLORS.length]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </React.Fragment>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="#e2e8f0"
                strokeOpacity={0.6}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                tickFormatter={(value) => dayjs(value).format("DD MMM")}
                dy={8}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                tickFormatter={(value) => {
                  if (value >= 1000000)
                    return `${(value / 1000000).toFixed(1)}Jt`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}Rb`;
                  return value;
                }}
                dx={-8}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
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
                    {value}
                  </span>
                )}
              />
              {data.series.map((s, i) => (
                <Area
                  key={i}
                  type="monotone"
                  dataKey={s.name}
                  name={s.name}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  fill={`url(#gradient-${i})`}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: COLORS[i % COLORS.length],
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
