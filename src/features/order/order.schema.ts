import { z } from "zod";

export const orderSchema = z
  .object({
    fulfillment: z.enum(["pickup", "delivery"], { error: "Choose pickup or delivery" }),
    // A natively disabled checkbox can submit as undefined, so default it.
    assembly: z.boolean().default(false),
    hardwareKit: z.boolean().default(false),
  })
  // Enforced here too, not only by the disabled checkbox in the UI.
  .refine((order) => !(order.assembly && order.fulfillment === "pickup"), {
    message: "Assembly is only available with delivery",
    path: ["assembly"],
  });

/** Shape of the form while the user edits it. */
export type OrderInput = z.input<typeof orderSchema>;
/** Shape of a validated, submitted order. */
export type Order = z.output<typeof orderSchema>;

export const DEFAULT_ORDER_VALUES: Partial<OrderInput> = {
  assembly: false,
  hardwareKit: false,
};
