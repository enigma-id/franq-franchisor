import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/outlet-saldo",
  filter,
  columns: {
    name: {
      title: "Outlet",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.name ?? "-"}</span>
      ),
    },
    saldo: {
      title: "Saldo",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => currencyFormat(row?.saldo ?? 0),
    },
  },
});

export default createTableConfig;
