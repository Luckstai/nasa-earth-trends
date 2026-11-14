import { describe, expect, it } from "vitest";
import { annualMeans, calculateTrend, makeSeries, toCsv } from "./analysis";

describe("demonstration analysis", () => {
  it("expresses a known annual change in units per decade", () => {
    const result = calculateTrend(
      Array.from({ length: 20 }, (_, i) => ({
        year: 2001 + i,
        value: 25 + i * 0.03,
      })),
    );
    expect(result!.slope).toBeCloseTo(0.3, 8);
    expect(result!.interval[0]).toBeCloseTo(0.3, 8);
    expect(result!.significant).toBe(true);
  });
  it("does not present a constant series as a directional trend", () => {
    expect(
      calculateTrend(
        Array.from({ length: 20 }, (_, i) => ({ year: 2001 + i, value: 5 })),
      )!.significant,
    ).toBe(false);
    expect(calculateTrend([{ year: 2001, value: 2 }])).toBeNull();
  });
  it("excludes incomplete years instead of replacing missing observations with zero", () => {
    expect(annualMeans([{ year: 2001, month: 1, value: 2 }])).toEqual([]);
    const series = makeSeries("saofrancisco", "temperature");
    expect(series).toHaveLength(288);
    expect(annualMeans(series)).toHaveLength(24);
  });
  it("exports the exact selected series with a synthetic-data disclosure", () => {
    const csv = toCsv(
      makeSeries("pantanal", "rainfall").filter((p) => p.year === 2024),
      "rainfall",
      "pantanal",
    );
    expect(csv).toContain("DADOS SIMULADOS");
    expect(csv).toContain("2024-12");
    expect(csv).not.toContain("2023-12");
    expect(csv).toContain("mm/mes");
  });
  it("keeps the designed rainfall example inconclusive and the warming example positive", () => {
    expect(
      calculateTrend(annualMeans(makeSeries("saofrancisco", "rainfall")))!
        .significant,
    ).toBe(false);
    expect(
      calculateTrend(annualMeans(makeSeries("saofrancisco", "temperature")))!
        .interval[0],
    ).toBeGreaterThan(0);
  });
  it("shows greater uncertainty away from the center of the observation period", () => {
    const trend = calculateTrend(
      annualMeans(makeSeries("saofrancisco", "temperature")),
    )!;
    const central = trend.confidenceAt(2012.5);
    const edge = trend.confidenceAt(2024);
    expect(edge[1] - edge[0]).toBeGreaterThan(central[1] - central[0]);
  });
});
