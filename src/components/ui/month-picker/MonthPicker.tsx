import { useState } from "react";
import dayjs from "dayjs";
import { Dropdown } from "@/components/ui";
import { Calendar, ChevronDown } from "lucide-react";
import clsx from "clsx";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

interface MonthPickerProps {
  value?: string; // YYYY-MM format
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
  placeholder = "Select month",
  className: _className,
  inputClassName,
  disabled,
}) => {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().format("MM");

  const selectedYear = value ? dayjs(value, "YYYY-MM").year() : currentYear;
  const selectedMonth = value ? dayjs(value, "YYYY-MM").format("MM") : currentMonth;

  const [internalYear, setInternalYear] = useState(selectedYear);

  const selectedMonthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || "";
  const isCurrentPeriod = selectedYear === currentYear && selectedMonth === currentMonth;

  const handleMonthChange = (monthValue: string) => {
    const newValue = `${internalYear}-${monthValue}`;
    onChange?.(newValue);
  };

  const handleYearChange = (year: number) => {
    setInternalYear(year);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(`${currentYear}-${currentMonth}`);
  };

  return (
    <Dropdown
      value={value || ""}
      onChange={() => {}}
      position="end"
      disabled={disabled}
      trigger={
        <button
          className={clsx(
            "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 group",
            inputClassName
          )}
          style={{
            height: "36px",
            minHeight: "36px",
          }}
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {value ? `${selectedMonthLabel} ${selectedYear}` : placeholder}
          </span>
          {value && !isCurrentPeriod && (
            <button
              onClick={handleReset}
              className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      }
      contentClassName="p-3 min-w-72"
    >
      {() => (
        <div className="flex flex-col gap-3">
          {/* Year Controls */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <button
              onClick={() => handleYearChange(internalYear - 1)}
              className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 transition-all"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-16 text-center">
              {internalYear}
            </span>
            <button
              onClick={() => handleYearChange(internalYear + 1)}
              disabled={internalYear >= currentYear}
              className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 transition-all disabled:opacity-40"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* Month Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-2">
            {MONTHS.map((month) => {
              const monthDate = dayjs(`${internalYear}-${month.value}-01`);
              const isFutureMonth =
                internalYear === currentYear && monthDate.isAfter(dayjs());
              const isSelected = selectedMonth === month.value;

              return (
                <button
                  key={month.value}
                  onClick={() => !isFutureMonth && handleMonthChange(month.value)}
                  disabled={isFutureMonth}
                  className={clsx(
                    "px-2 py-2 text-xs font-medium rounded-md transition-all duration-200",
                    isSelected
                      ? "bg-primary text-white"
                      : isFutureMonth
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {month.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Dropdown>
  );
};

export default MonthPicker;
