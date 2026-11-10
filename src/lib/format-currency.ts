const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Whole-dollar USD from cents, e.g. 27500 -> "$275". */
export function formatCurrency(cents: number): string {
  return usd.format(cents / 100);
}

/** Price of an add-on option, e.g. 0 -> "Free", 2500 -> "+$25". */
export function formatAddOnPrice(cents: number): string {
  return cents === 0 ? "Free" : `+${formatCurrency(cents)}`;
}
