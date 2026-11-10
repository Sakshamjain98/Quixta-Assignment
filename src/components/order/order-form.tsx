"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import type { Product } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";
import { createOrderSchema, getDefaultOrderValues, type Order, type OrderInput } from "@/features/order/order.schema";
import { getOrderTotalCents, isExtraAvailable } from "@/features/order/order.calculations";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FulfillmentSelector } from "./fulfillment-selector";
import { ExtrasSelector } from "./extras-selector";
import { OrderTotal } from "./order-total";
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
      <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-4 md:px-7 md:pt-6">
        <div>
          <h2 id={ORDER_DIALOG_TITLE_ID} className="text-2xl font-bold tracking-tight">
            Add to order
          </h2>
          <p className="mt-0.5 text-sm text-muted">
            {product.name}, {formatCurrency(product.priceCents)}
          </p>
        </div>
        {/* autoFocus: the form can mount after showModal() (lazy load), so move focus in explicitly. */}
        <IconButton aria-label="Close" onClick={onClose} className="-mt-1 -mr-2.5" autoFocus>
          <X className="size-5" strokeWidth={1.8} aria-hidden />
        </IconButton>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-1 pb-5 md:px-7">
        <FulfillmentSelector options={product.fulfillment} field={fulfillmentField} error={errors.fulfillment?.message} />
        <ExtrasSelector
          extras={product.extras}
          fulfillmentOptions={product.fulfillment}
          fulfillment={selection.fulfillment}
          register={register}
          errors={errors.extras}
        />
      </div>

      <footer className="space-y-4 border-t border-line px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-7 md:pb-7">
        <OrderTotal totalCents={getOrderTotalCents(product, selection)} />
        <Button type="submit" className="w-full">
          Add to order
        </Button>
      </footer>
    </form>
  );
}
