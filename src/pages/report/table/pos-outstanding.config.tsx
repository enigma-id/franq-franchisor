/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { dateFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  onRowClick,
  filter,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/outstanding",
  filter,
  onRowClick,
  columns: {
    code: {
      title: "Code",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold text-sm'>{row?.code ?? "-"}</span>
      ),
    },
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => dateFormat(row?.date, "DD/MM/YYYY HH:mm"),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold uppercase text-sm'>
          {row?.outlet ?? "-"}
        </span>
      ),
    },
    cashier: {
      title: "Kasir",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold uppercase text-sm'>
          {row?.cashier ?? "-"}
        </span>
      ),
    },
    bill_name: {
      title: "Bill Name",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold uppercase text-sm'>
          {row?.bill_name ?? "-"}
        </span>
      ),
    },

    total_charges: {
      title: "Total Charges",
      align: "right",
      class: "text-right",
      format_number: true,
    },
  },
});

export default createTableConfig;
