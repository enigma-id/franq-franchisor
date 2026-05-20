import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Button, Loading } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import { Save } from "lucide-react";
import { useEnigmaUI } from "@/components";
import {
  StoreOutletForm,
  type StoreOutletFormData,
} from "./components/storeOutletForm";

export function OutletCreate() {
  const navigate = useNavigate();
  const { create, createResult } = useOutlet();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Outlet berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate("/setting/outlet");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  const handleSubmit = (data: StoreOutletFormData) => {
    create(data);
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tambah Outlet"
        subtitle="Registrasikan outlet waralaba baru ke dalam sistem."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="store-outlet-form"
            disabled={isCreating}
            variant="success"
          >
            {isCreating ? (
              <Loading size="sm" variant="spinner" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Outlet
              </>
            )}
          </Button>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
        <StoreOutletForm id="store-outlet-form" onSubmit={handleSubmit} />
      </Page.Body>
    </Page>
  );
}

export default OutletCreate;
