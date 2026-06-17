/* eslint-disable @typescript-eslint/no-explicit-any */
import { RemoteSelect } from "@/components";
import type { SelectOptionValue } from "@/services/types/table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  table: any;
}

const statusOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export default function TableFilter({ table }: Props) {
  const currentStatus = table.State?.filter?.is_active ?? "";

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    return currentStatus
      ? (statusOptions.find((opt) => opt.value === currentStatus) ?? null)
      : null;
  });

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
          table.filter(
            val ? { is_active: val.value } : { is_active: undefined },
          );
        }}
        onClear={() => {
          setStatus(null);
          table.filter({ is_active: undefined });
        }}
        getLabel={(item) => (item ? `Status: ${item.label}` : "")}
        renderItem={(item) => item?.label}
      />
    </div>
  );
}
