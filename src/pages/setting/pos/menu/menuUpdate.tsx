/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { POSMenuForm } from "./components/menuForm";
import { usePOSMenu } from "@/services/pos/hooks";
import { Loading } from "@/components/ui";
import { Button, useEnigmaUI } from "@/components";
import { Save } from "lucide-react";
import { useCan } from "@/utils/permission";
import { ACTION } from "@/utils/permissions";

const POSMenuUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useEnigmaUI();
  const { show, showResult, update, updateResult } = usePOSMenu();
  const { isLoading: isUpdating, isSuccess } = updateResult;
  const canManage = useCan(ACTION.posMenu);

  // Scope brand saat diedit dari tab Franchise detail.
  const franchisorId = searchParams.get("franchisor_id") ?? undefined;
  const back = searchParams.get("back") ?? "/setting/pos/menu";

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      showToast({
        message: "Menu berhasil diperbarui",
        type: "success",
      });
      navigate(back);
      updateResult.reset?.();
    }
  }, [navigate, back, updateResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Update Menu"
        subtitle="Perbarui informasi menu makanan atau minuman."
        backTo={() => navigate(-1)}
        action={
          canManage && (
            <Button
              type="submit"
              form="pos-catalog-form"
              disabled={isUpdating}
              variant="success"
            >
              {isUpdating ? (
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
        {showResult.isLoading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <POSMenuForm
            id="pos-catalog-form"
            franchisorId={franchisorId}
            initialData={showResult.data?.data}
            onSubmit={(data) => update({ id: id!, payload: data as any })}
          />
        )}
      </Page.Body>
    </Page>
  );
};

export default POSMenuUpdatePage;
