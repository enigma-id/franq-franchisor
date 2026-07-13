/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const isActiveOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const typeOptions: SelectOptionValue[] = [
  { label: "Distributor", value: "distributor" },
  { label: "Factory", value: "factory" },
  { label: "Store", value: "store" },
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

  const [typeFilter, setTypeFilter] = useState<SelectOptionValue | null>(() => {
    const value = current.type;
    return value
      ? (typeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      is_active: isActive?.value ?? "",
      type: typeFilter?.value ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Status: All"
          inputClassName={selectClassName}
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
      <div className="w-40 md:w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Type: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={typeOptions}
          value={typeFilter}
          onChange={(val) => {
            setTypeFilter(val);
            applyFilters({ type: val?.value || "" });
          }}
          onClear={() => {
            setTypeFilter(null);
            applyFilters({ type: "" });
          }}
          getLabel={(item) => (item ? `Type: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
    </div>
  );
};

export default TableFilter;
