import config from "@/services/table/const";
import type { WarehouseDetail } from "@/services/types/purchase";
import { Building } from "lucide-react";

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
    address: {
      title: "Alamat",
      component: (row: WarehouseDetail) => (
        <span className="text-slate-600 font-medium">{row.address || "-"}</span>
      ),
    },
  },
});

export default createTableConfig;
