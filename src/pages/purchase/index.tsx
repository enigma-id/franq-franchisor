import React, { useEffect } from "react";
import { usePurchaseOrder } from "../../services/purchase/hooks";
import {
  Card,
  PageHeader,
  Layout,
  Table,
  Badge,
  Button,
} from "@/components/ui";
import { Plus, Eye } from "lucide-react";
import { getStatusVariant } from "@/utils";

const PurchasePage: React.FC = () => {
  const { orders: purchases, isLoadingOrders: isLoading, getOrders: getPurchases } = usePurchaseOrder();

  useEffect(() => {
    getPurchases();
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
      label: "No. Pesanan",
      accessor: "order_number",
      class: "font-bold text-primary",
    },
    {
      label: "Outlet",
      accessor: "outlet_name",
    },
    {
      label: "Tanggal",
      accessor: "date",
      render: (row: any) => new Date(row.date).toLocaleDateString(),
    },
    {
      label: "Total Biaya",
      accessor: "total_amount",
      render: (row: any) => (
        <span className="font-bold">{formatCurrency(row.total_amount)}</span>
      ),
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
    {
      label: "Aksi",
      accessor: "id",
      headerClass: "text-center",
      class: "text-center",
      render: () => (
        <Button variant={"ghost" as any} size="sm" shape="square">
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <Layout.Body>
      <PageHeader
        title="Pembelian Stok"
        subtitle="Kelola pesanan stok ke pusat atau supplier"
        actions={
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={16} />
            Buat Pesanan
          </Button>
        }
      />

      <Card variant="border" className="w-full shadow-none border-base-300">
        <Card.Header
          title="Daftar Pembelian"
          badge={purchases?.length?.toString()}
          badgeVariant="primary"
        />
        <Card.Body className="p-0">
          <Table
            columns={columns as any}
            data={purchases || []}
            loading={isLoading}
            total={purchases?.length || 0}
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

export default PurchasePage;
