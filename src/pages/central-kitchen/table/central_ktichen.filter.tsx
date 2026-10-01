/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import TableFilters from "@/components/ui/table/filter";
import { useOutlet } from "@/services/outlet/hooks";
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
  { label: "Published", value: "published" },
  { label: "Completed", value: "completed" },
];

const fulfillmentStatusOptions: SelectOptionValue[] = [
  { label: "New", value: "new" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
];

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

  // ── Fulfillment Status ──
  const [fulfillmentStatus, setFulfillmentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.fulfillment_status;
      return value
        ? (fulfillmentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

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
    fulfillment_status: fulfillmentStatus?.value ?? "",
    franchisor_id: franchise?.id ?? "",
    outlet_id: outlet?.id ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  // ── Dirty check ──
  const isDirty = useMemo(() => {
    const fresh = buildFilters();
    return (
      (fresh.document_status || "") !== (current.document_status || "") ||
      (fresh.fulfillment_status || "") !== (current.fulfillment_status || "") ||
      (fresh.franchisor_id || "") !== (current.franchisor_id || "") ||
      (fresh.outlet_id || "") !== (current.outlet_id || "") ||
      (fresh.start_date || "") !== (current.start_date || "") ||
      (fresh.end_date || "") !== (current.end_date || "")
    );
  }, [
    documentStatus,
    fulfillmentStatus,
    franchise,
    outlet,
    dateRange,
    current,
  ]);

  const anyActive = !!(
    current.document_status ||
    current.fulfillment_status ||
    current.franchisor_id ||
    current.outlet_id ||
    current.start_date ||
    current.end_date
  );

  // ── Handlers ──
  const handleClear = () => {
    setDocumentStatus(null);
    setFulfillmentStatus(null);
    setFranchise(null);
    setOutlet(null);
    setDateRange(undefined);
    table.filter({
      document_status: "",
      fulfillment_status: "",
      franchisor_id: "",
      outlet_id: "",
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
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <RemoteSelect<SelectOptionValue>
          label='Status Dokumen'
          placeholder='Filter Status'
          data={documentStatusOptions}
          value={documentStatus}
          onChange={(opt) => setDocumentStatus(opt)}
          onClear={() => setDocumentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />

        <RemoteSelect<SelectOptionValue>
          label='Fulfillment Status'
          placeholder='Filter Fulfillment'
          data={fulfillmentStatusOptions}
          value={fulfillmentStatus}
          onChange={(opt) => setFulfillmentStatus(opt)}
          onClear={() => setFulfillmentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />

        {isSuperuser && (
          <RemoteSelect
            label='Franchise'
            placeholder='Filter Franchise'
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
              ...(isSuperuser && franchise
                ? { franchisor_id: franchise.id }
                : {}),
            })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
          watchKey={isSuperuser ? (franchise?.id ?? "") : ""}
        />

        <DatePicker
          label='Tanggal Dibuat'
          mode='range'
          value={dateRange}
          onChange={(date) => {
            if (date && !("format" in date)) {
              setDateRange(date as [Dayjs | null, Dayjs | null]);
            } else {
              setDateRange(undefined);
            }
          }}
          placeholder='Filter Tanggal'
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
