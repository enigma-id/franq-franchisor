import config from "@/services/table/const";
import type { TableConfig } from "@/services/table/const";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/warehouse-stock",
  filter,
  columns: {
    name: {
      title: "Item Name",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-semibold block uppercase text-sm">
            {row?.item?.name ?? "-"}
          </span>
          <span className="text-xs text-gray-500 block">
            {row?.item?.code ?? "-"}
          </span>
        </div>
      ),
    },
    warehouse: {
      title: "Warehouse",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm">{row?.warehouse?.name ?? "-"}</span>
      ),
    },
    quantity_available: {
      title: "Available",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => (
        <span className="text-right block">
          {row?.quantity_available ?? 0}
        </span>
      ),
    },
    quantity_allocated: {
      title: "Allocated",
      align: "right",
      class: "text-right",
      component: (row: any) => row?.quantity_allocated ?? 0,
    },
    quantity_defect: {
      title: "Defect",
      align: "right",
      class: "text-right",
      component: (row: any) => row?.quantity_defect ?? 0,
    },
  },
});

export default createTableConfig;
