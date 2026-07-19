/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useInventoryItem } from "@/services/inventory/hooks";
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
    warehouse_id: warehouse?.id ?? "",
    item_id: item?.id ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      (f.warehouse_id || "") !== (current.warehouse_id || "") ||
      (f.item_id || "") !== (current.item_id || "")
    );
  }, [warehouse, item, current]);

  const anyActive = !!(current.warehouse_id || current.item_id);

  const handleClear = () => {
    setWarehouse(null);
    setItem(null);
    table.filter({ warehouse_id: "", item_id: "" });
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
