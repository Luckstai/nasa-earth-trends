import { memo, useMemo, useState } from "react";
import { Compass, Layers3, Minus, Plus, LocateFixed } from "lucide-react";
import { regionCoordinates } from "../lib/mapGeometry";
import { regions, variables, formatValue } from "../lib/analysis";
import { getSpatialFrame, getColorScale, formatMonth } from "../lib/playback";
import type { PlaybackState, PlaybackAction, MapMode } from "../lib/playback";
import { PlaybackControls } from "./PlaybackControls";
import type { RegionId, Variable } from "../lib/analysis";

type Props = {
  region: RegionId;
  variable: Variable;
  onRegion: (id: RegionId) => void;
  timeline: PlaybackState;
  onAction: (action: PlaybackAction) => void;
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
};

export const Globe = memo(function Globe({
  region,
  variable,
  onRegion,
  timeline,
  onAction,
  mode,
  onModeChange,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [showLayer, setShowLayer] = useState(true);
  const current = regions.find((r) => r.id === region)!;
  const color = variables[variable].color;
  const frames = useMemo(
    () =>
      regions.map((r) => getSpatialFrame(r.id, variable, timeline.frame, mode)),
    [variable, timeline.frame, mode],
  );
  const currentFrame = frames[regions.findIndex((r) => r.id === region)];
  const scale = getColorScale(variable, mode);
  return (
    <section
      className="globe-panel living-globe"
      aria-label="Exploração geográfica"
      style={
        {
          "--frame-duration": `${Math.min(160, 350 / timeline.speed)}ms`,
        } as React.CSSProperties
      }
    >
      <div className="map-topline">
        <span>
          <i className="live-dot" /> PERSPECTIVA DA TERRA
        </span>
        <button
          className={`layer-button ${showLayer ? "selected" : ""}`}
          onClick={() => setShowLayer(!showLayer)}
          aria-pressed={showLayer}
        >
          <Layers3 size={14} /> Campo simulado
        </button>
      </div>
      <div
        className="map-mode-switch"
        role="group"
        aria-label="Visualização do campo mensal"
      >
        <button
          onClick={() => onModeChange("absolute")}
          aria-pressed={mode === "absolute"}
        >
          Valores
        </button>
        <button
          onClick={() => onModeChange("anomaly")}
          aria-pressed={mode === "anomaly"}
        >
          Anomalias
        </button>
      </div>
      <div className="map-coordinate">
        {current.coords}
        <span>AMÉRICA DO SUL</span>
      </div>
      <div className="globe-stage">
        <svg
          className="globe-svg"
          viewBox="0 0 640 640"
          role="group"
          aria-label="Globo com três regiões brasileiras selecionáveis"
        >
          <defs>
            <radialGradient id="atmosphere">
              <stop offset="88%" stopColor="#78afaf" stopOpacity="0" />
              <stop offset="97%" stopColor="#76b4ad" stopOpacity=".2" />
              <stop offset="100%" stopColor="#8dd5c5" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="earth-shade" cx="35%" cy="28%" r="75%">
              <stop offset="30%" stopColor="#082621" stopOpacity="0" />
              <stop offset="100%" stopColor="#03110e" stopOpacity=".62" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id="earth-clip">
              <circle cx="320" cy="320" r="270" />
            </clipPath>
          </defs>
          <circle cx="320" cy="320" r="289" fill="url(#atmosphere)" />
          <g
            style={{
              transform: `translate(320px,320px) scale(${zoom}) translate(-320px,-320px)`,
              transition: "transform .5s ease",
            }}
          >
            <circle cx="320" cy="320" r="270" fill="#18302b" />
            <image
              href="/assets/globe.webp"
              x="50"
              y="50"
              width="540"
              height="540"
            />
            <circle cx="320" cy="320" r="270" fill="url(#earth-shade)" />
            <g clipPath="url(#earth-clip)">
              <image href="/assets/boundaries.svg" width="640" height="640" />
              {showLayer &&
                frames.map((frame, ri) => (
                  <g
                    key={regions[ri].id}
                    aria-hidden="true"
                    opacity={region === regions[ri].id ? 0.92 : 0.28}
                  >
                    {frame.cells.map((cell, i) => (
                      <polygon
                        key={i}
                        className="climate-cell"
                        data-value={cell.value.toFixed(5)}
                        points={cell.points}
                        fill={cell.color}
                        stroke="#f4f2de"
                        strokeOpacity=".18"
                        strokeWidth=".35"
                      >
                        <title>
                          {regions[ri].short} · {formatMonth(timeline.frame)} ·{" "}
                          {formatValue(
                            cell.value,
                            variable,
                            mode === "anomaly",
                          )}{" "}
                          {variables[variable].unit} · simulado
                        </title>
                      </polygon>
                    ))}
                  </g>
                ))}
            </g>
            <circle
              cx="320"
              cy="320"
              r="270"
              fill="none"
              stroke="#c7e0ce"
              strokeOpacity=".2"
            />
            {regions.map((r) => {
              const [x, y] = regionCoordinates[r.id];
              return (
                <g
                  key={r.id}
                  onClick={() => onRegion(r.id)}
                  className="map-point"
                >
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Investigar ${r.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRegion(r.id);
                      }
                    }}
                  >
                    <circle cx={x} cy={y} r="20" fill="transparent" />
                    {region === r.id && (
                      <>
                        <circle
                          cx={x}
                          cy={y}
                          r="16"
                          fill={color}
                          opacity=".25"
                          filter="url(#glow)"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="13"
                          stroke={color}
                          fill="none"
                          strokeOpacity=".5"
                        />
                      </>
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={region === r.id ? 4.5 : 3}
                      fill={region === r.id ? "#fff8e9" : "#c5cdbf"}
                    />
                  </g>
                  <path
                    d={`M${x + 9},${y - 9} l18,-16 h${r.id === "saofrancisco" ? 112 : 82}`}
                    stroke={region === r.id ? color : "#a8b3a1"}
                    strokeWidth=".7"
                    fill="none"
                    opacity=".7"
                  />
                  <text
                    x={x + 32}
                    y={y - 32}
                    fill={region === r.id ? "#f5f4e7" : "#abb9aa"}
                    fontSize="10"
                    fontWeight={region === r.id ? 700 : 500}
                  >
                    {r.short}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="map-frame-card">
        <span>
          <i
            className={
              timeline.playing ? "frame-live is-playing" : "frame-live"
            }
          />
          {formatMonth(timeline.frame)} · {current.short}
        </span>
        <output aria-label="Média regional simulada do mês">
          {formatValue(currentFrame.mean, variable, mode === "anomaly")}
          <small>{variables[variable].unit}</small>
        </output>
        <small>
          {mode === "anomaly"
            ? "Diferença para o mesmo mês · ref. 2001–2024"
            : "Valor mensal · média regional simulada"}
        </small>
      </div>
      <div className="map-tools">
        <span className="compass">
          <Compass size={19} />
          <small>N</small>
        </span>
        <div>
          <button
            aria-label="Aproximar globo"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
          >
            <Plus size={17} />
          </button>
          <button
            aria-label="Afastar globo"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          >
            <Minus size={17} />
          </button>
          <button aria-label="Restaurar globo" onClick={() => setZoom(1)}>
            <LocateFixed size={16} />
          </button>
        </div>
      </div>
      <div className="map-scale quantitative-scale">
        <span>
          {mode === "anomaly"
            ? "ANOMALIA"
            : variables[variable].short.toUpperCase()}
        </span>
        <i
          style={{
            background: `linear-gradient(90deg,${scale.colors.join(",")})`,
          }}
        />
        <div>
          <span>
            {formatValue(scale.domain[0], variable, mode === "anomaly")}
          </span>
          <span>
            {formatValue(scale.domain[1], variable, mode === "anomaly")}
          </span>
        </div>
        <small>{variables[variable].unit} · escala fixa</small>
      </div>
      <PlaybackControls state={timeline} onAction={onAction} />
    </section>
  );
});
