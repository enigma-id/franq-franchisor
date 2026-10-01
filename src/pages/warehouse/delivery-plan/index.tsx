/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Layers } from "lucide-react";

import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { useDeliveryPlan } from "@/services/warehouse/hooks";
import type { DeliveryPlanDetail, DeliveryPlanSummary } from "@/services/types";

import createTableConfig from "./table/delivery-plan.config";
import TableFilter from "./table/delivery-plan.filter";

const THEMES = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
};

export default function DeliveryPlanListPage() {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onClick: (row: DeliveryPlanDetail) =>
          navigate(`/warehouse/delivery-plan/${row.id}`),
      }),
    [navigate],
  );

  const Table = useTable("delivery_plan", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(
    () => ({
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    }),
    [Table.State?.filter, Table.State?.textSearch],
  );
  const currentFilterString = JSON.stringify(currentFilter);

  const { summary: getSummary, summaryResult } = useDeliveryPlan();

  useEffect(() => {
    getSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, Table.State !== undefined]);

  const summary = summaryResult?.data?.data as DeliveryPlanSummary | undefined;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Warehouse"
        title="Delivery Plan"
        subtitle="Rencana pengiriman barang dari gudang ke outlet."
      />

      <Page.Body className="flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            label="Total Plan"
            value={summary?.total ?? 0}
            icon={Layers}
            theme={THEMES.blue}
          />
          <SummaryCard
            label="Dalam Proses"
            value={summary?.process ?? 0}
            icon={Clock}
            theme={THEMES.orange}
          />
          <SummaryCard
            label="Selesai"
            value={summary?.completed ?? 0}
            icon={CheckCircle2}
            theme={THEMES.green}
          />
        </div>

        <Table.Tools>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Belum Ada Delivery Plan"
          emptyDescription="Daftar delivery plan akan muncul di sini."
        />

        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
