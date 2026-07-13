/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useUserGroup } from "@/services/usergroup/hooks";

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

  // Usergroup filter
  const { get: getUsergroup, getResult: getUsergroupResult } = useUserGroup();
  const [usergroup, setUsergroup] = useState<any | null>(null);

  useEffect(() => {
    getUsergroup({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.usergroup_id && getUsergroupResult?.data?.data) {
      const items = getUsergroupResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.usergroup_id);
      if (found) setUsergroup(found);
    } else if (!current.usergroup_id) {
      setUsergroup(null);
    }
  }, [current.usergroup_id, getUsergroupResult?.data?.data]);

  // is_active filter
  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      usergroup_id: usergroup?.id ?? "",
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
          placeholder="User Group: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={usergroup}
          onChange={(val) => {
            setUsergroup(val);
            applyFilters({ usergroup_id: val?.id || "" });
          }}
          onClear={() => {
            setUsergroup(null);
            applyFilters({ usergroup_id: "" });
          }}
          fetchData={(page, search) =>
            getUsergroup({ page: page || 1, limit: 20, search })
          }
          hook={getUsergroupResult as any}
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
