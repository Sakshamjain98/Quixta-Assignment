import type { Product } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";

interface ProductOptionsProps {
  product: Product;
}

interface Row {
  code: string;
  label: string;
  priceCents: number;
  note?: string;
}

/** A quiet preview of what can be chosen in the order sheet, read from the API. */
export function ProductOptions({ product }: ProductOptionsProps) {
  const extras: Row[] = product.extras.map((extra) => {
    const required = product.fulfillment.find((option) => option.code === extra.requires);
    return { ...extra, note: required ? `with ${required.label}` : undefined };
  });

  return (
    <div className="mt-8 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2">
      <OptionGroup title="Get it by" rows={product.fulfillment} />
      <OptionGroup title="Add if you like" rows={extras} />
    </div>
  );
}

function OptionGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section>
      <h2 className="font-semibold">{title}</h2>
      <dl className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <div key={row.code} className="flex justify-between gap-4">
            <dt className="text-muted">
              {row.label}
              {row.note && <span> ({row.note})</span>}
            </dt>
            <dd className="tabular-nums">{formatCurrency(row.priceCents)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
