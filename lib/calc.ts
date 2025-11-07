/**
 * Calculate monthly sum from an array of items with monthly amounts
 */
export function sumMonthlyCents(
  items: Array<{ amountMonthlyCents: number }>
): number {
  return items.reduce((sum, item) => sum + item.amountMonthlyCents, 0);
}

/**
 * Convert monthly cents to daily cents (divide by 30)
 */
export function toDailyCents(monthlyCents: number): number {
  return monthlyCents / 30;
}

/**
 * Compute daily burn rate in cents
 * Daily burn = max(expenses - income, 0) / 30
 */
export function computeDailyBurnCents(
  expensesMonthlyCents: number,
  incomesMonthlyCents: number
): number {
  const netMonthlyCents = expensesMonthlyCents - incomesMonthlyCents;
  return Math.max(netMonthlyCents, 0) / 30;
}

/**
 * Compute runway in days
 * Returns Infinity if daily burn is 0 (no burn)
 */
export function computeRunwayDays(
  startingCashCents: number,
  dailyBurnCents: number
): number {
  if (dailyBurnCents === 0) {
    return Infinity;
  }
  return startingCashCents / dailyBurnCents;
}

/**
 * Compute the end date when runway expires
 * Returns null if runway is infinite
 */
export function computeRunwayEndDate(
  now: Date,
  runwayDays: number
): Date | null {
  if (!isFinite(runwayDays)) {
    return null;
  }
  const endDate = new Date(now);
  endDate.setTime(endDate.getTime() + Math.floor(runwayDays) * 24 * 60 * 60 * 1000);
  return endDate;
}

