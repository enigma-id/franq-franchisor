/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/membership.config";
import TableFilter from "./table/membership.filter";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useMembershipReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Users, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <SummaryCard
        label='Total Member'
        value={data.total_member ?? 0}
        icon={Users}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Total Saldo'
        value={currencyFormat(data.total_saldo ?? 0)}
        icon={Wallet}
        theme={THEMES.blue}
      />
    </div>
  );
};

/**
 * Body report reusable — dipakai halaman Daftar Member standalone dan tab di
 * detail Rekap Outlet (filter `outlet_id` diisi saat dipakai sebagai tab).
 */
export function MembershipReport({ outletId }: { outletId?: string }) {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: outletId ? { outlet_id: outletId } : undefined,
        onRowClick: (row: any) =>
          navigate(
            `/report/membership/saldo-log?membership_id=${row.membership_id}`,
          ),
      }),
    [outletId, navigate],
  );

  const Table = useTable(
    outletId ? "outlet_tab_membership" : "report_membership",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    };
  }, [Table.State?.lockedFilter, Table.State?.filter, Table.State?.textSearch]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { membershipSummary, membershipSummaryResult } = useMembershipReport();
  const { data: summaryResult } = membershipSummaryResult;

  useEffect(() => {
    membershipSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <>
      <OverviewCards data={summary} />

      <Table.Tools downloadable>
        <TableFilter table={Table} />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data member akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default function MembershipReportPage() {
  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Daftar Member'
        subtitle='Rekap member beserta saldo dan transaksi terakhir.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <MembershipReport />
      </Page.Body>
    </Page>
  );
}
