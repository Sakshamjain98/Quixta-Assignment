import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductExtra, ProductOption } from "@/data/product";
import type { OrderInput } from "@/features/order/order.schema";
import { isExtraAvailable } from "@/features/order/order.calculations";
import { formatAddOnPrice } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";

interface ExtrasSelectorProps {
  extras: ProductExtra[];
  fulfillmentOptions: ProductOption[];
  fulfillment: string | null | undefined;
  register: UseFormRegister<OrderInput>;
  errors?: FieldErrors<OrderInput>["extras"];
}

export function ExtrasSelector({ extras, fulfillmentOptions, fulfillment, register, errors }: ExtrasSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">
        Extras <span className="font-normal text-muted">· optional</span>
      </legend>
      <div className="grid gap-3">
        {extras.map((extra) => {
          const available = isExtraAvailable(extra, fulfillment);
          const required = fulfillmentOptions.find((option) => option.code === extra.requires);
          const error = errors?.[extra.code]?.message;

          return (
            <div key={extra.code}>
              <OptionCard
                id={`extra-${extra.code}`}
                type="checkbox"
                title={extra.label}
                price={formatAddOnPrice(extra.priceCents)}
                description={available || !required ? undefined : `Available with ${required.label} only`}
                disabled={!available}
                aria-invalid={error ? true : undefined}
                {...register(`extras.${extra.code}`)}
              />
              <FieldError id={`extra-${extra.code}-error`} message={error} />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
