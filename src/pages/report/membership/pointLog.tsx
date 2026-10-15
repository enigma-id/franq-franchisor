/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useEffect } from "react";
import dayjs from "dayjs";
import createTableConfig from "./table/point-log.config";
import TableFilter from "./table/point-log.filter";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useMembershipReport } from "@/services/report/hooks";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import {
  ArrowUpCircle,
  Banknote,
  ListOrdered,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6'>
      <SummaryCard
        label='Total Earn'
        value={currencyFormat(data.total_earn ?? 0)}
        icon={TrendingUp}
        theme={THEMES.green}
      />
      <SummaryCard
        label='Total Redeem'
        value={currencyFormat(data.total_redeem ?? 0)}
        icon={Banknote}
        theme={THEMES.red}
      />
      <SummaryCard
        label='Total Revert'
        value={currencyFormat(data.total_revert ?? 0)}
        icon={RefreshCw}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Revert Earn'
        value={currencyFormat(data.total_revert_earn ?? 0)}
        icon={ArrowUpCircle}
        theme={THEMES.purple}
      />
      <SummaryCard
        label='Total Transaksi'
        value={data.total_count ?? 0}
        icon={ListOrdered}
        theme={THEMES.orange}
      />
    </div>
  );
};

/**
 * Body report reusable — dipakai halaman Mutasi Point standalone, drill-down per
 * member dari Daftar Member (`membership_id` dikunci), dan tab di detail Laporan
 * Outlet (`outlet_id` dikunci saat `outletId` diisi).
 */
export function PointLogReport({
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
        filter: lockOutlet
          ? { outlet_id: outletId, periode: dayjs().format("YYYY-MM") }
          : membershipId
            ? { membership_id: membershipId }
            : undefined,
        lockedFilter: lockOutlet
          ? { outlet_id: outletId }
          : membershipId
            ? { membership_id: membershipId }
            : undefined,
        hideMembership: !!membershipId,
      }),
    [membershipId, lockOutlet, outletId],
  );

  const Table = useTable(
    lockOutlet
      ? "outlet_tab_point_log"
      : membershipId
        ? "report_point_log_detail"
        : "report_point_log",
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

  const { pointLogSummary, pointLogSummaryResult } = useMembershipReport();
  const { data: summaryResult } = pointLogSummaryResult;

  useEffect(() => {
    pointLogSummary(JSON.parse(currentFilterString));
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
        emptyDescription='Data mutasi point akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default function PointLogReportPage() {
  const [params] = useSearchParams();
  const membershipId = params.get("membership_id");

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={membershipId ? "Mutasi Point — Detail" : "Mutasi Point"}
        subtitle='Rekap mutasi point member (earn, redeem, dan pembatalannya).'
        backTo={membershipId ? () => window.history.back() : undefined}
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <PointLogReport membershipId={membershipId ?? undefined} />
      </Page.Body>
    </Page>
  );
}
