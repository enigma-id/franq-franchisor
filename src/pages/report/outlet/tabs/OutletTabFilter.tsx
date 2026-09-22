/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { MonthPicker, RemoteSelect } from "@/components/ui";
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

  const [periode, setPeriode] = useState<string>(() => {
    const cur = current.periode as string | undefined;
    return cur || dayjs().format("YYYY-MM");
  });

  const buildFilters = (): Record<string, any> => ({
    periode,
    // Bersihkan nilai rentang tanggal lama yang mungkin masih tersimpan.
    start_date: "",
    end_date: "",
    ...(showStatus ? { status: status?.value ?? "" } : {}),
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.periode || "") !== (current.periode || "") ||
      (showStatus && (f.status || "") !== (current.status || ""))
    );
  }, [status, periode, current, showStatus]);

  const anyActive = !!(current.periode || (showStatus && current.status));

  const handleClear = () => {
    const defaultPeriode = dayjs().format("YYYY-MM");
    setStatus(null);
    setPeriode(defaultPeriode);
    table.filter({
      periode: defaultPeriode,
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
        <MonthPicker
          label='Periode'
          value={periode}
          onChange={setPeriode}
          placeholder='Filter Periode'
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
