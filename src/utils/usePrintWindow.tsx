import { useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

export interface UsePrintWindowOptions {
  width?: number;
  height?: number;
  title?: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export function usePrintWindow({
  width = 400,
  height = 600,
  title = "",
  onClose,
  autoClose = false,
}: UsePrintWindowOptions = {}) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const printWindow = useRef<Window | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const [ready, setReady] = useState(false);

  const open = (
    children: ReactNode,
    size?: { width?: number; height?: number },
  ) => {
    if (!printWindow.current || printWindow.current.closed) {
      const w = size?.width ?? width;
      const h = size?.height ?? height;
      printWindow.current = window.open(
        "",
        title,
        `width=${w},height=${h},left=200,top=200`,
      );

      if (!printWindow.current) {
        console.error("Failed to open print window");
        return;
      }

      const base = printWindow.current.document.createElement("base");
      base.href = window.location.origin;
      printWindow.current.document.head.appendChild(base);

      container.current = printWindow.current.document.createElement("div");
      printWindow.current.document.body.appendChild(container.current);

      const style = printWindow.current.document.createElement("style");
      style.innerHTML = `
        html {
          line-height: 1;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        body {
          font-family: monospace;
          background: #e0e0e0;
          margin: 0;
          padding: 0;
        }
        @page {
          margin: 0;
          size: auto;
        }
        .sheet {
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
          page-break-after: always;
          background: #fff;
          box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
          margin: 5mm auto;
          padding: 0;
          width: 80mm;
          min-height: fit-content;
        }
        .sheet.A4 {
          width: 210mm;
          height: 297mm;
          padding: 10mm 15mm;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media print {
          body {
            background: #fff;
          }
          .sheet {
            box-shadow: none;
            margin: 0 auto;
            page-break-after: always;
          }
          .sheet.A4 {
            width: 210mm;
            height: 297mm;
            padding: 10mm 15mm;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .page-break {
            page-break-after: always;
          }
        }
      `;
      printWindow.current.document.head.appendChild(style);

      const interval = setInterval(() => {
        if (printWindow.current?.closed) {
          clearInterval(interval);
          setContent(null);
          setReady(false);
          rootRef.current = null;
          onClose?.();
        }
      }, 500);

      setReady(true);
    }

    setContent(() => children);
  };

  useEffect(() => {
    if (
      content &&
      container.current &&
      printWindow.current &&
      !printWindow.current.closed
    ) {
      if (!rootRef.current) {
        rootRef.current = createRoot(container.current);
      }
      rootRef.current.render(content);

      // Auto print after render
      setTimeout(() => {
        printWindow.current?.focus();
        printWindow.current?.print();
        if (autoClose) {
          setTimeout(() => {
            printWindow.current?.close();
          }, 300);
        }
      }, 500);
    }
  }, [content, autoClose]);

  return {
    open,
    isOpen: ready,
    print: () => {
      if (printWindow.current && !printWindow.current.closed) {
        printWindow.current.focus();
        printWindow.current.print();
      }
    },
  };
}
