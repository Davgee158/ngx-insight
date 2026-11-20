export function formatCompanyValue(value: string, unit: string): string {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return `${value} ${unit}`;

  const number = new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 8,
  }).format(numericValue);

  if (unit === "NGN" || unit === "USD") {
    const symbol = unit === "NGN" ? "₦" : "$";
    const magnitude = Math.abs(numericValue);
    const divisor =
      magnitude >= 1_000_000_000_000
        ? 1_000_000_000_000
        : magnitude >= 1_000_000_000
          ? 1_000_000_000
          : 1_000_000;
    const suffix =
      divisor === 1_000_000_000_000
        ? "t"
        : divisor === 1_000_000_000
          ? "b"
          : "m";
    const scaledValue = numericValue / divisor;
    const precision =
      scaledValue !== 0 && Math.round(Math.abs(scaledValue) * 100) === 0
        ? 6
        : 2;
    const scaled = new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: precision,
    }).format(scaledValue);
    return `${symbol}${scaled}${suffix}`;
  }

  switch (unit) {
    case "NGN_per_share":
      return `₦${number} per share`;
    case "percent":
      return `${number}%`;
    case "multiple":
      return `${number}x`;
    default:
      return `${number} ${unit}`;
  }
}
