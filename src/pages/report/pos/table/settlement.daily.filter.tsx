/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
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
  periode: string;
  outletTypeId?: string;
}

const TableFilter: React.FC<TableFilterProps> = ({
  table,
  periode,
  outletTypeId,
}) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const {
    get: getOutlet,
    getResult,
    show: showOutlet,
    showResult,
  } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({
      page: 1,
      limit: 20,
      status: "active",
      outlet_type_id: outletTypeId,
    });
  }, [outletTypeId]);

  // Resolve selected outlet from the active-outlet list so the filter displays it.
  // If the outlet isn't in the first page, fetch it directly by id.
  useEffect(() => {
    if (!current.outlet_id) {
      setOutlet(null);
      return;
    }

    const outlets = getResult?.data?.data as any[] | undefined;
    const found = outlets?.find((c: any) => c.id === current.outlet_id);
    if (found) {
      setOutlet(found);
    } else {
      showOutlet({ id: current.outlet_id });
    }
  }, [current.outlet_id, getResult?.data?.data]);

  useEffect(() => {
    const shown = showResult?.data?.data as any | undefined;
    if (shown && String(shown.id) === String(current.outlet_id)) {
      setOutlet(shown);
    }
  }, [showResult?.data?.data, current.outlet_id]);

  const buildFilters = () => ({
    outlet_id: outlet?.id ?? "",
    periode,
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (f.outlet_id || "") !== (current.outlet_id || "");
  }, [outlet, current]);

  const anyActive = !!(current.outlet_id || current.periode);

  const handleClear = () => {
    setOutlet(null);
    table.filter({ outlet_id: "", periode });
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
      </div>
    </TableFilters>
  );
};

export default TableFilter;
