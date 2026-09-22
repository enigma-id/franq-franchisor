/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { ChevronRight } from "lucide-react";

const createTableConfig = ({
  filter,
  lockedFilter,
  onDetail,
  showBrand,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  onDetail?: (row: any) => void;
  /** Tampilkan kolom Brand (superuser — lintas brand). */
  showBrand?: boolean;
}): TableConfig<any> => {
  const columns: Record<string, any> = {
    outlet_name: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <span className='font-semibold text-sm'>{row?.outlet_name || "-"}</span>
      ),
    },
  };

  if (showBrand) {
    columns.brand_name = {
      title: "Brand",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.brand_name || "-"}</span>
      ),
    };
  }

  columns.total_sales = {
    title: "Total Sales",
    sortable: true,
    align: "right",
    class: "text-right font-medium",
    component: (row: any) => row?.total_sales ?? 0,
  };

  columns.omzet = {
    title: "Omzet",
    sortable: true,
    align: "right",
    class: "text-right font-mono font-semibold",
    component: (row: any) => currencyFormat(row?.omzet ?? 0),
  };

  columns.total_outstanding = {
    title: "Total Outstanding",
    sortable: true,
    align: "right",
    class: "text-right font-medium",
    component: (row: any) => row?.total_outstanding ?? 0,
  };

  columns.outstanding_amount = {
    title: "Outstanding Amount",
    sortable: true,
    align: "right",
    class: "text-right font-mono font-medium",
    component: (row: any) => currencyFormat(row?.outstanding_amount ?? 0),
  };

  columns.total_session = {
    title: "Total Session",
    sortable: true,
    align: "right",
    class: "text-right font-medium",
    component: (row: any) => row?.total_session ?? 0,
  };

  columns.saldo = {
    title: "Saldo akhir",
    sortable: true,
    align: "right",
    class: "text-right font-mono font-medium",
    component: (row: any) => currencyFormat(row?.saldo ?? 0),
  };

  columns.cancelled_count = {
    title: "Cancelled",
    sortable: true,
    align: "right",
    class: "text-right font-medium",
    component: (row: any) => row?.cancelled_count ?? 0,
  };

  columns.action = {
    title: "",
    width: 40,
    sortable: false,
    component: (row: any) => (
      <button
        type='button'
        onClick={() => onDetail?.(row)}
        aria-label='Lihat Detail'
        className='p-1.5 rounded-lg text-base-content/30 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer'
      >
        <ChevronRight size={16} />
      </button>
    ),
  };

  return {
    ...config,
    url: "/report/franchise/outlet",
    filter,
    lockedFilter,
    columns,
  };
};

export default createTableConfig;
