/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const applyFilters = (updates: any) => {
    const filters = {
      ...updates,
    };
    table.filter(filters);
  };

  return null;
};

export default TableFilter;
