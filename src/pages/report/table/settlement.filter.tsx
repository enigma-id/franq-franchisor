/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import type { SelectOptionValue } from "@/services/types/table";
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

const periodeTypeOptions: SelectOptionValue[] = [
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  // Outlet filter
  const { get: getOutlet, getResult } = useOutlet();
  const [outlet, setOutlet] = useState<any | null>(null);

  useEffect(() => {
    getOutlet({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.outlet_id && getResult?.data?.data) {
      const outlets = getResult.data.data as any[];
      const found = outlets.find((c: any) => c.id === current.outlet_id);
      if (found) {
        setOutlet(found);
      }
    } else if (!current.outlet_id) {
      setOutlet(null);
    }
  }, [current.outlet_id, getResult?.data?.data]);

  // Periode type
  const [periodeType, setPeriodeType] = useState<SelectOptionValue | null>(
    () => {
      const value = current.periode_type as string | undefined;
      return value
        ? (periodeTypeOptions.find((opt) => opt.value === value) ?? null)
        : null;
    },
  );

  // Periode (month picker via simple month/year string)
  const [periode, setPeriode] = useState<string>(
    (current.periode as string) || "",
  );

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  const applyFilters = (updates: any) => {
    const filters = {
      outlet_id: outlet?.id ?? "",
      periode_type: periodeType?.value ?? "",
      periode: periode || "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Outlet: All"
          inputClassName={selectClassName}
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
      <div className="w-40 md:w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Periode: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={periodeTypeOptions}
          value={periodeType}
          onChange={(val) => {
            setPeriodeType(val);
            applyFilters({ periode_type: val?.value || "" });
          }}
          onClear={() => {
            setPeriodeType(null);
            applyFilters({ periode_type: "" });
          }}
          getLabel={(item) => (item ? `Periode: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
    </div>
  );
};

export default TableFilter;
