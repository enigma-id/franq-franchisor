/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { FranchiseForm } from "./components/franchiseForm";
import { useFranchise } from "@/services/franchise/hooks";
import { useNavigate } from "react-router-dom";
import { useEnigmaUI } from "@/components";
import { Save } from "lucide-react";
import { Button, Loading } from "@/components/ui";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const FranchiseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = useFranchise();
  const { showToast } = useEnigmaUI();
  const { isLoading: isCreating, isSuccess, reset: resetCreate } = createResult;
  const canManage = useCan(ACTION.franchise);

  useEffect(() => {
    if (isSuccess) {
      showToast({ message: "Franchise berhasil dibuat", type: "success" });
      navigate("/franchise");
      resetCreate();
    }
  }, [isSuccess, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tambah Franchise Baru"
        subtitle="Daftarkan franchise baru ke dalam sistem."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button type="submit" form="franchise-form" disabled={isCreating} variant="success">
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
          <FranchiseForm id="franchise-form" onSubmit={(data) => create(data as any)} />
        </div>
      </Page.Body>
    </Page>
  );
};

export default FranchiseCreatePage;
