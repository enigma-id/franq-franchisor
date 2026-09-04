/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutletType } from "@/services/outlet/hooks";
import TableFilters from "@/components/ui/table/filter";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: { loading: boolean; filter: any };
  };
}

const isActiveOptions: SelectOptionValue[] = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(() => table.State?.filter ?? {}, [table.State?.filter]);

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

  const [isActive, setIsActive] = useState<SelectOptionValue | null>(() => {
    const v = current.is_active;
    return v ? (isActiveOptions.find((o) => o.value === v) ?? null) : null;
  });

  const buildFilters = () => ({
    outlet_type_id: outletType?.id ?? "",
    is_active: isActive?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.outlet_type_id || "") !== (current.outlet_type_id || "") ||
      (f.is_active || "") !== (current.is_active || "")
    );
  }, [outletType, isActive, current]);

  const anyActive = !!(current.outlet_type_id || current.is_active);

  const handleClear = () => {
    setOutletType(null);
    setIsActive(null);
    table.filter({ outlet_type_id: "", is_active: "" });
  };

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={() => table.filter(buildFilters())}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RemoteSelect
          label="Tipe"
          placeholder="Filter Tipe"
          value={outletType}
          onChange={(val) => setOutletType(val)}
          onClear={() => setOutletType(null)}
          fetchData={(page, search) =>
            getOutletType({ page: page || 1, limit: 20, search })
          }
          hook={getOutletTypeResult as any}
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
