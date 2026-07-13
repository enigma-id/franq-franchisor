/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Input, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";

interface TableFilterProps {
  table: {
    filter: {
      search?: string;
    };
    handleSearch: (value: string) => void;
    State: any;
  };
}

const isActiveOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      is_active: isActive?.value ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Cari metode pembayaran..."
        className="w-full md:w-48"
        value={table.filter.search || ""}
        onChange={(e) => table.handleSearch(e.target.value)}
      />
      <div className="w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Status: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={isActiveOptions}
          value={isActive}
          onChange={(val) => {
            setIsActive(val);
            applyFilters({ is_active: val?.value || "" });
          }}
          onClear={() => {
            setIsActive(null);
            applyFilters({ is_active: "" });
          }}
          getLabel={(item) => (item ? `Status: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
    </div>
  );
};

export default TableFilter;
