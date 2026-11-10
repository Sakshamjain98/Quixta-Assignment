import type { Product } from "@/data/product";
import { formatCurrency } from "@/lib/format-currency";
import { OrderDialog } from "@/components/order/order-dialog";
import { ProductPlaceholder } from "./product-placeholder";
import { ProductOptions } from "./product-options";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className="grid gap-7 md:grid-cols-2 md:items-center md:gap-12">
      <ProductPlaceholder name={product.name} />

      <div className="flex flex-col">
        <h1 className="text-2xl leading-tight font-bold tracking-tight md:text-[32px]">{product.name}</h1>
        <p className="mt-2 max-w-[38ch] text-base leading-relaxed text-muted">{product.description}</p>
        <p className="mt-5 text-xl font-semibold tabular-nums md:text-2xl">{formatCurrency(product.priceCents)}</p>
        <div className="mt-6">
          <OrderDialog product={product} />
        </div>
        <ProductOptions product={product} />
      </div>
    </article>
  );
}
