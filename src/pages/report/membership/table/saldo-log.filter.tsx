/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";

/** Pilihan tipe referensi saldo_log (mirror nilai yang di-insert backend). */
const referenceTypeOptions = [
  { label: "Top-Up", value: "top-up" },
  { label: "Bonus", value: "bonus" },
  { label: "Sales", value: "sales" },
];

const statusOptions = [
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

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

  const { get: getOutlet, getResult: getOutletResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({
      page: 1,
      limit: 20,
      status: "active",
    });
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

  const [referenceType, setReferenceType] = useState<SelectOptionValue | null>(
    () => {
      const cur = current.reference_type as string | undefined;
      const found = referenceTypeOptions.find((o) => o.value === cur);
      return found ? { label: found.label, value: found.value } : null;
    },
  );

  const [status, setStatus] = useState<SelectOptionValue | null>(() => {
    const cur = (current.status as string | undefined) ?? "completed";
    const found = statusOptions.find((o) => o.value === cur);
    return found ? { label: found.label, value: found.value } : null;
  });

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
    reference_type: referenceType?.value ?? "",
    status: status?.value ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
    outlet_id: outlet?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.reference_type || "") !== (current.reference_type || "") ||
      (f.status || "") !== (current.status || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "")
    );
  }, [referenceType, status, dateRange, outlet, current]);

  const anyActive = !!(
    current.reference_type ||
    (current.status && current.status !== "completed") ||
    current.start_date ||
    current.end_date ||
    current.outlet_id
  );

  const handleClear = () => {
    setOutlet(null);
    setReferenceType(null);
    setStatus({ label: "Completed", value: "completed" });
    setDateRange(undefined);
    table.filter({
      reference_type: "",
      status: "completed",
      start_date: "",
      end_date: "",
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
            })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
        <RemoteSelect<SelectOptionValue>
          label='Tipe'
          placeholder='Filter Tipe'
          data={referenceTypeOptions}
          value={referenceType}
          onChange={(opt) => setReferenceType(opt)}
          onClear={() => setReferenceType(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <RemoteSelect<SelectOptionValue>
          label='Status'
          placeholder='Filter Status'
          data={statusOptions}
          value={status}
          onChange={(opt) => setStatus(opt)}
          onClear={() => setStatus({ label: "Completed", value: "completed" })}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
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
