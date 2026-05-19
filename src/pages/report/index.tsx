import React, { useState, useEffect } from "react";
import { useReport } from "../../services/report/hooks";
import {
  Card,
  PageHeader,
  Layout,
  Table,
  Badge,
  Tabs,
} from "@/components/ui";
import { FileText, CreditCard, Calendar } from "lucide-react";
type SalesReportItem = any;
type SettlementReportItem = any;
import { getStatusVariant } from "@/utils";

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("sales");
  const {
    salesReport,
    settlementReport,
    isLoading,
    getSalesReport,
    getSettlementReport,
  } = useReport() as any;

  useEffect(() => {
    if (activeTab === "sales") {
      getSalesReport();
    } else {
      getSettlementReport();
    }
  }, [activeTab]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const salesColumns = [
    {
      label: "Tanggal",
      accessor: "date",
      class: "font-medium",
    },
    {
      label: "Outlet",
      accessor: "outlet_name",
      class: "font-bold text-primary",
    },
    {
      label: "Total Pesanan",
      accessor: "total_orders",
      class: "text-center",
    },
    {
      label: "Total Pendapatan",
      accessor: "total_revenue",
      render: (row: SalesReportItem) => (
        <span className="font-bold">{formatCurrency(row.total_revenue)}</span>
      ),
    },
  ];

  const settlementColumns = [
    {
      label: "Tanggal",
      accessor: "date",
      render: (row: SettlementReportItem) =>
        new Date(row.date).toLocaleDateString(),
    },
    {
      label: "Metode Pembayaran",
      accessor: "payment_method",
      class: "font-bold uppercase text-xs",
    },
    {
      label: "Jumlah",
      accessor: "amount",
      render: (row: SettlementReportItem) => (
        <span className="font-bold">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      render: (row: SettlementReportItem) => (
        <Badge
          variant={getStatusVariant(row.status)}
          size="xs"
          className="rounded-full px-2.5 font-semibold text-[10px] tracking-wider"
        >
          {row.status?.toLowerCase()}
        </Badge>
      ),
    },
  ];

  const tabItems = [
    {
      label: "Laporan Penjualan",
      value: "sales",
      icon: <FileText size={16} />,
    },
    {
      label: "Laporan Settlement",
      value: "settlement",
      icon: <CreditCard size={16} />,
    },
  ];

  return (
    <Layout.Body>
      <PageHeader
        title="Laporan & Analitik"
        subtitle="Pantau performa dan rekonsiliasi keuangan Anda"
        actions={
          <div className="flex items-center gap-2 bg-base-100 p-2 rounded-xl border border-base-300">
            <Calendar size={16} className="text-base-content/50" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Mei 2026
            </span>
          </div>
        }
      />

      <div className="mb-6">
        <Tabs
          items={tabItems}
          value={activeTab}
          onChange={(v) => setActiveTab(v)}
          variant="boxed"
          size="md"
        />
      </div>

      <Card variant="border" className="w-full shadow-none border-base-300">
        <Card.Body className="p-0">
          {activeTab === "sales" ? (
            <Table
              columns={salesColumns as any}
              data={salesReport || []}
              loading={isLoading}
              total={salesReport?.length || 0}
              page={1}
              pageSize={10}
              onPageChange={() => {}}
              className="border-none"
            />
          ) : (
            <Table
              columns={settlementColumns as any}
              data={settlementReport || []}
              loading={isLoading}
              total={settlementReport?.length || 0}
              page={1}
              pageSize={10}
              onPageChange={() => {}}
              className="border-none"
            />
          )}
        </Card.Body>
      </Card>
    </Layout.Body>
  );
};

export default ReportPage;
