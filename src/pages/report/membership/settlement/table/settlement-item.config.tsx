/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { Badge } from "@/components/ui";
import { currencyFormat, formatDate } from "@/utils";
import type { TableConfig } from "@/services/table/const";

const TYPE_LABEL: Record<string, string> = {
  topup_cash: "Topup Cash",
  topup_transfer: "Topup Transfer",
  payment_saldo: "Payment Saldo",
  payment_point: "Payment Point",
};

const createTableConfig = ({
  settlementId,
}: {
  settlementId: string;
}): TableConfig<any> => ({
  ...config,
  url: "/report/membership-settlement/items",
  // `filter` menjamin nilainya fresh tiap boot; `lockedFilter` menahannya saat Clear.
  filter: { settlement_id: settlementId },
  lockedFilter: { settlement_id: settlementId },
  columns: {
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>{row?.date ? formatDate(row.date) : "-"}</span>
      ),
    },
    type: {
      title: "Tipe",
      sortable: true,
      component: (row: any) => (
        <span className='text-sm'>
          {TYPE_LABEL[row?.type] || row?.type || "-"}
        </span>
      ),
    },
    kind: {
      title: "Jenis",
      sortable: true,
      component: (row: any) => (
        <Badge variant={row?.kind === "reversal" ? "warning" : "info"}>
          {row?.kind || "-"}
        </Badge>
      ),
    },
    reference_code: {
      title: "Reference Code",
      sortable: true,
      component: (row: any) => (
        <span className='font-medium text-sm'>{row?.reference_code || "-"}</span>
      ),
    },
    amount: {
      title: "Nominal",
      align: "right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => {
        const amount = row?.amount ?? 0;
        return (
          <span
            className={amount < 0 ? "text-red-500 font-semibold" : "text-green-600"}
          >
            {currencyFormat(amount)}
          </span>
        );
      },
    },
  },
});

export default createTableConfig;
