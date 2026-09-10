/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { POSMenuForm } from "./components/menuForm";
import { useProduct } from "@/services/product/hooks";
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
  const { show, showResult, update, updateResult } = useProduct();
  const { isLoading: isUpdating, isSuccess } = updateResult;
  const canManage = useCan(ACTION.product);

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

  // Detail aggregate = { item, catalog, menu }. Form menerima menu, tapi:
  // - base_price  : non-addon berasal dari `item.base_price` (harga dasar/cost).
  //                 `menu.base_price` non-addon diturunkan dari ingredient =
  //                 catalog.unit_price, jadi salah kalau dipakai sebagai harga dasar.
  // - unit_price  & production_price berasal dari catalog (null untuk addon).
  const initialData = useMemo(() => {
    const detail = showResult.data?.data as any;
    if (!detail?.menu) return undefined;

    return {
      ...detail.menu,
      base_price: detail.item?.base_price ?? detail.menu.base_price ?? 0,
      unit_price: detail.catalog?.unit_price ?? 0,
      production_price: detail.catalog?.production_price ?? 0,
    };
  }, [showResult.data]);

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
            isEdit
            initialData={initialData}
            onSubmit={(data) => update({ id: id!, payload: data as any })}
          />
        )}
      </Page.Body>
    </Page>
  );
};

export default POSMenuUpdatePage;
