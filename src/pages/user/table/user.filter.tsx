/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useUserGroup } from "@/services/usergroup/hooks";
import TableFilters from "@/components/ui/table/filter";

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

  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const buildFilters = () => ({
    usergroup_id: usergroup?.id ?? "",
    is_active: isActive?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.usergroup_id || "") !== (current.usergroup_id || "") ||
      (f.is_active || "") !== (current.is_active || "")
    );
  }, [usergroup, isActive, current]);

  const anyActive = !!(current.usergroup_id || current.is_active);

  const handleClear = () => {
    setUsergroup(null);
    setIsActive(null);
    table.filter({ usergroup_id: "", is_active: "" });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RemoteSelect
          label="Usergroup"
          placeholder="Filter Usergroup"
          value={usergroup}
          onChange={(val) => setUsergroup(val)}
          onClear={() => setUsergroup(null)}
          fetchData={(page, search) =>
            getUsergroup({ page: page || 1, limit: 20, search })
          }
          hook={getUsergroupResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
        <RemoteSelect<SelectOptionValue>
          label="Status"
          placeholder="Filter Status"
          data={isActiveOptions}
          value={isActive}
          onChange={(opt) => setIsActive(opt)}
          onClear={() => setIsActive(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
