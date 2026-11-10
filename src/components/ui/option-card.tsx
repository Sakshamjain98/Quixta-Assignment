import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface OptionCardProps extends Omit<ComponentProps<"input">, "type" | "id"> {
  id: string;
  type: "radio" | "checkbox";
  title: string;
  description: string;
  price: string;
}

const indicator = {
  radio: "rounded-full checked:border-[6px] checked:border-primary",
  checkbox: "checkbox rounded-[5px] checked:border-primary checked:bg-primary",
};

/**
 * A selectable card wrapping a real radio or checkbox input, so keyboard,
 * screen-reader, and form behaviour all stay native.
 */
export function OptionCard({ id, type, title, description, price, ...inputProps }: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-4 rounded-xl border border-line bg-surface px-4 py-4 transition-[border-color,box-shadow] duration-200 sm:px-5",
        "hover:border-line-strong",
        // Border + inset-free ring reads as a 2px outline without shifting layout.
        "has-checked:border-primary has-checked:ring-1 has-checked:ring-primary",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
        "has-disabled:cursor-not-allowed has-disabled:border-line has-disabled:bg-canvas",
      )}
    >
      <input
        id={id}
        type={type}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-price ${id}-description`}
        className={cn(
          "mt-0.5 size-5 shrink-0 cursor-pointer appearance-none border-[1.5px] border-line-strong bg-surface transition-[border-width,border-color,background-color] duration-150",
          "focus-visible:outline-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-canvas",
          indicator[type],
        )}
        {...inputProps}
      />

      <span className="min-w-0 flex-1">
        <span id={`${id}-title`} className="block font-medium leading-6 group-has-disabled:text-muted">
          {title}
        </span>
        <span id={`${id}-description`} className="mt-0.5 block text-sm leading-snug text-muted">
          {description}
        </span>
      </span>

      <span
        id={`${id}-price`}
        className="shrink-0 text-[15px] leading-6 tabular-nums text-ink group-has-disabled:text-muted"
      >
        {price}
      </span>
    </label>
  );
}
