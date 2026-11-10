import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, type = "button", ...props }: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-medium text-white shadow-sm transition-colors duration-200",
        "hover:bg-primary-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        "disabled:pointer-events-none disabled:bg-disabled disabled:text-muted",
        className,
      )}
      {...props}
    />
  );
}
