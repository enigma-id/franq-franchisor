import { useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import type { ReportSessionRow } from "@/services/types";
import createTableConfig from "../table/session.config";
import OutletTabFilter from "./OutletTabFilter";

/** Tab Laporan Sesi per-outlet (outlet_id terkunci). */
export function SessionTab({ outletId }: { outletId: string }) {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { outlet_id: outletId, periode: dayjs().format("YYYY-MM") },
        lockedFilter: { outlet_id: outletId },
        onDetail: (row: ReportSessionRow) =>
          navigate(`/report/outlet/${outletId}/session/${row.session_id}`),
      }),
    [outletId, navigate],
  );

  const Table = useTable("outlet_tab_session", tableConfig as TableConfig<unknown>);

  return (
    <>
      <Table.Tools downloadable>
        <OutletTabFilter table={Table} showStatus />
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data sesi outlet akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}

export default SessionTab;
