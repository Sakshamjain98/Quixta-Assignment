import { formatCurrency } from "@/lib/format-currency";

interface OrderTotalProps {
  totalCents: number;
}

export function OrderTotal({ totalCents }: OrderTotalProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-primary-soft px-4 py-3">
      <span className="text-lg font-semibold">Total</span>
      {/* Live region so screen readers hear the new total as selections change. */}
      <output aria-live="polite" data-testid="order-total" className="text-2xl font-bold tabular-nums">
        {formatCurrency(totalCents)}
      </output>
    </div>
  );
}
