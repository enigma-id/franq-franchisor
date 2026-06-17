import { Dropdown } from "@/components";
import config from "@/services/table/const";
import { Edit, MoreVertical, Trash } from "lucide-react";

const createTableConfig = ({
  onRowClick,
  filter,
  onClick,
  onRemove,
}: {
  onRowClick?: (row: any) => void;
  filter?: Record<string, unknown>;
  onClick?: (row: any) => void;
  onRemove?: (row: any) => void;
}) => ({
  ...config,
  url: "/supplier",
  filter,
  onRowClick,
  columns: {
    name: {
      title: "Nama",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-medium block">{row.name?.toUpperCase()}</span>
          <span className="text-xs text-gray-500 block">{row.code}</span>
        </div>
      ),
    },
    sales_person: {
      title: "Contact Person",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-medium block">
            {row.sales_person?.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 block">
            {row.sales_person_phone}
          </span>
        </div>
      ),
    },
    top: {
      title: "TOP",
      align: "center",
      class: "text-center",
      component: (row: any) => <span>{row.top} Hari</span>,
    },
    lead_time: {
      title: "Lead Time",
      align: "center",
      class: "text-center",
      component: (row: any) => <span>{row.lead_time} Hari</span>,
    },
    is_pkp: {
      title: "PKP Status",
      align: "center",
      class: "text-center",
      component: (row: any) =>
        row.is_pkp ? (
          <span className="text-emerald-500 font-semibold">✓</span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    bank_name: {
      title: "Payment Bank",
      sortable: true,
      component: (row: any) => (
        <div>
          <span className="font-medium block">
            {row.bank_name?.toUpperCase()}
          </span>
          {row.bank_account && (
            <span className="text-xs text-gray-500 block">
              {row.bank_number} ({row.bank_account})
            </span>
          )}
        </div>
      ),
    },
    action: {
      title: "",
      component: (row: any) => (
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          }
          position="end"
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2"
        >
          <Dropdown.Item
            onSelect={() => onClick?.(row)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Edit</span>
                <span className="text-[11px] text-slate-400">
                  Modify supplier info
                </span>
              </div>
            </button>
          </Dropdown.Item>
          <div className="my-1 border-t border-slate-50"></div>
          <Dropdown.Item
            onSelect={() => onRemove?.(row)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                <Trash className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Delete</span>
                <span className="text-[11px] text-slate-400">
                  Remove supplier
                </span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
