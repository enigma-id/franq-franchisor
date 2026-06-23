/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { dateFormat } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/demand/production",
  filter,
  columns: {
    production_date: {
      title: "Tanggal Produksi",
      sortable: true,
      component: (row: any) => dateFormat(row?.production_date, "DD/MM/YYYY"),
    },
    raw_material_code: {
      title: "Kode Material",
      sortable: true,
      component: (row: any) => (
        <span className="font-medium text-sm">{row?.raw_material_code ?? "-"}</span>
      ),
    },
    raw_material_name: {
      title: "Nama Material",
      sortable: true,
    },
    quantity: {
      title: "Qty",
      align: "right",
      class: "text-right font-medium",
      format_number: true,
    },
    unit: {
      title: "Unit",
      sortable: true,
    },
  },
});

export default createTableConfig;