/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
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

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [periode, setPeriode] = useState<SelectOptionValue | null>(() => {
    const cur = current.periode as number | undefined;
    const y = cur ?? new Date().getFullYear();
    return { label: String(y), value: y };
  });

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  ).map((y) => ({
    label: String(y),
    value: y,
  }));

  const buildFilters = () => ({
    periode: periode?.value ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return String(f.periode || "") !== String(current.periode || "");
  }, [periode, current]);

  const anyActive = !!current.periode;

  const currYear = new Date().getFullYear();

  const handleClear = () => {
    setPeriode({ label: String(currYear), value: currYear });
    table.filter({ periode: currYear });
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
          label='Periode'
          placeholder='Filter Periode'
          data={yearOptions}
          value={periode}
          onChange={(opt) => setPeriode(opt)}
          onClear={() =>
            setPeriode({ label: String(currYear), value: currYear })
          }
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
