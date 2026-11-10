import { FULFILLMENT_OPTIONS, PRODUCT, SERVICE_KEYS, SERVICE_OPTIONS } from "@/constants/product";
import type { OrderInput } from "./order.schema";

export interface LineItem {
  id: string;
  label: string;
  price: number;
}

/** A selection in progress: any field may still be empty. */
export type OrderSelection = { [K in keyof OrderInput]?: OrderInput[K] | null };

/** The shelf, the chosen fulfillment, then each selected service, in display order. */
export function getLineItems(selection: OrderSelection): LineItem[] {
  const items: LineItem[] = [{ id: "product", label: PRODUCT.name, price: PRODUCT.price }];

  if (selection.fulfillment) {
    const { label, price } = FULFILLMENT_OPTIONS[selection.fulfillment];
    items.push({ id: selection.fulfillment, label, price });
  }

  for (const key of SERVICE_KEYS) {
    if (selection[key]) {
      const { label, price } = SERVICE_OPTIONS[key];
      items.push({ id: key, label, price });
    }
  }

  return items;
}

export function getOrderTotal(selection: OrderSelection): number {
  return getLineItems(selection).reduce((sum, item) => sum + item.price, 0);
}
