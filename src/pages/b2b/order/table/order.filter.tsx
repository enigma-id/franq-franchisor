/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
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
  { label: "Shipped", value: "shipped" },
];

const paymentStatusOptions: SelectOptionValue[] = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Invoiced", value: "invoiced" },
  { label: "Paid", value: "paid" },
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
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.document_status || "") !== (current.document_status || "") ||
      (f.payment_status || "") !== (current.payment_status || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [documentStatus, paymentStatus, dateRange, current]);

  const anyActive = !!(
    current.document_status ||
    current.payment_status ||
    current.start_date ||
    current.end_date
  );

  const handleClear = () => {
    setDocumentStatus(null);
    setPaymentStatus(null);
    setDateRange(undefined);
    table.filter({
      document_status: "",
      payment_status: "",
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
          label="Payment Status"
          placeholder="Filter Payment"
          data={paymentStatusOptions}
          value={paymentStatus}
          onChange={(opt) => setPaymentStatus(opt)}
          onClear={() => setPaymentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
        <DatePicker
          label="Tanggal Dibuat"
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
