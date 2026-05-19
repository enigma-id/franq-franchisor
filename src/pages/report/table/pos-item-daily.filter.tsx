import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { MonthPicker } from "@/components/ui";

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

  const [periode, setPeriode] = useState<string>(() => {
    return (current.periode as string) || dayjs().format("YYYY-MM");
  });

  const handlePeriodeChange = (value: string) => {
    setPeriode(value);
    table.filter({ periode: value });
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <MonthPicker
        value={periode}
        onChange={handlePeriodeChange}
        placeholder="Select Month"
      />
    </div>
  );
};

export default TableFilter;
