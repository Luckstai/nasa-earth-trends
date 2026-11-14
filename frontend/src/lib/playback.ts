import { makeSeries, regions } from "./analysis";
import type { Observation, RegionId, Variable } from "./analysis";
import { regionCoordinates } from "./mapGeometry";

export const LAST_FRAME = 287;
export type MapMode = "absolute" | "anomaly";
export type Period = { start: number; end: number };
export type PlaybackSpeed = 0.5 | 1 | 2 | 4;
export type PlaybackState = Period & {
  frame: number;
  playing: boolean;
  speed: PlaybackSpeed;
  loop: boolean;
};
export type PlaybackAction =
  | { type: "range"; bound: "start" | "end"; index: number }
  | { type: "preset"; start: number; end: number }
  | { type: "seek"; frame: number }
  | { type: "step"; direction: -1 | 1 }
  | { type: "speed"; speed: PlaybackSpeed }
  | { type: "toggle" | "tick" | "pause" | "loop" | "restart" };

export const initialPlayback: PlaybackState = {
  start: 0,
  end: LAST_FRAME,
  frame: 0,
  playing: false,
  speed: 1,
  loop: false,
};
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : min)));

export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
): PlaybackState {
  switch (action.type) {
    case "preset": {
      const start = clamp(action.start, 0, LAST_FRAME);
      return {
        ...state,
        start,
        end: clamp(action.end, start, LAST_FRAME),
        frame: start,
        playing: false,
      };
    }
    case "range": {
      const index = clamp(action.index, 0, LAST_FRAME);
      const start =
        action.bound === "start" ? index : Math.min(state.start, index);
      const end = action.bound === "end" ? index : Math.max(state.end, index);
      return { ...state, start, end, frame: start, playing: false };
    }
    case "seek":
      return {
        ...state,
        frame: clamp(action.frame, state.start, state.end),
        playing: false,
      };
    case "step":
      return {
        ...state,
        frame: clamp(state.frame + action.direction, state.start, state.end),
        playing: false,
      };
    case "restart":
      return { ...state, frame: state.start, playing: false };
    case "pause":
      return state.playing ? { ...state, playing: false } : state;
    case "speed":
      return { ...state, speed: action.speed };
    case "loop":
      return { ...state, loop: !state.loop };
    case "toggle":
      return {
        ...state,
        frame: state.frame >= state.end ? state.start : state.frame,
        playing: state.start < state.end && !state.playing,
      };
    case "tick": {
      if (!state.playing) return state;
      if (state.frame >= state.end)
        return {
          ...state,
          frame: state.loop ? state.start : state.end,
          playing: state.loop && state.start < state.end,
        };
      const frame = state.frame + 1;
      return { ...state, frame, playing: frame < state.end || state.loop };
    }
  }
}

export function observationIndex(point: Pick<Observation, "year" | "month">) {
  return (point.year - 2001) * 12 + point.month - 1;
}

export function monthInputValue(index: number) {
  const valid = clamp(index, 0, LAST_FRAME);
  return `${2001 + Math.floor(valid / 12)}-${String((valid % 12) + 1).padStart(2, "0")}`;
}

export function parseMonth(value: string): number | null {
  if (!/^\d{4}-\d{2}$/.test(value)) return null;
  const [year, month] = value.split("-").map(Number);
  if (year < 2001 || year > 2024 || month < 1 || month > 12) return null;
  return (year - 2001) * 12 + month - 1;
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
export function formatMonth(index: number) {
  return monthFormatter
    .format(new Date(Date.UTC(2001 + Math.floor(index / 12), index % 12, 1)))
    .replace(" de ", " ");
}

export function selectPeriod(series: Observation[], period: Period) {
  return series.filter((point) => {
    const index = observationIndex(point);
    return index >= period.start && index <= period.end;
  });
}

export const spatialCells = Object.fromEntries(
  regions.map((region, ri) => {
    const [cx, cy] = regionCoordinates[region.id];
    const cells = Array.from({ length: 13 * 14 }, (_, i) => {
      const col = i % 13,
        row = Math.floor(i / 13);
      const x = cx + (col - 6) * 7.7;
      const y = cy + (row - 6.5) * 8.5 + (col % 2) * 4.25;
      const nx = (x - cx) / (ri === 1 ? 51 : 29);
      const ny = (y - cy) / (ri === 1 ? 40 : 57);
      const points = Array.from(
        { length: 6 },
        (_, j) =>
          `${(x + Math.cos((j * Math.PI) / 3) * 4.45).toFixed(1)},${(y + Math.sin((j * Math.PI) / 3) * 4.45).toFixed(1)}`,
      ).join(" ");
      return { x, y, nx, ny, points };
    }).filter((c) => c.nx * c.nx + c.ny * c.ny < 1);
    return [region.id, cells];
  }),
) as Record<
  RegionId,
  { x: number; y: number; nx: number; ny: number; points: string }[]
>;

type SpatialHistory = {
  series: Observation[];
  frames: number[][];
  climatology: number[][];
};
const historyCache = new Map<string, SpatialHistory>();
function spatialHistory(region: RegionId, variable: Variable): SpatialHistory {
  const key = `${region}:${variable}`;
  const cached = historyCache.get(key);
  if (cached) return cached;
  const series = makeSeries(region, variable);
  const cells = spatialCells[region];
  const frames = series.map((point, frame) => {
    const phase = ((point.month - 1) * Math.PI) / 6;
    const pattern = cells.map(
      (c) =>
        0.48 * c.nx +
        0.28 * c.ny +
        0.24 * Math.sin(c.nx * 3.2 + c.ny * 2.1 + phase + frame * 0.073),
    );
    const mean = pattern.reduce((sum, v) => sum + v, 0) / pattern.length;
    return pattern.map((value) => {
      const centered = value - mean;
      return variable === "rainfall"
        ? point.value * (1 + centered * 0.36)
        : point.value + centered * (variable === "temperature" ? 2.1 : 0.035);
    });
  });
  const climatology = Array.from({ length: 12 }, (_, month) =>
    cells.map((_, cell) => {
      let sum = 0;
      for (let year = 0; year < 24; year++)
        sum += frames[year * 12 + month][cell];
      return sum / 24;
    }),
  );
  const history = { series, frames, climatology };
  historyCache.set(key, history);
  return history;
}

const scales = {
  temperature: {
    absolute: {
      domain: [18, 34],
      colors: ["#477eaa", "#73bec0", "#d1cf9c", "#eea563", "#d76f48"],
    },
    anomaly: {
      domain: [-1.2, 1.2],
      colors: ["#4997cc", "#82c2d5", "#c8cfba", "#edb77e", "#ee825c"],
    },
  },
  rainfall: {
    absolute: {
      domain: [0, 240],
      colors: ["#927d58", "#bdbb92", "#96bfb6", "#6ab4cf", "#4c83c7"],
    },
    anomaly: {
      domain: [-60, 60],
      colors: ["#d19859", "#d2ba8a", "#b7c9bb", "#87c9d4", "#559ed3"],
    },
  },
  vegetation: {
    absolute: {
      domain: [0.4, 0.85],
      colors: ["#a08d65", "#c3c195", "#aac690", "#8bb76e", "#5c9c66"],
    },
    anomaly: {
      domain: [-0.035, 0.035],
      colors: ["#c38176", "#c7ab8d", "#c4ceb0", "#acd98b", "#75bb72"],
    },
  },
} as const;

export function getColorScale(variable: Variable, mode: MapMode) {
  return scales[variable][mode];
}

function interpolateColor(value: number, variable: Variable, mode: MapMode) {
  const { domain, colors } = getColorScale(variable, mode);
  const fraction =
    Math.max(0, Math.min(1, (value - domain[0]) / (domain[1] - domain[0]))) *
    (colors.length - 1);
  const segment = Math.min(colors.length - 2, Math.floor(fraction));
  const t = fraction - segment;
  const from = colors[segment],
    to = colors[segment + 1];
  const channels = [1, 3, 5].map((i) =>
    Math.round(
      parseInt(from.slice(i, i + 2), 16) * (1 - t) +
        parseInt(to.slice(i, i + 2), 16) * t,
    ),
  );
  return `rgb(${channels.join(",")})`;
}

/** Schematic synthetic fields; regional means exactly match the demonstration series. */
export function getSpatialFrame(
  region: RegionId,
  variable: Variable,
  index: number,
  mode: MapMode,
) {
  const valid = clamp(index, 0, LAST_FRAME);
  const history = spatialHistory(region, variable);
  const raw = history.frames[valid];
  const cells = spatialCells[region].map((geometry, cell) => {
    const value =
      mode === "anomaly"
        ? raw[cell] - history.climatology[valid % 12][cell]
        : raw[cell];
    return {
      ...geometry,
      value,
      color: interpolateColor(value, variable, mode),
    };
  });
  return {
    cells,
    observation: history.series[valid],
    mean: cells.reduce((sum, cell) => sum + cell.value, 0) / cells.length,
  };
}
