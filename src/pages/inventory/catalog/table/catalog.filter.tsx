/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";

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

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (statusOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const [itemType, setItemType] = useState<SelectOptionValue | null>(() => {
    const value = current.item_type;
    return value
      ? (itemTypeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const buildFilters = () => ({
    is_active: status?.value ?? "",
    item_type: itemType?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.is_active || "") !== (current.is_active || "") ||
      (f.item_type || "") !== (current.item_type || "")
    );
  }, [status, itemType, current]);

  const anyActive = !!(current.is_active || current.item_type);

  const handleClear = () => {
    setStatus(null);
    setItemType(null);
    table.filter({ is_active: "", item_type: "" });
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
          label="Tipe Item"
          placeholder="Filter Tipe"
          data={itemTypeOptions}
          value={itemType}
          onChange={(opt) => setItemType(opt)}
          onClear={() => setItemType(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
}
