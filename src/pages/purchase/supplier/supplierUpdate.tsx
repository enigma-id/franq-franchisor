/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { SupplierForm, type SupplierFormData } from "./components/supplierForm";
import { useSupplier } from "@/services/supplier/hooks";
import { Loading } from "@/components/ui";
import { Button, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const SupplierUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.supplier);
  const { show, showResult, update, updateResult } = useSupplier();
  const { isLoading: isUpdating, isSuccess } = updateResult;

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Supplier berhasil diperbarui",
        type: "success",
      });
      navigate("/purchase/supplier");
      updateResult.reset?.();
    }
  }, [isSuccess, navigate, updateResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Purchase"
        title="Update Supplier"
        subtitle="Perbarui informasi mitra penyuplai."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="supplier-form"
              disabled={isUpdating}
              variant="success"
            >
              {isUpdating ? (
                <Loading size="sm" variant="spinner" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Supplier
                </>
              )}
            </Button>
          )
        }
      />
      <Page.Body>
        <div className="max-w-4xl mx-auto py-6">
          {showResult.isLoading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" variant="spinner" />
            </div>
          ) : (
            <SupplierForm
              id="supplier-form"
              initialData={showResult.data?.data as any}
              onSubmit={(data) =>
                update({ id: id!, payload: data as SupplierFormData })
              }
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default SupplierUpdatePage;
