import config from "@/services/table/const";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WithdrawalRequest } from "@/services/types";
import { currencyFormat } from "@/utils";

const createTableConfig = ({
  onView,
}: {
  onView?: (row: WithdrawalRequest) => void;
}) => ({
  ...config,
  url: "/withdrawal-request",
  columns: {
    outlet: {
      title: "Outlet",
      class: "font-medium",
      component: (row: WithdrawalRequest) => (
        <span>{row.outlet?.name || "-"}</span>
      ),
    },
    amount: {
      title: "Jumlah",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: WithdrawalRequest) => (
        <span className="font-semibold">{currencyFormat(row.amount)}</span>
      ),
    },
    status: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: WithdrawalRequest) => {
        let variant: "default" | "success" | "error" | "warning" = "default";
        if (row.status === "approved") variant = "success";
        if (row.status === "rejected") variant = "error";
        if (row.status === "pending") variant = "warning";
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    created_at: {
      title: "Tanggal",
      class: "text-sm",
      component: (row: WithdrawalRequest) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    action: {
      title: "",
      width: 64,
      component: (row: WithdrawalRequest) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => onView?.(row)}
          >
            <Eye size={16} />
          </Button>
        </div>
      ),
    },
  },
});

export default createTableConfig;
