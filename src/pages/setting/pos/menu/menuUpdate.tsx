/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { POSMenuForm } from "./components/menuForm";
import { usePOSMenu } from "@/services/pos/hooks";
import { Loading } from "@/components/ui";
import { useEnigmaUI } from "@/components";

const POSMenuUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show, showResult, update, updateResult } = usePOSMenu();
  const { showToast } = useEnigmaUI();

  useEffect(() => {
    if (id) {
      show({ id });
    }
  }, [id, show]);

  useEffect(() => {
    if (updateResult.isSuccess) {
      showToast({
        message: "Menu berhasil diperbarui",
        type: "success",
      });
      navigate("/setting/pos/menu");
      updateResult.reset?.();
    }
  }, [updateResult.isSuccess, navigate, updateResult, showToast]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="POS Menu"
        title="Update Menu"
        subtitle="Perbarui informasi menu makanan atau minuman."
        backTo={() => navigate(-1)}
      />
      <Page.Body>
        <div className="max-w-4xl mx-auto py-6">
          {showResult.isLoading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" variant="spinner" />
            </div>
          ) : (
            <POSMenuForm
              initialData={showResult.data?.data}
              onSubmit={(data) => update({ id: id!, payload: data as any })}
            />
          )}
        </div>
      </Page.Body>
    </Page>
  );
};

export default POSMenuUpdatePage;
