import { describe, expect, it } from "vitest";
import { getLineItems, getOrderTotal, type OrderSelection } from "@/features/order/order.calculations";
import { orderSchema } from "@/features/order/order.schema";
import { formatAddOnPrice, formatCurrency } from "@/lib/format-currency";

describe("getOrderTotal", () => {
  const cases: Array<[string, OrderSelection, string]> = [
    ["nothing selected", {}, "$180"],
    ["Pickup", { fulfillment: "pickup" }, "$180"],
    ["Delivery", { fulfillment: "delivery" }, "$205"],
    ["Delivery + Assembly", { fulfillment: "delivery", assembly: true }, "$245"],
    ["Delivery + Assembly + Hardware kit", { fulfillment: "delivery", assembly: true, hardwareKit: true }, "$275"],
    ["Pickup + Hardware kit", { fulfillment: "pickup", hardwareKit: true }, "$210"],
  ];

  it.each(cases)("%s -> %s", (_, selection, expected) => {
    expect(formatCurrency(getOrderTotal(selection))).toBe(expected);
  });

  it("lists only what was selected", () => {
    const labels = getLineItems({ fulfillment: "pickup", hardwareKit: true }).map((i) => i.label);
    expect(labels).toEqual(["Linden Shelf", "Pickup", "Hardware kit"]);
  });
});

describe("orderSchema", () => {
  it("rejects Assembly with Pickup and puts the error on the assembly field", () => {
    const result = orderSchema.safeParse({ fulfillment: "pickup", assembly: true, hardwareKit: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["assembly"]);
  });

  it("requires a fulfillment choice", () => {
    const result = orderSchema.safeParse({ assembly: false, hardwareKit: false });
    expect(result.error?.issues[0]).toMatchObject({ path: ["fulfillment"], message: "Choose pickup or delivery" });
  });

  it("accepts Delivery + Assembly", () => {
    expect(orderSchema.safeParse({ fulfillment: "delivery", assembly: true, hardwareKit: true }).success).toBe(true);
  });
});

describe("formatting", () => {
  it("formats whole-dollar USD and add-on prices", () => {
    expect(formatCurrency(275)).toBe("$275");
    expect(formatAddOnPrice(0)).toBe("Free");
    expect(formatAddOnPrice(25)).toBe("+$25");
  });
});
