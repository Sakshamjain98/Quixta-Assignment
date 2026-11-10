import type { Product, ProductExtra } from "@/data/product";

export interface LineItem {
  code: string;
  label: string;
  priceCents: number;
}

/** A selection in progress: any field may still be empty. */
export interface OrderSelection {
  fulfillment?: string | null;
  extras?: Partial<Record<string, boolean>>;
}

/** An extra can be chosen when it has no requirement or its required fulfillment is selected. */
export function isExtraAvailable(extra: ProductExtra, fulfillment: string | null | undefined): boolean {
  return extra.requires === null || extra.requires === fulfillment;
}

/** The shelf, the chosen fulfillment, then each selected extra, in display order. */
export function getLineItems(product: Product, selection: OrderSelection): LineItem[] {
  const items: LineItem[] = [{ code: "product", label: product.name, priceCents: product.priceCents }];

  const fulfillment = product.fulfillment.find((option) => option.code === selection.fulfillment);
  if (fulfillment) {
    items.push({ code: fulfillment.code, label: fulfillment.label, priceCents: fulfillment.priceCents });
  }

  for (const extra of product.extras) {
    if (selection.extras?.[extra.code]) {
      items.push({ code: extra.code, label: extra.label, priceCents: extra.priceCents });
    }
  }

  return items;
}

export function getOrderTotalCents(product: Product, selection: OrderSelection): number {
  return getLineItems(product, selection).reduce((sum, item) => sum + item.priceCents, 0);
}
