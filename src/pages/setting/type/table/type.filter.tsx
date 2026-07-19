/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { usePOSCategory } from "@/services/pos/hooks";
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

  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const value = current.is_active;
    return value
      ? (isActiveOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const buildFilters = () => ({
    category_id: category?.id ?? "",
    is_active: isActive?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.category_id || "") !== (current.category_id || "") ||
      (f.is_active || "") !== (current.is_active || "")
    );
  }, [category, isActive, current]);

  const anyActive = !!(current.category_id || current.is_active);

  const handleClear = () => {
    setCategory(null);
    setIsActive(null);
    table.filter({ category_id: "", is_active: "" });
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
          label="Kategori"
          placeholder="Filter Kategori"
          value={category}
          onChange={(val) => setCategory(val)}
          onClear={() => setCategory(null)}
          fetchData={(page, search) =>
            getCategory({ page: page || 1, limit: 20, search })
          }
          hook={getCategoryResult as any}
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
