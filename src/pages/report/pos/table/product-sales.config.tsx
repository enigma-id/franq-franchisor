import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import type { ProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/franchise/product-sales",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='text-sm'>{formatDate(row?.date)}</span>
      ),
    },
    code: {
      title: "Order Code",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='font-medium text-sm'>{row?.code ?? "-"}</span>
      ),
    },
    menu: {
      title: "Product Menu",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='font-semibold text-sm'>{row?.menu ?? "-"}</span>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='text-sm'>{row?.outlet ?? "-"}</span>
      ),
    },
    channel: {
      title: "Channel",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='text-sm'>{row?.channel ?? "-"}</span>
      ),
    },
    payment: {
      title: "Payment Method",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='text-sm'>{row?.payment ?? "-"}</span>
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
    discount: {
      title: "Discount",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: ProductSalesRow) => currencyFormat(row?.discount),
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
