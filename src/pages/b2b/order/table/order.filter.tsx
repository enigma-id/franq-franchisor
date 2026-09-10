/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useIsSuperuser } from "@/utils/permission";

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
  { label: "Cancelled", value: "cancelled" },
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

  // ── Franchise (khusus superuser) ──
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();
  const [franchise, setFranchise] = useState<any | null>(null);

  useEffect(() => {
    getFranchisors({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.franchisor_id && getFranchisorsResult?.data?.data) {
      const franchisors = getFranchisorsResult.data.data as any[];
      const found = franchisors.find(
        (c: any) => c.id === current.franchisor_id,
      );
      if (found) setFranchise(found);
    } else if (!current.franchisor_id) {
      setFranchise(null);
    }
  }, [current.franchisor_id, getFranchisorsResult?.data?.data]);

  const buildFilters = () => ({
    document_status: documentStatus?.value ?? "",
    payment_status: paymentStatus?.value ?? "",
    franchisor_id: franchise?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.document_status || "") !== (current.document_status || "") ||
      (f.payment_status || "") !== (current.payment_status || "") ||
      (f.franchisor_id || "") !== (current.franchisor_id || "") ||
      (f.start_date || "") !== (current.start_date || "") ||
      (f.end_date || "") !== (current.end_date || "")
    );
  }, [documentStatus, paymentStatus, franchise, dateRange, current]);

  const anyActive = !!(
    current.document_status ||
    current.payment_status ||
    current.franchisor_id ||
    current.start_date ||
    current.end_date
  );

  const handleClear = () => {
    setDocumentStatus(null);
    setPaymentStatus(null);
    setFranchise(null);
    setDateRange(undefined);
    table.filter({
      document_status: "",
      payment_status: "",
      franchisor_id: "",
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
        {isSuperuser && (
          <RemoteSelect
            label="Franchise"
            placeholder="Filter Franchise"
            value={franchise}
            onChange={(val) => setFranchise(val)}
            onClear={() => setFranchise(null)}
            fetchData={(page, search) =>
              getFranchisors({ page: page || 1, limit: 20, search })
            }
            hook={getFranchisorsResult as any}
            getLabel={(item: any) => item?.name ?? ""}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item.id}
          />
        )}
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
