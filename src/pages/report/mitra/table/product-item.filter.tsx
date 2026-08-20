/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
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
  outletTypeId?: string;
}

const TableFilter: React.FC<TableFilterProps> = ({ table, outletTypeId }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({
      page: 1,
      limit: 20,
      status: "active",
      outlet_type_id: outletTypeId,
    });
  }, [outletTypeId]);

  useEffect(() => {
    if (current.outlet_id && getOutletResult?.data?.data) {
      const outlets = getOutletResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) setOutlet(found);
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getOutletResult?.data?.data]);

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
    outlet_id: outlet?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "")
    );
  }, [dateRange, outlet, current]);

  const anyActive = !!(
    current.start_date ||
    current.end_date ||
    current.outlet_id
  );

  const handleClear = () => {
    setOutlet(null);
    setDateRange([dayjs().startOf("month"), dayjs().endOf("month")]);
    table.filter({
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
      outlet_id: "",
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
        <RemoteSelect
          label='Outlet'
          placeholder='Filter Outlet'
          value={outlet}
          onChange={(val) => setOutlet(val)}
          onClear={() => setOutlet(null)}
          fetchData={(page, search) =>
            getOutlet({
              page: page || 1,
              limit: 20,
              search,
              outlet_type_id: outletTypeId,
            })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
        <DatePicker
          label='Rentang Tanggal'
          mode='range'
          value={dateRange}
          onChange={(date) => {
            if (Array.isArray(date)) {
              setDateRange(date as [Dayjs | null, Dayjs | null]);
            }
          }}
          placeholder='Filter Tanggal'
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
