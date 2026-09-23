import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Modal } from "@/components/ui";
import { useBarcodeScanner } from "@/hooks";
import { useDeliveryPlan } from "@/services/warehouse/hooks";
import { useCan } from "@/utils/permission";
import { MENU } from "@/utils/permissions";

const DELIVERY_PLAN_PATH = "/warehouse/delivery-plan";

/**
 * Menangkap hasil scan QR cetakan Delivery Plan (hardware barcode scanner) di
 * level global. QR berisi `ref_code` plan (= code Sales Order), dipakai untuk
 * mencari plan lewat `GET /delivery/plan?ref_code=...`, lalu redirect ke detail.
 */
export function DeliveryPlanScanner() {
  const navigate = useNavigate();
  const canScan = useCan(MENU.deliveryPlan);
  const { get } = useDeliveryPlan();
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const busyRef = useRef(false);

  const handleScan = useCallback(
    async (code: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      try {
        const res = await get({ ref_code: code, page: 1, limit: 1 });
        const plans = res?.data ?? [];
        if (plans.length > 0) {
          navigate(`${DELIVERY_PLAN_PATH}/${plans[0].id}`);
        } else {
          setNotFoundCode(code);
        }
      } catch {
        setNotFoundCode(code);
      } finally {
        busyRef.current = false;
      }
    },
    [get, navigate],
  );

  useBarcodeScanner({ onScan: handleScan, enabled: canScan });

  return (
    <Modal.Wrapper
      open={!!notFoundCode}
      onClose={() => setNotFoundCode(null)}
      closeOnOutsideClick={false}
    >
      <Modal.Header>
        <div className="font-bold leading-7">Data Tidak Ditemukan</div>
      </Modal.Header>
      <Modal.Body className="text-sm font-normal leading-5 space-y-4">
        <p>
          Order dengan kode <strong>{notFoundCode}</strong> tidak ditemukan,
          pastikan QR yang di-scan dari order yang dibuat oleh mitra.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="flex-1 rounded-xl"
          variant="primary"
          onClick={() => setNotFoundCode(null)}
        >
          Tutup
        </Button>
      </Modal.Footer>
    </Modal.Wrapper>
  );
}

export default DeliveryPlanScanner;
