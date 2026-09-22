/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";
import { useIsSuperuser } from "@/utils";
import { useFranchisorList } from "@/services/franchisor/hooks";

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

  // ── Franchise (khusus superuser) ──
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();
  const [franchise, setFranchise] = useState<any | null>(null);

  useEffect(() => {
    getFranchisors({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.franchisor_id && getFranchisorsResult?.data?.data) {
      const franchisors = getFranchisorsResult.data.data as any[];
      const found = franchisors.find(
        (c: any) => c.id === current.franchisor_id,
      );
      if (found) setFranchise(found);
    } else if (!current.franchisor_id) {
      setFranchise(null);
    }
  }, [current.franchisor_id, getFranchisorsResult?.data?.data]);

  const buildFilters = () => ({
    is_active: isActive?.value ?? "",
    type: typeFilter?.value ?? "",
    franchisor_id: franchise?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.is_active || "") !== (current.is_active || "") ||
      (f.type || "") !== (current.type || "") ||
      (f.franchisor_id || "") !== (current.franchisor_id || "")
    );
  }, [isActive, typeFilter, franchise, current]);

  const anyActive = !!(
    current.is_active ||
    current.type ||
    current.franchisor_id
  );

  const handleClear = () => {
    setIsActive(null);
    setTypeFilter(null);
    setFranchise(null);
    table.filter({ is_active: "", type: "", franchisor_id: "" });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <RemoteSelect<SelectOptionValue>
          label='Status'
          placeholder='Filter Status'
          data={isActiveOptions}
          value={isActive}
          onChange={(opt) => setIsActive(opt)}
          onClear={() => setIsActive(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <RemoteSelect<SelectOptionValue>
          label='Tipe'
          placeholder='Filter Tipe'
          data={typeOptions}
          value={typeFilter}
          onChange={(opt) => setTypeFilter(opt)}
          onClear={() => setTypeFilter(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        {isSuperuser && (
          <RemoteSelect
            label='Franchise'
            placeholder='Filter Franchise'
            value={franchise}
            onChange={(val) => setFranchise(val)}
            onClear={() => setFranchise(null)}
            fetchData={(page, search) =>
              getFranchisors({ page: page || 1, limit: 20, search })
            }
            hook={getFranchisorsResult as any}
            getLabel={(item: any) => item?.name ?? ""}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item.id}
          />
        )}
      </div>
    </TableFilters>
  );
};

export default TableFilter;
