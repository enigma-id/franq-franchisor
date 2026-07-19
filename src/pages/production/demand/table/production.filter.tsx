/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, RemoteSelect } from "@/components/ui";
import dayjs, { Dayjs } from "dayjs";
import { useOutlet } from "@/services/outlet/hooks";
import TableFilters from "@/components/ui/table/filter";

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
  const current = useMemo(() => table.State?.filter ?? {}, [table.State?.filter]);

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

  const [date, setDate] = useState<Dayjs | null>(
    current.production_date ? dayjs(current.production_date) : dayjs(),
  );

  useEffect(() => {
    if (!current.production_date) {
      setDate(dayjs());
    }
  }, [table]);

  const buildFilters = () => ({
    production_date: date ? date.format("YYYY-MM-DD") : "",
    outlet_id: outlet?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.production_date || "") !== (current.production_date || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "")
    );
  }, [date, outlet, current]);

  const anyActive = !!(current.production_date || current.outlet_id);

  const handleClear = () => {
    setOutlet(null);
    setDate(dayjs());
    table.filter({ production_date: dayjs().format("YYYY-MM-DD"), outlet_id: "" });
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
          label="Tanggal Produksi"
          mode="single"
          value={date ?? undefined}
          onChange={(d) => {
            const next = d as Dayjs;
            setDate(next);
          }}
          placeholder="Filter Tanggal"
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
