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
  url: "/report/pos/order/item",
  filter,
  onRowClick,
  columns: {
    ordered_at: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => dateFormat(row?.order?.ordered_at, "DD/MM/YYYY HH:mm"),
    },
    channel: {
      title: "Channel",
      sortable: true,
      component: (row: any) => (
        <span className="font-medium uppercase text-xs">
          {row?.order?.channel?.name ?? "-"}
        </span>
      ),
    },
    payment: {
      title: "Payment",
      sortable: true,
      component: (row: any) => (
        <span className="text-xs">
          {row?.order?.payment_method?.name ?? "Cash"}
        </span>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-xs">
          {row?.order?.session?.outlet?.name ?? "-"}
        </span>
      ),
    },
    code: {
      title: "#Transaksi",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold text-xs">{row?.order?.code ?? "-"}</span>
      ),
    },
    item: {
      title: "Menu",
      sortable: true,
      component: (row: any) => {
        const name = row?.catalog?.name;
        const desc = row?.description;
        const display = name === "" || !name ? desc?.toUpperCase() : name?.toUpperCase();
        return <span className="font-semibold uppercase text-xs">{display ?? "-"}</span>;
      },
    },
    quantity: {
      title: "Qty",
      sortable: true,
      align: "right",
      component: (row: any) => (
        <span className="text-right block font-semibold text-sm">
          {currencyFormat(row?.quantity)}
        </span>
      ),
    },
    unit_nett: {
      title: "Unit Nett",
      sortable: true,
      align: "right",
      component: (row: any) => (
        <span className="text-right block font-semibold text-sm">
          {currencyFormat(row?.unit_nett)}
        </span>
      ),
    },
    total_nett: {
      title: "Total Nett",
      sortable: true,
      align: "right",
      component: (row: any) => (
        <span className="text-right block font-semibold text-sm">
          {currencyFormat(row?.total_nett)}
        </span>
      ),
    },
    cost_goods: {
      title: "Cost",
      sortable: true,
      align: "right",
      component: (row: any) => (
        <span className="text-right block font-semibold text-sm">
          {currencyFormat(row?.cost_goods)}
        </span>
      ),
    },
    profit: {
      title: "RP Profit",
      sortable: true,
      align: "right",
      component: (row: any) => {
        const cost = (row?.unit_base ?? 0) * (row?.quantity ?? 0);
        const sales = (row?.unit_gross ?? 0) * (row?.quantity ?? 0);
        const profit = sales - cost;
        const pct = cost > 0 ? ((sales - cost) / cost * 100).toFixed(1) : "0.0";
        return (
          <div className="text-right">
            <span
              className={`block font-semibold text-sm ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {currencyFormat(profit)}
            </span>
            <span className="text-xs">({pct}%)</span>
          </div>
        );
      },
    },
  },
});

export default createTableConfig;