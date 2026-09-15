import config from "@/services/table/const";
import type { ReceivingPlanDetail } from "@/services/types";
import { Badge, Dropdown } from "@/components/ui";
import { Eye, MoreVertical, PackageOpen } from "lucide-react";
import { formatDate, formatDateTime, getStatusVariant } from "@/utils";

const createTableConfig = ({
  onClick,
  filter,
}: {
  onClick?: (row: ReceivingPlanDetail) => void;
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/receiving/plan",
  filter,
  columns: {
    code: {
      title: "Kode Plan",
      sortable: true,
      component: (row: ReceivingPlanDetail) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0'>
            <PackageOpen size={16} />
          </div>
          <div className='flex flex-col'>
            <span className='font-bold text-slate-700'>{row.code || "-"}</span>
            {row.ref_code && (
              <span className='text-[11px] text-slate-400 font-medium uppercase tracking-wider'>
                Ref: {row.ref_code}
              </span>
            )}
          </div>
        </div>
      ),
    },
    sender_name: {
      title: "Pengirim",
      sortable: true,
      component: (row: ReceivingPlanDetail) => (
        <span className='text-slate-600 font-medium'>
          {row.sender_name || "-"}
        </span>
      ),
    },
    warehouse: {
      title: "Gudang",
      component: (row: ReceivingPlanDetail) => (
        <span className='text-slate-600 font-medium'>
          {row.warehouse?.name || "-"}
        </span>
      ),
    },
    plan_date: {
      title: "Tanggal Rencana",
      sortable: true,
      component: (row: ReceivingPlanDetail) => (
        <span className='text-slate-600 font-medium'>
          {formatDate(row.plan_date)}
        </span>
      ),
    },
    document_status: {
      title: "Status Dokumen",
      align: "center",
      class: "text-center",
      component: (row: ReceivingPlanDetail) => (
        <Badge variant={getStatusVariant(row.document_status)} size='xs'>
          {row.document_status?.toLowerCase() || "-"}
        </Badge>
      ),
    },
    receiving_status: {
      title: "Penerimaan",
      align: "center",
      class: "text-center",
      component: (row: ReceivingPlanDetail) => (
        <Badge variant={getStatusVariant(row.receiving_status)} size='xs'>
          {row.receiving_status?.toLowerCase() || "-"}
        </Badge>
      ),
    },
    created_at: {
      title: "Dibuat",
      sortable: true,
      component: (row: ReceivingPlanDetail) => (
        <div className='flex flex-col gap-0.5'>
          <span className='text-[13px] font-medium text-gray-700'>
            {formatDateTime(row?.created_at)}
          </span>
          <span className='text-[12px] text-gray-500'>
            by {row?.created_by || "-"}
          </span>
        </div>
      ),
    },
    action: {
      title: "",
      align: "right",
      sortable: false,
      class: "text-right",
      component: (row: ReceivingPlanDetail) => (
        <Dropdown
          trigger={
            <button className='p-2 rounded-lg hover:bg-slate-100 transition-colors'>
              <MoreVertical className='w-5 h-5 text-slate-600' />
            </button>
          }
          position='end'
          contentClassName='dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2'
        >
          <Dropdown.Item
            onSelect={() => onClick?.(row)}
            className='hover:bg-green-50 hover:text-green-600'
          >
            <button className='flex items-center py-1 gap-3 rounded-xl text-slate-700'>
              <div className='w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-success'>
                <Eye className='w-4 h-4' />
              </div>
              <div className='flex flex-col items-start leading-tight'>
                <span className='font-bold text-[13px]'>Lihat Detail</span>
                <span className='text-[11px] text-slate-400'>
                  Lihat detail receiving plan
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
