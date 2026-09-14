/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components/ui";
import { useReport } from "@/services/report/hooks";
import OutletSummaryCards from "./components/OutletSummaryCards";
import SessionTab from "./tabs/SessionTab";
import { ProductSalesReport } from "@/pages/report/pos/productSales";
import { ProductItemReport } from "@/pages/report/pos/productItem";
import { OutstandingReport } from "@/pages/report/pos/outstanding";
import { CancelledProductSalesReport } from "@/pages/report/pos/cancelledProductSales";
import { SettlementReport } from "@/pages/report/pos/settlement";
import { OutletMapReport } from "@/pages/report/franchisor/outletMap";

type OutletTab = { key: string; label: string };

/** Tab untuk brand bertipe `outlet`. */
const TABS_OUTLET: OutletTab[] = [
  { key: "session", label: "Sesi" },
  { key: "outstanding", label: "Outstanding" },
  { key: "settlement", label: "Settlement" },
  { key: "product-sales", label: "Penjualan Produk" },
  { key: "product-item", label: "Penjualan Menu" },
  { key: "cancelled", label: "Transaksi Dibatalkan" },
];

/** Tab untuk brand bertipe `mitra`. */
const TABS_MITRA: OutletTab[] = [
  { key: "session", label: "Sesi" },
  { key: "settlement", label: "Settlement" },
  { key: "product-sales", label: "Penjualan Produk" },
  { key: "product-item", label: "Penjualan Menu" },
  { key: "outlet-maps", label: "Peta Outlet" },
];

export default function OutletReportDetailPage() {
  const { outletId } = useParams<{ outletId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("session");

  const {
    outletReport,
    outletReportResult,
    outletReportSummary,
    outletReportSummaryResult,
  } = useReport();

  useEffect(() => {
    if (outletId) {
      outletReport({ outlet_id: outletId, page: 1, limit: 1 });
      outletReportSummary({ outlet_id: outletId });
    }
  }, [outletId]);

  const outletRow = useMemo(() => {
    const rows = outletReportResult?.data?.data as any[] | undefined;
    return rows?.[0];
  }, [outletReportResult?.data]);

  const outletName = outletRow?.outlet_name as string | undefined;

  // Set tab mengikuti tipe brand outlet-nya.
  const tabs = outletRow?.brand_type === "mitra" ? TABS_MITRA : TABS_OUTLET;

  const summary = outletReportSummaryResult?.data?.data;
  const isLoading =
    outletReportSummaryResult?.isLoading || outletReportResult?.isLoading;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={outletName ? `Rekap Outlet — ${outletName}` : "Rekap Outlet"}
        subtitle='Detail performa outlet beserta rekap per-outlet.'
        backTo={() => navigate("/report/outlet")}
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        {isLoading && !summary ? (
          <div className='flex justify-center py-20'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : (
          <>
            <OutletSummaryCards data={summary} />

            {/* Tab navigasi laporan per-outlet */}
            <div className='flex items-center gap-1 border-b border-slate-200 mb-4 overflow-x-auto'>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-white text-primary border border-b-0 border-slate-200 -mb-px"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {outletId && (
              <div
                key={`${outletId}-${activeTab}`}
                className='flex-1 flex flex-col min-h-0'
              >
                {activeTab === "session" && <SessionTab outletId={outletId} />}
                {activeTab === "outstanding" && (
                  <OutstandingReport outletId={outletId} />
                )}
                {activeTab === "settlement" && (
                  <SettlementReport outletId={outletId} />
                )}
                {activeTab === "product-sales" && (
                  <ProductSalesReport outletId={outletId} />
                )}
                {activeTab === "product-item" && (
                  <ProductItemReport outletId={outletId} />
                )}
                {activeTab === "cancelled" && (
                  <CancelledProductSalesReport outletId={outletId} />
                )}
                {activeTab === "outlet-maps" && (
                  <OutletMapReport outletId={outletId} />
                )}
              </div>
            )}
          </>
        )}
      </Page.Body>
    </Page>
  );
}
