/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const applyFilters = (updates: any) => {
    const filters = {
      date: date ? date.format("YYYY-MM-DD") : "",
      ...updates,
    };
    table.filter(filters);
  };

  const handleDateChange = (
    dateParam: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    const selectedDate = Array.isArray(dateParam)
      ? (dateParam[0] ?? null)
      : dateParam;
    setDate(selectedDate);

    if (selectedDate) {
      applyFilters({ date: selectedDate.format("YYYY-MM-DD") });
    } else {
      applyFilters({ date: "" });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-48">
        <DatePicker
          placeholder="Date: All Time"
          mode="single"
          value={date || undefined}
          onChange={handleDateChange}
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          dropdownAlign="right"
        />
      </div>
    </div>
  );
};

export default TableFilter;
