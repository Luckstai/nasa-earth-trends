import {
  Pause,
  Play,
  Repeat2,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { formatMonth } from "../lib/playback";
import type {
  PlaybackAction,
  PlaybackSpeed,
  PlaybackState,
} from "../lib/playback";

export function PlaybackControls({
  state,
  onAction,
}: {
  state: PlaybackState;
  onAction: (action: PlaybackAction) => void;
}) {
  const count = state.end - state.start + 1;
  return (
    <div
      className="playback-controls"
      aria-label="Reprodução do período escolhido"
    >
      <div className="playback-topline">
        <span>O PERÍODO GANHA VIDA</span>
        <span>
          {state.frame - state.start + 1} / {count}{" "}
          {count === 1 ? "mês" : "meses"} · simulação
        </span>
      </div>
      <div className="playback-scrubber">
        <span>{formatMonth(state.start)}</span>
        <input
          type="range"
          min={state.start}
          max={state.end}
          value={state.frame}
          disabled={count === 1}
          onChange={(e) =>
            onAction({ type: "seek", frame: Number(e.target.value) })
          }
          aria-label="Mês em exibição"
          aria-valuetext={formatMonth(state.frame)}
        />
        <span>{formatMonth(state.end)}</span>
      </div>
      <div className="playback-bottom">
        <div className="playback-actions">
          <button
            aria-label="Voltar ao início do período"
            onClick={() => onAction({ type: "restart" })}
          >
            <RotateCcw size={13} />
          </button>
          <button
            aria-label="Mês anterior"
            disabled={state.frame === state.start}
            onClick={() => onAction({ type: "step", direction: -1 })}
          >
            <SkipBack size={13} />
          </button>
          <button
            className="play-button"
            aria-label={
              state.playing
                ? "Pausar reprodução"
                : "Reproduzir período escolhido"
            }
            disabled={count === 1}
            onClick={() => onAction({ type: "toggle" })}
          >
            {state.playing ? (
              <Pause size={15} fill="currentColor" />
            ) : (
              <Play size={15} fill="currentColor" />
            )}
          </button>
          <button
            aria-label="Próximo mês"
            disabled={state.frame === state.end}
            onClick={() => onAction({ type: "step", direction: 1 })}
          >
            <SkipForward size={13} />
          </button>
        </div>
        <output className="playback-date" aria-live="off">
          {formatMonth(state.frame)}
        </output>
        <div className="playback-options">
          <select
            aria-label="Velocidade da reprodução"
            value={state.speed}
            onChange={(e) =>
              onAction({
                type: "speed",
                speed: Number(e.target.value) as PlaybackSpeed,
              })
            }
          >
            <option value="0.5">0,5×</option>
            <option value="1">1×</option>
            <option value="2">2×</option>
            <option value="4">4×</option>
          </select>
          <button
            className={state.loop ? "loop-active" : ""}
            aria-label="Repetir período"
            aria-pressed={state.loop}
            onClick={() => onAction({ type: "loop" })}
          >
            <Repeat2 size={16} />
          </button>
        </div>
      </div>
      <span className="sr-only" role="status">
        {state.playing
          ? "Reproduzindo o período escolhido"
          : state.frame === state.end && count > 1
            ? "Fim do período escolhido"
            : "Reprodução em pausa"}
      </span>
    </div>
  );
}
