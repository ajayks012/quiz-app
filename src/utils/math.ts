/**
 * Safely computes the percentage of a value relative to a total.
 * Returns 0 if total is 0 or negative to prevent NaN/Infinity.
 *
 * @param value - The numerator value.
 * @param total - The denominator total.
 * @param decimals - Decimal precision (defaults to 0).
 * @returns Calculated percentage clamped or rounded to decimals.
 */
export function percentage(value: number, total: number, decimals = 0): number {
  if (total <= 0 || isNaN(value) || isNaN(total) || value <= 0) {
    return 0
  }

  const calculated = (value / total) * 100
  const factor = Math.pow(10, Math.max(0, decimals))
  return Math.round(calculated * factor) / factor
}
