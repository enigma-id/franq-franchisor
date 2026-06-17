/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, dateFormat, getStatusVariant, formatDateTime } from "@/utils";
import { Badge } from "@/components/ui";
import type { SalesOrderDetail } from "@/services/types/sales";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: SalesOrderDetail) => void;
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
      component: (row: SalesOrderDetail) => (
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-medium block">{row.code}</span>
            <span className="text-xs text-gray-500 block">
              {formatDateTime(row.ordered_at)} WIB
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
      component: (row: SalesOrderDetail) => (
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
      component: (row: SalesOrderDetail) => currencyFormat(row.total_bill),
    },
    shipping_date: {
      title: "Shipment Date",
      sortable: true,
      class: "text-center",
      align: "center",
      component: (row: SalesOrderDetail) => (
        <span className="font-medium">{dateFormat(row.shipping_date)}</span>
      ),
    },
    order_status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: SalesOrderDetail) => (
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
      component: (row: SalesOrderDetail) => (
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
      component: (row: SalesOrderDetail) => (
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
