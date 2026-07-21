import config from "@/services/table/const";
import type { PurchaseOrderDetail } from "@/services/types/purchase";
import { Badge, Dropdown } from "@/components/ui";
import { Edit, Eye, MoreVertical, ShoppingCart, Trash, Check, CreditCard } from "lucide-react";
import { formatCurrency, getStatusVariant, formatDate } from "@/utils";

const createTableConfig = ({
  onClick,
  onRemove,
  onEdit,
  onPublish,
  onPaid,
  filter,
}: {
  onClick?: (row: PurchaseOrderDetail) => void;
  onRemove?: (row: PurchaseOrderDetail) => void;
  onEdit?: (row: PurchaseOrderDetail) => void;
  onPublish?: (row: PurchaseOrderDetail) => void;
  onPaid?: (row: PurchaseOrderDetail) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/purchase/order",
  filter,
  columns: {
    created_at: {
      title: "Tanggal",
      sortable: true,
      component: (row: PurchaseOrderDetail) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <ShoppingCart size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {formatDate(row.created_at, "DD MMM YYYY")}
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
          {row.supplier?.name || "-"}
        </span>
      ),
    },
    warehouse_name: {
      title: "Warehouse",
      component: (row: PurchaseOrderDetail) => (
        <span className="text-slate-600 font-medium">
          {row.warehouse_name || "-"}
        </span>
      ),
    },
    total_charges: {
      title: "Total",
      sortable: true,
      component: (row: PurchaseOrderDetail) => (
        <span className="font-bold text-primary">
          {formatCurrency(row.total_charges)}
        </span>
      ),
    },
    document_status: {
      title: "Status Dokumen",
      class: "text-center",
      align: "center",
      component: (row: PurchaseOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.document_status?.toLowerCase() || "-"}
        </Badge>
      ),
    },
    receiving_status: {
      title: "Status Penerimaan",
      class: "text-center",
      align: "center",
      component: (row: PurchaseOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.receiving_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.receiving_status?.toLowerCase() || "-"}
        </Badge>
      ),
    },
    payment_status: {
      title: "Status Pembayaran",
      class: "text-center",
      align: "center",
      component: (row: PurchaseOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.payment_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.payment_status?.toLowerCase() || "-"}
        </Badge>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      sortable: false,
      align: "right",
      component: (row: PurchaseOrderDetail) => (
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
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">
                  See purchase order info
                </span>
              </div>
            </button>
          </Dropdown.Item>
          {row?.document_status === "pending" && (
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
                    <span className="font-bold text-[13px]">Publish</span>
                    <span className="text-[11px] text-slate-400">Approve purchase order</span>
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
                    <span className="text-[11px] text-slate-400">
                      Modify purchase order info
                    </span>
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
                    <span className="text-[11px] text-slate-400">
                      Remove purchase order
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}

          {row?.payment_status === "unpaid" && row?.document_status !== "pending" && (
            <Dropdown.Item
              onSelect={() => onPaid?.(row)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Paid</span>
                  <span className="text-[11px] text-slate-400">Mark as paid</span>
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
