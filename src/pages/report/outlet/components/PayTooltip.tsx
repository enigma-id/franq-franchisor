import { useState, type ReactNode } from "react";
import { CreditCard } from "lucide-react";
import type { SessionPaymentMethod } from "@/services/types";
import { currencyFormat } from "@/utils";

/** Tooltip breakdown pembayaran per metode (gaya list session franchisee). */
export const PayTooltip = ({
  children,
  methods,
}: {
  children: ReactNode;
  methods: SessionPaymentMethod[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className='relative inline-block'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <>
          <span className='absolute left-1/2 bottom-full z-50 mb-2.5 -translate-x-1/2'>
            <span className='block whitespace-nowrap rounded-2xl border border-white/60 bg-slate-900/95 px-4 py-3 text-left shadow-2xl shadow-indigo-500/20 backdrop-blur-md'>
              <span className='mb-1.5 flex items-center gap-1.5 border-b border-white/10 pb-1.5'>
                <CreditCard className='h-3 w-3 text-indigo-300' />
                <span className='text-[10px] font-bold uppercase tracking-widest text-indigo-200'>
                  Pembayaran
                </span>
              </span>
              {methods.map((m) => (
                <span
                  key={m.id ?? m.name}
                  className='flex items-center justify-between gap-4 py-0.5'
                >
                  <span className='text-xs font-medium text-slate-200'>
                    {m.name}
                  </span>
                  <span className='ml-3 text-xs font-semibold text-white'>
                    {currencyFormat(m.total_paid)}
                  </span>
                </span>
              ))}
            </span>
            <span className='absolute left-1/2 top-full -mt-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/60 bg-slate-900/95' />
          </span>
        </>
      )}
    </span>
  );
};

export default PayTooltip;
