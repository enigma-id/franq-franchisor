import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/b2b/product-sales",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.date ? new Date(row.date).toLocaleDateString() : "-"}</span>
      ),
    },
    code: {
      title: "Order Code",
      sortable: true,
      component: (row: any) => (
        <span className="font-medium text-sm">{row?.code ?? "-"}</span>
      ),
    },
    customer_name: {
      title: "Customer",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.customer_name ?? "-"}</span>
      ),
    },
    menu_name: {
      title: "Product Name",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold uppercase text-sm">
          {row?.menu_name ?? "-"}
        </span>
      ),
    },
    quantity: {
      title: "Quantity",
      align: "center",
      class: "text-center font-semibold",
      component: (row: any) => row?.quantity ?? "-",
    },
    unit_nett: {
      title: "Unit Price",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.unit_nett),
    },
    total_nett: {
      title: "Total",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row?.total_nett),
    },
  },
});

export default createTableConfig;
