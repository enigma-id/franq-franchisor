/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { ChevronDown } from "lucide-react";

interface Props {
  table: any;
}

const statusOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const itemTypeOptions: SelectOptionValue[] = [
  { label: "Raw Material", value: "raw_material" },
  { label: "Finished Goods", value: "finished_goods" },
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

  const [itemType, setItemType] = useState<SelectOptionValue | null>(() => {
    const value = current.item_type;
    return value
      ? (itemTypeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      is_active: status?.value ?? "",
      item_type: itemType?.value ?? "",
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
        placeholder="Item Type: All"
        inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
        data={itemTypeOptions}
        value={itemType}
        onChange={(val) => {
          setItemType(val);
          applyFilters({ item_type: val?.value || "" });
        }}
        onClear={() => {
          setItemType(null);
          applyFilters({ item_type: "" });
        }}
        getLabel={(item) => (item ? `Type: ${item.label}` : "")}
        renderItem={(item) => item?.label}
      />
    </div>
  );
}
