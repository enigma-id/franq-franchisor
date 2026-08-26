import config from "@/services/table/const";
import { Badge, Dropdown } from "@/components/ui";
import type { B2BOrderDetail } from "@/services/types";
import { getStatusVariant, formatDate, formatDateTime } from "@/utils";
import {
  Eye,
  MoreVertical,
  Trash,
  Truck,
  FileText,
  Wallet,
  Edit,
  XCircle,
} from "lucide-react";

const createTableConfig = ({
  onClick,
  onEdit,
  onRemove,
  onShip,
  onInvoice,
  onPay,
  onCancel,
  canManage,
  canCancel,
}: {
  onClick?: (row: B2BOrderDetail) => void;
  onEdit?: (row: B2BOrderDetail) => void;
  onRemove?: (row: B2BOrderDetail) => void;
  onShip?: (row: B2BOrderDetail) => void;
  onInvoice?: (row: B2BOrderDetail) => void;
  onPay?: (row: B2BOrderDetail) => void;
  onCancel?: (row: B2BOrderDetail) => void;
  canManage: boolean;
  canCancel: boolean;
}) => ({
  ...config,
  url: "/b2b/order",
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      class: "font-medium",
      component: (row: B2BOrderDetail) => (
        <div>
          <span className='font-medium block'>{row.code}</span>
          <span className='text-xs text-gray-500 block'>
            {formatDateTime(row.created_at)}
          </span>
        </div>
      ),
    },
    document_status: {
      title: "Status",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: B2BOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          size='xs'
          className='px-2.5 font-semibold text-[10px] tracking-wider'
        >
          {row.document_status?.toLowerCase()}
        </Badge>
      ),
    },
    payment_status: {
      title: "Pembayaran",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: B2BOrderDetail) => (
        <Badge
          variant={getStatusVariant(row.payment_status)}
          size='xs'
          className='px-2.5 font-semibold text-[10px] tracking-wider'
        >
          {row.payment_status?.toLowerCase()}
        </Badge>
      ),
    },
    total_charges: {
      title: "Total",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: B2BOrderDetail) => (
        <span className='font-semibold'>
          {row.total_charges?.toLocaleString("id-ID")}
        </span>
      ),
    },
    shipping_date: {
      title: "Tgl Kirim",
      sortable: true,
      class: "text-sm",
      component: (row: B2BOrderDetail) => (
        <span>{formatDate(row.shipping_date)}</span>
      ),
    },
    invoice_date: {
      title: "Tgl Invoice",
      sortable: true,
      class: "text-sm",
      component: (row: B2BOrderDetail) => (
        <span>{row.invoice_date ? formatDate(row.invoice_date) : "-"}</span>
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
            <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
              <MoreVertical className='w-5 h-5 text-slate-600' />
            </button>
          }
          position='end'
          contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
        >
          <Dropdown.Item
            onSelect={() => onClick?.(row)}
            className='hover:bg-green-50 hover:text-green-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success'>
                <Eye className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>See Detail</span>
                <span className='text-[11px] text-slate-400'>
                  View order info
                </span>
              </div>
            </button>
          </Dropdown.Item>

          {canManage && row.document_status !== "cancelled" && (
            <Dropdown.Item
              onSelect={() => onEdit?.(row)}
              className='hover:bg-indigo-50 hover:text-indigo-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600'>
                  <Edit className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Edit</span>
                  <span className='text-[11px] text-slate-400'>
                    Modify order
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}

          {canManage && row.document_status === "pending" && (
            <>
              <Dropdown.Item
                onSelect={() => onShip?.(row)}
                className='hover:bg-amber-50 hover:text-amber-600'
              >
                <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600'>
                    <Truck className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Ship</span>
                    <span className='text-[11px] text-slate-400'>
                      Mark as shipped
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}

          {canManage &&
            row.document_status === "pending" &&
            row.payment_status === "unpaid" && (
              <Dropdown.Item
                onSelect={() => onRemove?.(row)}
                className='hover:bg-red-50 hover:text-red-600'
              >
                <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                    <Trash className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Delete</span>
                    <span className='text-[11px] text-slate-400'>
                      Remove order
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            )}

          {canManage &&
            row.document_status !== "cancelled" &&
            row.payment_status === "unpaid" && (
            <Dropdown.Item
              onSelect={() => onInvoice?.(row)}
              className='hover:bg-purple-50 hover:text-purple-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600'>
                  <FileText className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Invoice</span>
                  <span className='text-[11px] text-slate-400'>
                    Send invoice
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}

          {canManage && row.payment_status === "invoiced" && (
            <Dropdown.Item
              onSelect={() => onPay?.(row)}
              className='hover:bg-emerald-50 hover:text-emerald-600'
            >
              <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
                <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600'>
                  <Wallet className='w-4 h-4' />
                </div>
                <div className='flex flex-col items-start leading-tight'>
                  <span className='font-bold text-[13px]'>Pay</span>
                  <span className='text-[11px] text-slate-400'>
                    Mark as paid
                  </span>
                </div>
              </button>
            </Dropdown.Item>
          )}

          {canCancel &&
            row.document_status !== "cancelled" &&
            (row.document_status !== "pending" ||
              row.payment_status !== "unpaid") && (
              <Dropdown.Item
                onSelect={() => onCancel?.(row)}
                className='hover:bg-red-50 hover:text-red-600'
              >
                <button className='flex items-center gap-3 py-1 rounded-xl text-slate-700'>
                  <div className='w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600'>
                    <XCircle className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col items-start leading-tight'>
                    <span className='font-bold text-[13px]'>Cancel</span>
                    <span className='text-[11px] text-slate-400'>
                      Cancel order
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
