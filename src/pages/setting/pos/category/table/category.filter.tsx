/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-48"></div>
    </div>
  );
};

export default TableFilter;
