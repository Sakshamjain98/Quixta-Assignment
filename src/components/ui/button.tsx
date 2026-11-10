import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-sm hover:bg-primary-hover",
  outline: "border-[1.5px] border-primary bg-surface text-primary hover:bg-primary-soft",
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[10px] px-6 text-base font-semibold transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:bg-disabled disabled:text-muted",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
