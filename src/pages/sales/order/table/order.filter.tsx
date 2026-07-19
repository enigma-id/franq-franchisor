/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { documentStatusOptions, paymentStatusOptions } from "@/utils/options";
import TableFilters from "@/components/ui/table/filter";
import { useOutlet } from "@/services/outlet/hooks";
import { useWarehouse } from "@/services/warehouse/hooks";

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

  // ── Document Status ──
  const [documentStatus, setDocumentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.document_status;
      return value
        ? (documentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

  // ── Payment Status ──
  const [paymentStatus, setPaymentStatus] = useState<SelectOptionValue | null>(
    () => {
      const value = current.payment_status;
      return value
        ? (paymentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    },
  );

  // ── Outlet ──
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

  // ── Warehouse ──
  const { get: getWarehouse, getResult: getWarehouseResult } = useWarehouse();
  const [warehouse, setWarehouse] = useState<any | null>(null);

  useEffect(() => {
    getWarehouse({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.warehouse_id && getWarehouseResult?.data?.data) {
      const warehouses = getWarehouseResult.data.data as any[];
      const found = warehouses.find((c: any) => c.id === current.warehouse_id);
      if (found) setWarehouse(found);
    } else if (!current.warehouse_id) {
      setWarehouse(null);
    }
  }, [current.warehouse_id, getWarehouseResult?.data?.data]);

  // ── Date Range ──
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

  // ── Build filter payload ──
  const buildFilters = () => ({
    document_status: documentStatus?.value ?? "",
    payment_status: paymentStatus?.value ?? "",
    outlet_id: outlet?.id ?? "",
    warehouse_id: warehouse?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  // ── Dirty check ──
  const isDirty = useMemo(() => {
    const fresh = buildFilters();
    return (
      (fresh.document_status || "") !== (current.document_status || "") ||
      (fresh.payment_status || "") !== (current.payment_status || "") ||
      (fresh.outlet_id || "") !== (current.outlet_id || "") ||
      (fresh.warehouse_id || "") !== (current.warehouse_id || "") ||
      (fresh.start_date || "") !== (current.start_date || "") ||
      (fresh.end_date || "") !== (current.end_date || "")
    );
  }, [documentStatus, paymentStatus, outlet, warehouse, dateRange, current]);

  const anyActive = !!(
    current.document_status ||
    current.payment_status ||
    current.outlet_id ||
    current.warehouse_id ||
    current.start_date ||
    current.end_date
  );

  // ── Handlers ──
  const handleClear = () => {
    setDocumentStatus(null);
    setPaymentStatus(null);
    setOutlet(null);
    setWarehouse(null);
    setDateRange(undefined);
    table.filter({
      document_status: "",
      payment_status: "",
      outlet_id: "",
      warehouse_id: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleFilter = () => {
    table.filter(buildFilters());
  };

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

        <RemoteSelect<SelectOptionValue>
          label="Status Pembayaran"
          placeholder="Filter Pembayaran"
          data={paymentStatusOptions}
          value={paymentStatus}
          onChange={(opt) => setPaymentStatus(opt)}
          onClear={() => setPaymentStatus(null)}
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
          label="Gudang"
          placeholder="Filter Gudang"
          value={warehouse}
          onChange={(val) => setWarehouse(val)}
          onClear={() => setWarehouse(null)}
          fetchData={(page, search) =>
            getWarehouse({ page: page || 1, limit: 20, search })
          }
          hook={getWarehouseResult as any}
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
