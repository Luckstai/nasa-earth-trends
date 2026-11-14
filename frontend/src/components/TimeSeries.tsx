import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Info } from "lucide-react";
import {
  anomalies,
  annualMeans,
  calculateTrend,
  formatValue,
  variables,
} from "../lib/analysis";
import type { Observation, Variable } from "../lib/analysis";
import { observationIndex, formatMonth } from "../lib/playback";

type Props = {
  series: Observation[];
  reference: Observation[];
  frame: number;
  onFrame: (frame: number) => void;
  variable: Variable;
  deseasonalized: boolean;
  onDeseasonalize: () => void;
  onExplain: () => void;
};
const height = 242,
  left = 48,
  right = 20,
  top = 22,
  bottom = 32;

export function TimeSeries({
  series,
  reference,
  frame,
  onFrame,
  variable,
  deseasonalized,
  onDeseasonalize,
  onExplain,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(880);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = variables[variable];
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(280, Math.round(entry.contentRect.width))),
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  const chart = useMemo(() => {
    const visible = deseasonalized ? anomalies(series, reference) : series;
    const values = visible.map((p) => p.value);
    const annual = annualMeans(visible);
    const trend = calculateTrend(annual);
    const min = Math.min(...values),
      max = Math.max(...values);
    const pad = Math.max(
      (max - min) * 0.18,
      variable === "vegetation" ? 0.006 : 0.1,
    );
    const low = min - pad,
      high = max + pad;
    const x = (i: number) =>
      left + (i / Math.max(1, visible.length - 1)) * (width - left - right);
    const y = (v: number) =>
      top + ((high - v) / (high - low)) * (height - top - bottom);
    const path = visible
      .map(
        (p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`,
      )
      .join(" ");
    const firstYear = visible[0].year,
      lastYear = visible.at(-1)!.year;
    const trendPath = trend
      ? `M${x(0)},${y(trend.predict(firstYear))} L${x(visible.length - 1)},${y(trend.predict(lastYear))}`
      : "";
    const bandPoints = trend
      ? Array.from({ length: 30 }, (_, i) => {
          const fraction = i / 29;
          return {
            x: x(fraction * (visible.length - 1)),
            bounds: trend.confidenceAt(
              firstYear + fraction * (lastYear - firstYear),
            ),
          };
        })
      : [];
    const band =
      bandPoints
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${p.x.toFixed(1)},${y(p.bounds[1]).toFixed(1)}`,
        )
        .join(" ") +
      " " +
      bandPoints
        .toReversed()
        .map((p) => `L${p.x.toFixed(1)},${y(p.bounds[0]).toFixed(1)}`)
        .join(" ") +
      (bandPoints.length ? " Z" : "");
    return {
      visible,
      low,
      high,
      x,
      y,
      path,
      trendPath,
      band,
      firstYear,
      lastYear,
      hasTrend: Boolean(trend),
    };
  }, [series, reference, variable, deseasonalized, width]);
  const active = hover === null ? null : chart.visible[hover];
  const frameIndex = chart.visible.findIndex(
    (point) => observationIndex(point) === frame,
  );
  const framePoint = chart.visible[frameIndex];
  const indexAt = (clientX: number, element: SVGSVGElement) => {
    const rect = element.getBoundingClientRect();
    return Math.max(
      0,
      Math.min(
        chart.visible.length - 1,
        Math.round(
          ((((clientX - rect.left) / rect.width) * width - left) /
            (width - left - right)) *
            (chart.visible.length - 1),
        ),
      ),
    );
  };
  return (
    <section className="chart-panel" id="series">
      <div className="chart-heading">
        <div>
          <span className="eyebrow">
            <span className="tiny-number">02</span> ENCONTRE O PADRÃO
          </span>
          <h2>O tempo revela a história.</h2>
        </div>
        <button className="text-button" onClick={onExplain}>
          Como ler este gráfico <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="chart-control-row">
        <span className="chart-label">
          <i style={{ background: config.color }} />
          {deseasonalized ? "Anomalia" : config.short}{" "}
          <span>· {config.unit}</span>
        </span>
        <label className="switch-label">
          <input
            type="checkbox"
            checked={deseasonalized}
            onChange={onDeseasonalize}
          />
          <span className="switch" />
          Remover ciclo das estações <Info size={13} />
        </label>
      </div>
      <div className="chart-playback-hint">
        <span>
          <i /> Marcador sincronizado com o globo
        </span>
        <small>
          {deseasonalized
            ? "Referência mensal fixa: 2001–2024"
            : "Clique no gráfico para escolher um mês"}
        </small>
      </div>
      <div className="chart-wrap" ref={containerRef}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="series-svg"
          aria-label={`Série mensal simulada de ${config.name}, ${chart.firstYear} a ${chart.lastYear}`}
          role="img"
          onClick={(e) =>
            onFrame(
              observationIndex(
                chart.visible[indexAt(e.clientX, e.currentTarget)],
              ),
            )
          }
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const svgX = ((e.clientX - rect.left) / rect.width) * width;
            setHover(
              Math.max(
                0,
                Math.min(
                  chart.visible.length - 1,
                  Math.round(
                    ((svgX - left) / (width - left - right)) *
                      (chart.visible.length - 1),
                  ),
                ),
              ),
            );
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={config.color} stopOpacity=".12" />
              <stop offset="1" stopColor={config.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const v = chart.low + ((chart.high - chart.low) * i) / 4;
            return (
              <g key={i}>
                <line
                  x1={left}
                  x2={width - right}
                  y1={chart.y(v)}
                  y2={chart.y(v)}
                  stroke="#344138"
                  strokeDasharray="3 5"
                  opacity=".7"
                />
                <text
                  x={left - 12}
                  y={chart.y(v) + 4}
                  textAnchor="end"
                  fill="#889487"
                  fontSize="11"
                >
                  {v
                    .toFixed(variable === "vegetation" ? 2 : 1)
                    .replace(".", ",")}
                </text>
              </g>
            );
          })}
          <path
            d={`${chart.path} L${chart.x(chart.visible.length - 1)},${height - bottom} L${left},${height - bottom} Z`}
            fill="url(#chart-fill)"
          />
          <path d={chart.band} fill={config.color} opacity=".12" />
          <path
            d={chart.path}
            fill="none"
            stroke={config.color}
            opacity=".65"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d={chart.trendPath}
            fill="none"
            stroke={config.color}
            strokeWidth="2.4"
            strokeDasharray="6 5"
          />
          {[
            ...new Set(
              [0, 1, 2, 3, 4].map((i) =>
                Math.round((i / 4) * (chart.visible.length - 1)),
              ),
            ),
          ].map((index) => {
            return (
              <text
                key={index}
                x={chart.x(index)}
                y={height - 9}
                textAnchor="middle"
                fill="#9ca697"
                fontSize="11"
              >
                {chart.visible.length <= 24
                  ? formatMonth(observationIndex(chart.visible[index]))
                  : chart.visible[index].year}
              </text>
            );
          })}
          {framePoint && (
            <g className="chart-playhead" aria-hidden="true">
              <line
                x1={chart.x(frameIndex)}
                x2={chart.x(frameIndex)}
                y1={top}
                y2={height - bottom}
                stroke="#e1eacb"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity=".7"
              />
              <circle
                cx={chart.x(frameIndex)}
                cy={chart.y(framePoint.value)}
                r="4"
                fill={config.color}
                stroke="#e5ebd8"
                strokeWidth="1.5"
              />
              <rect
                x={Math.max(
                  left,
                  Math.min(width - right - 79, chart.x(frameIndex) - 36),
                )}
                y={top - 16}
                width="79"
                height="18"
                rx="4"
                fill="#34452d"
                stroke="#6b8053"
                strokeWidth=".5"
              />
              <text
                x={
                  Math.max(
                    left,
                    Math.min(width - right - 79, chart.x(frameIndex) - 36),
                  ) + 39.5
                }
                y={top - 4}
                textAnchor="middle"
                fill="#dde7cf"
                fontSize="9"
              >
                {formatMonth(frame)}
              </text>
            </g>
          )}
          {active && hover !== null && (
            <g>
              <line
                x1={chart.x(hover)}
                x2={chart.x(hover)}
                y1={top}
                y2={height - bottom}
                stroke="#d6decd"
                opacity=".4"
              />
              <circle
                cx={chart.x(hover)}
                cy={chart.y(active.value)}
                r="4"
                fill={config.color}
                stroke="#13231c"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
        {active && (
          <output className="chart-tooltip">
            {String(active.month).padStart(2, "0")}/{active.year}
            <strong>
              {formatValue(active.value, variable)} {config.unit}
            </strong>
          </output>
        )}
      </div>
      <div className="chart-footer">
        <span>
          <i className="legend-line" style={{ background: config.color }} />{" "}
          Valores mensais
        </span>
        <span>
          <i className="legend-dash" style={{ borderColor: config.color }} />{" "}
          {chart.hasTrend
            ? "Tendência anual"
            : "Sem estimativa anual neste recorte"}
        </span>
        <span className="uncertainty-note">
          {chart.hasTrend
            ? "IC 95% da média estimada"
            : "Amplie o período para analisar a tendência"}{" "}
          <button
            aria-label="Entender a faixa de incerteza"
            onClick={onExplain}
          >
            <Info size={13} />
          </button>
        </span>
      </div>
    </section>
  );
}
