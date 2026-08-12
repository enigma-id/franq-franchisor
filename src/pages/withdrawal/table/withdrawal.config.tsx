import config from "@/services/table/const";
import { Badge, Dropdown } from "@/components/ui";
import { Eye, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import type { WithdrawalRequest } from "@/services/types";
import { currencyFormat, getStatusVariant } from "@/utils";

const createTableConfig = ({
  onView,
  onApprove,
  onReject,
}: {
  onView?: (row: WithdrawalRequest) => void;
  onApprove?: (row: WithdrawalRequest) => void;
  onReject?: (row: WithdrawalRequest) => void;
}) => ({
  ...config,
  url: "/withdrawal-request",
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      class: "font-medium",
      component: (row: WithdrawalRequest) => (
        <span className="text-xs font-mono">{row.code || "-"}</span>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      alias: "outlet_id",
      class: "font-medium",
      component: (row: WithdrawalRequest) => (
        <span>{row.outlet?.name || "-"}</span>
      ),
    },
    amount: {
      title: "Jumlah",
      sortable: true,
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: WithdrawalRequest) => (
        <span className="font-semibold">{currencyFormat(row.amount)}</span>
      ),
    },
    document_status: {
      title: "Status",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: WithdrawalRequest) => (
        <Badge variant={getStatusVariant(row.document_status)}>{row.document_status}</Badge>
      ),
    },
    created_at: {
      title: "Tanggal",
      sortable: true,
      class: "text-sm",
      component: (row: WithdrawalRequest) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      sortable: false,
      component: (row: WithdrawalRequest) => (
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
            onSelect={() => onView?.(row)}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">See Detail</span>
                <span className="text-[11px] text-slate-400">View withdrawal info</span>
              </div>
            </button>
          </Dropdown.Item>

          {row.document_status === "pending" && (
            <>
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
                    <span className="text-[11px] text-slate-400">Approve withdrawal</span>
                  </div>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => onReject?.(row)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Reject</span>
                    <span className="text-[11px] text-slate-400">Reject withdrawal</span>
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
