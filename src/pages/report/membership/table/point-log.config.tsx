/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
  lockedFilter,
  hideMembership,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  /** Sembunyikan kolom member saat drill-down per member. */
  hideMembership?: boolean;
}): TableConfig<any> => {
  // Urutan key = urutan kolom: Tanggal, Member, Outlet, Tipe, Reference Code,
  // Nominal, Kasir.
  const columns: Record<string, any> = {
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>
          {row?.date ? formatDateTime(row.date) : "-"}
        </span>
      ),
    },
  };

  if (!hideMembership) {
    columns.membership = {
      title: "Member",
      sortable: true,
      component: (row: any) => (
        <div className='flex flex-col'>
          <span className='font-semibold text-sm'>{row?.membership || "-"}</span>
          {row?.card_id && (
            <span className='text-xs text-base-content/60'>{row.card_id}</span>
          )}
        </div>
      ),
    };
  }

  columns.outlet = {
    title: "Outlet",
    sortable: true,
    component: (row: any) => (
      <span className='text-sm'>{row?.outlet || "-"}</span>
    ),
  };

  columns.reference_type = {
    title: "Tipe",
    sortable: true,
    component: (row: any) => (
      <span className='text-sm capitalize'>
        {row?.reference_type ? row.reference_type.replaceAll("_", " ") : "-"}
      </span>
    ),
  };

  columns.reference_code = {
    title: "Reference Code",
    sortable: true,
    component: (row: any) => (
      <span className='font-medium text-sm'>{row?.reference_code || "-"}</span>
    ),
  };

  columns.nominal = {
    title: "Nominal",
    align: "right",
    class: "text-right font-mono font-semibold",
    component: (row: any) => {
      const nominal = row?.nominal ?? 0;
      const isNegative = nominal < 0;
      return (
        <span
          className={
            isNegative
              ? "text-red-500 font-semibold"
              : "text-green-600 font-semibold"
          }
        >
          {currencyFormat(nominal)}
        </span>
      );
    },
  };

  columns.cashier_name = {
    title: "Kasir",
    sortable: true,
    component: (row: any) => (
      <span className='text-sm'>{row?.cashier_name || "-"}</span>
    ),
  };

  return {
    ...config,
    url: "/report/point/log",
    filter,
    lockedFilter,
    columns,
  };
};

export default createTableConfig;
