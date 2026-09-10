/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Page } from "@/components/app/layout";
import { POSMenuForm } from "./components/menuForm";
import { useProduct } from "@/services/product/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Loading, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const POSMenuCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { create, createResult } = useProduct();
  const { isLoading: isCreating, isSuccess } = createResult;
  const { showToast } = useEnigmaUI();
  const canManage = useCan(ACTION.product);

  // Scope brand: diisi saat create dari tab Franchise detail.
  const franchisorId = searchParams.get("franchisor_id") ?? undefined;
  const back = searchParams.get("back") ?? "/setting/pos/menu";

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Menu berhasil dibuat",
        type: "success",
      });
      navigate(back);
      createResult.reset?.();
    }
  }, [isSuccess, navigate, back, createResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Tambah Menu Baru"
        subtitle="Daftarkan menu makanan atau minuman baru."
        backTo={() => navigate(-1)}
        action={
          canManage && (
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
          )
        }
      />
      <Page.Body>
        <POSMenuForm
          id="pos-catalog-form"
          franchisorId={franchisorId}
          onSubmit={(data) => create(data as any)}
        />
      </Page.Body>
    </Page>
  );
};

export default POSMenuCreatePage;
