/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import createTableConfig from "./table/settlement.config";
import type { SettlementAction } from "./table/settlement.config";
import TableFilter from "./table/settlement.filter";
import SettlementSummaryCards from "./components/SettlementSummaryCards";
import SettlementActionModals from "./components/SettlementActionModals";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useMembershipReport } from "@/services/report/hooks";
import type { MembershipSettlementRow } from "@/services/types";
import { Page } from "@/components/app/layout";
import { useCan, useIsSuperuser } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

/**
 * Body report reusable — dipakai halaman Settlement standalone dan tab di
 * detail Rekap Outlet (filter `outlet_id` dikunci saat `outletId` diisi).
 */
export function MembershipSettlementReport({
  outletId,
}: {
  outletId?: string;
}) {
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();
  const canSettleAction = useCan(ACTION.membershipSettlementSettle);
  // Aksi settle/unsettle/reconcile di BE: slug aksi + wajib superuser.
  const canSettle = isSuperuser && canSettleAction;
  const lockOutlet = !!outletId;

  const [selectedRow, setSelectedRow] =
    useState<MembershipSettlementRow | null>(null);
  const [action, setAction] = useState<SettlementAction | null>(null);

  const closeAction = () => {
    setSelectedRow(null);
    setAction(null);
  };

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: lockOutlet
          ? { outlet_id: outletId, periode: dayjs().format("YYYY-MM") }
          : undefined,
        lockedFilter: lockOutlet ? { outlet_id: outletId } : undefined,
        onDetail: (row: any) =>
          navigate(`/report/membership/settlement/${row.id}`),
        onAction: (row: any, next: SettlementAction) => {
          setSelectedRow(row);
          setAction(next);
        },
        canSettle,
      }),
    [navigate, canSettle, lockOutlet, outletId],
  );

  const Table = useTable(
    lockOutlet
      ? "outlet_tab_membership_settlement"
      : "report_membership_settlement",
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

  const { settlementSummary, settlementSummaryResult } = useMembershipReport();
  const { data: summaryResult } = settlementSummaryResult;

  useEffect(() => {
    settlementSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <>
      <SettlementSummaryCards data={summary} />

      <Table.Tools downloadable>
        <TableFilter table={Table} lockOutlet={lockOutlet} />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data settlement akan muncul di sini.'
      />
      <Table.Pagination />

      {selectedRow && action && (
        <SettlementActionModals
          key={`${selectedRow.id}-${action}`}
          settlement={selectedRow}
          action={action}
          onClose={closeAction}
          onSuccess={() => Table.boot()}
        />
      )}
    </>
  );
}

export default function MembershipSettlementPage() {
  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Settlement'
        subtitle='Rekap settlement HO ↔ outlet (topup & pemakaian saldo/point).'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <MembershipSettlementReport />
      </Page.Body>
    </Page>
  );
}
