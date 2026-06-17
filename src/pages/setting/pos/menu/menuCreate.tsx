/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { POSMenuForm } from "./components/menuForm";
import { usePOSMenu } from "@/services/pos/hooks";
import { useNavigate } from "react-router-dom";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";

const POSMenuCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create, createResult } = usePOSMenu();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Menu berhasil dibuat",
        type: "success",
      });
      navigate("/setting/pos/menu");
      createResult.reset?.();
    }
  }, [isSuccess, navigate, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="POS Menu"
        title="Tambah Menu Baru"
        subtitle="Daftarkan menu makanan atau minuman baru."
        backTo={() => navigate(-1)}
        action={
          <Button
            type="submit"
            form="pos-catalog-form"
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
        <POSMenuForm
          id="pos-catalog-form"
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
};

export default POSMenuCreatePage;
