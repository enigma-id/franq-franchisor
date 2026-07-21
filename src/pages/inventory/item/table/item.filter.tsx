/* eslint-disable @typescript-eslint/no-explicit-any */
import { RemoteSelect } from "@/components";
import type { SelectOptionValue } from "@/services/types/table";
import { useMemo, useState } from "react";
import TableFilters from "@/components/ui/table/filter";

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

export default function TableFilter({ table }: Props) {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (statusOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const [typeFilter, setTypeFilter] = useState<SelectOptionValue | null>(() => {
    const value = current.type;
    return value
      ? (typeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const buildFilters = () => ({
    is_active: status?.value ?? "",
    type: typeFilter?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.is_active || "") !== (current.is_active || "") ||
      (f.type || "") !== (current.type || "")
    );
  }, [status, typeFilter, current]);

  const anyActive = !!(current.is_active || current.type);

  const handleClear = () => {
    setStatus(null);
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
          data={statusOptions}
          value={status}
          onChange={(opt) => setStatus(opt)}
          onClear={() => setStatus(null)}
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
}
