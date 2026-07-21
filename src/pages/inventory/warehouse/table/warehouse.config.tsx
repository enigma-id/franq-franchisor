import config from "@/services/table/const";
import type { WarehouseDetail } from "@/services/types";
import { Building, Warehouse } from "lucide-react";

const typeBadge = (type: string) => {
  const styles: Record<string, string> = {
    default: "bg-purple-50 text-purple-700",
    production: "bg-amber-50 text-amber-700",
  };
  const labels: Record<string, string> = {
    default: "Default",
    production: "Production",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles[type] || "bg-slate-100 text-slate-500"}`}>
      {labels[type] || type || "-"}
    </span>
  );
};

const createTableConfig = () => ({
  ...config,
  url: "/warehouse",
  columns: {
    name: {
      title: "Nama Gudang",
      sortable: true,
      component: (row: WarehouseDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <Building size={16} />
          </div>
          <span className="font-bold text-slate-700">{row.name}</span>
        </div>
      ),
    },
    type: {
      title: "Tipe",
      sortable: true,
      align: "center",
      component: (row: WarehouseDetail) => typeBadge(row.type),
    },
    address: {
      title: "Alamat",
      component: (row: WarehouseDetail) => (
        <span className="text-slate-600 font-medium">{row.address || "-"}</span>
      ),
    },
  },
});

export default createTableConfig;
