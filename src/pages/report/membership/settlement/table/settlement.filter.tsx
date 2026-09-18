/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Settled", value: "settled" },
];

const directionOptions = [
  { label: "HO → Outlet", value: "ho_to_outlet" },
  { label: "Outlet → HO", value: "outlet_to_ho" },
];

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
  /** Kunci outlet (dipakai saat halaman dipasang sebagai tab) — select outlet disembunyikan. */
  lockOutlet?: boolean;
}

const TableFilter: React.FC<TableFilterProps> = ({ table, lockOutlet }) => {
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
    });
  }, [lockOutlet]);

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

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const cur = current.status as string | undefined;
    const found = statusOptions.find((o) => o.value === cur);
    return found ? { label: found.label, value: found.value } : null;
  });

  const [direction, setDirection] = useState<SelectOptionValue | null>(() => {
    const cur = current.transfer_direction as string | undefined;
    const found = directionOptions.find((o) => o.value === cur);
    return found ? { label: found.label, value: found.value } : null;
  });

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

  const buildFilters = (): Record<string, any> => ({
    status: status?.value ?? "",
    transfer_direction: direction?.value ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
    ...(lockOutlet ? {} : { outlet_id: outlet?.id ?? "" }),
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.status || "") !== (current.status || "") ||
      (f.transfer_direction || "") !== (current.transfer_direction || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "") ||
      (!lockOutlet && (f.outlet_id || "") !== (current.outlet_id || ""))
    );
  }, [status, direction, dateRange, outlet, current, lockOutlet]);

  const anyActive = !!(
    current.status ||
    current.transfer_direction ||
    current.start_date ||
    current.end_date ||
    (!lockOutlet && current.outlet_id)
  );

  const handleClear = () => {
    setOutlet(null);
    setStatus(null);
    setDirection(null);
    setDateRange(undefined);
    table.filter({
      status: "",
      transfer_direction: "",
      start_date: "",
      end_date: "",
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
              })
            }
            hook={getOutletResult as any}
            getLabel={(item: any) => item?.name ?? ""}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item.id}
          />
        )}
        <RemoteSelect<SelectOptionValue>
          label='Status'
          placeholder='Filter Status'
          data={statusOptions}
          value={status}
          onChange={(opt) => setStatus(opt)}
          onClear={() => setStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <RemoteSelect<SelectOptionValue>
          label='Arah'
          placeholder='Filter Arah'
          data={directionOptions}
          value={direction}
          onChange={(opt) => setDirection(opt)}
          onClear={() => setDirection(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
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
      </div>
    </TableFilters>
  );
};

export default TableFilter;
