import React from "react";
import type { LucideIcon } from "lucide-react";

export interface SummaryCardTheme {
  text: string;
  iconBg: string;
  wave: string;
}

export interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon | React.ElementType;
  theme: SummaryCardTheme;
  variant?: "default" | "primary";
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  icon: Icon,
  theme,
  variant = "default",
}) => {
  if (variant === "primary") {
    return (
      <div
        className="bg-white rounded-2xl shadow-md overflow-hidden relative flex items-center p-6 w-full"
        style={{ height: 110 }}
      >
        {/* Background gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, white 30%, ${theme.iconBg})`,
          }}
        />

        {/* Dot stars ornament */}
        <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none overflow-hidden flex justify-end">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 3px, transparent 3px)",
              backgroundSize: "20px 20px",
              maskImage: "linear-gradient(to left, black, transparent)",
            }}
          />
        </div>

        <div className="flex items-center gap-5 relative z-10 w-full">
          {/* Icon with light circle */}
          <div
            className="flex items-center justify-center rounded-full shrink-0 border-[2px] border-white shadow-sm"
            style={{
              width: 64,
              height: 64,
              backgroundColor: theme.iconBg,
            }}
          >
            <Icon className={`w-8 h-8 ${theme.text}`} strokeWidth={2} />
          </div>

          {/* Text content */}
          <div className="flex flex-col justify-center min-w-0 pr-2">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
              {label}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight mt-1 truncate">
              {value}
            </span>
          </div>
        </div>

        {/* Wave decoration - bottom */}
        <svg
          viewBox="0 0 1440 390"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full h-[90px] pointer-events-none"
          style={{ opacity: 0.15, transform: "scaleX(-1)" }}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 0,400 L 0,150 C 36.02017511407078,139.6689 72.04035022814156,129.3378 130,138 C 187.95964977185844,167.3243556542114 267.85877420150456,246.6352447897399 335,285 C 402.14122579849544,323.3647552102601 456.52455296584037,320.7833764952521 503,309 C 549.4754470341596,297.2166235047479 588.0430139351339,276.23124922925143 639,314 C 689.9569860648661,351.76875077074857 753.3033912936243,448.29162658774214 812,497 C 870.6966087063757,545.7083734122579 924.7434208903687,546.6022444197804 977,548 C 1029.2565791096313,549.3977555802196 1079.7229251449007,551.2993957331362 1128,581 C 1176.2770748550993,610.7006042668638 1222.3648785300284,668.2001726476753 1274,701 C 1325.6351214699716,733.7998273523247 1382.8175607349858,741.8999136761623 1440,750 L 1440,400 L 0,400 Z"
            fill={theme.wave}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden bg-white rounded-2xl shadow-md flex items-center justify-between"
      style={{ height: 90, padding: "0 20px" }}
    >
      {/* Text content */}
      <div className="flex flex-col justify-center z-10 min-w-0 pr-2">
        <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase truncate">
          {label}
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mt-0.5 truncate">
          {value}
        </span>
      </div>

      {/* Icon with light circle */}
      <div
        className="z-10 flex items-center justify-center rounded-full shrink-0 border-[2px] border-white shadow-sm"
        style={{
          width: 52,
          height: 52,
          backgroundColor: theme.iconBg,
        }}
      >
        <Icon className={`w-6 h-6 ${theme.text}`} strokeWidth={1.8} />
      </div>

      {/* Wave decoration - bottom */}
      <svg
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full h-[80px] pointer-events-none"
        style={{ opacity: 0.15, transform: "scaleX(-1)" }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0,400 L 0,150 C 36.02017511407078,139.6689 72.04035022814156,129.3378 130,138 C 187.95964977185844,167.3243556542114 267.85877420150456,246.6352447897399 335,285 C 402.14122579849544,323.3647552102601 456.52455296584037,320.7833764952521 503,309 C 549.4754470341596,297.2166235047479 588.0430139351339,276.23124922925143 639,314 C 689.9569860648661,351.76875077074857 753.3033912936243,448.29162658774214 812,497 C 870.6966087063757,545.7083734122579 924.7434208903687,546.6022444197804 977,548 C 1029.2565791096313,549.3977555802196 1079.7229251449007,551.2993957331362 1128,581 C 1176.2770748550993,610.7006042668638 1222.3648785300284,668.2001726476753 1274,701 C 1325.6351214699716,733.7998273523247 1382.8175607349858,741.8999136761623 1440,750 L 1440,400 L 0,400 Z"
          fill={theme.wave}
        />
      </svg>
    </div>
  );
};
