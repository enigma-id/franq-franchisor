/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import TableFilters from "@/components/ui/table/filter";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useIsSuperuser } from "@/utils/permission";

type Opt = { label: string; value: string };

const documentStatusOptions: Opt[] = [
  { label: "New", value: "new" },
  { label: "Published", value: "published" },
  { label: "Process", value: "process" },
  { label: "Completed", value: "completed" },
];

const receivingStatusOptions: Opt[] = [
  { label: "New", value: "new" },
  { label: "Process", value: "process" },
  { label: "Completed", value: "completed" },
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

  // ── Franchise (khusus superuser) ──
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();
  const [franchise, setFranchise] = useState<any | null>(null);

  // Superuser wajib memilih franchise dulu sebelum daftar gudang bisa diambil.
  const canPickWarehouse = !isSuperuser || !!franchise?.id;

  useEffect(() => {
    if (!isSuperuser) return;
    getFranchisors({ page: 1, limit: 20 });
  }, [isSuperuser]);

  useEffect(() => {
    if (!isSuperuser) return;
    if (current.franchisor_id && getFranchisorsResult?.data?.data) {
      const franchisors = getFranchisorsResult.data.data as any[];
      const found = franchisors.find(
        (c: any) => c.id === current.franchisor_id,
      );
      if (found) setFranchise(found);
    } else if (!current.franchisor_id) {
      setFranchise(null);
    }
  }, [current.franchisor_id, getFranchisorsResult?.data?.data, isSuperuser]);

  // ── Gudang ──
  const { get: getWarehouse, getResult: getWarehouseResult } = useWarehouse();
  const [warehouse, setWarehouse] = useState<any | null>(null);

  const warehouseParams = useMemo(
    () => ({
      page: 1,
      limit: 20,
      status: "active",
      ...(isSuperuser ? { franchisor_id: franchise?.id ?? "" } : {}),
    }),
    [isSuperuser, franchise?.id],
  );

  useEffect(() => {
    if (!canPickWarehouse) return;
    getWarehouse(warehouseParams);
  }, [canPickWarehouse, warehouseParams]);

  useEffect(() => {
    if (current.warehouse_id && getWarehouseResult?.data?.data) {
      const items = getWarehouseResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.warehouse_id);
      if (found) setWarehouse(found);
    } else if (!current.warehouse_id) {
      setWarehouse(null);
    }
  }, [current.warehouse_id, getWarehouseResult?.data?.data]);

  const findOpt = (options: Opt[], value?: string): Opt | null =>
    value ? (options.find((o) => o.value === value) ?? null) : null;

  const [documentStatus, setDocumentStatus] = useState<Opt | null>(() =>
    findOpt(documentStatusOptions, current.document_status),
  );
  const [receivingStatus, setReceivingStatus] = useState<Opt | null>(() =>
    findOpt(receivingStatusOptions, current.receiving_status),
  );
  const [planAt, setPlanAt] = useState<Dayjs | undefined>();

  const buildFilters = () => ({
    franchisor_id: franchise?.id ?? "",
    warehouse_id: warehouse?.id ?? "",
    document_status: documentStatus?.value ?? "",
    receiving_status: receivingStatus?.value ?? "",
    plan_date: planAt ? planAt.format("YYYY-MM-DD") : "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      f.franchisor_id !== (current.franchisor_id || "") ||
      f.warehouse_id !== (current.warehouse_id || "") ||
      f.document_status !== (current.document_status || "") ||
      f.receiving_status !== (current.receiving_status || "") ||
      f.plan_date !== (current.plan_date || "")
    );
  }, [franchise, warehouse, documentStatus, receivingStatus, planAt, current]);

  const anyActive = !!(
    current.franchisor_id ||
    current.warehouse_id ||
    current.document_status ||
    current.receiving_status ||
    current.plan_date
  );

  const handleClear = () => {
    setFranchise(null);
    setWarehouse(null);
    setDocumentStatus(null);
    setReceivingStatus(null);
    setPlanAt(undefined);
    table.filter({
      franchisor_id: "",
      warehouse_id: "",
      document_status: "",
      receiving_status: "",
      plan_date: "",
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
        {isSuperuser && (
          <RemoteSelect
            label="Franchise"
            placeholder="Filter Franchise"
            value={franchise}
            onChange={(val) => {
              setFranchise(val);
              setWarehouse(null);
            }}
            onClear={() => {
              setFranchise(null);
              setWarehouse(null);
            }}
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
          label="Tanggal Rencana"
          placeholder="Filter Tanggal Rencana"
          value={planAt}
          onChange={(d) => {
            const date = Array.isArray(d) ? d[0] : d;
            setPlanAt(date ?? undefined);
          }}
        />

        <RemoteSelect
          label="Gudang"
          placeholder={
            canPickWarehouse ? "Filter Gudang" : "Pilih Franchise dulu"
          }
          value={warehouse}
          onChange={(val) => setWarehouse(val)}
          onClear={() => setWarehouse(null)}
          disabled={!canPickWarehouse}
          fetchData={(page, search) =>
            getWarehouse({
              page: page || 1,
              limit: 20,
              search,
              ...(isSuperuser ? { franchisor_id: franchise?.id ?? "" } : {}),
            })
          }
          hook={getWarehouseResult as any}
          getLabel={(item: any) => item?.name ?? ""}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />

        <RemoteSelect<Opt>
          label="Status Dokumen"
          placeholder="Filter Status"
          data={documentStatusOptions}
          value={documentStatus}
          onChange={(opt) => setDocumentStatus(opt)}
          onClear={() => setDocumentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />

        <RemoteSelect<Opt>
          label="Status Penerimaan"
          placeholder="Filter Penerimaan"
          data={receivingStatusOptions}
          value={receivingStatus}
          onChange={(opt) => setReceivingStatus(opt)}
          onClear={() => setReceivingStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
