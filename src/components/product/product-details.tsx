import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { FULFILLMENT_OPTIONS, PRODUCT } from "@/constants/product";
import { formatCurrency } from "@/lib/format-currency";
import { OrderDialog } from "@/components/order/order-dialog";

const perks = [
  { icon: Truck, text: `Free studio pickup, or delivery for ${formatCurrency(FULFILLMENT_OPTIONS.delivery.price)}` },
  { icon: ShieldCheck, text: "Two-year warranty on materials and finish" },
  { icon: RotateCcw, text: "30-day returns on unused items" },
];

export function ProductDetails() {
  return (
    <div className="flex flex-col md:py-2 lg:py-6">
      <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
        {PRODUCT.category.join(" · ")}
      </p>

      <h1 className="mt-3 text-[2.5rem] leading-[1.1] font-normal tracking-tight lg:text-5xl">{PRODUCT.name}</h1>

      <div className="mt-4 flex items-center gap-4">
        <p className="text-2xl tabular-nums">{formatCurrency(PRODUCT.price)}</p>
        <p className="flex items-center gap-1.5 text-sm text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          In stock
        </p>
      </div>

      <p className="mt-6 max-w-md text-base leading-relaxed text-muted lg:text-[17px]">{PRODUCT.description}</p>

      <div className="mt-8">
        <OrderDialog />
      </div>

      <ul className="mt-8 space-y-3">
        {perks.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-sm leading-5 text-muted">
            <Icon className="size-4.5 shrink-0 text-accent" strokeWidth={1.6} aria-hidden />
            {text}
          </li>
        ))}
      </ul>

      <section aria-labelledby="details-heading" className="mt-10 border-t border-line pt-6">
        <h2 id="details-heading" className="text-sm font-medium">
          Details
        </h2>
        <dl className="mt-2 divide-y divide-line">
          {PRODUCT.details.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
