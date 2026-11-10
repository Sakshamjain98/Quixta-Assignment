import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ComponentProps<"button"> {
  /** Required: icon-only buttons have no visible text. */
  "aria-label": string;
}

export function IconButton({ className, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-grid size-11 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-ink/5",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        className,
      )}
      {...props}
    />
  );
}
