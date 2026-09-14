import { useMemo } from "react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "../table/session.config";
import OutletTabFilter from "./OutletTabFilter";

/** Tab Laporan Sesi per-outlet (outlet_id terkunci). */
export function SessionTab({ outletId }: { outletId: string }) {
  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter: { outlet_id: outletId },
        lockedFilter: { outlet_id: outletId },
      }),
    [outletId],
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
