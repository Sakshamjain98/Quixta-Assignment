/** Single source of truth for the product and every price in the order sheet. */
export const PRODUCT = {
  name: "Linden Shelf",
  category: ["Furniture", "Storage"],
  description:
    "A slim floating shelf in solid linden wood, finished in natural oil for books, frames, and the small things worth keeping in view.",
  price: 180,
  details: [
    { label: "Material", value: "Solid linden, natural oil finish" },
    { label: "Dimensions", value: "W 90 × D 12 × H 6 cm" },
    { label: "Load capacity", value: "Up to 15 kg, evenly distributed" },
  ],
} as const;

export const FULFILLMENT_OPTIONS = {
  pickup: { label: "Pickup", price: 0, description: "Collect your order from our studio." },
  delivery: { label: "Delivery", price: 25, description: "Delivered to your door in 3–5 days." },
} as const;

export const SERVICE_OPTIONS = {
  assembly: { label: "Assembly", price: 40, description: "We mount and level it for you." },
  hardwareKit: { label: "Hardware kit", price: 30, description: "Wall anchors, screws, and a level." },
} as const;

type FulfillmentKey = keyof typeof FULFILLMENT_OPTIONS;
type ServiceKey = keyof typeof SERVICE_OPTIONS;

export const FULFILLMENT_KEYS = Object.keys(FULFILLMENT_OPTIONS) as FulfillmentKey[];
export const SERVICE_KEYS = Object.keys(SERVICE_OPTIONS) as ServiceKey[];
