// currency-and-pricing.ts

/**
 * Normalize input to number (accepts string/number, strips non-digits except minus & dot/comma).
 */
function toNumeric(value: number | string): number {
  const numeric = Number(
    String(value)
      .replace(/[^\d\-.,]/g, "") // keep digits, minus, dot, comma
      .replace(/,/g, ".")        // normalize comma to dot
  );
  return Number.isNaN(numeric) ? NaN : numeric;
}

/**
 * Format as plain IDR number with 3-digit grouping and dot separator.
 * 5000000 -> "5.000.000"
 */
export function formatIDR(value: number | string): string {
  const numeric = toNumeric(value);
  if (Number.isNaN(numeric)) return "";

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Format IDR with optional "IDR" prefix.
 * 5000000 -> "IDR 5.000.000"
 */
export function formatIDRCurrency(
  value: number | string,
  withPrefix = true
): string {
  const formatted = formatIDR(value);
  if (!formatted) return "";
  return withPrefix ? `IDR ${formatted}` : formatted;
}

/**
 * Format as plain USD number with 3-digit grouping:
 * 5000000 -> "5,000,000"
 */
export function formatUSD(value: number | string): string {
  const numeric = toNumeric(value);
  if (Number.isNaN(numeric)) return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Format USD as proper currency with $ prefix and 2 decimals:
 * 5000000 -> "$5,000,000.00"
 */
export function formatUSDCurrency(
  value: number | string,
  withSymbol = true
): string {
  const numeric = toNumeric(value);
  if (Number.isNaN(numeric)) return "";

  if (!withSymbol) {
    // "5,000,000.00" without "$"
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Calculate discount percentage based on current vs actual price.
 * Returns integer percentage (0–100).
 * Example:
 *   currentPrice = "500000", actualPrice = "1000000" -> 50
 */
export function calculateDiscount(
  currentPrice: number | string,
  actualPrice: number | string
): number {
  const current = toNumeric(currentPrice);
  const actual = toNumeric(actualPrice);

  if (Number.isNaN(current) || Number.isNaN(actual)) return 0;
  if (actual > current && actual > 0) {
    return Math.round(((actual - current) / actual) * 100);
  }
  return 0;
}

/**
 * Human-readable billing cycle label for displaying in UI.
 */
export function formatBillingCycle(priceItem: {
  billingCycle?: string;
  duration?: string | null;
}): string {
  if (priceItem.billingCycle === "one_time") return "One Time";

  if (priceItem.billingCycle === "monthly" && priceItem.duration) {
    const d = priceItem.duration;
    return `Monthly - ${d.charAt(0).toUpperCase() + d.slice(1)}`;
  }

  return "Subscription";
}

/**
 * Payment note text shown under price / CTA.
 */
export function getPaymentNote(priceItem: {
  billingCycle?: string;
  duration?: string | null;
}): string {
  if (priceItem.billingCycle === "one_time") return "One time purchase";

  if (priceItem.billingCycle === "monthly" && priceItem.duration) {
    const d = priceItem.duration;
    return (
      "Monthly subscription - " + d.charAt(0).toUpperCase() + d.slice(1)
    );
  }

  return "Subscription";
}
