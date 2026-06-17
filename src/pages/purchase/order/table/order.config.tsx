import config from "@/services/table/const";
import type { PurchaseOrderDetail } from "@/services/types/purchase";
import { Badge, Button } from "@/components/ui";
import { ShoppingCart } from "lucide-react";
import { formatCurrency, getStatusVariant, formatDate } from "@/utils";

const createTableConfig = ({
  onEdit,
}: {
  onEdit: (id: string) => void;
}) => ({
  ...config,
  url: "/purchase/order",
  columns: {
    purchase_date: {
      title: "Tanggal",
      sortable: true,
      component: (row: PurchaseOrderDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <ShoppingCart size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {formatDate(row.purchase_date, "DD MMM YYYY")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {row.code}
            </span>
          </div>
        </div>
      ),
    },
    supplier: {
      title: "Supplier",
      component: (row: PurchaseOrderDetail) => (
        <span className="text-slate-600 font-medium">
          {(row as any).supplier?.name || "-"}
        </span>
      ),
    },
    grand_total: {
      title: "Total",
      sortable: true,
      component: (row: PurchaseOrderDetail) => (
        <span className="font-bold text-primary">
          {formatCurrency(row.grand_total)}
        </span>
      ),
    },
    status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: PurchaseOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.status?.toLowerCase()}
        </Badge>
      ),
    },
    id: {
      title: "Aksi",
      class: "text-right",
      align: "right",
      component: (row: PurchaseOrderDetail) => (
        <Button
          variant="ghost"
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
