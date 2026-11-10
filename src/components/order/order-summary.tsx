import type { LineItem } from "@/features/order/order.calculations";
import { formatAddOnPrice, formatCurrency } from "@/lib/format-currency";

interface OrderSummaryProps {
  items: LineItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <section aria-label="Order summary">
      <ul className="space-y-1.5 text-sm">
        {items.map((item, index) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span className="text-muted">{item.label}</span>
            <span className="tabular-nums">
              {/* The shelf is the base price; everything after it is an add-on. */}
              {index === 0 ? formatCurrency(item.price) : formatAddOnPrice(item.price)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="font-medium">Total</span>
        {/* Live region so screen readers hear the new total as selections change. */}
        <output aria-live="polite" data-testid="order-total" className="text-2xl font-medium tabular-nums">
          {formatCurrency(total)}
        </output>
      </div>
    </section>
  );
}
