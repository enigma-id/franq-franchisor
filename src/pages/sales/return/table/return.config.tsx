import config from "@/services/table/const";
import type { SalesReturnDetail } from "@/services/types/sales";
import { Badge, Button } from "@/components/ui";
import { RefreshCcw } from "lucide-react";
import dayjs from "dayjs";

const statusVariant = (status: string) => {
  if (status === "approved" || status === "active") return "success";
  if (status === "rejected") return "error";
  return "warning";
};

const statusLabel = (status: string) => {
  if (status === "approved" || status === "active") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
};

const createTableConfig = ({
  onView,
}: {
  onView: (id: string) => void;
}) => ({
  ...config,
  url: "/sales/return",
  columns: {
    date: {
      title: "Tanggal Return",
      sortable: true,
      component: (row: SalesReturnDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <RefreshCcw size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {dayjs(row.date).format("DD MMM YYYY")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {row.number}
            </span>
          </div>
        </div>
      ),
    },
    sales_order_id: {
      title: "Order ID",
      component: (row: SalesReturnDetail) => (
        <span className="text-slate-600 font-medium font-mono text-[12px]">
          {row.sales_order_id}
        </span>
      ),
    },
    status: {
      title: "Status",
      component: (row: SalesReturnDetail) => (
        <Badge variant={statusVariant(row.status)} className="px-3 py-1 rounded-full text-xs">
          {statusLabel(row.status)}
        </Badge>
      ),
    },
    items: {
      title: "Jumlah Barang",
      component: (row: SalesReturnDetail) => (
        <span className="text-slate-600 font-medium">
          {row.items?.length || 0} Item
        </span>
      ),
    },
    id: {
      title: "Aksi",
      headerClass: "text-right",
      class: "text-right",
      component: (row: SalesReturnDetail) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold"
          onClick={() => onView(row.id)}
        >
          Detail
        </Button>
      ),
    },
  },
});

export default createTableConfig;
