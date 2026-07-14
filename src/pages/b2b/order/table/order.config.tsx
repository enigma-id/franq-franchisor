import config from "@/services/table/const";
import { Badge, Dropdown } from "@/components/ui";
import type { B2BOrderDetail } from "@/services/types";
import {
  Eye,
  MoreVertical,
  Trash,
  Truck,
  PackageCheck,
  FileText,
  Wallet,
  Edit,
} from "lucide-react";

const createTableConfig = ({
  onClick,
  onEdit,
  onRemove,
  onShip,
  onReceive,
  onInvoice,
  onPay,
}: {
  onClick?: (row: B2BOrderDetail) => void;
  onEdit?: (row: B2BOrderDetail) => void;
  onRemove?: (row: B2BOrderDetail) => void;
  onShip?: (row: B2BOrderDetail) => void;
  onReceive?: (row: B2BOrderDetail) => void;
  onInvoice?: (row: B2BOrderDetail) => void;
  onPay?: (row: B2BOrderDetail) => void;
}) => ({
  ...config,
  url: "/b2b/order",
  columns: {
    code: {
      title: "Kode",
      class: "font-medium",
      component: (row: B2BOrderDetail) => (
        <div>
          <span className="font-medium block">{row.code}</span>
          <span className="text-xs text-gray-500 block">
            {new Date(row.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>
      ),
    },
    customer_name: { title: "Pelanggan" },
    document_status: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: B2BOrderDetail) => {
        let variant:
          | "default"
          | "primary"
          | "secondary"
          | "accent"
          | "info"
          | "success"
          | "warning"
          | "error" = "default";
        if (row.document_status === "pending") variant = "warning";
        if (row.document_status === "shipped") variant = "info";
        if (row.document_status === "received") variant = "primary";
        if (row.document_status === "invoiced") variant = "success";
        return (
          <Badge
            variant={variant}
            size="xs"
            className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
          >
            {row.document_status?.toLowerCase()}
          </Badge>
        );
      },
    },
    payment_status: {
      title: "Pembayaran",
      class: "text-center",
      headerClass: "text-center",
      component: (row: B2BOrderDetail) => (
        <Badge
          variant={row.payment_status === "paid" ? "success" : "warning"}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.payment_status?.toLowerCase()}
        </Badge>
      ),
    },
    total_charges: {
      title: "Total",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: B2BOrderDetail) => (
        <span className="font-semibold">
          {row.total_charges?.toLocaleString("id-ID")}
        </span>
      ),
    },
    shipping_date: {
      title: "Tgl Kirim",
      class: "text-sm",
      component: (row: B2BOrderDetail) => (
        <span>{new Date(row.shipping_date).toLocaleDateString("id-ID")}</span>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      sortable: false,
      align: "right",
      component: (row: B2BOrderDetail) => (
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
                  View order info
                </span>
              </div>
            </button>
          </Dropdown.Item>

          {row.document_status === "pending" && (
            <>
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
                      Modify order
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => onShip?.(row)}
                className="hover:bg-amber-50 hover:text-amber-600"
              >
                <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Ship</span>
                    <span className="text-[11px] text-slate-400">
                      Mark as shipped
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
                      Remove order
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}

          {row.document_status === "shipped" && (
            <Dropdown.Item
              onSelect={() => onReceive?.(row)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Receive</span>
                  <span className="text-[11px] text-slate-400">
                    Mark as received
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}

          {row.document_status === "received" && row.payment_status === "unpaid" && (
            <Dropdown.Item
              onSelect={() => onInvoice?.(row)}
              className="hover:bg-purple-50 hover:text-purple-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Invoice</span>
                  <span className="text-[11px] text-slate-400">
                    Generate invoice
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}

          {row.payment_status === "unpaid" && (
            <Dropdown.Item
              onSelect={() => onPay?.(row)}
              className="hover:bg-emerald-50 hover:text-emerald-600"
            >
              <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold text-[13px]">Pay</span>
                  <span className="text-[11px] text-slate-400">
                    Mark as paid
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
