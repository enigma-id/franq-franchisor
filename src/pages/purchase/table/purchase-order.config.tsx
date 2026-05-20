import { Badge } from "@/components";
import config from "@/services/table/const";
import { currencyFormat, dateFormat, getStatusVariant } from "@/utils";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/purchase/order",
  filter,
  onRowClick,
  columns: {
    code: {
      title: "Code",
      component: (row: any) => (
        <div>
          <span className="font-medium uppercase">{row.code}</span>
          <span className="font-medium uppercase">{row.reff_code}</span>
        </div>
      ),
    },
    suppiler: {
      title: "Suppiler",
      component: (row: any) => row?.supplier?.name ?? "-",
    },
    ordered_at: {
      title: "Order At",
      component: (row: any) => dateFormat(row?.ordered_at),
    },
    eta_date: {
      title: "ETA",
      component: (row: any) => dateFormat(row?.eta_date),
    },
    subtotal_nett: {
      title: "Total",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row.subtotal_nett),
    },
    document_status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.document_status?.toLowerCase()}
        </Badge>
      ),
    },
    receiving_status: {
      title: "Receiving",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.receiving_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.receiving_status?.toLowerCase()}
        </Badge>
      ),
    },
    payment_status: {
      title: "Payment",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.payment_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.payment_status?.toLowerCase()}
        </Badge>
      ),
    },
  },
});

export default createTableConfig;
