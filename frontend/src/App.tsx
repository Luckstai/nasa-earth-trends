import {
  useCallback,
  useReducer,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  Droplets,
  Earth,
  ExternalLink,
  Fingerprint,
  FlaskConical,
  Leaf,
  MapPin,
  Menu,
  Orbit,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Waves,
  X,
} from "lucide-react";
import { Globe } from "./components/Globe";
import { TimeSeries } from "./components/TimeSeries";
import { Modal } from "./components/Modal";
import {
  annualMeans,
  anomalies,
  calculateTrend,
  formatValue,
  makeSeries,
  regions,
  toCsv,
  variables,
} from "./lib/analysis";
import type { RegionId, Variable } from "./lib/analysis";
import {
  initialPlayback,
  playbackReducer,
  selectPeriod,
  monthInputValue,
  parseMonth,
  formatMonth,
} from "./lib/playback";

const variableKeys: Variable[] = ["temperature", "rainfall", "vegetation"];
const variableIcons = {
  temperature: Thermometer,
  rainfall: Droplets,
  vegetation: Leaf,
};
type ModalKind =
  "sources" | "guide" | "reading" | "robustness" | "definition" | null;
const guideSteps = [
  {
    tag: "01 · OLHE PARA UM LUGAR",
    title: "Toda boa descoberta começa com uma pergunta.",
    description:
      "Escolha uma região que tenha significado para você. Neste laboratório, três paisagens brasileiras ajudam a explorar a relação entre água, calor e vida.",
    lesson:
      "Experimente mudar a região no painel à esquerda. O mapa e os exemplos acompanham sua escolha.",
    icon: MapPin,
  },
  {
    tag: "02 · SIGA UM SINAL",
    title: "Uma variável é uma lente para enxergar a Terra.",
    description:
      "Temperatura, chuva e vegetação contam partes diferentes de uma mesma história. Comece por uma pergunta simples: está ficando mais quente?",
    lesson:
      "As séries deste protótipo são inventadas para ensinar. As missões e os produtos citados são reais.",
    icon: Thermometer,
  },
  {
    tag: "03 · DÊ TEMPO AO TEMPO",
    title: "Um ano fora do comum não é uma tendência.",
    description:
      "Estações se repetem. Eventos extremos aparecem. Uma série longa ajuda a distinguir esses movimentos de uma mudança persistente.",
    lesson:
      "Escolha um período e dê play. Alterne valores e anomalias para separar as estações de mudanças em relação ao mesmo mês de referência.",
    icon: Waves,
  },
  {
    tag: "04 · QUESTIONE A CONCLUSÃO",
    title: "A direção da linha não conta tudo.",
    description:
      "O intervalo de confiança expressa a incerteza de uma estimativa. Se inclui zero, nossos dados ainda são compatíveis com ausência de mudança.",
    lesson:
      "Teste a precipitação para explorar um exemplo inconclusivo. Isso também é uma descoberta útil.",
    icon: ShieldCheck,
  },
  {
    tag: "05 · DEIXE PISTAS",
    title: "Uma descoberta boa pode ser refeita.",
    description:
      "Guarde a região, a variável, o período, o método e os dados utilizados. Outra pessoa deve conseguir seguir as mesmas pistas.",
    lesson:
      "“Exportar investigação” salva os valores simulados e um documento com suas escolhas e limitações.",
    icon: Fingerprint,
  },
];

function download(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function App() {
  const [region, setRegion] = useState<RegionId>("saofrancisco");
  const [variable, setVariable] = useState<Variable>("temperature");
  const [timeline, dispatchTimeline] = useReducer(
    playbackReducer,
    initialPlayback,
  );
  const startYear = 2001 + Math.floor(timeline.start / 12);
  const endYear = 2001 + Math.floor(timeline.end / 12);
  const [deseasonalized, setDeseasonalized] = useState(true);
  const [modal, setModal] = useState<ModalKind>(null);
  const [guideStep, setGuideStep] = useState(0);
  const [toast, setToast] = useState("");
  const [mobileControls, setMobileControls] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRegion = regions.find((r) => r.id === region)!;
  const config = variables[variable];
  const allSeries = useMemo(
    () => makeSeries(region, variable),
    [region, variable],
  );
  const series = useMemo(
    () => selectPeriod(allSeries, timeline),
    [allSeries, timeline.start, timeline.end],
  );
  const annualSeries = useMemo(() => annualMeans(series), [series]);
  const trend = useMemo(() => calculateTrend(annualSeries), [annualSeries]);
  const displaySeries = useMemo(
    () => (deseasonalized ? anomalies(allSeries, allSeries) : allSeries),
    [allSeries, deseasonalized],
  );
  const currentObservation = displaySeries[timeline.frame];
  const metrics = useMemo(
    () =>
      variableKeys.map((key) => ({
        key,
        result: calculateTrend(
          annualMeans(selectPeriod(makeSeries(region, key), timeline)),
        ),
      })),
    [region, timeline.start, timeline.end],
  );
  const isConsistent = trend?.significant ?? false;

  useEffect(() => {
    if (!timeline.playing) return;
    const timer = setInterval(
      () => dispatchTimeline({ type: "tick" }),
      500 / timeline.speed,
    );
    return () => clearInterval(timer);
  }, [timeline.playing, timeline.speed]);
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) dispatchTimeline({ type: "pause" });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  useEffect(() => {
    if (modal) dispatchTimeline({ type: "pause" });
  }, [modal]);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );
  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4500);
  };
  const selectVariable = useCallback(
    (value: Variable) => startTransition(() => setVariable(value)),
    [],
  );
  const selectRegion = useCallback(
    (value: RegionId) => startTransition(() => setRegion(value)),
    [],
  );
  const seekFrame = useCallback(
    (frame: number) => dispatchTimeline({ type: "seek", frame }),
    [],
  );
  const openGuide = () => {
    setGuideStep(0);
    setModal("guide");
  };
  const exportInvestigation = () => {
    const evidence = {
      title: "KIPP — investigação educacional",
      synthetic: true,
      disclosure:
        "Todos os valores são simulados. Nenhuma observação NASA foi usada no cálculo. Isto não é uma conclusão ambiental real.",
      region: currentRegion.name,
      variable: config.name,
      unit: config.unit,
      schemaVersion: 2,
      period: [monthInputValue(timeline.start), monthInputValue(timeline.end)],
      yearPeriod: [startYear, endYear],
      playback: {
        currentMonth: monthInputValue(timeline.frame),
        mode: deseasonalized ? "anomaly" : "absolute",
        reference: "2001–2024, por mês do calendário",
        currentValue: currentObservation.value,
        speed: timeline.speed,
        loop: timeline.loop,
      },
      monthlyObservations: series.length,
      illustrativeSourceForFutureIntegration: {
        name: config.source,
        product: config.product,
        url: config.url,
      },
      method:
        "Regressão linear das médias anuais completas; IC 95% Student-t com erros anuais independentes, hipótese simplificadora da demonstração. Sem correção HAC/FDR nem inferência causal.",
      result: trend
        ? {
            perDecade: trend.slope,
            interval95: trend.interval,
            includesZero: !trend.significant,
          }
        : null,
      basemap:
        "NASA Blue Marble January 2004, static; monthly overlay contains simulated spatial fields whose regional means match the synthetic series. Colors use a fixed scale and anomalies use a fixed 2001–2024 monthly climatology.",
      observations: series,
    };
    download(
      `kipp-${region}-${variable}-${monthInputValue(timeline.start)}-${monthInputValue(timeline.end)}.json`,
      JSON.stringify(evidence, null, 2),
      "application/json;charset=utf-8",
    );
    showToast("Investigação exportada com dados, método e limitações.");
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#investigation">
        Pular para a investigação
      </a>
      <header className="site-header">
        <a href="#" className="brand" aria-label="KIPP, início">
          <span className="brand-mark">
            <Earth size={29} strokeWidth={1.25} />
            <i />
          </span>
          <span>
            KIPP<span className="brand-dot">.</span>
          </span>
          <span className="brand-divider" />
          <small>EARTH SYSTEMS LAB</small>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a className="active" href="#investigation">
            Explorar
          </a>
          <a href="#how-it-works">Como funciona</a>
          <button onClick={() => setModal("sources")}>
            Fontes & ciência <ArrowUpRight size={12} />
          </button>
        </nav>
        <div className="header-right">
          <span className="prototype-badge">
            <i /> PROTÓTIPO
          </span>
          <button className="field-guide-button" onClick={openGuide}>
            <BookOpen size={15} /> Guia de campo <ArrowUpRight size={14} />
          </button>
        </div>
      </header>

      <main>
        <section className="intro">
          <div>
            <div className="intro-kicker">
              <span className="kicker-line" /> UM PLANETA. INFINITAS PISTAS.
            </div>
            <h1>
              Cada mudança conta <em>uma história.</em>
            </h1>
            <p>
              Investigue os sinais da Terra. Descubra o que muda, onde muda e o
              que os dados realmente dizem.
            </p>
          </div>
          <button className="guided-button" onClick={openGuide}>
            <span className="guided-play">
              <Play size={15} fill="currentColor" />
            </span>
            <span>
              Sua primeira investigação
              <small>Uma jornada guiada em 5 passos</small>
            </span>
            <ArrowRight size={17} />
          </button>
        </section>

        <div className="workbench-top" id="investigation">
          <div>
            <span className="workspace-icon">
              <ScanLine size={14} />
            </span>
            <span>SEU OBSERVATÓRIO</span>
            <span className="workbench-separator">/</span>
            <span className="workspace-name">Água, calor & vida</span>
          </div>
          <div className="workbench-disclosure">
            <FlaskConical size={13} /> Experiência com dados simulados{" "}
            <button
              aria-label="Sobre os dados simulados"
              onClick={() => setModal("sources")}
            >
              <CircleHelp size={13} />
            </button>
          </div>
          <button
            className="mobile-filter-button"
            onClick={() => setMobileControls((v) => !v)}
          >
            <Menu size={16} /> Investigar
          </button>
        </div>

        <div
          className="workspace-grid"
          style={{ "--variable-color": config.color } as React.CSSProperties}
        >
          <aside
            className={`controls-panel ${mobileControls ? "mobile-open" : ""}`}
            aria-label="Configurar investigação"
          >
            <div className="panel-heading">
              <span className="eyebrow">
                <span className="tiny-number">01</span> ESCOLHA SUA PERGUNTA
              </span>
              <button
                className="mobile-close icon-button"
                aria-label="Fechar controles"
                onClick={() => setMobileControls(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="control-block">
              <label className="field-label" htmlFor="region">
                <MapPin size={14} /> Onde vamos olhar?
              </label>
              <div className="select-wrap">
                <select
                  id="region"
                  value={region}
                  onChange={(e) => selectRegion(e.target.value as RegionId)}
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="biome-label">
                <span />
                {currentRegion.biome}
              </div>
            </div>
            <div className="control-block variable-block">
              <span className="field-label">
                <Orbit size={14} /> Qual sinal investigar?
              </span>
              <div className="variable-options">
                {variableKeys.map((key) => {
                  const Icon = variableIcons[key];
                  const v = variables[key];
                  return (
                    <button
                      key={key}
                      className={`variable-option ${variable === key ? "selected" : ""}`}
                      style={
                        { "--option-color": v.color } as React.CSSProperties
                      }
                      onClick={() => selectVariable(key)}
                      aria-pressed={variable === key}
                    >
                      <span className="variable-icon">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <span>
                        <strong>{v.short}</strong>
                        <small>{v.question}</small>
                      </span>
                      <span className="radio-dot">
                        {variable === key ? <span /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="control-block time-block">
              <span className="field-label">
                <Waves size={14} /> Qual período vamos explorar?
              </span>
              <div className="month-fields">
                <label>
                  De
                  <input
                    type="month"
                    min="2001-01"
                    max="2024-12"
                    value={monthInputValue(timeline.start)}
                    onInput={(e) => {
                      const index = parseMonth(e.currentTarget.value);
                      if (index !== null)
                        dispatchTimeline({
                          type: "range",
                          bound: "start",
                          index,
                        });
                    }}
                    aria-label="Mês inicial da investigação"
                  />
                </label>
                <label>
                  Até
                  <input
                    type="month"
                    min="2001-01"
                    max="2024-12"
                    value={monthInputValue(timeline.end)}
                    onInput={(e) => {
                      const index = parseMonth(e.currentTarget.value);
                      if (index !== null)
                        dispatchTimeline({
                          type: "range",
                          bound: "end",
                          index,
                        });
                    }}
                    aria-label="Mês final da investigação"
                  />
                </label>
              </div>
              <div className="period-presets">
                <button
                  onClick={() =>
                    dispatchTimeline({ type: "preset", start: 276, end: 287 })
                  }
                >
                  1 ano
                </button>
                <button
                  onClick={() =>
                    dispatchTimeline({ type: "preset", start: 228, end: 287 })
                  }
                >
                  5 anos
                </button>
                <button
                  onClick={() =>
                    dispatchTimeline({ type: "preset", start: 0, end: 287 })
                  }
                >
                  Histórico
                </button>
              </div>
              <div className="period-note">
                <span>{series.length} meses selecionados</span>
                <span>mensal</span>
              </div>
              {!trend && (
                <p className="short-period-note">
                  Um recorte para observar os ciclos. Amplie o período para
                  estimar uma tendência anual.
                </p>
              )}
            </div>
            <div className="field-note">
              <Sparkles size={16} />
              <div>
                <strong>Olhar além do óbvio</strong>
                <p>
                  Um verão muito quente é um evento. Uma mudança persistente ao
                  longo dos anos pode ser uma tendência.
                </p>
                <button onClick={() => setModal("definition")}>
                  Entenda a diferença <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
            <div className="source-mini">
              <span>FONTE PREVISTA</span>
              <button onClick={() => setModal("sources")}>
                <span className="source-orbit">
                  <Orbit size={18} />
                </span>
                <span>
                  <strong>{config.source}</strong>
                  <small>Conheça o produto científico</small>
                </span>
                <ArrowUpRight size={14} />
              </button>
              <small className="source-disclosure">
                Os valores deste protótipo são fictícios.
              </small>
            </div>
          </aside>

          <div className="center-column">
            <Globe
              region={region}
              variable={variable}
              onRegion={selectRegion}
              timeline={timeline}
              onAction={dispatchTimeline}
              mode={deseasonalized ? "anomaly" : "absolute"}
              onModeChange={(mode) => setDeseasonalized(mode === "anomaly")}
            />
            <TimeSeries
              series={series}
              reference={allSeries}
              frame={timeline.frame}
              onFrame={seekFrame}
              variable={variable}
              deseasonalized={deseasonalized}
              onDeseasonalize={() => setDeseasonalized((v) => !v)}
              onExplain={() => setModal("reading")}
            />
          </div>

          <aside
            className="insights-panel"
            aria-label="Resultados da investigação"
          >
            <span className="eyebrow">
              <span className="tiny-number">03</span> CONECTE AS PISTAS
            </span>
            <div className="insights-title">
              <h2>O que encontramos?</h2>
              <span>EXEMPLO SIMULADO</span>
            </div>
            <div className="frame-readout">
              <span>
                MÊS EM EXIBIÇÃO<small>{formatMonth(timeline.frame)}</small>
              </span>
              <strong style={{ color: config.color }}>
                {formatValue(
                  currentObservation.value,
                  variable,
                  deseasonalized,
                )}
                <small>
                  {config.unit} · {deseasonalized ? "anomalia" : "valor médio"}
                </small>
              </strong>
            </div>
            <p className="period-analysis-label">
              TENDÊNCIA · {formatMonth(timeline.start)} —{" "}
              {formatMonth(timeline.end)}
            </p>
            <div
              className={`finding-card ${isConsistent ? "consistent" : "uncertain"}`}
            >
              <div className="finding-status">
                {isConsistent ? (
                  <ShieldCheck size={15} />
                ) : (
                  <CircleHelp size={15} />
                )}{" "}
                {!trend
                  ? "Período insuficiente para estimar"
                  : isConsistent
                    ? "Sinal consistente no exemplo"
                    : "Resultado inconclusivo"}
              </div>
              <span className="finding-label">{config.name}</span>
              <div className="finding-value">
                {trend ? formatValue(trend.slope, variable, true) : "—"}
                <span>{config.decadeUnit}</span>
              </div>
              <p>
                {!trend
                  ? "Este recorte mostra a dinâmica mensal. São necessários pelo menos três anos completos para executar esta regressão simplificada; estudos climáticos exigem mais contexto e uma série adequada."
                  : isConsistent
                    ? `A série simulada indica ${trend.slope > 0 ? "aumento" : "redução"} ao longo do período escolhido.`
                    : "A variação deste exemplo ainda é compatível com ausência de tendência."}
              </p>
              <div className="confidence">
                <div>
                  <span>Intervalo de confiança · 95%</span>
                  <button
                    aria-label="Entender o intervalo de confiança"
                    onClick={() => setModal("reading")}
                  >
                    <CircleHelp size={12} />
                  </button>
                </div>
                <strong>
                  {trend ? formatValue(trend.interval[0], variable, true) : "—"}{" "}
                  <span>a</span>{" "}
                  {trend ? formatValue(trend.interval[1], variable, true) : "—"}
                </strong>
              </div>
            </div>
            <div className="translation">
              <span className="translation-icon">
                <BookOpen size={16} />
              </span>
              <div>
                <span className="eyebrow">EM OUTRAS PALAVRAS</span>
                <p>
                  {!trend
                    ? "Observar um ciclo é diferente de medir uma tendência. Você pode reproduzir este recorte e depois ampliar a janela da investigação."
                    : isConsistent
                      ? "O sinal aparece além das oscilações deste exemplo. Isso não explica, por si só, o que causou a mudança."
                      : "Não encontrar um sinal claro também ensina. Mais tempo ou dados melhores podem mudar a conclusão."}
                </p>
              </div>
            </div>
            <div className="other-signals">
              <div className="section-label">
                UMA REGIÃO, TRÊS SINAIS
                <button
                  aria-label="Entender as variáveis"
                  onClick={() => setModal("definition")}
                >
                  <CircleHelp size={12} />
                </button>
              </div>
              {metrics.map(({ key, result }) => {
                const Icon = variableIcons[key];
                return (
                  <button
                    key={key}
                    className={`signal-row ${key === variable ? "selected" : ""}`}
                    onClick={() => selectVariable(key)}
                  >
                    <span style={{ color: variables[key].color }}>
                      <Icon size={15} />
                    </span>
                    <span>
                      {variables[key].short}
                      <small>
                        {!result
                          ? "Período curto"
                          : result.significant
                            ? "Sinal no exemplo"
                            : "Inconclusivo"}
                      </small>
                    </span>
                    <strong style={{ color: variables[key].color }}>
                      {result ? formatValue(result.slope, key, true) : "—"}
                      <small>{variables[key].unit}/déc.</small>
                    </strong>
                    <ChevronDown size={12} />
                  </button>
                );
              })}
            </div>
            <button
              className="robustness-button"
              onClick={() => setModal("robustness")}
            >
              <ShieldCheck size={17} />
              <span>
                A conclusão resiste?<small>Teste outros períodos</small>
              </span>
              <ArrowUpRight size={15} />
            </button>
            <div className="evidence-footer">
              <span>
                <Fingerprint size={13} /> {series.length} pontos simulados ·{" "}
                {annualSeries.length} anos completos
              </span>
              <button className="export-button" onClick={exportInvestigation}>
                <ArrowDownToLine size={15} /> Exportar investigação
              </button>
              <small>Dados + escolhas + método. Ciência rastreável.</small>
            </div>
          </aside>
        </div>

        <section className="learning-section" id="how-it-works">
          <div className="learning-intro">
            <span className="eyebrow">MENOS MISTÉRIO. MAIS ENTENDIMENTO.</span>
            <h2>
              Você não precisa ser cientista
              <br />
              para fazer <em>boas perguntas.</em>
            </h2>
            <p>Três ideias para transformar observação em conhecimento.</p>
            <button className="text-button" onClick={openGuide}>
              Abra seu guia de campo <ArrowRight size={15} />
            </button>
          </div>
          <div className="learning-cards">
            <button
              onClick={() => {
                setGuideStep(2);
                setModal("guide");
              }}
            >
              <span className="lesson-number">01</span>
              <Waves size={24} strokeWidth={1.2} />
              <h3>Ciclo ou mudança?</h3>
              <p>
                As estações se repetem. Uma tendência aponta uma direção ao
                longo do tempo.
              </p>
              <span className="lesson-link">
                Aprenda a separar <ArrowUpRight size={15} />
              </span>
            </button>
            <button onClick={() => setModal("reading")}>
              <span className="lesson-number">02</span>
              <ShieldCheck size={24} strokeWidth={1.2} />
              <h3>Quanto podemos confiar?</h3>
              <p>
                Uma linha no gráfico é só o começo. A incerteza também faz parte
                da história.
              </p>
              <span className="lesson-link">
                Entenda a evidência <ArrowUpRight size={15} />
              </span>
            </button>
            <button onClick={() => setModal("sources")}>
              <span className="lesson-number">03</span>
              <Fingerprint size={24} strokeWidth={1.2} />
              <h3>De onde vem esse sinal?</h3>
              <p>
                Cada dado tem uma origem, uma escala e limites. Conhecê-los muda
                seu olhar.
              </p>
              <span className="lesson-link">
                Siga a origem <ArrowUpRight size={15} />
              </span>
            </button>
          </div>
        </section>

        <footer className="site-footer">
          <a href="#" className="footer-brand">
            <Earth size={19} /> KIPP.
          </a>
          <span>Feito para cultivar curiosidade sobre o nosso planeta.</span>
          <div>
            <span>PROTÓTIPO INDEPENDENTE</span>
            <span className="footer-dot" />
            NASA SPACE APPS · 2026
            <button onClick={() => setModal("sources")}>
              Créditos & dados <ArrowUpRight size={12} />
            </button>
          </div>
        </footer>
      </main>

      {toast && (
        <div className="toast" role="status">
          <CheckCheck size={17} />
          <span>{toast}</span>
          <button aria-label="Fechar notificação" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {modal && (
        <Modal
          title={
            modal === "sources"
              ? "Toda evidência tem uma origem."
              : modal === "guide"
                ? "Seu guia de campo"
                : modal === "robustness"
                  ? "A conclusão resiste?"
                  : modal === "definition"
                    ? "Uma lente para cada pergunta."
                    : "Aprenda a ler os sinais."
          }
          onClose={() => setModal(null)}
          wide={modal === "sources" || modal === "robustness"}
        >
          {modal === "guide" && (
            <div className="guide-content">
              <div className="guide-progress">
                {guideSteps.map((_, i) => (
                  <button
                    key={i}
                    className={i <= guideStep ? "done" : ""}
                    onClick={() => setGuideStep(i)}
                    aria-label={`Ir para etapa ${i + 1}`}
                    aria-current={i === guideStep ? "step" : undefined}
                  />
                ))}
              </div>
              <div className="guide-illustration">
                {(() => {
                  const Icon = guideSteps[guideStep].icon;
                  return <Icon size={64} strokeWidth={0.9} />;
                })()}
                <span className="orbit-decoration" />
                <span className="orbit-decoration second" />
              </div>
              <span className="eyebrow">{guideSteps[guideStep].tag}</span>
              <h3>{guideSteps[guideStep].title}</h3>
              <p>{guideSteps[guideStep].description}</p>
              <div className="guide-tip">
                <Sparkles size={18} />
                <p>{guideSteps[guideStep].lesson}</p>
              </div>
              <div className="guide-actions">
                <span>{guideStep + 1} de 5</span>
                <div>
                  {guideStep > 0 && (
                    <button
                      className="text-button"
                      onClick={() => setGuideStep((s) => s - 1)}
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    className="primary-button"
                    onClick={() => {
                      if (guideStep < 4) setGuideStep((s) => s + 1);
                      else {
                        setModal(null);
                        document
                          .getElementById("investigation")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {guideStep < 4 ? "Próxima pista" : "Começar a investigar"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
          {modal === "sources" && (
            <div className="source-content">
              <div className="demo-notice">
                <FlaskConical size={21} />
                <div>
                  <strong>Missões reais. Valores simulados.</strong>
                  <p>
                    Este protótipo não consulta a NASA. Todas as séries,
                    tendências e células coloridas são fictícias e servem para
                    demonstrar a experiência. A imagem de base é uma composição
                    estática Blue Marble de janeiro de 2004.
                  </p>
                </div>
              </div>
              <p className="modal-intro">
                Estes são os produtos científicos previstos para uma futura
                integração. A resolução do dado determina o tamanho da pergunta
                que podemos fazer.
              </p>
              <div className="source-list">
                {variableKeys.map((key) => {
                  const v = variables[key];
                  const Icon = variableIcons[key];
                  return (
                    <a key={key} href={v.url} target="_blank" rel="noreferrer">
                      <span
                        className="source-list-icon"
                        style={{ color: v.color }}
                      >
                        <Icon size={23} />
                      </span>
                      <div>
                        <h3>{v.source}</h3>
                        <p>{v.name}</p>
                        <code>{v.product}</code>
                      </div>
                      <span>
                        {v.resolution}
                        <ExternalLink size={15} />
                      </span>
                    </a>
                  );
                })}
              </div>
              <div className="method-note">
                <h3>O que a análise deste protótipo calcula?</h3>
                <p>
                  Regressão linear das médias anuais completas dos dados
                  simulados. O intervalo de 95% usa Student-t e pressupõe erros
                  anuais independentes. Esse modelo simplificado não implementa
                  correções de autocorrelação, testes múltiplos ou atribuição
                  causal.
                </p>
                <p>
                  O mapa e o gráfico exibem valores mensais simulados ou
                  anomalias em relação à referência fixa 2001–2024, por mês do
                  calendário. As cores têm escala fixa durante o playback. A
                  inferência continua usando apenas médias anuais completas do
                  período selecionado. O mapa usa regiões e hexágonos
                  esquemáticos, sem representar fronteiras de bacias ou medições
                  reais.
                </p>
              </div>
              <div className="source-credits">
                <a
                  href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Imagem: NASA Blue Marble <ArrowUpRight size={12} />
                </a>
                <span>Limites: Natural Earth / world-atlas</span>
                <span>
                  Projeto independente, sem afiliação institucional à NASA.
                </span>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  download(
                    `kipp-${region}-${variable}.csv`,
                    toCsv(series, variable, region),
                    "text/csv;charset=utf-8",
                  );
                  showToast("CSV dos dados simulados exportado.");
                }}
              >
                <ArrowDownToLine size={15} /> Baixar série de demonstração
              </button>
            </div>
          )}
          {modal === "reading" && (
            <div className="reading-content">
              <p className="modal-intro">
                Um gráfico conta duas histórias ao mesmo tempo: o que observamos
                e o quanto ainda não sabemos.
              </p>
              <div className="reading-visual">
                <svg viewBox="0 0 500 130" aria-hidden="true">
                  <path
                    d="M20 115 L480 12 L480 76 L20 92Z"
                    fill="#c4dfa1"
                    opacity=".12"
                  />
                  <path
                    d="M20 103L480 44"
                    stroke="#c4dfa1"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <path
                    d="M20 115 L45 87 70 106 95 76 120 95 145 72 170 93 195 63 220 77 245 52 270 74 295 46 320 70 345 34 370 52 395 24 420 45 445 23 480 35"
                    fill="none"
                    stroke="#f4b080"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="reading-item">
                <span>01</span>
                <div>
                  <h3>Valores: o que muda a cada mês</h3>
                  <p>
                    Oscilações podem vir das estações e da variabilidade.
                    “Remover ciclo das estações” subtrai a média do mesmo mês na
                    referência fixa de 2001–2024. O mapa e o gráfico usam a
                    mesma referência, mesmo quando o período selecionado muda.
                  </p>
                </div>
              </div>
              <div className="reading-item">
                <span>02</span>
                <div>
                  <h3>Tendência: a direção ao longo dos anos</h3>
                  <p>
                    A linha tracejada resume a regressão das médias anuais. Sua
                    inclinação é expressa por década, para facilitar a
                    interpretação.
                  </p>
                </div>
              </div>
              <div className="reading-item">
                <span>03</span>
                <div>
                  <h3>Incerteza: quanto a estimativa pode variar</h3>
                  <p>
                    O intervalo de confiança depende do método e de suas
                    hipóteses. Se o intervalo da inclinação inclui zero, o
                    exemplo é compatível com ausência de tendência.
                  </p>
                </div>
              </div>
              <div className="guide-tip">
                <CircleHelp size={19} />
                <p>
                  95% não é a probabilidade de a tendência ser verdadeira. E um
                  sinal estatístico não prova sua causa nem mede sozinho sua
                  importância.
                </p>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setVariable("rainfall");
                  setModal(null);
                }}
              >
                Explorar um exemplo inconclusivo <ArrowRight size={16} />
              </button>
            </div>
          )}
          {modal === "robustness" && (
            <div className="robustness-content">
              <span className="eyebrow">
                DADOS SIMULADOS · {config.short.toUpperCase()}
              </span>
              <p className="modal-intro">
                Se mudarmos o começo da história, a direção continua? Compare as
                estimativas calculadas com três janelas do mesmo exemplo.
              </p>
              <div className="robustness-table">
                <div className="robustness-table-head">
                  <span>Período</span>
                  <span>Mudança / década</span>
                  <span>Intervalo de 95%</span>
                  <span>Leitura</span>
                </div>
                {[
                  ...new Set([
                    0,
                    Math.floor(timeline.end / 36) * 12,
                    Math.floor(timeline.end / 18) * 12,
                  ]),
                ].map((start) => {
                  const result = calculateTrend(
                    annualMeans(
                      selectPeriod(allSeries, { start, end: timeline.end }),
                    ),
                  );
                  return (
                    <button
                      key={start}
                      onClick={() => {
                        dispatchTimeline({
                          type: "preset",
                          start,
                          end: timeline.end,
                        });
                        setModal(null);
                        showToast(
                          `Período alterado: ${formatMonth(start)} — ${formatMonth(timeline.end)}.`,
                        );
                      }}
                    >
                      <strong>
                        {formatMonth(start)}
                        <small>até {formatMonth(timeline.end)}</small>
                      </strong>
                      <span style={{ color: config.color }}>
                        {result
                          ? formatValue(result.slope, variable, true)
                          : "—"}
                      </span>
                      <span>
                        {result
                          ? `${formatValue(result.interval[0], variable)} a ${formatValue(result.interval[1], variable)}`
                          : "Sem estimativa"}
                      </span>
                      <span
                        className={
                          result?.significant ? "positive-text" : "muted-text"
                        }
                      >
                        {result?.significant ? (
                          <Check size={14} />
                        ) : (
                          <CircleHelp size={14} />
                        )}
                        {!result
                          ? "Período curto"
                          : result.significant
                            ? "Sinal no exemplo"
                            : "Inconclusivo"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="method-note">
                <h3>Resistir a uma escolha não resolve todas as outras.</h3>
                <p>
                  Num estudo real, também verificaríamos qualidade, cobertura,
                  mudanças de sensor, autocorrelação e testes múltiplos. Regiões
                  e períodos devem ser justificados antes de procurar um
                  resultado atraente.
                </p>
              </div>
              <div className="guide-tip">
                <ShieldCheck size={20} />
                <p>
                  Uma série curta pode ter um resultado significativo e ainda
                  não representar uma mudança climática de longo prazo. Contexto
                  físico e período sempre importam.
                </p>
              </div>
            </div>
          )}
          {modal === "definition" && (
            <div className="definition-content">
              <div
                className="definition-feature"
                style={{ color: config.color }}
              >
                {(() => {
                  const Icon = variableIcons[variable];
                  return <Icon size={45} strokeWidth={1.2} />;
                })()}
                <span>
                  <span className="eyebrow">A LENTE ATUAL</span>
                  <h3>{config.name}</h3>
                </span>
              </div>
              <p className="modal-intro">{config.definition}</p>
              <div className="method-note">
                <h3>Como interpretar?</h3>
                <p>{config.explanation}</p>
              </div>
              <div className="concept-contrast">
                <div>
                  <span className="eyebrow">EVENTO</span>
                  <h3>Um mês excepcional.</h3>
                  <p>Uma observação que se afasta do comportamento habitual.</p>
                </div>
                <ArrowRight size={18} />
                <div>
                  <span className="eyebrow">TENDÊNCIA</span>
                  <h3>Uma direção persistente.</h3>
                  <p>
                    Uma mudança avaliada ao longo de um período, com incerteza.
                  </p>
                </div>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setModal("guide");
                  setGuideStep(2);
                }}
              >
                Continue aprendendo <ArrowRight size={16} />
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default App;
