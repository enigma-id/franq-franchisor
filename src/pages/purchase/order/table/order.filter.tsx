/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useSupplier } from "@/services/supplier/hooks";
import { useWarehouse } from "@/services/warehouse/hooks";
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
  { label: "Completed", value: "completed" },
];

const paymentStatusOptions: SelectOptionValue[] = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
];

const receivingStatusOptions: SelectOptionValue[] = [
  { label: "New", value: "new" },
  { label: "Disputed", value: "disputed" },
  { label: "Completed", value: "completed" },
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

  const [paymentStatus, setPaymentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.payment_status;
      return value
        ? (paymentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

  const [receivingStatus, setReceivingStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.receiving_status;
      return value
        ? (receivingStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

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

  const { get: getWarehouse, getResult: getWarehouseResult } = useWarehouse();
  const [warehouse, setWarehouse] = useState<any | null>(null);

  useEffect(() => {
    getWarehouse({ page: 1, limit: 20, status: "active" });
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
    payment_status: paymentStatus?.value ?? "",
    receiving_status: receivingStatus?.value ?? "",
    supplier_id: supplier?.id ?? "",
    warehouse_id: warehouse?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.document_status || "") !== (current.document_status || "") ||
      (f.payment_status || "") !== (current.payment_status || "") ||
      (f.receiving_status || "") !== (current.receiving_status || "") ||
      (f.supplier_id || "") !== (current.supplier_id || "") ||
      (f.warehouse_id || "") !== (current.warehouse_id || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [documentStatus, paymentStatus, receivingStatus, supplier, warehouse, dateRange, current]);

  const anyActive = !!(
    current.document_status ||
    current.payment_status ||
    current.receiving_status ||
    current.supplier_id ||
    current.warehouse_id ||
    current.start_date ||
    current.end_date
  );

  const handleClear = () => {
    setDocumentStatus(null);
    setPaymentStatus(null);
    setReceivingStatus(null);
    setSupplier(null);
    setWarehouse(null);
    setDateRange(undefined);
    table.filter({
      document_status: "",
      payment_status: "",
      receiving_status: "",
      supplier_id: "",
      warehouse_id: "",
      start_date: "",
      end_date: "",
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
          placeholder="Filter Payment"
          data={paymentStatusOptions}
          value={paymentStatus}
          onChange={(opt) => setPaymentStatus(opt)}
          onClear={() => setPaymentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <RemoteSelect<SelectOptionValue>
          label="Status Penerimaan"
          placeholder="Filter Receiving"
          data={receivingStatusOptions}
          value={receivingStatus}
          onChange={(opt) => setReceivingStatus(opt)}
          onClear={() => setReceivingStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
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
        <RemoteSelect
          label="Warehouse"
          placeholder="Filter Warehouse"
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
