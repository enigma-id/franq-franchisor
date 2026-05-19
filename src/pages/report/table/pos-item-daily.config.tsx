import config from "@/services/table/const";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
} = {}) => ({
  ...config,
  url: "/report/pos/item/sales/daily",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Name",
      sortable: true,
      component: (row: any) => (
        <span className="font-semibold">{row?.name ?? "-"}</span>
      ),
    },
    dates: {
      title: "Dates",
      component: (row: any) => (
        <span className="text-gray-500 text-xs">{row?.dates?.length ?? 0} days</span>
      ),
    },
    total_qty: {
      title: "Total Qty",
      align: "right",
      component: (row: any) => {
        const total = row?.total_qty?.reduce((a: number, b: number) => a + b, 0) ?? 0;
        return (
          <span className="font-semibold text-right">
            {total.toLocaleString("id-ID")}
          </span>
        );
      },
    },
  },
});

export default createTableConfig;
