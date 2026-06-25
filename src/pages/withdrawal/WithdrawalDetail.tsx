/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { useEffect } from "react";
import { currencyFormat } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { useWithdrawal } from "@/services/withdrawal/hooks";

export function WithdrawalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { show, showResult } = useWithdrawal();

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  const data = showResult?.data?.data as any;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Withdrawal"
        title="Detail Penarikan"
        subtitle={`ID: ${data.id}`}
        backTo={() => navigate(-1)}
      />
      <Page.Body className="p-6">
        <div className="max-w-xl bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between">
            <span className="text-base-content/60">Outlet</span>
            <span className="font-semibold">{data.outlet?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Jumlah</span>
            <span className="font-bold text-lg">
              {currencyFormat(data.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Status</span>
            <Badge>{data?.status}</Badge>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
