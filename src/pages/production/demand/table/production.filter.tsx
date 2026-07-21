/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui";
import dayjs, { Dayjs } from "dayjs";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      filter: any;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const [date, setDate] = useState<Dayjs>(() => {
    const f = table.State?.filter?.production_date;
    return f ? dayjs(f) : dayjs();
  });

  useEffect(() => {
    const f = table.State?.filter?.production_date;
    if (f) setDate(dayjs(f));
  }, [table.State?.filter?.production_date]);

  const handleChange = (d: any) => {
    const val = d ? (d as Dayjs) : dayjs();
    setDate(val);
    table.filter({ production_date: val.format("YYYY-MM-DD") });
  };

  return (
    <div className="w-56">
      <DatePicker
        label=""
        mode="single"
        value={date}
        onChange={handleChange}
        placeholder="Filter Tanggal"
      />
    </div>
  );
};

export default TableFilter;
