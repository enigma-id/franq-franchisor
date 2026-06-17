import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker } from "@/components/ui";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
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
    const start = current.start_at as string | undefined;
    const end = current.end_at as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    // Default: start of month to end of month
    return [dayjs().startOf("month"), dayjs().endOf("month")];
  });

  const applyFilters = (updates: any) => {
    const filters = {
      start_at: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_at: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
      ...updates,
    };
    table.filter(filters);
  };

  const handleDateChange = (
    date: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    let newRange: [Dayjs | null, Dayjs | null] = [null, null];
    if (date && typeof date !== "string" && !("format" in date)) {
      newRange = date as [Dayjs | null, Dayjs | null];
    }
    setDateRange(newRange);
    if ((newRange[0] && newRange[1]) || (!newRange[0] && !newRange[1])) {
      applyFilters({
        start_at: newRange[0]?.format("YYYY-MM-DD") || "",
        end_at: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-70">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Date Range"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default TableFilter;
