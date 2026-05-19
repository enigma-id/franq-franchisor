import config from "@/services/table/const";
import { currencyFormat, dateFormat } from "@/utils";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/pos/order/outstanding",
  filter,
  onRowClick,
  columns: {
    code: {
      title: "Code",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold text-sm">{row?.code ?? "-"}</span>
      ),
    },
    ordered_at: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => dateFormat(row?.ordered_at, "DD/MM/YYYY HH:mm"),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.session?.outlet?.name ?? "-"}
        </span>
      ),
    },
    cashier: {
      title: "Kasir",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.session?.cashier?.name ?? "-"}
        </span>
      ),
    },
    ticket: {
      title: "Bill Name",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.ticket ?? "-"}
        </span>
      ),
    },
    membership: {
      title: "Customer",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.membership?.name?.toUpperCase() ?? "-"}
        </span>
      ),
    },
    total_charges: {
      title: "Total Charges",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.total_charges),
    },
  },
});

export default createTableConfig;