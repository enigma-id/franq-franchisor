import React from "react";
import { Input } from "@/components/ui";

interface TableFilterProps {
  table: {
    filter: {
      search?: string;
    };
    handleSearch: (value: string) => void;
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Cari metode pembayaran..."
        className="w-full md:w-64"
        value={table.filter.search || ""}
        onChange={(e) => table.handleSearch(e.target.value)}
      />
    </div>
  );
};

export default TableFilter;
