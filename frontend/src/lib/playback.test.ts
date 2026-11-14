import { describe, expect, it } from "vitest";
import { makeSeries } from "./analysis";
import {
  initialPlayback,
  playbackReducer,
  parseMonth,
  monthInputValue,
  selectPeriod,
  getSpatialFrame,
  getColorScale,
} from "./playback";

describe("period playback", () => {
  it("round-trips valid months and refuses dates outside the demonstration", () => {
    expect(parseMonth("2001-01")).toBe(0);
    expect(parseMonth("2024-12")).toBe(287);
    expect(monthInputValue(18)).toBe("2002-07");
    expect(parseMonth("2025-01")).toBeNull();
    expect(parseMonth("2020-13")).toBeNull();
    expect(parseMonth("")).toBeNull();
  });
  it("starts at the selected boundary and never plays beyond the chosen end", () => {
    let state = playbackReducer(initialPlayback, {
      type: "preset",
      start: 120,
      end: 122,
    });
    state = playbackReducer(state, { type: "toggle" });
    state = playbackReducer(state, { type: "tick" });
    expect(state.frame).toBe(121);
    state = playbackReducer(state, { type: "tick" });
    expect(state.frame).toBe(122);
    expect(state.playing).toBe(false);
    expect(playbackReducer(state, { type: "tick" }).frame).toBe(122);
    expect(playbackReducer(state, { type: "toggle" }).frame).toBe(120);
  });
  it("repeats only when requested and pauses when seeking or editing the period", () => {
    let state = {
      ...initialPlayback,
      start: 24,
      end: 25,
      frame: 25,
      loop: true,
      playing: true,
    };
    expect(playbackReducer(state, { type: "tick" }).frame).toBe(24);
    expect(playbackReducer(state, { type: "seek", frame: 999 })).toMatchObject({
      frame: 25,
      playing: false,
    });
    expect(
      playbackReducer(state, { type: "range", bound: "start", index: 40 }),
    ).toMatchObject({ start: 40, end: 40, frame: 40, playing: false });
    state = { ...state, start: 25 };
    expect(playbackReducer(state, { type: "toggle" }).playing).toBe(false);
  });
  it("uses exact inclusive month boundaries for the chart and exports", () => {
    const selected = selectPeriod(makeSeries("pantanal", "temperature"), {
      start: 14,
      end: 16,
    });
    expect(selected.map((p) => [p.year, p.month])).toEqual([
      [2002, 3],
      [2002, 4],
      [2002, 5],
    ]);
  });
});

describe("quantitative simulated map frames", () => {
  it("changes actual spatial values between months while keeping the regional mean consistent", () => {
    for (const variable of ["temperature", "rainfall", "vegetation"] as const) {
      const january = getSpatialFrame("saofrancisco", variable, 0, "absolute");
      const july = getSpatialFrame("saofrancisco", variable, 6, "absolute");
      const mean =
        january.cells.reduce((sum, c) => sum + c.value, 0) /
        january.cells.length;
      expect(mean).toBeCloseTo(
        makeSeries("saofrancisco", variable)[0].value,
        8,
      );
      expect(january.cells[0].value).not.toBeCloseTo(july.cells[0].value, 4);
      expect(new Set(january.cells.map((c) => c.value)).size).toBeGreaterThan(
        10,
      );
    }
  });
  it("uses a fixed monthly climatology, whose anomalies average zero for each cell", () => {
    const frames = Array.from({ length: 24 }, (_, i) =>
      getSpatialFrame("amazonia", "temperature", i * 12, "anomaly"),
    );
    for (let cell = 0; cell < frames[0].cells.length; cell += 10) {
      expect(
        frames.reduce((sum, frame) => sum + frame.cells[cell].value, 0) /
          frames.length,
      ).toBeCloseTo(0, 8);
    }
    expect(getColorScale("temperature", "anomaly").domain).toEqual([-1.2, 1.2]);
  });
  it("keeps precipitation physically non-negative in every simulated frame", () => {
    for (let month = 0; month < 288; month++) {
      expect(
        getSpatialFrame(
          "saofrancisco",
          "rainfall",
          month,
          "absolute",
        ).cells.every((c) => c.value >= 0),
      ).toBe(true);
    }
  });
});
