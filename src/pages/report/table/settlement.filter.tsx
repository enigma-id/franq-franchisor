/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import { useOutlet } from "@/services/outlet/hooks";

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

  const { get: getOutlet, getResult } = useOutlet();

  useEffect(() => {
    getOutlet({ page: 1, limit: 20, status: "active" });
  }, []);

  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    if (current.outlet_id && getResult?.data?.data) {
      const outlets = getResult.data.data as any[];
      const found = outlets.find((c) => c.id === current.outlet_id);
      if (found) {
        setOutlet(found);
      }
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getResult?.data?.data]);

  const applyFilters = (updates: any) => {
    const filters = {
      outlet_id: outlet?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Outlet: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={outlet}
          onChange={(val) => {
            setOutlet(val);
            applyFilters({ outlet_id: val?.id || "" });
          }}
          onClear={() => {
            setOutlet(null);
            applyFilters({ outlet_id: "" });
          }}
          fetchData={(page, search) =>
            getOutlet({
              page: page || 1,
              limit: 20,
              search,
            })
          }
          hook={getResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
    </div>
  );
};

export default TableFilter;
