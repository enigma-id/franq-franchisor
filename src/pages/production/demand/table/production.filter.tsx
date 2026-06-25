/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui";
import dayjs, { Dayjs } from "dayjs";

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
  const currentDate = table.State?.filter?.production_date ?? "";

  const [date, setDate] = useState<Dayjs | null>(dayjs(currentDate));

  const applyFilters = (updates: any) => {
    const filters = {
      production_date: date ? date.format("YYYY-MM-DD") : "",
      ...updates,
    };
    table.filter(filters);
  };

  useEffect(() => {
    if (currentDate === "") {
      setDate(dayjs());

      applyFilters({ production_date: dayjs().format("YYYY-MM-DD") });
    }
  }, [table]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-48">
        <DatePicker
          placeholder="Date: All Time"
          mode="single"
          value={date || undefined}
          onChange={(date: unknown) => {
            const next = date as Dayjs;
            setDate(next);

            if (next) {
              applyFilters({ production_date: next.format("YYYY-MM-DD") });
            } else {
              applyFilters({ production_date: "" });
            }
          }}
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          dropdownAlign="right"
        />
      </div>
    </div>
  );
};

export default TableFilter;
