import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductExtra, ProductOption } from "@/data/product";
import type { OrderInput } from "@/features/order/order.schema";
import { isExtraAvailable } from "@/features/order/order.calculations";
import { formatCurrency } from "@/lib/format-currency";
import { OptionCard } from "@/components/ui/option-card";
import { FieldError } from "@/components/ui/field-error";
import { getOptionIcon } from "./option-icon";

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
      <legend className="mb-2.5 flex w-full items-baseline justify-between font-semibold">
        Extras <span className="text-sm font-normal text-muted">Optional</span>
      </legend>
      <div className="grid gap-2">
        {extras.map((extra) => {
          const required = fulfillmentOptions.find((option) => option.code === extra.requires);
          const error = errors?.[extra.code]?.message;

          return (
            <div key={extra.code}>
              <OptionCard
                id={`extra-${extra.code}`}
                type="checkbox"
                title={extra.label}
                description={required ? `Only with ${required.label}` : undefined}
                price={formatCurrency(extra.priceCents)}
                icon={getOptionIcon(extra.code)}
                disabled={!isExtraAvailable(extra, fulfillment)}
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
