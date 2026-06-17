import React from "react";
import { Input } from "@/components/ui";
import type { UseTableReturn } from "@/services/table/hooks";
import type { POSCategoryDetail } from "@/services/types/pos";

interface TableFilterProps {
  table: UseTableReturn<POSCategoryDetail>;
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      {/* Search is handled by Table.Tools */}
    </div>
  );
};

export default TableFilter;
