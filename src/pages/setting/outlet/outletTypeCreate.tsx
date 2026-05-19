import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useOutletType } from "@/services/outlet/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  OutletTypeForm,
  type OutletTypeFormData,
} from "./components/outletTypeForm";

export function OutletTypeCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useOutletType();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Tipe Outlet berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/type/outlet");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: OutletTypeFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="setting"
        title="Tambah Tipe Outlet"
        subtitle="Buat tipe klasifikasi outlet baru."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="outlet-type-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Tipe Outlet
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-6">
        <OutletTypeForm id="outlet-type-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}

export default OutletTypeCreate;
