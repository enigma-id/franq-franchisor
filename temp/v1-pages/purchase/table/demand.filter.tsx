import { useState } from "react";
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
  const [date, setDate] = useState<Dayjs | null>(() => {
    const current = table.State?.filter?.date;
    return current ? dayjs(current) : dayjs();
  });

  const handleDateChange = (
    value: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    // Only handle single date (not range)
    if (value && "format" in (value as Dayjs)) {
      const d = value as Dayjs;
      setDate(d);
      table.filter({ date: d.format("YYYY-MM-DD") });
    } else {
      setDate(null);
      table.filter({ date: "" });
    }
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-52">
        <DatePicker
          mode="single"
          value={date as any}
          onChange={handleDateChange}
          dropdownAlign="right"
          placeholder="Tanggal: Hari Ini"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default TableFilter;
