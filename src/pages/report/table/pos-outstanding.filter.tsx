/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { ChevronDown } from "lucide-react";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";

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

  // Outlet filter
  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.outlet_id && getOutletResult?.data?.data) {
      const outlets = getOutletResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getOutletResult?.data?.data]);

  // Date range filter
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

  const applyFilters = (updates: any) => {
    const filters = {
      start_date: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_date: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
      outlet_id: outlet?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  const handleDateChange = (
    date: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    let newRange: [Dayjs | null, Dayjs | null] = [null, null];
    if (Array.isArray(date)) {
      newRange = date as [Dayjs | null, Dayjs | null];
    }
    setDateRange(newRange);
    if ((newRange[0] && newRange[1]) || (!newRange[0] && !newRange[1])) {
      applyFilters({
        start_date: newRange[0]?.format("YYYY-MM-DD") || "",
        end_date: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
  };

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Outlet: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={outlet}
          onChange={(val) => {
            setOutlet(val);
            applyFilters({ outlet_id: val?.id || "" });
          }}
          onClear={() => {
            setOutlet(null);
            applyFilters({ outlet_id: "" });
          }}
          fetchData={(page, search) =>
            getOutlet({ page: page || 1, limit: 20, search })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
      <div className="w-70">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Date Range"
          inputClassName={selectClassName}
        />
      </div>
    </div>
  );
};

export default TableFilter;
