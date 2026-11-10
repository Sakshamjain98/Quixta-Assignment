import { Check, X } from "lucide-react";
import type { Order } from "@/features/order/order.schema";
import { getLineItems, getOrderTotal } from "@/features/order/order.calculations";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { OrderSummary } from "./order-summary";
import { DIALOG_COLUMN, ORDER_DIALOG_TITLE_ID } from "./dialog-layout";

interface OrderConfirmationProps {
  order: Order;
  onBack: () => void;
}

export function OrderConfirmation({ order, onBack }: OrderConfirmationProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <IconButton aria-label="Close" onClick={onBack} className="absolute top-3 right-3">
        <X className="size-5" strokeWidth={1.6} aria-hidden />
      </IconButton>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-10 pb-8 lg:pt-16">
        <div className={DIALOG_COLUMN}>
          <span className="grid size-12 place-items-center rounded-full bg-success/10 text-success">
            <Check className="size-6" strokeWidth={2} aria-hidden />
          </span>
          <h2 id={ORDER_DIALOG_TITLE_ID} className="mt-6 text-2xl font-medium tracking-tight">
            Added to your order
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">Here’s a summary of your selection.</p>

          <div className="mt-8 rounded-xl border border-line bg-canvas/60 p-5">
            <h3 className="mb-4 text-sm font-medium">Order summary</h3>
            <OrderSummary items={getLineItems(order)} total={getOrderTotal(order)} />
          </div>
        </div>
      </div>

      <footer className="border-t border-line px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* autoFocus moves keyboard focus here once the form is replaced. */}
        <div className={DIALOG_COLUMN}>
          <Button className="w-full" onClick={onBack} autoFocus>
            Back to product
          </Button>
        </div>
      </footer>
    </div>
  );
}
