/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Dropdown } from "@/components/ui";
import { Factory, Eye, Edit, Trash, MoreVertical } from "lucide-react";
import config from "@/services/table/const";
import { getStatusVariant, formatDate } from "@/utils";

const createTableConfig = ({
  onView,
  onEdit,
  onRemove,
  filter,
}: {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (v: any) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/demand/production",
  filter,
  columns: {
    date: {
      title: "Tanggal Rencana",
      sortable: true,
      component: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Factory size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {formatDate(row.date, "DD MMM YYYY")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              {row.number}
            </span>
          </div>
        </div>
      ),
    },
    warehouse: {
      title: "Gudang",
      component: (row: any) => (
        <span className="text-slate-600 font-medium">
          {row.warehouse?.name || "-"}
        </span>
      ),
    },
    status: {
      title: "Status",
      class: "text-center",
      align: "center",
      component: (row: any) => (
        <Badge
          variant={getStatusVariant(row.status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.status?.toLowerCase()}
        </Badge>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      align: "right",
      component: (row: any) => (
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          }
          position="end"
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2 text-left"
        >
          <Dropdown.Item
            onSelect={() => onView(row.id)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">View Details</span>
                <span className="text-[11px] text-slate-400">
                  See production plan info
                </span>
              </div>
            </button>
          </Dropdown.Item>

          {row.status === "draft" && (
            <>
              <Dropdown.Item
                onSelect={() => onEdit(row.id)}
                className="hover:bg-amber-50 hover:text-amber-600"
              >
                <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700 w-full text-left">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Edit</span>
                    <span className="text-[11px] text-slate-400">
                      Modify draft plan
                    </span>
                  </div>
                </button>
              </Dropdown.Item>

              <Dropdown.Item
                onSelect={() => onRemove(row)}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <button className="flex items-center gap-3 py-1 rounded-xl text-slate-700 w-full text-left">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                    <Trash className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-bold text-[13px]">Delete</span>
                    <span className="text-[11px] text-slate-400">
                      Remove plan
                    </span>
                  </div>
                </button>
              </Dropdown.Item>
            </>
          )}
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
