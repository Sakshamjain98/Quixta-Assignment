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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-7 md:pb-7">
      <SuccessBadge />
      <h2 id={ORDER_DIALOG_TITLE_ID} className="mt-4 text-center text-2xl font-bold">
        Added to your order
      </h2>

      <div className="mt-6 divide-y divide-line">
        {fulfillment && <SummarySection title="Fulfillment" options={[fulfillment]} />}
        {extras.length > 0 && <SummarySection title="Extras" options={extras} />}
      </div>

      <div className="mt-4 space-y-4">
        <OrderTotal totalCents={getOrderTotalCents(product, order)} />
        {/* autoFocus moves keyboard focus here once the form is replaced. */}
        <Button variant="outline" className="w-full" onClick={onBack} autoFocus>
          Back to product
        </Button>
      </div>
    </div>
  );
}

function SummarySection({ title, options }: { title: string; options: ProductOption[] }) {
  return (
    <section className="py-3 first:pt-0">
      <h3 className="mb-1.5 font-semibold">{title}</h3>
      <ul className="space-y-1.5">
        {options.map((option) => {
          const Icon = getOptionIcon(option.code);
          return (
            <li key={option.code} className="flex items-center gap-3 pl-1">
              <Icon className="size-5 shrink-0" strokeWidth={1.6} aria-hidden />
              <span className="flex-1">{option.label}</span>
              <span className="tabular-nums">{formatCurrency(option.priceCents)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Green check with a few short rays around it. Decorative. */
function SuccessBadge() {
  const rays = [-60, -30, 30, 60, 120, 150, 210, 240];
  return (
    <div aria-hidden className="relative mx-auto grid size-24 place-items-center">
      {rays.map((deg) => (
        <span
          key={deg}
          className="absolute h-1.5 w-0.5 rounded-full bg-primary/40"
          style={{ transform: `rotate(${deg}deg) translateY(-44px)` }}
        />
      ))}
      <span className="grid size-14 place-items-center rounded-full bg-[#8cc99a] text-white">
        <Check className="size-8" strokeWidth={2.5} />
      </span>
    </div>
  );
}
