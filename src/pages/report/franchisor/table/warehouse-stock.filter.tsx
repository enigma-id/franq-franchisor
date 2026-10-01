/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useInventoryItem } from "@/services/inventory/hooks";
import { useIsSuperuser } from "@/utils/permission";
import TableFilters from "@/components/ui/table/filter";

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
      const found = franchisors.find((c: any) => c.id === current.franchisor_id);
      if (found) setFranchise(found);
    } else if (!current.franchisor_id) {
      setFranchise(null);
    }
  }, [current.franchisor_id, getFranchisorsResult?.data?.data, isSuperuser]);

  // ── Gudang (ikut franchise saat superuser) ──
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

  const { get: getItem, getResult: getItemResult } = useInventoryItem();
  const [item, setItem] = useState<any | null>(null);

  useEffect(() => {
    getItem({ page: 1, limit: 20 });
  }, []);

  useEffect(() => {
    if (current.item_id && getItemResult?.data?.data) {
      const items = getItemResult.data.data as any[];
      const found = items.find((c: any) => c.id === current.item_id);
      if (found) setItem(found);
    } else if (!current.item_id) {
      setItem(null);
    }
  }, [current.item_id, getItemResult?.data?.data]);

  const buildFilters = () => ({
    franchisor_id: franchise?.id ?? "",
    warehouse_id: warehouse?.id ?? "",
    item_id: item?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      f.franchisor_id !== (current.franchisor_id || "") ||
      f.warehouse_id !== (current.warehouse_id || "") ||
      f.item_id !== (current.item_id || "")
    );
  }, [franchise, warehouse, item, current]);

  const anyActive = !!(
    current.franchisor_id ||
    current.warehouse_id ||
    current.item_id
  );

  const handleClear = () => {
    setFranchise(null);
    setWarehouse(null);
    setItem(null);
    table.filter({ franchisor_id: "", warehouse_id: "", item_id: "" });
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
        <RemoteSelect
          label="Item"
          placeholder="Filter Item"
          value={item}
          onChange={(val) => setItem(val)}
          onClear={() => setItem(null)}
          fetchData={(page, search) =>
            getItem({ page: page || 1, limit: 20, search })
          }
          hook={getItemResult as any}
          getLabel={(item: any) =>
            item ? `${item.name}${item.sku ? ` (${item.sku})` : ""}` : ""
          }
          renderItem={(item: any) =>
            item ? `${item.name}${item.sku ? ` - ${item.sku}` : ""}` : ""
          }
          getValue={(item: any) => item.id}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
