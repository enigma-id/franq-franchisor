/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Input, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { usePOSCategory } from "@/services/pos/hooks";

interface TableFilterProps {
  table: {
    filter: { search: string };
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

  // Category filter
  const { get: getCategory, getResult: getCategoryResult } = usePOSCategory();
  const [category, setCategory] = useState<any | null>(null);

  useEffect(() => {
    getCategory({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.category_id && getCategoryResult?.data?.data) {
      const items = getCategoryResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.category_id);
      if (found) setCategory(found);
    } else if (!current.category_id) {
      setCategory(null);
    }
  }, [current.category_id, getCategoryResult?.data?.data]);

  // is_active filter
  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      category_id: category?.id ?? "",
      is_active: isActive?.value ?? "",
      ...updates,
    };
    table.State?.filter
      ? table.filter(filters)
      : table.handleSearch(table.filter.search || "");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Cari menu..."
        className="w-full md:w-48"
        value={table.filter.search || ""}
        onChange={(e) => table.handleSearch(e.target.value)}
      />
      <div className="w-40 md:w-48">
        <RemoteSelect
          placeholder="Category: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={category}
          onChange={(val) => {
            setCategory(val);
            applyFilters({ category_id: val?.id || "" });
          }}
          onClear={() => {
            setCategory(null);
            applyFilters({ category_id: "" });
          }}
          fetchData={(page, search) =>
            getCategory({ page: page || 1, limit: 20, search })
          }
          hook={getCategoryResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
      <div className="w-40 md:w-44">
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
