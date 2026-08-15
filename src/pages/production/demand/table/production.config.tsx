/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/demand/production",
  filter,
  columns: {
    code: {
      title: "Code",
      sortable: true,
      component: (row: any) => (
        <span className="font-bold text-slate-700">{row.code}</span>
      ),
    },
    name: {
      title: "Item",
      sortable: true,
      component: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{row.name}</span>
          {row.alias_name && (
            <span className="text-[11px] text-slate-400 font-medium">
              {row.alias_name.trim()}
            </span>
          )}
        </div>
      ),
    },
    stock_available: {
      title: "Stok",
      align: "right",
      class: "text-right",
      component: (row: any) => (
        <span className="font-medium text-slate-600">
          {row.stock_available} {row.default_fraction}
        </span>
      ),
    },
    quantity_need: {
      title: "Kebutuhan",
      align: "right",
      class: "text-right",
      component: (row: any) => (
        <span className="font-bold text-primary">
          {row.quantity_need} {row.default_fraction}
        </span>
      ),
    },
    diff: {
      title: "Selisih",
      align: "right",
      class: "text-right",
      component: (row: any) => (
        <span className={`font-bold ${row.diff < 0 ? "text-red-500" : "text-emerald-500"}`}>
          {row.diff} {row.default_fraction}
        </span>
      ),
    },
  },
});

export default createTableConfig;