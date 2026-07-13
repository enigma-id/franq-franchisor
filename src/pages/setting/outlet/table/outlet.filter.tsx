/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutletType } from "@/services/outlet/hooks";

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

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  // Outlet type filter
  const { get: getOutletType, getResult: getOutletTypeResult } = useOutletType();
  const [outletType, setOutletType] = useState<any | null>(null);

  useEffect(() => {
    getOutletType({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.outlet_type_id && getOutletTypeResult?.data?.data) {
      const items = getOutletTypeResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.outlet_type_id);
      if (found) setOutletType(found);
    } else if (!current.outlet_type_id) {
      setOutletType(null);
    }
  }, [current.outlet_type_id, getOutletTypeResult?.data?.data]);

  // is_active filter
  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      outlet_type_id: outletType?.id ?? "",
      is_active: isActive?.value ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Type: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={outletType}
          onChange={(val) => {
            setOutletType(val);
            applyFilters({ outlet_type_id: val?.id || "" });
          }}
          onClear={() => {
            setOutletType(null);
            applyFilters({ outlet_type_id: "" });
          }}
          fetchData={(page, search) =>
            getOutletType({ page: page || 1, limit: 20, search })
          }
          hook={getOutletTypeResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
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
    </div>
  );
};

export default TableFilter;
