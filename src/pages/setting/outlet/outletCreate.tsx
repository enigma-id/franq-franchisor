import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { OutletForm } from "./components/outletForm";
import { useOutlet } from "@/services/outlet/hooks";
import { useNavigate } from "react-router-dom";
import { useEnigmaUI } from "@/components";

import { Save } from "lucide-react";
import { Button, Loading } from "@/components/ui";

const OutletCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = useOutlet();
  const { showToast } = useEnigmaUI();
  const { isLoading: isCreating, isSuccess, reset: resetCreate } = createResult;

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Outlet berhasil dibuat",
        type: "success",
      });
      navigate("/setting/outlet");
      resetCreate();
    }
  }, [isSuccess, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Outlet"
        title="Tambah Outlet Baru"
        subtitle="Daftarkan outlet baru ke dalam sistem Franchisor."
        backTo={() => navigate(-1)}
        action={
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
        }
      />
      <Page.Body>
        <div className="mx-auto py-6">
          <OutletForm
            id="outlet-form"
            onSubmit={(data) => create(data as any)}
            isLoading={isCreating}
          />
        </div>
      </Page.Body>
    </Page>
  );
};

export default OutletCreatePage;
