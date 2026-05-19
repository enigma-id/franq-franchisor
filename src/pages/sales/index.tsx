import React, { useEffect } from "react";
import { useSalesOrder } from "../../services/sales/hooks";
import {
  Card,
  PageHeader,
  Layout,
  Table,
  Badge,
} from "@/components/ui";
import { Receipt, Banknote, History } from "lucide-react";
import { getStatusVariant } from "@/utils";

const SalesPage: React.FC = () => {
  const { orders: sales, isLoadingOrders: isLoading, getOrders: getSales } = useSalesOrder();

  useEffect(() => {
    getSales();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const columns = [
    {
      label: "No. Invoice",
      accessor: "invoice_number",
      class: "font-bold text-primary",
    },
    {
      label: "Outlet",
      accessor: "outlet_name",
    },
    {
      label: "Tanggal",
      accessor: "created_at",
      render: (row: any) => new Date(row.created_at).toLocaleString(),
    },
    {
      label: "Total",
      accessor: "total_amount",
      render: (row: any) => (
        <span className="font-bold">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      label: "Metode Bayar",
      accessor: "payment_method",
      class: "text-xs font-semibold",
    },
    {
      label: "Status",
      accessor: "status",
      render: (row: any) => (
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

  return (
    <Layout.Body>
      <PageHeader
        title="Transaksi Penjualan"
        subtitle="Daftar transaksi penjualan dari seluruh outlet"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="border" className="w-full shadow-none border-base-300">
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Banknote size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
                  Total Pendapatan
                </p>
                <h3 className="text-xl font-bold">
                  {formatCurrency(0)}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card variant="border" className="w-full shadow-none border-base-300">
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                <Receipt size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
                  Total Transaksi
                </p>
                <h3 className="text-xl font-bold">
                  {0}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card variant="border" className="w-full shadow-none border-base-300">
          <Card.Body>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <History size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-widest">
                  Rata-rata Transaksi
                </p>
                <h3 className="text-xl font-bold">
                  {formatCurrency(0)}
                </h3>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card variant="border" className="w-full shadow-none border-base-300">
        <Card.Header title="Riwayat Transaksi" />
        <Card.Body className="p-0">
          <Table
            columns={columns as any}
            data={sales || []}
            loading={isLoading}
            total={sales?.length || 0}
            page={1}
            pageSize={10}
            onPageChange={() => {}}
            className="border-none"
          />
        </Card.Body>
      </Card>
    </Layout.Body>
  );
};

export default SalesPage;
