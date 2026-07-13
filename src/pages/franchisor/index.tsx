import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button } from "@/components/ui";
import { useFranchisor } from "@/services/franchisor/hooks";

const FranchisorProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { show, showResult } = useFranchisor();

  useEffect(() => {
    show({});
  }, [show]);

  const data = showResult.data?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Setting"
        title="Profil Franchisor"
        subtitle="Informasi perusahaan waralaba."
        backTo={() => navigate(-1)}
      />
      <Page.Body className="p-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Nama</span>
            <span className="font-semibold">{data?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span>{data?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telepon</span>
            <span>{data?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Alamat</span>
            <span className="text-right max-w-xs">{data?.address}</span>
          </div>
          {data?.logo_url && (
            <div>
              <span className="text-slate-500 block mb-2">Logo</span>
              <img src={data.logo_url} alt="Logo" className="h-20 w-20 object-contain rounded-lg border" />
            </div>
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default FranchisorProfilePage;
