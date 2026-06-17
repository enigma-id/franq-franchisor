import config from "@/services/table/const";
import { currencyFormat } from "@/utils";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/pos/item/sales",
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Item Name",
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.name?.toUpperCase() ?? "-"}
        </span>
      ),
    },
    total_qty: {
      title: "Total Sold",
      align: "center",
      class: "text-center font-semibold",
      component: (row: any) => currencyFormat(row?.total_qty),
    },
    total_order: {
      title: "TRX",
      align: "center",
      class: "text-center font-semibold",
      component: (row: any) => row?.total_order ?? 0,
    },
    actions: {
      title: "",
      component: () => <span />,
    },
  },
});

export default createTableConfig;
