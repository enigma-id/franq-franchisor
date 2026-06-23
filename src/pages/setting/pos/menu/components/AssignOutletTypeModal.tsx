/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "@/components/ui";
import { useOutletType } from "@/services/outlet/hooks";
import { useEnigmaUI } from "@/components";
import { usePOSMenu } from "@/services/pos/hooks";

interface AssignOutletModalProps {
  catalog: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignOutletTypeModal({
  catalog,
  onClose,
  onSuccess,
}: AssignOutletModalProps) {
  const {
    updateTypes,
    updateTypesResult,
    show: getMenuDetail,
    showResult: menuDetailResult,
  } = usePOSMenu();

  const { get: getOutletTypes, getResult: outletTypesResult } = useOutletType();
  const { showToast } = useEnigmaUI();

  const [selectedTypes, setSelectedTypes] = useState<Record<number, any>>({});

  useEffect(() => {
    getOutletTypes({ limit: 100, page: 1, status: "active" });
    if (catalog?.id) {
      getMenuDetail({ id: catalog.id });
    }
  }, [catalog]);

  useEffect(() => {
    if (menuDetailResult?.isSuccess) {
      const catalogData = menuDetailResult.data?.data as any;
      const outlets = catalogData?.outlet_types;
      if (outlets) {
        const initialSelected: Record<number, any> = {};
        outlets.forEach((ot: any) => {
          const key = ot.outlet_type?.id;
          initialSelected[key] = { ...ot, type_id: key };
        });
        setSelectedTypes(initialSelected);
      }
    }
  }, [menuDetailResult]);

  const handleSave = () => {
    const payload = Object.values(selectedTypes);

    updateTypes({
      id: catalog.id,
      payload: { types: payload?.map((p: any) => p.type_id) },
    });
  };

  useEffect(() => {
    if (updateTypesResult?.isSuccess) {
      showToast({
        message: "Berhasil mengatur tipe outlet",
        type: "success",
        position: "bottom-center",
        duration: 3000,
      });
      onSuccess();
    } else if (updateTypesResult?.isError) {
      showToast({
        message: "Gagal mengatur tipe outlet",
        type: "error",
        position: "bottom-center",
        duration: 3000,
      });
    }
  }, [updateTypesResult]);

  const toggleType = (t: any, checked: boolean) => {
    setSelectedTypes((prev) => {
      const next = { ...prev };
      if (checked) {
        next[t.id] = { ...t, type_id: t.id }; // Mark as selected
      } else {
        delete next[t.id];
      }
      return next;
    });
  };

  const types = outletTypesResult?.data?.data || [];
  const isLoading =
    outletTypesResult?.isLoading || updateTypesResult?.isLoading;

  return (
    <Modal.Wrapper open onClose={onClose} closeOnOutsideClick={false}>
      <Modal.Header>
        <div className="font-bold leading-7">Atur Tipe Outlet</div>
        <div className="text-xs text-slate-500 font-normal mt-1">
          Pilih tipe outlet mana saja yang dapat menggunakan katalog{" "}
          <b>{catalog?.name}</b>
        </div>
      </Modal.Header>
      <Modal.Body className="max-h-[60vh] overflow-y-auto p-5">
        {isLoading ? (
          <div className="text-center py-10 text-sm text-slate-400">
            Loading...
          </div>
        ) : (
          <div className="space-y-3">
            {types.length === 0 ? (
              <div className="text-center py-5 text-sm text-slate-400">
                Tidak ada tipe outlet tersedia
              </div>
            ) : (
              types.map((t: any) => {
                const isChecked = !!selectedTypes[t.id];
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => toggleType(t, !isChecked)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => toggleType(t, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">
                        {t.name}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="flex-1 rounded-xl"
          variant="primary"
          onClick={handleSave}
          isLoading={updateTypesResult?.isLoading}
          disabled={isLoading}
        >
          Simpan
        </Button>
        <Button
          className="flex-1 rounded-xl"
          styleType="outline"
          variant="secondary"
          onClick={onClose}
          disabled={updateTypesResult?.isLoading}
        >
          Batal
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}
