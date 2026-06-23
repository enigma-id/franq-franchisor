/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { OutletForm } from "./components/outletForm";
import { useOutlet } from "@/services/outlet/hooks";

import { Save, RefreshCw } from "lucide-react";
import { Button, Loading } from "@/components/ui";
import { useEnigmaUI } from "@/components";

const OutletUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = useOutlet();
  const { showToast } = useEnigmaUI();
  const { isLoading: isUpdating, isSuccess, reset: resetUpdate } = updateResult;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Outlet berhasil diperbarui",
        type: "success",
      });
      navigate("/setting/outlet");
      resetUpdate();
    }
  }, [isSuccess, navigate, resetUpdate, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Outlet"
        title="Update Outlet"
        subtitle={
          showResult.data?.data
            ? `Perbarui outlet: ${showResult.data.data.name}`
            : "Perbarui informasi outlet yang sudah terdaftar."
        }
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="outlet-form"
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
        }
      />
      <Page.Body>
        <div className="mx-auto py-6">
          {showResult.isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <RefreshCw className="w-8 h-8 text-violet-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Memuat detail outlet...
              </p>
            </div>
          ) : (
            <OutletForm
              id="outlet-form"
              initialData={showResult.data?.data}
              onSubmit={(data) => update({ id: id!, payload: data as any })}
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default OutletUpdatePage;
