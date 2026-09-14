/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useReport } from "@/services/report/hooks";
import { useIsSuperuser } from "@/utils/permission";
import createTableConfig from "./table/outlet.config";
import TableFilter from "./table/outlet.filter";
import OutletSummaryCards from "./components/OutletSummaryCards";

export default function OutletReportPage() {
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onRowClick: (row: any) => navigate(`/report/outlet/${row.outlet_id}`),
        showBrand: isSuperuser,
      }),
    [navigate, isSuperuser],
  );

  const Table = useTable("report_outlet", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    };
  }, [Table.State?.lockedFilter, Table.State?.filter, Table.State?.textSearch]);

  const currentFilterString = JSON.stringify(currentFilter);

  const { outletReportSummary, outletReportSummaryResult } = useReport();
  const { data: summaryResult } = outletReportSummaryResult;

  useEffect(() => {
    outletReportSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Rekap Outlet'
        subtitle='Rekap performa tiap outlet.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OutletSummaryCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data laporan outlet akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
