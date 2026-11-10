import { Check } from "lucide-react";
import type { Product, ProductOption } from "@/data/product";
import type { Order } from "@/features/order/order.schema";
import { getOrderTotalCents, getSelectedOptions } from "@/features/order/order.calculations";
import { formatCurrency } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { OrderTotal } from "./order-total";
import { getOptionIcon } from "./option-icon";
import { ORDER_DIALOG_TITLE_ID } from "./dialog-ids";

interface OrderConfirmationProps {
  product: Product;
  order: Order;
  onBack: () => void;
}

export function OrderConfirmation({ product, order, onBack }: OrderConfirmationProps) {
  const { fulfillment, extras } = getSelectedOptions(product, order);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-7 md:pt-8 md:pb-7">
      <span className="grid size-12 place-items-center rounded-full bg-primary text-white ring-8 ring-primary-soft">
        <Check className="size-6" strokeWidth={2.5} aria-hidden />
      </span>
      <h2 id={ORDER_DIALOG_TITLE_ID} className="mt-6 text-2xl font-bold tracking-tight">
        Added to your order
      </h2>
      <p className="mt-1 text-sm text-muted">
        {product.name}, {formatCurrency(product.priceCents)}
      </p>

      {/* Receipt: what was chosen, then the total under a dashed rule. */}
      <div className="mt-6 rounded-xl bg-primary-soft px-4 py-4">
        {fulfillment && <ReceiptSection title="Fulfillment" options={[fulfillment]} />}
        {extras.length > 0 && <ReceiptSection title="Extras" options={extras} />}
        <div className="mt-4 border-t border-dashed border-line-strong pt-4">
          <OrderTotal totalCents={getOrderTotalCents(product, order)} />
        </div>
      </div>

      {/* autoFocus moves keyboard focus here once the form is replaced. */}
      <Button variant="outline" className="mt-5 w-full" onClick={onBack} autoFocus>
        Back to product
      </Button>
    </div>
  );
}

function ReceiptSection({ title, options }: { title: string; options: ProductOption[] }) {
  return (
    <section className="not-first:mt-4">
      <h3 className="text-sm text-muted">{title}</h3>
      <ul className="mt-1.5 space-y-1.5">
        {options.map((option) => {
          const Icon = getOptionIcon(option.code);
          return (
            <li key={option.code} className="flex items-center gap-2.5">
              <Icon className="size-4.5 shrink-0 text-primary" strokeWidth={1.6} aria-hidden />
              <span className="flex-1 font-medium">{option.label}</span>
              <span className="tabular-nums">{formatCurrency(option.priceCents)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
