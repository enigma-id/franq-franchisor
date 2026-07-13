/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DatePicker, RemoteSelect } from "@/components/ui";
import dayjs, { Dayjs } from "dayjs";
import { ChevronDown } from "lucide-react";
import { useOutlet } from "@/services/outlet/hooks";

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
  const current = table.State?.filter ?? {};

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

  const currentDate = current.production_date ?? "";
  const [date, setDate] = useState<Dayjs | null>(dayjs(currentDate));

  const applyFilters = (updates: any) => {
    const filters = {
      production_date: date ? date.format("YYYY-MM-DD") : "",
      outlet_id: outlet?.id ?? "",
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

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-wrap items-center gap-3">
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
          inputClassName={selectClassName}
          dropdownAlign="right"
        />
      </div>
    </div>
  );
};

export default TableFilter;
