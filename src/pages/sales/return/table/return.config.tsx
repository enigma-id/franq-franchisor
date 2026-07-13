import config from "@/services/table/const";
import type { SalesReturnDetail } from "@/services/types/sales";
import { Badge, Dropdown } from "@/components/ui";
import { CheckCircle2, Eye, MoreVertical, RefreshCcw } from "lucide-react";
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
  onApprove,
}: {
  onView: (id: string) => void;
  onApprove?: (row: SalesReturnDetail) => void;
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
        <Badge
          variant={statusVariant(row.status)}
          className="px-3 py-1 rounded-full text-xs"
        >
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
    action: {
      title: "",
      class: "text-right",
      sortable: false,
      align: "right",
      component: (row: SalesReturnDetail) => (
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          }
          position="end"
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2"
        >
          <Dropdown.Item
            onSelect={() => onView?.(row?.id)}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">
                  See sales return info
                </span>
              </div>
            </button>
          </Dropdown.Item>
          {row?.status === "pending" && (
            <Dropdown.Item
              onSelect={() => onApprove?.(row)}
              className="hover:bg-emerald-50 hover:text-emerald-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Approve</span>
                  <span className="text-[11px] text-slate-400">
                    Approve sales return
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
