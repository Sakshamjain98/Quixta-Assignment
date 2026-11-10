import type { UseFormRegisterReturn } from "react-hook-form";
import type { ProductOption } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";
import { getOptionIcon } from "./option-icon";

interface FulfillmentSelectorProps {
  options: ProductOption[];
  field: UseFormRegisterReturn<"fulfillment">;
  error?: string;
}

export function FulfillmentSelector({ options, field, error }: FulfillmentSelectorProps) {
  return (
    <fieldset aria-describedby={error ? "fulfillment-error" : undefined}>
      <legend className="mb-2 font-semibold">
        Fulfillment{" "}
        <span className="text-danger" aria-hidden>
          *
        </span>
        <span className="sr-only">(required)</span>
      </legend>
      <div className="grid gap-2.5 md:grid-cols-2">
        {options.map((option) => (
          <OptionCard
            key={option.code}
            id={`fulfillment-${option.code}`}
            type="radio"
            value={option.code}
            title={option.label}
            description={option.priceCents === 0 ? "No extra cost" : undefined}
            price={formatCurrency(option.priceCents)}
            icon={getOptionIcon(option.code)}
            {...field}
          />
        ))}
      </div>
      <FieldError id="fulfillment-error" message={error} />
    </fieldset>
  );
}
