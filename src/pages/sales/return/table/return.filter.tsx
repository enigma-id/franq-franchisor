import React from "react";
import { Input, DatePicker, RemoteSelect } from "@/components/ui";
import { useSalesOrder } from "@/services/sales/hooks";
import type { UseTableReturn } from "@/services/table/hooks";
import type { SalesReturnDetail } from "@/services/types/sales";

interface TableFilterProps {
  table: UseTableReturn<SalesReturnDetail>;
}

import dayjs from "dayjs";
// ... (imports remain the same)

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const { get: getSalesOrders, getResult: salesOrdersResult } = useSalesOrder();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-48">
        <DatePicker
          placeholder="Filter tanggal"
          value={table.filter.date ? dayjs(table.filter.date) : null}
          onChange={(date: any) => table.handleFilter({ date: date?.format("YYYY-MM-DD") })}
        />
      </div>
      <div className="w-64">
        <RemoteSelect
          placeholder="Pilih Sales Order"
          hook={salesOrdersResult}
          fetchData={(page, search) => getSalesOrders({ page, search })}
          getLabel={(item: any) => item?.number || item?.code}
          renderItem={(item: any) => item?.number || item?.code}
          value={
            table.filter.sales_order_id
              ? (salesOrdersResult.data as any)?.data?.find((o: any) => o.id === table.filter.sales_order_id)
              : null
          }
          onChange={(item: any) => table.handleFilter({ sales_order_id: item?.id })}
          onClear={() => table.handleFilter({ sales_order_id: undefined })}
        />
      </div>
    </div>
  );
};

export default TableFilter;
