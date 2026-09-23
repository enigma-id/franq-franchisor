import { useEffect, useRef } from "react";

interface UseBarcodeScannerOptions {
  /** Dipanggil saat kode hasil scan (burst + Enter) terdeteksi. */
  onScan: (code: string) => void;
  /** Listener hanya aktif bila true. */
  enabled?: boolean;
  /** Jarak antar karakter maksimum (ms) agar dianggap satu burst scanner. */
  maxIntervalMs?: number;
  /** Panjang kode minimum agar dianggap hasil scan (bukan ketikan manusia). */
  minLength?: number;
  /** Idle (ms) yang mengosongkan buffer. */
  bufferResetMs?: number;
}

/**
 * Detektor keyboard-wedge untuk hardware barcode scanner (HID).
 *
 * Scanner "mengetik" kode sangat cepat lalu mengirim Enter. Hook ini membedakan
 * burst tersebut dari ketikan manusia lewat jeda antar karakter, lalu memanggil
 * `onScan(code)` saat Enter diterima.
 */
export function useBarcodeScanner({
  onScan,
  enabled = true,
  maxIntervalMs = 80,
  minLength = 4,
  bufferResetMs = 300,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    const clearBuffer = () => {
      bufferRef.current = "";
      lastKeyTimeRef.current = 0;
    };

    const cancelReset = () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const scheduleReset = () => {
      cancelReset();
      resetTimerRef.current = setTimeout(clearBuffer, bufferResetMs);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.key === "Enter") {
        const code = bufferRef.current;
        clearBuffer();
        cancelReset();
        if (code.length >= minLength) {
          event.preventDefault();
          onScanRef.current(code);
        }
        return;
      }

      // Hanya karakter printable (lewati Shift/Tab/panah/dll).
      if (event.key.length !== 1) return;

      const now = Date.now();
      if (now - lastKeyTimeRef.current > maxIntervalMs) {
        bufferRef.current = "";
      }
      bufferRef.current += event.key;
      lastKeyTimeRef.current = now;
      scheduleReset();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelReset();
      clearBuffer();
    };
  }, [enabled, maxIntervalMs, minLength, bufferResetMs]);
}
