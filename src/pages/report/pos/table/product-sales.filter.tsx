/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker, MonthPicker, RemoteSelect } from "@/components/ui";
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

  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
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
    if (current.outlet_id && getOutletResult?.data?.data) {
      const outlets = getOutletResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getOutletResult?.data?.data, lockOutlet]);

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_date as string | undefined;
    const end = current.end_date as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return undefined;
  });

  // Mode periode (tab detail Rekap Outlet) — pengganti rentang tanggal.
  const [periode, setPeriode] = useState<string>(() => {
    const cur = current.periode as string | undefined;
    return cur || dayjs().format("YYYY-MM");
  });

  const buildFilters = (): Record<string, any> =>
    lockOutlet
      ? {
          periode,
          // Bersihkan nilai rentang tanggal lama yang mungkin masih tersimpan.
          start_date: "",
          end_date: "",
        }
      : {
          start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
          end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
          outlet_id: outlet?.id ?? "",
        };

  const isDirty = useMemo(() => {
    const f = buildFilters();
    if (lockOutlet) {
      return (f.periode || "") !== (current.periode || "");
    }
    return (
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "")
    );
  }, [periode, dateRange, outlet, current, lockOutlet]);

  const anyActive = lockOutlet
    ? !!current.periode
    : !!(current.start_date || current.end_date || current.outlet_id);

  const handleClear = () => {
    const defaultPeriode = dayjs().format("YYYY-MM");
    setOutlet(null);
    setDateRange(undefined);
    setPeriode(defaultPeriode);
    table.filter(
      lockOutlet
        ? { periode: defaultPeriode, start_date: "", end_date: "" }
        : { start_date: "", end_date: "", outlet_id: "" },
    );
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
            hook={getOutletResult as any}
            getLabel={(item: any) => item?.name ?? ""}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item.id}
          />
        )}
        {lockOutlet ? (
          <MonthPicker
            label='Periode'
            value={periode}
            onChange={setPeriode}
            placeholder='Filter Periode'
          />
        ) : (
          <DatePicker
            label='Rentang Tanggal'
            mode='range'
            value={dateRange}
            onChange={(date) => {
              if (Array.isArray(date)) {
                setDateRange(date as [Dayjs | null, Dayjs | null]);
              }
            }}
            placeholder='Filter Tanggal'
          />
        )}
      </div>
    </TableFilters>
  );
};

export default TableFilter;
