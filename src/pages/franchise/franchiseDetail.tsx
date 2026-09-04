/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { Loading, Button, Badge } from "@/components/ui";
import { useFranchise } from "@/services/franchise/hooks";
import { formatDateTime, getTypeVariant } from "@/utils";
import type { FranchiseDetail as FranchiseDetailType } from "@/services/types/franchise";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";
import { ArrowLeft, AlertCircle, Edit, Building2 } from "lucide-react";
import OutletList from "./outlet";

export default function FranchiseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult } = useFranchise();
  const franchise = showResult?.data?.data as FranchiseDetailType | undefined;
  const isLoading = showResult?.isLoading || showResult?.isFetching;
  const canManageFranchise = useCan(ACTION.franchise);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  if (isLoading && !franchise) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <Loading size="lg" variant="spinner" />
          </div>
        </Page.Body>
      </Page>
    );
  }

  if (!franchise) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body>
          <div className="flex-1 flex items-center justify-center min-h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 mb-2">
                Franchise tidak ditemukan
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/franchise")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Franchise"
        title={franchise.name}
        subtitle={`Detail franchise & outlet yang terdaftar.`}
        backTo={() => navigate(-1)}
        action={
          canManageFranchise && (
            <div className="flex gap-2">
              <Button
                variant="info"
                onClick={() => navigate(`/franchise/update/${franchise.id}`)}
                title="Edit Franchise"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          )
        }
      />

      <Page.Body className="overflow-auto p-4 md:p-6 space-y-6">
        {/* Info Franchise */}
        <div className="card-info card-animate p-6">
          <div className="card-section-header">
            <div className="card-section-icon">
              <Building2 size={18} />
            </div>
            <h2 className="card-section-title">Informasi Franchise</h2>
          </div>
          <dl className="space-y-1">
            <div className="info-row">
              <dt className="info-label">Nama</dt>
              <dd className="info-value">{franchise.name}</dd>
            </div>
            <div className="info-row">
              <dt className="info-label">Tipe</dt>
              <dd className="info-value">
                <Badge
                  variant={getTypeVariant(franchise.outlet_type?.name)}
                  size="xs"
                  className="px-2.5 font-semibold text-[10px] tracking-wider uppercase"
                >
                  {franchise.outlet_type?.name ?? "-"}
                </Badge>
              </dd>
            </div>
            <div className="info-row">
              <dt className="info-label">Telepon</dt>
              <dd className="info-value">{franchise.phone}</dd>
            </div>
            <div className="info-row">
              <dt className="info-label">Email</dt>
              <dd className="info-value">{franchise.email}</dd>
            </div>
            <div className="info-row flex-col items-start gap-1">
              <dt className="info-label">Alamat</dt>
              <dd className="info-value text-left w-full wrap-break-words mt-0.5">
                {franchise.address || "-"}
              </dd>
            </div>
            <div className="info-row">
              <dt className="info-label">Dibuat Pada</dt>
              <dd className="info-value">
                {formatDateTime(franchise.created_at)}
              </dd>
            </div>
          </dl>
          {franchise.logo_url && (
            <div className="mt-4">
              <dt className="info-label">Logo</dt>
              <img
                src={franchise.logo_url}
                alt={franchise.name}
                className="mt-2 w-16 h-16 rounded-xl object-cover"
              />
            </div>
          )}
        </div>

        {/* List Outlet milik franchise ini */}
        <div className="pt-2">
          <OutletList key={franchise.id} franchiseId={franchise.id} />
        </div>
      </Page.Body>
    </Page>
  );
}
