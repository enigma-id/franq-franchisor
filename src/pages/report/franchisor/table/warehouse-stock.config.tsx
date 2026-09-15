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
          <span className='font-semibold block uppercase text-sm'>
            {row?.item?.alias_name ?? "-"}
          </span>
          <span className='text-xs text-gray-500 block'>
            {row?.item?.code ?? "-"}
          </span>
        </div>
      ),
    },
    warehouse: {
      title: "Warehouse",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className='font-semibold block uppercase text-sm'>
            {row?.warehouse?.name ?? "-"}
          </span>
          <span className='text-xs text-gray-500 block'>
            {row?.warehouse?.brand?.name ?? "-"}
          </span>
        </div>
      ),
    },
    quantity_available: {
      title: "Available",
      align: "right",
      class: "text-right font-semibold",
      component: (row: any) => (
        <div>
          <span className='font-semibold block uppercase text-sm'>
            {row?.quantity_available} {row?.item?.default_fraction}
          </span>
          <p className='text-xs text-slate-400'>{`(${row?.quantity_available_fracted})`}</p>
        </div>
      ),
    },
    quantity_allocated: {
      title: "Allocated",
      align: "right",
      class: "text-right",
      component: (row: any) => (
        <div>
          <span className='font-semibold block uppercase text-sm'>
            {row?.quantity_allocated} {row?.item?.default_fraction}
          </span>
          {row?.quantity_allocated > 0 && (
            <p className='text-xs text-slate-400'>{`(${row?.quantity_allocated_fracted})`}</p>
          )}
        </div>
      ),
    },
    quantity_defect: {
      title: "Defect",
      align: "right",
      class: "text-right",
      component: (row: any) => (
        <div>
          <span className='font-semibold block uppercase text-sm'>
            {row?.quantity_defect} {row?.item?.default_fraction}
          </span>
          {row?.quantity_defect > 0 && (
            <p className='text-xs text-slate-400'>{`(${row?.quantity_defect_fracted})`}</p>
          )}
        </div>
      ),
    },
  },
});

export default createTableConfig;
