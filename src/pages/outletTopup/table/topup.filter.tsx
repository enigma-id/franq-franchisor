/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutlet } from "@/services/outlet/hooks";

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
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  // Document status filter
  const [documentStatus, setDocumentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.document_status;
      return value
        ? (documentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

  // Outlet filter
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

  const applyFilters = (updates: any) => {
    const filters = {
      document_status: documentStatus?.value ?? "",
      outlet_id: outlet?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Status: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={documentStatusOptions}
          value={documentStatus}
          onChange={(val) => {
            setDocumentStatus(val);
            applyFilters({ document_status: val?.value || "" });
          }}
          onClear={() => {
            setDocumentStatus(null);
            applyFilters({ document_status: "" });
          }}
          getLabel={(item) => (item ? `Status: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
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
            getOutlet({ page: page || 1, limit: 20, search })
          }
          hook={getOutletResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
    </div>
  );
};

export default TableFilter;
