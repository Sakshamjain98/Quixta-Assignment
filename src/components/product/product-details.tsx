import type { Product } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";
import { OrderDialog } from "@/components/order/order-dialog";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
      <div role="img" aria-label={product.name} className="aspect-[4/3] w-full rounded-lg bg-neutral-300" />

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold md:text-[32px] md:leading-tight">{product.name}</h1>
        <p className="text-muted">{product.description}</p>
        <p className="text-xl tabular-nums md:text-2xl">{formatCurrency(product.priceCents)}</p>
        <div className="mt-2">
          <OrderDialog product={product} />
        </div>
      </div>
    </article>
  );
}
