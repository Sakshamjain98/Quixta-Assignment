import { Image as ImageIcon, Package } from "lucide-react";
import type { Product } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";
import { OrderDialog } from "@/components/order/order-dialog";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className="product-card grid gap-5 rounded-2xl border border-line p-4 md:grid-cols-2 md:items-center md:gap-9 md:p-8">
      {/* role="img" makes the box one image named after the product; its contents are presentational. */}
      <div
        role="img"
        aria-label={product.name}
        className="grid aspect-[4/3] w-full place-content-center justify-items-center gap-3 rounded-xl bg-placeholder text-muted"
      >
        <ImageIcon className="size-12" strokeWidth={1.4} />
        <span className="text-lg">{product.name}</span>
      </div>

      <div className="flex flex-col items-start">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-ink">
          <Package className="size-3.5" strokeWidth={2} aria-hidden />
          Wall Shelf
        </span>
        <h1 className="mt-3 text-2xl font-bold md:text-[32px] md:leading-tight">{product.name}</h1>
        <p className="mt-2 text-muted md:text-lg">{product.description}</p>
        <p className="mt-4 text-xl font-bold tabular-nums md:text-2xl">{formatCurrency(product.priceCents)}</p>
        <div className="mt-5 w-full md:w-auto">
          <OrderDialog product={product} />
        </div>
      </div>
    </article>
  );
}
