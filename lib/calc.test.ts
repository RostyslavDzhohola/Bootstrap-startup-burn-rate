import { describe, it, expect } from "vitest";
import {
  sumMonthlyCents,
  toDailyCents,
  computeDailyBurnCents,
  computeRunwayDays,
  computeRunwayEndDate,
} from "@/lib/calc";

describe("sumMonthlyCents", () => {
  it("should sum monthly amounts correctly", () => {
    const items = [
      { amountMonthlyCents: 1000 },
      { amountMonthlyCents: 2000 },
      { amountMonthlyCents: 500 },
    ];
    expect(sumMonthlyCents(items)).toBe(3500);
  });

  it("should return 0 for empty array", () => {
    expect(sumMonthlyCents([])).toBe(0);
  });

  it("should handle negative values", () => {
    const items = [
      { amountMonthlyCents: 1000 },
      { amountMonthlyCents: -500 },
    ];
    expect(sumMonthlyCents(items)).toBe(500);
  });
});

describe("toDailyCents", () => {
  it("should convert monthly to daily correctly", () => {
    expect(toDailyCents(3000)).toBe(100); // 3000 / 30 = 100
  });

  it("should handle zero", () => {
    expect(toDailyCents(0)).toBe(0);
  });

  it("should handle fractional results", () => {
    expect(toDailyCents(1000)).toBeCloseTo(33.333, 2);
  });
});

describe("computeDailyBurnCents", () => {
  it("should compute burn when expenses exceed income", () => {
    const result = computeDailyBurnCents(3000, 1000); // 2000 monthly net / 30
    expect(result).toBeCloseTo(66.667, 2);
  });

  it("should return 0 when income exceeds expenses", () => {
    expect(computeDailyBurnCents(1000, 3000)).toBe(0);
  });

  it("should return 0 when income equals expenses", () => {
    expect(computeDailyBurnCents(1000, 1000)).toBe(0);
  });

  it("should handle zero expenses", () => {
    expect(computeDailyBurnCents(0, 1000)).toBe(0);
  });

  it("should handle zero income", () => {
    const result = computeDailyBurnCents(3000, 0);
    expect(result).toBe(100); // 3000 / 30
  });
});

describe("computeRunwayDays", () => {
  it("should compute runway correctly", () => {
    const result = computeRunwayDays(30000, 100); // 30000 cents / 100 cents per day
    expect(result).toBe(300);
  });

  it("should return Infinity when daily burn is 0", () => {
    expect(computeRunwayDays(10000, 0)).toBe(Infinity);
  });

  it("should handle very small cash amounts", () => {
    const result = computeRunwayDays(100, 50); // 100 cents / 50 cents per day
    expect(result).toBe(2);
  });

  it("should handle fractional days", () => {
    const result = computeRunwayDays(1000, 33.333);
    expect(result).toBeCloseTo(30, 0);
  });

  it("should return 0 when cash is 0", () => {
    expect(computeRunwayDays(0, 100)).toBe(0);
  });
});

describe("computeRunwayEndDate", () => {
  it("should compute end date correctly", () => {
    const now = new Date("2024-01-01T00:00:00Z");
    const endDate = computeRunwayEndDate(now, 30);
    expect(endDate).toBeInstanceOf(Date);
    const expectedDate = new Date("2024-01-31T00:00:00Z");
    expect(endDate?.getTime()).toBe(expectedDate.getTime());
  });

  it("should return null for infinite runway", () => {
    const now = new Date();
    expect(computeRunwayEndDate(now, Infinity)).toBeNull();
  });

  it("should handle zero days", () => {
    const now = new Date("2024-01-01T00:00:00Z");
    const endDate = computeRunwayEndDate(now, 0);
    expect(endDate?.getTime()).toBe(now.getTime());
  });

  it("should handle very large runway", () => {
    const now = new Date("2024-01-01T00:00:00Z");
    const endDate = computeRunwayEndDate(now, 365);
    // 365 days from Jan 1, 2024 = Dec 31, 2024 (2024 is a leap year)
    const expectedDate = new Date("2024-12-31T00:00:00Z");
    expect(endDate?.getTime()).toBe(expectedDate.getTime());
  });
});

