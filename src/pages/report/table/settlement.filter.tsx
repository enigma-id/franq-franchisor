/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutlet } from "@/services/outlet/hooks";
import TableFilters from "@/components/ui/table/filter";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State:
      | {
          loading: boolean;
          filter: any;
        }
      | undefined;
  };
}

const periodeTypeOptions: SelectOptionValue[] = [
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const { get: getOutlet, getResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.outlet_id && getResult?.data?.data) {
      const outlets = getResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getResult?.data?.data]);

  const [periodeType, setPeriodeType] = useState<SelectOptionValue | null>(() => {
    const value = current.periode_type as string | undefined;
    return value
      ? (periodeTypeOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

  const buildFilters = () => ({
    outlet_id: outlet?.id ?? "",
    periode_type: periodeType?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.outlet_id || "") !== (current.outlet_id || "") ||
      (f.periode_type || "") !== (current.periode_type || "")
    );
  }, [outlet, periodeType, current]);

  const anyActive = !!(current.outlet_id || current.periode_type);

  const handleClear = () => {
    setOutlet(null);
    setPeriodeType(null);
    table.filter({ outlet_id: "", periode_type: "" });
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
          label="Outlet"
          placeholder="Filter Outlet"
          value={outlet}
          onChange={(val) => setOutlet(val)}
          onClear={() => setOutlet(null)}
          fetchData={(page, search) =>
            getOutlet({ page: page || 1, limit: 20, search })
          }
          hook={getResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
        <RemoteSelect<SelectOptionValue>
          label="Periode"
          placeholder="Filter Periode"
          data={periodeTypeOptions}
          value={periodeType}
          onChange={(opt) => setPeriodeType(opt)}
          onClear={() => setPeriodeType(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
