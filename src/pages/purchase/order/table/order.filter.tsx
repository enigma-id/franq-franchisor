import React from "react";
import { Input, DatePicker } from "@/components/ui";
import type { UseTableReturn } from "@/services/table/hooks";
import type { PurchaseOrderDetail } from "@/services/types/purchase";

interface TableFilterProps {
  table: UseTableReturn<PurchaseOrderDetail>;
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-48">
        <DatePicker
          placeholder="Filter tanggal"
          value={table.filter.date ? dayjs(table.filter.date) : null}
          onChange={(date: any) => table.handleFilter({ date: date?.format("YYYY-MM-DD") })}
        />
      </div>
    </div>
  );
};

export default TableFilter;
