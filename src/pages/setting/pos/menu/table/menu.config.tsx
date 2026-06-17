import config from "@/services/table/const";
import type { POSMenuDetail } from "@/services/types/pos";
import { Badge, Button } from "@/components/ui";
import { UtensilsCrossed } from "lucide-react";
import { formatCurrency, getStatusVariant } from "@/utils";

const createTableConfig = ({ onEdit }: { onEdit: (id: string) => void }) => ({
  ...config,
  url: "/pos/menu",
  columns: {
    name: {
      title: "Nama Menu",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed size={16} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">{row.name}</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {(row as any).category?.name || "Tanpa Kategori"}
            </span>
          </div>
        </div>
      ),
    },
    base_price: {
      title: "Harga Dasar",
      sortable: true,
      component: (row: POSMenuDetail) => (
        <span className="font-medium text-slate-600">
          {formatCurrency(row.base_price)}
        </span>
      ),
    },
    is_active: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: POSMenuDetail) => (
        <Badge
          variant={getStatusVariant(row.is_active ? "active" : "inactive")}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.is_active ? "aktif" : "non-aktif"}
        </Badge>
      ),
    },
    action: {
      title: "",
      headerClass: "text-right",
      class: "text-right",
      component: (row: POSMenuDetail) => (
        <Button
          size="sm"
          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold"
          onClick={() => onEdit(row.id)}
        >
          Detail
        </Button>
      ),
    },
  },
});

export default createTableConfig;
