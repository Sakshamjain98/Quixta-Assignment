export interface ProductOption {
  code: string;
  label: string;
  priceCents: number;
}

export interface ProductExtra extends ProductOption {
  /** Fulfillment code this extra needs, or null if it works with any. */
  requires: string | null;
}

export interface Product {
  name: string;
  description: string;
  priceCents: number;
  fulfillment: ProductOption[];
  extras: ProductExtra[];
}

/** The only place prices are written down. Served by GET /api/product. */
export const PRODUCT: Product = {
  name: "Linden shelf",
  description: "A solid linden wall shelf with hidden brackets.",
  priceCents: 18000,
  fulfillment: [
    { code: "pickup", label: "Pickup", priceCents: 0 },
    { code: "delivery", label: "Delivery", priceCents: 2500 },
  ],
  extras: [
    { code: "assembly", label: "Assembly", priceCents: 4000, requires: "delivery" },
    { code: "hardware", label: "Hardware kit", priceCents: 3000, requires: null },
  ],
};
