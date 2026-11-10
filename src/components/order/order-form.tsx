"use client";

import { useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { DEFAULT_ORDER_VALUES, orderSchema, type Order, type OrderInput } from "@/features/order/order.schema";
import { getLineItems, getOrderTotal } from "@/features/order/order.calculations";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FulfillmentSelector } from "./fulfillment-selector";
import { AdditionalServices } from "./additional-services";
import { OrderSummary } from "./order-summary";
import { OrderConfirmation } from "./order-confirmation";
import { DIALOG_COLUMN, ORDER_DIALOG_TITLE_ID } from "./dialog-layout";
import { cn } from "@/lib/utils";

interface OrderFormProps {
  onClose: () => void;
}

export function OrderForm({ onClose }: OrderFormProps) {
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrderInput, unknown, Order>({
    resolver: zodResolver(orderSchema),
    defaultValues: DEFAULT_ORDER_VALUES,
  });

  const selection = useWatch({ control });

  if (submittedOrder) {
    return <OrderConfirmation order={submittedOrder} onBack={onClose} />;
  }

  const fulfillmentField = register("fulfillment", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      // Assembly needs delivery: switching to pickup clears it.
      if (event.target.value === "pickup") setValue("assembly", false);
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(setSubmittedOrder)} className="flex min-h-0 flex-1 flex-col">
      <header className="relative border-b border-line px-6 pt-5 pb-5 md:pt-6">
        <div className={cn("pr-10 md:pr-0", DIALOG_COLUMN)}>
          <h2 id={ORDER_DIALOG_TITLE_ID} className="text-xl font-medium tracking-tight">
            Configure your order
          </h2>
          <p className="mt-1 text-sm text-muted">Choose how you’d like to receive your shelf and any extras.</p>
        </div>
        <IconButton aria-label="Close" onClick={onClose} className="absolute top-3 right-3">
          <X className="size-5" strokeWidth={1.6} aria-hidden />
        </IconButton>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {/* Brief: the choices are centered as a group from 768px to 1023px, start-aligned from 1024px. */}
        <div className={cn("flex flex-col gap-8", DIALOG_COLUMN)}>
          <FulfillmentSelector field={fulfillmentField} error={errors.fulfillment?.message} />
          <AdditionalServices
            assemblyField={register("assembly")}
            hardwareKitField={register("hardwareKit")}
            isAssemblyAvailable={selection.fulfillment === "delivery"}
            assemblyError={errors.assembly?.message}
          />
        </div>
      </div>

      <footer className="border-t border-line bg-canvas/60 px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className={cn("space-y-5", DIALOG_COLUMN)}>
          <OrderSummary items={getLineItems(selection)} total={getOrderTotal(selection)} />
          <Button type="submit" className="w-full">
            Add to order
          </Button>
        </div>
      </footer>
    </form>
  );
}
