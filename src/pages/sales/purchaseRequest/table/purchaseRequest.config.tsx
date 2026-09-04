import config from "@/services/table/const";
import { formatDate, getStatusVariant, formatDateTime } from "@/utils";
import { Badge, Dropdown } from "@/components/ui";
import type { SalesOrderDetail } from "@/services/types/sales";
import { Edit, Eye, MoreVertical, Trash, Check } from "lucide-react";

const createTableConfig = ({
  onClick,
  onRemove,
  onEdit,
  onPublish,
  filter,
  canManage,
}: {
  onClick?: (row: SalesOrderDetail) => void;
  onRemove?: (row: SalesOrderDetail) => void;
  onEdit?: (row: SalesOrderDetail) => void;
  onPublish?: (row: SalesOrderDetail) => void;
  filter?: Record<string, unknown>;
  canManage?: boolean;
}) => ({
  ...config,
  url: "/sales/order",
  lockedFilter: { order_type: "request" },
  filter,
  columns: {
    code: {
      title: "Code",
      sortable: true,
      component: (row: SalesOrderDetail) => (
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-medium block">{row.code}</span>
            <span className="text-xs text-gray-500 block">
              {formatDateTime(row.created_at)}
            </span>
          </div>
        </div>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      alias: "outlet_id",
      component: (row: SalesOrderDetail) => (
        <div>
          <span className="font-medium block">
            {row.outlet?.name?.toUpperCase() ?? "-"}
          </span>
          <span className="text-xs text-gray-500 block">
            {row.outlet?.phone ?? ""}
          </span>
        </div>
      ),
    },
    warehouse_name: {
      title: "Warehouse",
      component: (row: SalesOrderDetail) => (
        <span className="text-slate-600 font-medium">
          {row.warehouse_name || "-"}
        </span>
      ),
    },
    total_charges: {
      title: "Total (Rp)",
      headerClass: "text-end!",
      class: "text-end!",
      sortable: true,
      format_number: true,
      width: 200,
    },
    shipping_date: {
      title: "Tanggal Request",
      sortable: true,
      class: "text-center",
      align: "center",
      component: (row: SalesOrderDetail) => (
        <span className="font-medium">{formatDate(row.shipping_date)}</span>
      ),
    },
    document_status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: SalesOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          size="xs"
          className="px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.document_status?.toLowerCase()}
        </Badge>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      sortable: false,
      align: "right",
      component: (row: SalesOrderDetail) => (
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
            onSelect={() => onClick?.(row)}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Lihat Detail</span>
                <span className="text-[11px] text-slate-400">Detail purchase request</span>
              </div>
            </button>
          </Dropdown.Item>
          {canManage && row?.document_status === "pending" && (
            <>
              <Dropdown.Item
                onSelect={() => onPublish?.(row)}
                className="hover:bg-emerald-50 hover:text-emerald-600"
              >
                <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Approve</span>
                    <span className="text-[11px] text-slate-400">Setujui purchase request</span>
                  </div>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => onEdit?.(row)}
                className="hover:bg-indigo-50 hover:text-indigo-600"
              >
                <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Edit</span>
                    <span className="text-[11px] text-slate-400">Ubah purchase request</span>
                  </div>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => onRemove?.(row)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <Trash className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Delete</span>
                    <span className="text-[11px] text-slate-400">Hapus purchase request</span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
