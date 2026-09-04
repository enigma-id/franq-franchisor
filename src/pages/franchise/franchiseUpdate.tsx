/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { FranchiseForm } from "./components/franchiseForm";
import { useFranchise } from "@/services/franchise/hooks";
import { Save, RefreshCw } from "lucide-react";
import { Button, Loading } from "@/components/ui";
import { useEnigmaUI } from "@/components";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const FranchiseUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useFranchise();
  const { showToast } = useEnigmaUI();
  const { isLoading: isUpdating, isSuccess, reset: resetUpdate } = updateResult;
  const canManage = useCan(ACTION.franchise);

  useEffect(() => {
    if (id) show({ id });
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({ message: "Franchise berhasil diperbarui", type: "success" });
      navigate("/franchise");
      resetUpdate();
    }
  }, [isSuccess, navigate, resetUpdate, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Update Franchise"
        subtitle={
          showResult.data?.data
            ? `Perbarui franchise: ${showResult.data.data.name}`
            : "Perbarui informasi franchise."
        }
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="franchise-form"
              disabled={isUpdating || showResult.isLoading}
              variant="success"
            >
              {isUpdating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body>
        <div className="mx-auto py-6">
          {showResult.isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Memuat detail franchise...
              </p>
            </div>
          ) : (
            <FranchiseForm
              id="franchise-form"
              initialData={showResult.data?.data}
              hideOwnerSection
              onSubmit={(data) => update({ id: id!, payload: data as any })}
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default FranchiseUpdatePage;
