import config from "@/services/table/const";
import { currencyFormat, dateFormat, getStatusVariant } from "@/utils";
import { Badge } from "@/components/ui";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/sales/order",
  filter,
  onRowClick,
  columns: {
    code: {
      title: "Code",
      sortable: true,
      component: (row: any) => (
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-medium block">{row.code}</span>
            <span className="text-xs text-gray-500 block">
              {dateFormat(row.ordered_at, "DD/MM/YYYY HH:mm")} WIB
            </span>
          </div>
          {row.type && (
            <Badge
              variant={getStatusVariant(row.type)}
              size="xs"
              className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
            >
              {row.type?.toLowerCase()}
            </Badge>
          )}
        </div>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-medium block">
            {row.outlet?.alias?.toUpperCase() ?? "-"}
          </span>
          <span className="text-xs text-gray-500 block">
            {row.outlet?.phone ?? ""}
          </span>
        </div>
      ),
    },
    total_bill: {
      title: "Total (Rp)",
      sortable: true,
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row.total_bill),
    },
    shipping_date: {
      title: "Shipment Date",
      sortable: true,
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <span className="font-medium">{dateFormat(row.shipping_date)}</span>
      ),
    },
    order_status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.order_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.order_status?.toLowerCase()}
        </Badge>
      ),
    },
    delivery_status: {
      title: "Delivery",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.delivery_status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.delivery_status?.toLowerCase()}
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
