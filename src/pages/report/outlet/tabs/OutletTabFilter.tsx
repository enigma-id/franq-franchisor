/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";

const statusOptions = [
  { label: "Opened", value: "opened" },
  { label: "Closed", value: "closed" },
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
  /** Tampilkan filter status sesi (opened/closed). */
  showStatus?: boolean;
}

/** Filter generik untuk tab per-outlet (Sesi & Cashier) — tanpa select outlet. */
const TableFilter: React.FC<TableFilterProps> = ({ table, showStatus }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const cur = current.status as string | undefined;
    const found = statusOptions.find((o) => o.value === cur);
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
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
    ...(showStatus ? { status: status?.value ?? "" } : {}),
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "") ||
      (showStatus && (f.status || "") !== (current.status || ""))
    );
  }, [status, dateRange, current, showStatus]);

  const anyActive = !!(
    current.start_date ||
    current.end_date ||
    (showStatus && current.status)
  );

  const handleClear = () => {
    setStatus(null);
    setDateRange(undefined);
    table.filter({
      start_date: "",
      end_date: "",
      ...(showStatus ? { status: "" } : {}),
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
        {showStatus && (
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
        )}
      </div>
    </TableFilters>
  );
};

export default TableFilter;
