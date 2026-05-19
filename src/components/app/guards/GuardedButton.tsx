import React from "react";
import { Button } from "@/components/ui/button";
import type {
  ButtonSize,
  ButtonStyle,
  ButtonVariant,
} from "@/components/ui/button/types";
import { Tooltip } from "@/components/ui";

interface GuardedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  allowed: boolean;
  reason: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  styleType?: ButtonStyle;
}

export const GuardedButton: React.FC<GuardedButtonProps> = ({
  allowed,
  reason,
  onClick,
  title,
  children,
  isLoading = false,
  variant = "default",
  size = "md",
  styleType,
  className = "",
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!allowed || isLoading) {
      e.preventDefault();
      return;
    }
    onClick(e);
  };

  const buttonElement = (
    <Button
      {...props}
      variant={variant}
      size={size}
      styleType={styleType}
      disabled={disabled || !allowed || isLoading}
      onClick={handleClick}
      isLoading={isLoading}
      className={`
        ${!allowed ? "opacity-50 cursor-not-allowed pointer-events-auto" : ""}
        ${className}
      `}
    >
      {children}
    </Button>
  );

  const tooltipLabel = allowed
    ? title
    : `${title}\n\n⚠️ ${reason}`;

  const tooltipVariant = allowed ? "neutral" : "error";

  return (
    <Tooltip label={tooltipLabel} position="bottom" variant={tooltipVariant} size="sm">
      {buttonElement}
    </Tooltip>
  );
};

export default GuardedButton;
