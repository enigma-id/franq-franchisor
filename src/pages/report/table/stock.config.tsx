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
  url: "/inventory/item",
  filter: { franchise_id: 0, status: "active", category_id: 0, status_stock: "", ...filter },
  onRowClick,
  columns: {
    name: {
      title: "Name",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-semibold block">{row?.alias}</span>
          <span className="text-xs text-gray-500 block">{row?.code}</span>
        </div>
      ),
    },
    stock_available: {
      title: "Stock Available",
      sortable: true,
      class: "text-right",
      component: (row: any) => (
        <span className="text-right block">
          {currencyFormat(row?.stock_available)} {row?.default_fraction}
        </span>
      ),
    },
    stock_value: {
      title: "Stock Value",
      class: "text-right",
      component: (row: any) => (
        <span className="text-right block font-semibold">
          {currencyFormat((row?.stock_available ?? 0) * (row?.base_price ?? 0))}
        </span>
      ),
    },
  },
});

export default createTableConfig;