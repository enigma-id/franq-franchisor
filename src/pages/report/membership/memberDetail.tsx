/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Loading } from "@/components/ui";
import { useMembershipReport } from "@/services/report/hooks";
import { SaldoLogReport } from "./saldoLog";
import { PointLogReport } from "./pointLog";
import { currencyFormat, formatDate, formatDateTime } from "@/utils";
import type { MembershipReportRow } from "@/services/types";

type MemberTab = { key: string; label: string };

/** Tab mutasi member — data di-scope ke `membership_id` dari URL. */
const TABS: MemberTab[] = [
  { key: "saldo", label: "Mutasi Saldo" },
  { key: "point", label: "Mutasi Point" },
];

/** Satu baris info: label di kiri, nilai di kanan. */
function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0'>
      <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-0.5'>
        {label}
      </span>
      <span className='text-sm text-slate-700 text-right break-words'>
        {value}
      </span>
    </div>
  );
}

export default function MemberDetailPage() {
  const { membershipId } = useParams<{ membershipId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("saldo");

  const { membershipDetail, membershipDetailResult } = useMembershipReport();
  const member = membershipDetailResult?.data?.data as
    | MembershipReportRow
    | undefined;

  useEffect(() => {
    if (membershipId) membershipDetail(membershipId);
  }, [membershipId]);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={member?.name ? `Member — ${member.name}` : "Detail Member"}
        subtitle={
          member?.card_id ? `Card ID: ${member.card_id}` : "Riwayat mutasi member."
        }
        backTo={() => navigate("/report/membership")}
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        {membershipDetailResult?.isLoading && !member ? (
          <div className='flex justify-center py-20'>
            <Loading size='lg' variant='spinner' />
          </div>
        ) : (
          <>
            {member && (
              <div className='bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-4 shrink-0'>
                <div className='flex items-center gap-3 mb-4'>
                  <h2 className='font-bold text-slate-700 text-sm'>
                    Informasi Member
                  </h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8'>
                  <InfoRow label='Nama' value={member.name || "-"} />
                  <InfoRow
                    label='Saldo'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(member.saldo ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Tanggal Daftar'
                    value={member.date ? formatDate(member.date) : "-"}
                  />
                  <InfoRow label='Phone Number' value={member.reff_code || "-"} />
                  <InfoRow
                    label='Poin'
                    value={
                      <span className='font-mono font-semibold'>
                        {currencyFormat(member.point ?? 0)}
                      </span>
                    }
                  />
                  <InfoRow
                    label='Transaksi Terakhir'
                    value={
                      member.last_transaction
                        ? formatDateTime(member.last_transaction)
                        : "-"
                    }
                  />
                  <InfoRow label='Card ID' value={member.card_id || "-"} />
                </div>
              </div>
            )}

            {/* Tab navigasi mutasi member */}
            <div className='flex flex-wrap items-center gap-1 border-b border-slate-200 mb-4'>
              {TABS.map((tab) => (
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

            {membershipId && (
              <div
                key={`${membershipId}-${activeTab}`}
                className='flex-1 flex flex-col min-h-0'
              >
                {activeTab === "saldo" && (
                  <SaldoLogReport membershipId={membershipId} />
                )}
                {activeTab === "point" && (
                  <PointLogReport membershipId={membershipId} />
                )}
              </div>
            )}
          </>
        )}
      </Page.Body>
    </Page>
  );
}
