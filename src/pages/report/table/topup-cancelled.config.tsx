import config from "@/services/table/const";
import { currencyFormat, dateFormat } from "@/utils";
import type { TopupCancelledRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/topup-cancelled",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="text-sm">
          {row?.date ? dateFormat(row.date) : "-"}
        </span>
      ),
    },
    reference_code: {
      title: "Reference Code",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="font-medium text-sm">
          {row?.reference_code ?? "-"}
        </span>
      ),
    },
    membership: {
      title: "Membership",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="font-semibold text-sm">{row?.membership ?? "-"}</span>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="text-sm">{row?.outlet ?? "-"}</span>
      ),
    },
    nominal: {
      title: "Nominal",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: TopupCancelledRow) => currencyFormat(row?.nominal),
    },
    cancelled_reason: {
      title: "Cancelled Reason",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="text-sm">{row?.cancelled_reason ?? "-"}</span>
      ),
    },
    cancelled_by: {
      title: "Cancelled By",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="text-sm">{row?.cancelled_by ?? "-"}</span>
      ),
    },
    cancelled_at: {
      title: "Cancelled At",
      sortable: true,
      component: (row: TopupCancelledRow) => (
        <span className="text-sm">{dateFormat(row?.cancelled_at)}</span>
      ),
    },
  },
});

export default createTableConfig;
