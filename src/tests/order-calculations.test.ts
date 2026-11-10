import { describe, expect, it } from "vitest";
import { PRODUCT } from "@/data/product";
import { getLineItems, getOrderTotalCents, type OrderSelection } from "@/features/order/order.calculations";
import { createOrderSchema } from "@/features/order/order.schema";
import { formatAddOnPrice, formatCurrency } from "@/lib/format-currency";

describe("getOrderTotalCents", () => {
  const cases: Array<[string, OrderSelection, string]> = [
    ["nothing selected", {}, "$180"],
    ["Pickup", { fulfillment: "pickup" }, "$180"],
    ["Delivery", { fulfillment: "delivery" }, "$205"],
    ["Delivery + Assembly", { fulfillment: "delivery", extras: { assembly: true } }, "$245"],
    ["Delivery + Assembly + Hardware kit", { fulfillment: "delivery", extras: { assembly: true, hardware: true } }, "$275"],
    ["Pickup + Hardware kit", { fulfillment: "pickup", extras: { hardware: true } }, "$210"],
  ];

  it.each(cases)("%s -> %s", (_, selection, expected) => {
    expect(formatCurrency(getOrderTotalCents(PRODUCT, selection))).toBe(expected);
  });

  it("lists only what was selected", () => {
    const labels = getLineItems(PRODUCT, { fulfillment: "pickup", extras: { hardware: true } }).map((i) => i.label);
    expect(labels).toEqual(["Linden shelf", "Pickup", "Hardware kit"]);
  });
});

describe("order schema", () => {
  const schema = createOrderSchema(PRODUCT);

  it("rejects Assembly with Pickup and puts the error on the assembly field", () => {
    const result = schema.safeParse({ fulfillment: "pickup", extras: { assembly: true, hardware: false } });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["extras", "assembly"]);
  });

  it("requires a fulfillment choice", () => {
    const result = schema.safeParse({ extras: {} });
    expect(result.error?.issues[0]).toMatchObject({ path: ["fulfillment"], message: "Choose pickup or delivery" });
  });

  it("rejects an unknown fulfillment code", () => {
    expect(schema.safeParse({ fulfillment: "drone", extras: {} }).success).toBe(false);
  });

  it("accepts Delivery + Assembly + Hardware kit", () => {
    expect(schema.safeParse({ fulfillment: "delivery", extras: { assembly: true, hardware: true } }).success).toBe(true);
  });
});

describe("formatting", () => {
  it("formats cents as whole-dollar USD and add-on prices", () => {
    expect(formatCurrency(27500)).toBe("$275");
    expect(formatAddOnPrice(0)).toBe("Free");
    expect(formatAddOnPrice(2500)).toBe("+$25");
  });
});
