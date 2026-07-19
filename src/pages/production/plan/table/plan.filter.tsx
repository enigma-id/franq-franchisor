/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { productionPlanStatusOptions } from "@/utils/options";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutlet } from "@/services/outlet/hooks";
import TableFilters from "@/components/ui/table/filter";

interface TableFilterProps {
  table: any;
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const value = current.document_status;
    return value
      ? (productionPlanStatusOptions.find((opt) => opt.value === value) ?? null)
      : null;
  });

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

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_date as string | undefined;
    const end = current.end_date as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return undefined;
  });

  const buildFilters = () => ({
    document_status: status?.value ?? "",
    outlet_id: outlet?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.document_status || "") !== (current.document_status || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [status, outlet, dateRange, current]);

  const anyActive = !!(current.document_status || current.outlet_id || current.start_date || current.end_date);

  const handleClear = () => {
    setStatus(null);
    setOutlet(null);
    setDateRange(undefined);
    table.filter({ document_status: "", outlet_id: "", start_date: "", end_date: "" });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RemoteSelect<SelectOptionValue>
          label="Status"
          placeholder="Filter Status"
          data={productionPlanStatusOptions}
          value={status}
          onChange={(opt) => setStatus(opt)}
          onClear={() => setStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <RemoteSelect
          label="Outlet"
          placeholder="Filter Outlet"
          value={outlet}
          onChange={(val) => setOutlet(val)}
          onClear={() => setOutlet(null)}
          fetchData={(page, search) =>
            getOutlet({ page: page || 1, limit: 20, search })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
        <DatePicker
          label="Rentang Tanggal"
          mode="range"
          value={dateRange}
          onChange={(date) => {
            if (date && !("format" in date)) {
              setDateRange(date as [Dayjs | null, Dayjs | null]);
            } else {
              setDateRange(undefined);
            }
          }}
          placeholder="Filter Tanggal"
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
