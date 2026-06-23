/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import type { SelectOptionValue } from "@/services/types/table";
import {
  documentStatusOptions,
  paymentStatusOptions,
  fulfillmentStatusOptions,
} from "@/utils/options";
import { ChevronDown } from "lucide-react";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [docuemntStatus, setdocuemntStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.document_status;
      return value
        ? (documentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

  const [paymentStatus, setPaymentStatus] = useState<SelectOptionValue | null>(
    () => {
      const value = current.payment_status;
      return value
        ? (paymentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    },
  );

  const [fulfillmentStatus, setfulfillmentStatus] =
    useState<SelectOptionValue | null>(() => {
      const value = current.fulfillment_status;
      return value
        ? (fulfillmentStatusOptions.find((opt) => opt.value === value) ?? null)
        : null;
    });

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_at as string | undefined;
    const end = current.end_at as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return undefined;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      start_at: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_at: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
      document_status: docuemntStatus?.value ?? "",
      payment_status: paymentStatus?.value ?? "",
      fulfillment_status: fulfillmentStatus?.value ?? "",
      ...updates,
    };
    table.filter(filters);
  };

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
        start_at: newRange[0]?.format("YYYY-MM-DD") || "",
        end_at: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
  };

  const selectClassName =
    "!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium";

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0 flex-wrap">
      <div className="w-40 md:w-48">
        <RemoteSelect<SelectOptionValue>
          placeholder="Order Status: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={documentStatusOptions}
          value={docuemntStatus}
          onChange={(val) => {
            setdocuemntStatus(val);
            applyFilters({ document_status: val?.value || "" });
          }}
          onClear={() => {
            setdocuemntStatus(null);
            applyFilters({ document_status: "" });
          }}
          getLabel={(item) => (item ? `Status: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
      <div className="w-40 md:w-48">
        <RemoteSelect<SelectOptionValue>
          placeholder="Payment: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={paymentStatusOptions}
          value={paymentStatus}
          onChange={(val) => {
            setPaymentStatus(val);
            applyFilters({ payment_status: val?.value || "" });
          }}
          onClear={() => {
            setPaymentStatus(null);
            applyFilters({ payment_status: "" });
          }}
          getLabel={(item) => (item ? `Payment: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
      <div className="w-40 md:w-48">
        <RemoteSelect<SelectOptionValue>
          placeholder="Fulfillment: All"
          inputClassName={selectClassName}
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={fulfillmentStatusOptions}
          value={fulfillmentStatus}
          onChange={(val) => {
            setfulfillmentStatus(val);
            applyFilters({ fulfillment_status: val?.value || "" });
          }}
          onClear={() => {
            setfulfillmentStatus(null);
            applyFilters({ fulfillment_status: "" });
          }}
          getLabel={(item) => (item ? `Delivery: ${item.label}` : "")}
          renderItem={(item) => item?.label}
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
