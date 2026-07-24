import React from "react";
import { Button } from "@/components/ui/button";
import type {
  ButtonSize,
  ButtonStyle,
  ButtonVariant,
} from "@/components/ui/button/types";

interface GuardedButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "title"
> {
  allowed: boolean;
  reason: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children?: React.ReactNode;
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
    if (!allowed || isLoading) return;
    onClick(e);
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      styleType={styleType}
      disabled={disabled || !allowed || isLoading}
      onClick={handleClick}
      isLoading={isLoading}
      className={className}
      title={title}
    >
      {children}
    </Button>
  );
};

export default GuardedButton;
