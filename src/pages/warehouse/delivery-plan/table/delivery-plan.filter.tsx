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

const fulfillmentStatusOptions: Opt[] = [
  { label: "New", value: "new" },
  { label: "Process", value: "process" },
  { label: "Completed", value: "completed" },
];

const deliveryTypeOptions: Opt[] = [
  { label: "Shipment", value: "shipment" },
  { label: "Defect", value: "defect" },
  { label: "Transfer", value: "transfer" },
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

  const { get: getWarehouse, getResult: getWarehouseResult } = useWarehouse();
  const [warehouse, setWarehouse] = useState<any | null>(null);

  useEffect(() => {
    getWarehouse({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.warehouse_id && getWarehouseResult?.data?.data) {
      const items = getWarehouseResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.warehouse_id);
      if (found) setWarehouse(found);
    } else if (!current.warehouse_id) {
      setWarehouse(null);
    }
  }, [current.warehouse_id, getWarehouseResult?.data?.data]);

  // ── Franchise (khusus superuser) ──
  const isSuperuser = useIsSuperuser();
  const { get: getFranchisors, getResult: getFranchisorsResult } =
    useFranchisorList();
  const [franchise, setFranchise] = useState<any | null>(null);

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

  const findOpt = (options: Opt[], value?: string): Opt | null =>
    value ? (options.find((o) => o.value === value) ?? null) : null;

  const [type, setType] = useState<Opt | null>(() =>
    findOpt(deliveryTypeOptions, current.type),
  );
  const [documentStatus, setDocumentStatus] = useState<Opt | null>(() =>
    findOpt(documentStatusOptions, current.document_status),
  );
  const [fulfillmentStatus, setFulfillmentStatus] = useState<Opt | null>(() =>
    findOpt(fulfillmentStatusOptions, current.fulfillment_status),
  );
  const [shippingAt, setShippingAt] = useState<Dayjs | undefined>();

  const buildFilters = () => ({
    franchisor_id: franchise?.id ?? "",
    warehouse_id: warehouse?.id ?? "",
    type: type?.value ?? "",
    document_status: documentStatus?.value ?? "",
    fulfillment_status: fulfillmentStatus?.value ?? "",
    shipping_date: shippingAt ? shippingAt.format("YYYY-MM-DD") : "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      f.franchisor_id !== (current.franchisor_id || "") ||
      f.warehouse_id !== (current.warehouse_id || "") ||
      f.type !== (current.type || "") ||
      f.document_status !== (current.document_status || "") ||
      f.fulfillment_status !== (current.fulfillment_status || "") ||
      f.shipping_date !== (current.shipping_date || "")
    );
  }, [
    franchise,
    warehouse,
    type,
    documentStatus,
    fulfillmentStatus,
    shippingAt,
    current,
  ]);

  const anyActive = !!(
    current.franchisor_id ||
    current.warehouse_id ||
    current.type ||
    current.document_status ||
    current.fulfillment_status ||
    current.shipping_date
  );

  const handleClear = () => {
    setFranchise(null);
    setWarehouse(null);
    setType(null);
    setDocumentStatus(null);
    setFulfillmentStatus(null);
    setShippingAt(undefined);
    table.filter({
      franchisor_id: "",
      warehouse_id: "",
      type: "",
      document_status: "",
      fulfillment_status: "",
      shipping_date: "",
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
          label="Tanggal Kirim"
          placeholder="Filter Tanggal Kirim"
          value={shippingAt}
          onChange={(d) => {
            const date = Array.isArray(d) ? d[0] : d;
            setShippingAt(date ?? undefined);
          }}
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

        <RemoteSelect<Opt>
          label="Tipe"
          placeholder="Filter Tipe"
          data={deliveryTypeOptions}
          value={type}
          onChange={(opt) => setType(opt)}
          onClear={() => setType(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
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
          label="Status Fulfillment"
          placeholder="Filter Fulfillment"
          data={fulfillmentStatusOptions}
          value={fulfillmentStatus}
          onChange={(opt) => setFulfillmentStatus(opt)}
          onClear={() => setFulfillmentStatus(null)}
          getLabel={(item) => item?.label ?? ""}
          renderItem={(item) => item?.label}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
