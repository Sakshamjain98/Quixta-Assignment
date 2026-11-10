import { Check, X } from "lucide-react";
import type { Product } from "@/data/product";
import type { Order } from "@/features/order/order.schema";
import { getLineItems, getOrderTotalCents } from "@/features/order/order.calculations";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { OrderSummary } from "./order-summary";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-ids";

interface OrderConfirmationProps {
  product: Product;
  order: Order;
  onBack: () => void;
}

export function OrderConfirmation({ product, order, onBack }: OrderConfirmationProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <IconButton aria-label="Close" onClick={onBack} className="absolute top-3 right-3">
        <X className="size-5" strokeWidth={1.6} aria-hidden />
      </IconButton>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-10 pb-8">
        <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Check className="size-6" strokeWidth={2} aria-hidden />
        </span>
        <h2 id={ORDER_DIALOG_TITLE_ID} className="mt-5 text-2xl font-semibold">
          Added to your order
        </h2>

        <div className="mt-6 rounded-xl border border-line bg-canvas p-5">
          <OrderSummary items={getLineItems(product, order)} totalCents={getOrderTotalCents(product, order)} />
        </div>
      </div>

      <footer className="border-t border-line px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* autoFocus moves keyboard focus here once the form is replaced. */}
        <Button className="w-full" onClick={onBack} autoFocus>
          Back to product
        </Button>
      </footer>
    </div>
  );
}
