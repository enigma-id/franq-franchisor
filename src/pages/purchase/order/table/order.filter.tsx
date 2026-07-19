/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutlet } from "@/services/outlet/hooks";
import { useSupplier } from "@/services/supplier/hooks";
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

const documentStatusOptions: SelectOptionValue[] = [
  { label: "Pending", value: "pending" },
  { label: "Published", value: "published" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [documentStatus, setDocumentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.document_status;
      return value
        ? (documentStatusOptions.find((opt) => opt.value === value) ?? null)
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

  const { get: getSupplier, getResult: getSupplierResult } = useSupplier();
  const [supplier, setSupplier] = useState<any | null>(null);

  useEffect(() => {
    getSupplier({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.supplier_id && getSupplierResult?.data?.data) {
      const suppliers = getSupplierResult.data.data as any[];
      const found = suppliers.find((c: any) => c.id === current.supplier_id);
      if (found) setSupplier(found);
    } else if (!current.supplier_id) {
      setSupplier(null);
    }
  }, [current.supplier_id, getSupplierResult?.data?.data]);

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
    document_status: documentStatus?.value ?? "",
    outlet_id: outlet?.id ?? "",
    supplier_id: supplier?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.document_status || "") !== (current.document_status || "") ||
      (f.outlet_id || "") !== (current.outlet_id || "") ||
      (f.supplier_id || "") !== (current.supplier_id || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [documentStatus, outlet, supplier, dateRange, current]);

  const anyActive = !!(current.document_status || current.outlet_id || current.supplier_id || current.start_date || current.end_date);

  const handleClear = () => {
    setDocumentStatus(null);
    setOutlet(null);
    setSupplier(null);
    setDateRange(undefined);
    table.filter({ document_status: "", outlet_id: "", supplier_id: "", start_date: "", end_date: "" });
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
          label="Status Dokumen"
          placeholder="Filter Status"
          data={documentStatusOptions}
          value={documentStatus}
          onChange={(opt) => setDocumentStatus(opt)}
          onClear={() => setDocumentStatus(null)}
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
        <RemoteSelect
          label="Supplier"
          placeholder="Filter Supplier"
          value={supplier}
          onChange={(val) => setSupplier(val)}
          onClear={() => setSupplier(null)}
          fetchData={(page, search) =>
            getSupplier({ page: page || 1, limit: 20, search })
          }
          hook={getSupplierResult as any}
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
