/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "@/components/ui";
import { usePOSMenu } from "@/services/pos/hooks";
import { useOutletType } from "@/services/outlet/hooks";
import { useEnigmaUI } from "@/components";

interface AssignMenuOutletTypeModalProps {
  menu: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignMenuOutletTypeModal({
  menu,
  onClose,
  onSuccess,
}: AssignMenuOutletTypeModalProps) {
  const {
    updateTypes,
    updateResult,
    show: getMenuDetail,
    showResult: menuDetailResult,
  } = usePOSMenu();
  const { get: getOutletTypes, getResult: outletTypesResult } = useOutletType();
  const { showToast } = useEnigmaUI();

  const [selectedTypeIds, setSelectedTypeIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    getOutletTypes({ limit: 100, page: 1, status: "active" });
    if (menu?.id) {
      getMenuDetail({ id: menu.id });
    }
  }, [menu]);

  useEffect(() => {
    if (menuDetailResult?.isSuccess) {
      const menuData = menuDetailResult.data?.data as any;
      const ids = menuData?.outlet_type_ids ?? [];
      const initial: Record<string, boolean> = {};
      ids.forEach((id: string) => {
        initial[id] = true;
      });
      setSelectedTypeIds(initial);
    }
  }, [menuDetailResult]);

  const handleSave = () => {
    const payload = Object.keys(selectedTypeIds).filter(
      (id) => selectedTypeIds[id],
    );
    updateTypes({
      id: menu.id,
      payload: { types: payload },
    });
  };

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Berhasil mengatur tipe outlet",
        type: "success",
        position: "bottom-center",
        duration: 3000,
      });
      onSuccess();
    } else if (updateResult?.isError) {
      showToast({
        message: "Gagal mengatur tipe outlet",
        type: "error",
        position: "bottom-center",
        duration: 3000,
      });
    }
  }, [updateResult]);

  const toggleType = (id: string, checked: boolean) => {
    setSelectedTypeIds((prev) => ({ ...prev, [id]: checked }));
  };

  const types = outletTypesResult?.data?.data || [];
  const isLoading = outletTypesResult?.isLoading || menuDetailResult?.isLoading;

  return (
    <Modal.Wrapper open onClose={onClose} closeOnOutsideClick={false}>
      <Modal.Header>
        <div className='font-bold leading-7'>Atur Tipe Outlet</div>
        <div className='text-xs text-slate-500 font-normal mt-1'>
          Pilih tipe outlet mana saja yang tersedia untuk menu{" "}
          <b>{menu?.name}</b>
        </div>
      </Modal.Header>
      <Modal.Body className='max-h-[60vh] overflow-y-auto p-5'>
        {isLoading ? (
          <div className='text-center py-10 text-sm text-slate-400'>
            Loading...
          </div>
        ) : (
          <div className='space-y-3'>
            {types.length === 0 ? (
              <div className='text-center py-5 text-sm text-slate-400'>
                Tidak ada tipe outlet tersedia
              </div>
            ) : (
              types.map((t: any) => (
                <div
                  key={t.id}
                  className='flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors'
                  onClick={() => toggleType(t.id, !selectedTypeIds[t.id])}
                >
                  <Checkbox
                    checked={!!selectedTypeIds[t.id]}
                    onChange={(e) => toggleType(t.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className='text-sm font-semibold text-slate-800'>
                    {t.name}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='flex-1 rounded-xl'
          variant='primary'
          onClick={handleSave}
          isLoading={updateResult?.isLoading}
          disabled={isLoading}
        >
          Simpan
        </Button>
        <Button
          className='flex-1 rounded-xl'
          styleType='outline'
          variant='secondary'
          onClick={onClose}
          disabled={updateResult?.isLoading}
        >
          Batal
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}
