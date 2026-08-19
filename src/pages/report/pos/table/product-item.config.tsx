/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, dateFormat } from "@/utils";
import type { ProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/product-item",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className="text-sm">
          {row?.date ? dateFormat(row.date, "DD/MM/YYYY") : "-"}
        </span>
      ),
    },
    menu: {
      title: "Menu",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className="font-semibold text-sm">{row?.menu ?? "-"}</span>
      ),
    },
    quantity: {
      title: "Qty",
      align: "center",
      class: "text-center font-semibold",
      component: (row: ProductSalesRow) => row?.quantity ?? 0,
    },
    unit_nett: {
      title: "Unit Price",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: ProductSalesRow) => currencyFormat(row?.unit_nett),
    },
    total_nett: {
      title: "Total Price",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: ProductSalesRow) => currencyFormat(row?.total_nett),
    },
  },
});

export default createTableConfig;
