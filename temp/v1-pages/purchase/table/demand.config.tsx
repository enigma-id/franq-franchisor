import config from "@/services/table/const";

const createTableConfig = ({
  onRowClick,
  lockFilter,
  filter,
}: {
  onRowClick?: (row: any) => void;
  lockFilter?: Record<string, unknown>;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/inventory/demand",
  lockFilter,
  filter,
  onRowClick,
  columns: {
    item_name: {
      title: "Name",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-medium block">{row.item_name}</span>
          <span className="text-xs text-gray-500 block">{row.item_code}</span>
        </div>
      ),
    },
    stock_available: {
      title: "Stock",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => (
        <span>
          {Number(row.stock_available ?? 0).toLocaleString("id-ID")}{" "}
          {row.default_fraction}
        </span>
      ),
    },
    quantity: {
      title: "Demand",
      sortable: true,
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => (
        <span>
          {Number(row.quantity ?? 0).toLocaleString("id-ID")}{" "}
          {row.default_fraction}
        </span>
      ),
    },
    difference: {
      title: "Diff",
      align: "right",
      class: "text-right font-mono",
      component: (row: any) => {
        const diff = (row.stock_available ?? 0) - (row.quantity ?? 0);
        if (diff < 0) {
          return (
            <span className="text-red-500 font-semibold">
              {diff.toLocaleString("id-ID")} {row.default_fraction}
            </span>
          );
        }
        return <span className="text-gray-400">—</span>;
      },
    },
  },
});

export default createTableConfig;
