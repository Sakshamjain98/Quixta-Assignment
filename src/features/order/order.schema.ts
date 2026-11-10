import { z } from "zod";
import type { Product } from "@/data/product";
import { isExtraAvailable } from "./order.calculations";

const FULFILLMENT_REQUIRED = "Choose pickup or delivery";

/** Built from the product so fulfillment codes and extra rules come from the API, not the schema. */
export function createOrderSchema(product: Product) {
  const fulfillmentCodes = product.fulfillment.map((option) => option.code);

  return z
    .object({
      fulfillment: z
        .string({ error: FULFILLMENT_REQUIRED })
        .refine((code) => fulfillmentCodes.includes(code), FULFILLMENT_REQUIRED),
      // A natively disabled checkbox submits as undefined, hence optional.
      extras: z.record(z.string(), z.boolean().optional()),
    })
    // Enforced here too, not only by the disabled checkbox in the UI.
    .superRefine((order, ctx) => {
      for (const extra of product.extras) {
        if (order.extras[extra.code] && !isExtraAvailable(extra, order.fulfillment)) {
          const required = product.fulfillment.find((option) => option.code === extra.requires);
          ctx.addIssue({
            code: "custom",
            path: ["extras", extra.code],
            message: `${extra.label} is only available with ${required?.label ?? extra.requires}`,
          });
        }
      }
    });
}

type OrderSchema = ReturnType<typeof createOrderSchema>;
/** Shape of the form while the user edits it. */
export type OrderInput = z.input<OrderSchema>;
/** Shape of a validated, submitted order. */
export type Order = z.output<OrderSchema>;

export function getDefaultOrderValues(product: Product): Partial<OrderInput> {
  return { extras: Object.fromEntries(product.extras.map((extra) => [extra.code, false])) };
}
