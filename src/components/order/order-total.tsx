import { formatCurrency } from "@/lib/format-currency";

interface OrderTotalProps {
  totalCents: number;
}

export function OrderTotal({ totalCents }: OrderTotalProps) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-semibold">Total</span>
      {/* Live region so screen readers hear the new total as selections change. */}
      <output aria-live="polite" data-testid="order-total" className="text-[28px] leading-none font-bold tabular-nums">
        {formatCurrency(totalCents)}
      </output>
    </div>
  );
}
