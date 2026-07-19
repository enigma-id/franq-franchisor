/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
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

  const buildFilters = () => ({
    is_active: isActive?.value ?? "",
    type: typeFilter?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.is_active || "") !== (current.is_active || "") ||
      (f.type || "") !== (current.type || "")
    );
  }, [isActive, typeFilter, current]);

  const anyActive = !!(current.is_active || current.type);

  const handleClear = () => {
    setIsActive(null);
    setTypeFilter(null);
    table.filter({ is_active: "", type: "" });
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
        <RemoteSelect<SelectOptionValue>
          label="Tipe"
          placeholder="Filter Tipe"
          data={typeOptions}
          value={typeFilter}
          onChange={(opt) => setTypeFilter(opt)}
          onClear={() => setTypeFilter(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
