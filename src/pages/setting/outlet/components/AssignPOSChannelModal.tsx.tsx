/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";
import { useEnigmaUI } from "@/components";
import { usePOSChannel } from "@/services/pos/hooks";

interface AssignPOSChannelModalProps {
  data: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignPOSChannelModal({
  data,
  onClose,
  onSuccess,
}: AssignPOSChannelModalProps) {
  const { updateChannel, updateChannelResult, show, showResult } = useOutlet();
  const { get, getResult } = usePOSChannel();
  const { showToast } = useEnigmaUI();

  const [selectedTypes, setSelectedTypes] = useState<Record<number, any>>({});

  useEffect(() => {
    get({ limit: 100, page: 1, status: "active" });
    if (data?.id) {
      show({ id: data.id });
    }
  }, [data]);

  useEffect(() => {
    if (showResult?.isSuccess) {
      const catalogData = showResult.data?.data as any;
      const channels = catalogData?.pos_channels;
      if (channels) {
        const initialSelected: Record<number, any> = {};
        channels.forEach((ot: any) => {
          const key = ot.pos_channel?.id;
          initialSelected[key] = { ...ot, channel_id: key };
        });
        setSelectedTypes(initialSelected);
      }
    }
  }, [showResult]);

  const handleSave = () => {
    const payload = Object.values(selectedTypes);

    updateChannel({
      id: data?.id,
      payload: { channels: payload?.map((p: any) => p.channel_id) },
    });
  };

  useEffect(() => {
    if (updateChannelResult?.isSuccess) {
      showToast({
        message: "Berhasil mengatur pos channel",
        type: "success",
        position: "bottom-center",
        duration: 3000,
      });
      onSuccess();
    } else if (updateChannelResult?.isError) {
      showToast({
        message: "Gagal mengatur pos channel",
        type: "error",
        position: "bottom-center",
        duration: 3000,
      });
    }
  }, [updateChannelResult]);

  const toggleType = (t: any, checked: boolean) => {
    setSelectedTypes((prev) => {
      const next = { ...prev };
      if (checked) {
        next[t.id] = { ...t, channel_id: t.id }; // Mark as selected
      } else {
        delete next[t.id];
      }
      return next;
    });
  };

  const types = getResult?.data?.data || [];
  const isLoading = getResult?.isLoading || showResult?.isLoading;

  return (
    <Modal.Wrapper open onClose={onClose} closeOnOutsideClick={false}>
      <Modal.Header>
        <div className="font-bold leading-7">Atur POS Channel</div>
        <div className="text-xs text-slate-500 font-normal mt-1">
          Pilih channel mana saja yang akan dimasukkan ke
          <b>{data?.name}</b>
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
          isLoading={updateChannelResult?.isLoading}
          disabled={isLoading}
        >
          Simpan
        </Button>
        <Button
          className="flex-1 rounded-xl"
          styleType="outline"
          variant="secondary"
          onClick={onClose}
          disabled={updateChannelResult?.isLoading}
        >
          Batal
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}
