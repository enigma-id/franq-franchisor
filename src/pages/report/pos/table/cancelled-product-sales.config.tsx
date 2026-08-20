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
  url: "/report/franchise/cancelled-product-sales",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: ProductSalesRow) => (
        <span className='text-sm'>
          {row?.date ? dateFormat(row.date) : "-"}
        </span>
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
      title: "Menu",
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
    quantity: {
      title: "QTY",
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
    cancelled_reason: {
      title: "Cancelled Reason",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.cancelled_reason ?? "-"}</span>
      ),
    },
    cancelled_by: {
      title: "Cancelled By",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.cancelled_by ?? "-"}</span>
      ),
    },
    cancelled_at: {
      title: "Cancelled At",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{dateFormat(row?.cancelled_at)}</span>
      ),
    },
  },
});

export default createTableConfig;
