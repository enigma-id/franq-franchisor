/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui";
import config from "@/services/table/const";
import { getStatusVariant } from "@/utils";
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
    item_code: {
      title: "Kode Material",
      sortable: true,
      alias: "item_id",
      component: (row: any) => (
        <span className="font-bold text-sm text-slate-700">
          {row?.item?.code ?? "-"}
        </span>
      ),
    },
    item_name: {
      title: "Nama Material",
      sortable: true,
      alias: "item_id",
      component: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-700">
            {row?.item?.name ?? "-"}
          </span>
          {row?.item?.variant && (
            <span className="text-[11px] text-slate-400">{row.item.variant}</span>
          )}
        </div>
      ),
    },
    stock: {
      title: "Stock",
      align: "right",
      class: "text-right font-medium",
      component: (row: any) => (
        <span className="font-medium text-amber-600">
          {row?.item?.stock_available ?? 0} {row?.item?.default_fraction ?? ""}
        </span>
      ),
    },
    quantity_planned: {
      title: "Qty Rencana",
      align: "right",
      class: "text-right font-medium",
      format_number: true,
      component: (row: any) => (
        <span className="font-medium">
          {row?.quantity_planned ?? 0} {row?.item?.default_fraction ?? ""}
        </span>
      ),
    },
    quantity_produced: {
      title: "Qty Produksi",
      align: "right",
      class: "text-right font-medium",
      component: (row: any) => (
        <span className="font-medium text-emerald-600">
          {row?.quantity_produced ?? 0} {row?.item?.default_fraction ?? ""}
        </span>
      ),
    },
    document_status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row?.document_status)}
          size="xs"
          className="px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row?.document_status?.toLowerCase()}
        </Badge>
      ),
    },
  },
});

export default createTableConfig;