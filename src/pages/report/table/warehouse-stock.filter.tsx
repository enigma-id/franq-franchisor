/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { RemoteSelect } from "@/components/ui";
import { useWarehouse } from "@/services/warehouse/hooks";
import { useInventoryItem } from "@/services/inventory/hooks";

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

  // Warehouse filter
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

  // Item filter
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

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  const applyFilters = (updates: any) => {
    const filters = {
      warehouse_id: warehouse?.id ?? "",
      item_id: item?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Warehouse: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={warehouse}
          onChange={(val) => {
            setWarehouse(val);
            applyFilters({ warehouse_id: val?.id || "" });
          }}
          onClear={() => {
            setWarehouse(null);
            applyFilters({ warehouse_id: "" });
          }}
          fetchData={(page, search) =>
            getWarehouse({ page: page || 1, limit: 20, search })
          }
          hook={getWarehouseResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Item: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={item}
          onChange={(val) => {
            setItem(val);
            applyFilters({ item_id: val?.id || "" });
          }}
          onClear={() => {
            setItem(null);
            applyFilters({ item_id: "" });
          }}
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
    </div>
  );
};

export default TableFilter;
