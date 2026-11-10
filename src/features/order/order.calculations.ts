import type { Product, ProductExtra, ProductOption } from "@/data/product";

/** A selection in progress: any field may still be empty. */
export interface OrderSelection {
  fulfillment?: string | null;
  extras?: Partial<Record<string, boolean>>;
}

export interface SelectedOptions {
  fulfillment: ProductOption | undefined;
  extras: ProductExtra[];
}

/** An extra can be chosen when it has no requirement or its required fulfillment is selected. */
export function isExtraAvailable(extra: ProductExtra, fulfillment: string | null | undefined): boolean {
  return extra.requires === null || extra.requires === fulfillment;
}

/** The chosen fulfillment and each selected extra, in the product's order. */
export function getSelectedOptions(product: Product, selection: OrderSelection): SelectedOptions {
  return {
    fulfillment: product.fulfillment.find((option) => option.code === selection.fulfillment),
    extras: product.extras.filter((extra) => selection.extras?.[extra.code]),
  };
}

export function getOrderTotalCents(product: Product, selection: OrderSelection): number {
  const { fulfillment, extras } = getSelectedOptions(product, selection);
  return (
    product.priceCents +
    (fulfillment?.priceCents ?? 0) +
    extras.reduce((sum, extra) => sum + extra.priceCents, 0)
  );
}
