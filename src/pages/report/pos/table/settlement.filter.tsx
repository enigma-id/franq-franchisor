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
  outletTypeId?: string;
  /** Kunci outlet (dipakai di tab detail outlet) — select outlet disembunyikan. */
  lockOutlet?: boolean;
}

const TableFilter: React.FC<TableFilterProps> = ({
  table,
  outletTypeId,
  lockOutlet,
}) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const { get: getOutlet, getResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    if (lockOutlet) return;
    getOutlet({
      page: 1,
      limit: 20,
      status: "active",
      outlet_type_id: outletTypeId,
    });
  }, [outletTypeId, lockOutlet]);

  useEffect(() => {
    if (lockOutlet) return;
    if (current.outlet_id && getResult?.data?.data) {
      const outlets = getResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getResult?.data?.data, lockOutlet]);

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

  const buildFilters = (): Record<string, any> => ({
    periode: periode?.value ?? "",
    ...(lockOutlet ? {} : { outlet_id: outlet?.id ?? "" }),
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      String(f.periode || "") !== String(current.periode || "") ||
      (!lockOutlet && (f.outlet_id || "") !== (current.outlet_id || ""))
    );
  }, [outlet, periode, current, lockOutlet]);

  const anyActive = !!(
    current.periode ||
    (!lockOutlet && current.outlet_id)
  );

  const currYear = new Date().getFullYear();

  const handleClear = () => {
    setOutlet(null);
    setPeriode({ label: String(currYear), value: currYear });
    table.filter({
      periode: currYear,
      ...(lockOutlet ? {} : { outlet_id: "" }),
    });
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
        {!lockOutlet && (
          <RemoteSelect
            label='Outlet'
            placeholder='Filter Outlet'
            value={outlet}
            onChange={(val) => setOutlet(val)}
            onClear={() => setOutlet(null)}
            fetchData={(page, search) =>
              getOutlet({
                page: page || 1,
                limit: 20,
                search,
                outlet_type_id: outletTypeId,
              })
            }
            hook={getResult as any}
            getLabel={(item: any) => item?.name ?? ""}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item.id}
          />
        )}
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
