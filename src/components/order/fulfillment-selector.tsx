import type { UseFormRegisterReturn } from "react-hook-form";
import type { ProductOption } from "@/data/product";
import { formatAddOnPrice } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";

interface FulfillmentSelectorProps {
  options: ProductOption[];
  field: UseFormRegisterReturn<"fulfillment">;
  error?: string;
}

export function FulfillmentSelector({ options, field, error }: FulfillmentSelectorProps) {
  return (
    <fieldset aria-describedby={error ? "fulfillment-error" : undefined}>
      <legend className="mb-3 text-sm font-medium">
        Fulfillment <span className="font-normal text-muted">· required</span>
      </legend>
      <div className="grid gap-3">
        {options.map((option) => (
          <OptionCard
            key={option.code}
            id={`fulfillment-${option.code}`}
            type="radio"
            value={option.code}
            title={option.label}
            price={formatAddOnPrice(option.priceCents)}
            {...field}
          />
        ))}
      </div>
      <FieldError id="fulfillment-error" message={error} />
    </fieldset>
  );
}
