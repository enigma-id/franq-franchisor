/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import createTableConfig from "./table/saldo-log.config";
import TableFilter from "./table/saldo-log.filter";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useMembershipReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, ListOrdered } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <SummaryCard
        label='Total Nominal'
        value={currencyFormat(data.total_nominal ?? 0)}
        icon={Banknote}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Transaksi'
        value={data.total_count ?? 0}
        icon={ListOrdered}
        theme={THEMES.green}
      />
    </div>
  );
};

/**
 * Body report reusable — dipakai halaman Saldo Membership standalone/detail dan
 * tab di detail Laporan Outlet (outlet dikunci saat `outletId` diisi).
 */
export function SaldoLogReport({
  membershipId,
  outletId,
}: {
  membershipId?: string;
  outletId?: string;
}) {
  const lockOutlet = !!outletId;

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: {
          ...(membershipId ? { membership_id: membershipId } : {}),
          ...(lockOutlet ? { outlet_id: outletId } : {}),
        },
        lockedFilter: lockOutlet ? { outlet_id: outletId } : undefined,
      }),
    [membershipId, lockOutlet, outletId],
  );

  const Table = useTable(
    outletId
      ? "outlet_tab_saldo_log"
      : membershipId
        ? "report_saldo_log_detail"
        : "report_saldo_log",
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

  const { saldoLogSummary, saldoLogSummaryResult } = useMembershipReport();
  const { data: summaryResult } = saldoLogSummaryResult;

  useEffect(() => {
    saldoLogSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <>
      <OverviewCards data={summary} />

      <Table.Tools downloadable>
        <TableFilter table={Table} lockOutlet={lockOutlet} />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data mutasi saldo akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default function SaldoLogReportPage() {
  const [params] = useSearchParams();
  const membershipId = params.get("membership_id");

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={
          membershipId ? "Mutasi Saldo — Detail" : "Mutasi Saldo"
        }
        subtitle='Rekap mutasi saldo member (top-up, bonus, dan pemakaian).'
        backTo={membershipId ? () => window.history.back() : undefined}
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <SaldoLogReport membershipId={membershipId ?? undefined} />
      </Page.Body>
    </Page>
  );
}
