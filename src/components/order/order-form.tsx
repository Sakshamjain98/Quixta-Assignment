"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { Product } from "@/data/product";
import { createOrderSchema, getDefaultOrderValues, type Order, type OrderInput } from "@/features/order/order.schema";
import { getLineItems, getOrderTotalCents, isExtraAvailable } from "@/features/order/order.calculations";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FulfillmentSelector } from "./fulfillment-selector";
import { ExtrasSelector } from "./extras-selector";
import { OrderSummary } from "./order-summary";
import { OrderConfirmation } from "./order-confirmation";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-ids";

interface OrderFormProps {
  product: Product;
  onClose: () => void;
}

export function OrderForm({ product, onClose }: OrderFormProps) {
  const schema = useMemo(() => createOrderSchema(product), [product]);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrderInput, unknown, Order>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultOrderValues(product),
  });

  const selection = useWatch({ control });

  if (submittedOrder) {
    return <OrderConfirmation product={product} order={submittedOrder} onBack={onClose} />;
  }

  const fulfillmentField = register("fulfillment", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      // Clear extras the new fulfillment doesn't allow (choosing Pickup unchecks Assembly).
      for (const extra of product.extras) {
        if (!isExtraAvailable(extra, event.target.value)) setValue(`extras.${extra.code}`, false);
      }
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(setSubmittedOrder)} className="flex min-h-0 flex-1 flex-col">
      <header className="relative border-b border-line px-6 py-5">
        <h2 id={ORDER_DIALOG_TITLE_ID} className="pr-10 text-xl font-semibold">
          Configure your order
        </h2>
        {/* autoFocus: the form can mount after showModal() (lazy load), so move focus in explicitly. */}
        <IconButton aria-label="Close" onClick={onClose} className="absolute top-3 right-3" autoFocus>
          <X className="size-5" strokeWidth={1.6} aria-hidden />
        </IconButton>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 py-6">
        <FulfillmentSelector options={product.fulfillment} field={fulfillmentField} error={errors.fulfillment?.message} />
        <ExtrasSelector
          extras={product.extras}
          fulfillmentOptions={product.fulfillment}
          fulfillment={selection.fulfillment}
          register={register}
          errors={errors.extras}
        />
      </div>

      <footer className="space-y-5 border-t border-line bg-canvas px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <OrderSummary items={getLineItems(product, selection)} totalCents={getOrderTotalCents(product, selection)} />
        <Button type="submit" className="w-full">
          Add to order
        </Button>
      </footer>
    </form>
  );
}
