/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { OutletForm } from "./components/outletForm";
import { useOutlet } from "@/services/outlet/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useEnigmaUI } from "@/components";

import { Save } from "lucide-react";
import { Button, Loading } from "@/components/ui";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const OutletCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { franchiseId } = useParams<{ franchiseId: string }>();
  const { create, createResult } = useOutlet();
  const { showToast } = useEnigmaUI();
  const { isLoading: isCreating, isSuccess, reset: resetCreate } = createResult;
  const canManage = useCan(ACTION.outlet);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Outlet berhasil dibuat",
        type: "success",
      });
      navigate(franchiseId ? `/franchise/${franchiseId}` : "/franchise");
      resetCreate();
    }
  }, [isSuccess, showToast, navigate, franchiseId, resetCreate]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Franchise"
        title="Tambah Outlet Baru"
        subtitle="Daftarkan outlet baru untuk franchise."
        backTo={() => navigate(franchiseId ? `/franchise/${franchiseId}` : "/franchise")}
        action={
          canManage && (
            <Button
              type="submit"
              form="outlet-form"
              disabled={isCreating}
              variant="success"
            >
              {isCreating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body>
        <div className="mx-auto py-6">
          <OutletForm
            id="outlet-form"
            onSubmit={(data) => {
              const { outlet_type_id: _outletTypeId, ...rest } = data as any;
              create({ ...rest, franchise_id: franchiseId } as any);
            }}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default OutletCreatePage;
