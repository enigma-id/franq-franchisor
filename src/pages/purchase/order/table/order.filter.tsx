/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronDown } from "lucide-react";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import { useOutlet } from "@/services/outlet/hooks";
import { useSupplier } from "@/services/supplier/hooks";

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
  { label: "Published", value: "published" },
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

  // Supplier filter
  const { get: getSupplier, getResult: getSupplierResult } = useSupplier();
  const [supplier, setSupplier] = useState<any | null>(null);

  useEffect(() => {
    getSupplier({ page: 1, limit: 20, status: "active" });
  }, []);

  useEffect(() => {
    if (current.supplier_id && getSupplierResult?.data?.data) {
      const suppliers = getSupplierResult.data.data as any[];
      const found = suppliers.find((c: any) => c.id === current.supplier_id);
      if (found) setSupplier(found);
    } else if (!current.supplier_id) {
      setSupplier(null);
    }
  }, [current.supplier_id, getSupplierResult?.data?.data]);

  // Date range filter
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

  const handleDateChange = (
    date: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    let newRange: [Dayjs | null, Dayjs | null] = [null, null];
    if (date && typeof date !== "string" && !("format" in date)) {
      newRange = date as [Dayjs | null, Dayjs | null];
    }
    setDateRange(newRange);
    if ((newRange[0] && newRange[1]) || (!newRange[0] && !newRange[1])) {
      applyFilters({
        start_date: newRange[0]?.format("YYYY-MM-DD") || "",
        end_date: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
  };

  const applyFilters = (updates: any) => {
    const filters = {
      start_date: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_date: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
      document_status: documentStatus?.value ?? "",
      outlet_id: outlet?.id ?? "",
      supplier_id: supplier?.id ?? "",
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
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Supplier: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={supplier}
          onChange={(val) => {
            setSupplier(val);
            applyFilters({ supplier_id: val?.id || "" });
          }}
          onClear={() => {
            setSupplier(null);
            applyFilters({ supplier_id: "" });
          }}
          fetchData={(page, search) =>
            getSupplier({ page: page || 1, limit: 20, search })
          }
          hook={getSupplierResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
      <div className="w-40 md:w-60">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Date: All Time"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default TableFilter;
