/* eslint-disable @typescript-eslint/no-explicit-any */
import { RemoteSelect } from "@/components";
import type { SelectOptionValue } from "@/services/types/table";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  table: any;
}

const statusOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const typeOptions: SelectOptionValue[] = [
  { label: "Raw Material", value: "raw_material" },
  { label: "Finished Goods", value: "finished_goods" },
];

const categoryOptions: SelectOptionValue[] = [
  { label: "Package", value: "package" },
  { label: "Pcs", value: "pcs" },
  { label: "Liquid", value: "liquid" },
  { label: "Powder", value: "powder" },
];

export default function TableFilter({ table }: Props) {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const currentStatus = current.is_active ?? "";

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    return currentStatus
      ? (statusOptions.find((opt) => opt.value === currentStatus) ?? null)
      : null;
  });

  const [typeFilter, setTypeFilter] = useState<SelectOptionValue | null>(() => {
    const value = current.type;
    return value
      ? (typeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const [categoryFilter, setCategoryFilter] = useState<SelectOptionValue | null>(() => {
    const value = current.category;
    return value
      ? (categoryOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      is_active: status?.value ?? "",
      type: typeFilter?.value ?? "",
      category: categoryFilter?.value ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex items-center gap-2">
      <RemoteSelect<SelectOptionValue>
        placeholder="Status: All"
        inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
        data={statusOptions}
        value={status}
        onChange={(val) => {
          setStatus(val);
          applyFilters({ is_active: val?.value || "" });
        }}
        onClear={() => {
          setStatus(null);
          applyFilters({ is_active: "" });
        }}
        getLabel={(item) => (item ? `Status: ${item.label}` : "")}
        renderItem={(item) => item?.label}
      />
      <RemoteSelect<SelectOptionValue>
        placeholder="Type: All"
        inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
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
      <RemoteSelect<SelectOptionValue>
        placeholder="Category: All"
        inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
        data={categoryOptions}
        value={categoryFilter}
        onChange={(val) => {
          setCategoryFilter(val);
          applyFilters({ category: val?.value || "" });
        }}
        onClear={() => {
          setCategoryFilter(null);
          applyFilters({ category: "" });
        }}
        getLabel={(item) => (item ? `Category: ${item.label}` : "")}
        renderItem={(item) => item?.label}
      />
    </div>
  );
}
