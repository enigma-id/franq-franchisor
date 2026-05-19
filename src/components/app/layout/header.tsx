import type { FC, ReactNode } from "react";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components";

interface HeaderProps {
  className?: string;
  action?: ReactNode;
  actionDisabled?: boolean;
  title?: ReactNode;
  titleClassName?: string;
  category?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  backTo?: () => void;
}

const Header: FC<HeaderProps> = ({
  className,
  backTo,
  action,
  category,
  subtitle,
  title,
  titleClassName,
  children,
}) => {
  return (
    <div
      className={clsx(
        "p-6 lg:px-8 lg:pt-8 bg-white shrink-0 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6",
        className,
      )}
    >
      {/* Left Section - Title */}
      <div className="flex flex-col">
        {/* Category Badge */}
        {category && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f1f5f9] border border-[#e2e8f0]/60 rounded-full w-fit mb-3">
            <div className="text-emerald-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-database"
                aria-hidden="true"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                <path d="M3 12A9 3 0 0 0 21 12"></path>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {category}
            </span>
          </div>
        )}

        {/* Main Title with Back Button */}
        <div className="flex items-center gap-3">
          {backTo && (
            <Button
              onClick={backTo}
              styleType="ghost"
              className="btn-circle btn-ghost"
            >
              <ArrowLeft />
            </Button>
          )}
          <div
            className={clsx(
              "text-3xl font-black text-slate-900 tracking-tight leading-none mb-1",
              titleClassName,
            )}
          >
            {title}
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            {subtitle}
          </p>
        )}

        {/* Description (children) */}
        {children && (
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            {children}
          </p>
        )}
      </div>

      {/* Right Section - Action */}
      {action && (
        <div className="flex items-center gap-3 mt-4 md:mt-0">{action}</div>
      )}
    </div>
  );
};

export default Header;
