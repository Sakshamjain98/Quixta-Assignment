import type { UseFormRegisterReturn } from "react-hook-form";
import { FULFILLMENT_KEYS, FULFILLMENT_OPTIONS } from "@/constants/product";
import { formatAddOnPrice } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";

interface FulfillmentSelectorProps {
  field: UseFormRegisterReturn<"fulfillment">;
  error?: string;
}

export function FulfillmentSelector({ field, error }: FulfillmentSelectorProps) {
  return (
    <fieldset aria-describedby={error ? "fulfillment-error" : undefined}>
      <legend className="mb-3 text-sm font-medium">
        Fulfillment <span className="font-normal text-muted">· required</span>
      </legend>
      <div className="grid gap-3">
        {FULFILLMENT_KEYS.map((key) => (
          <OptionCard
            key={key}
            id={`fulfillment-${key}`}
            type="radio"
            value={key}
            title={FULFILLMENT_OPTIONS[key].label}
            description={FULFILLMENT_OPTIONS[key].description}
            price={formatAddOnPrice(FULFILLMENT_OPTIONS[key].price)}
            {...field}
          />
        ))}
      </div>
      <FieldError id="fulfillment-error" message={error} />
    </fieldset>
  );
}
