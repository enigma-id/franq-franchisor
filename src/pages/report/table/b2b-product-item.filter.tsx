/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker } from "@/components/ui";
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

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_date as string | undefined;
    const end = current.end_date as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return [dayjs().startOf("month"), dayjs().endOf("month")];
  });

  const buildFilters = () => ({
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [dateRange, current]);

  const anyActive = !!(current.start_date || current.end_date);

  const handleClear = () => {
    setDateRange([dayjs().startOf("month"), dayjs().endOf("month")]);
    table.filter({
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
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
      <DatePicker
        label="Rentang Tanggal"
        mode="range"
        value={dateRange}
        onChange={(date) => {
          if (Array.isArray(date)) {
            setDateRange(date as [Dayjs | null, Dayjs | null]);
          }
        }}
        placeholder="Filter Tanggal"
      />
    </TableFilters>
  );
};

export default TableFilter;
