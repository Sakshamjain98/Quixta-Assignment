const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Whole-dollar USD, e.g. 275 -> "$275". */
export function formatCurrency(amount: number): string {
  return usd.format(amount);
}

/** Price of an add-on option, e.g. 0 -> "Free", 25 -> "+$25". */
export function formatAddOnPrice(amount: number): string {
  return amount === 0 ? "Free" : `+${formatCurrency(amount)}`;
}
