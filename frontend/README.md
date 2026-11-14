# KIPP — NASA Earth Trends

Protótipo exploratório, com a identidade provisória da equipe **KIPP**, de uma experiência didática para o desafio **Be An Earth System Trend Detective!**, do NASA Space Apps 2026.

## Executar

Requer Node.js 24. A versão também está fixada em `package.json` para o ambiente da Vercel.

```sh
npm ci
npm run dev
```

Abra o endereço impresso pelo Vite, normalmente `http://127.0.0.1:5173/`.

```sh
npm test          # verificações de análise, exportação e reprodução temporal
npm run build    # TypeScript estrito e build de produção
npm run preview  # prévia do build
```

## Publicação automática na Vercel

Configuração do projeto `nasa-earth-trends`, na conta do time KIPP:

Produção: **[nasa-earth-trends.vercel.app](https://nasa-earth-trends.vercel.app/)**.

Painel: [projeto na Vercel](https://vercel.com/lucas-projects-62e8b289/nasa-earth-trends).

| Campo             | Valor                        |
| ----------------- | ---------------------------- |
| Repositório       | `Luckstai/nasa-earth-trends` |
| Root Directory    | `frontend`                   |
| Production Branch | `main`                       |
| Framework         | Vite                         |
| Node.js           | 24.x                         |
| Install Command   | `npm ci`                     |
| Build Command     | `npm test && npm run build`  |
| Output Directory  | `dist`                       |

O repositório está conectado à Vercel, e a integração Git publica automaticamente os pushes na `main`. O arquivo `vercel.json` concentra a configuração e limita os deploys automáticos a essa branch. Não há necessidade de armazenar um token Vercel no GitHub.

O comando `node scripts/vercel-ignore-build.mjs` compara o frontend com o commit do último deploy bem-sucedido (`VERCEL_GIT_PREVIOUS_SHA`). Assim, alterações apenas na documentação ou nos experimentos não recompilam o site, e um push com vários commits considera todas as mudanças acumuladas. No primeiro deploy ou quando o histórico não está disponível, a build é executada.

As credenciais e conexões de login são gerenciadas nas contas pessoais das plataformas. `.vercel/`, arquivos de ambiente, dependências e a pasta de build ficam fora do Git.

## Experiência

- Três regiões brasileiras: São Francisco, Amazônia central e Pantanal.
- Três variáveis com séries mensais determinísticas e simuladas: temperatura do ar, precipitação e EVI.
- Seleção exata de mês inicial e final, com atalhos para um ano, cinco anos e o histórico completo.
- Globo com base NASA Blue Marble, limites Natural Earth, seleção de região e zoom. Campos espaciais simulados mudam mensalmente com escalas de cores fixas e valores quantitativos.
- Player com play/pausa, quadro anterior/seguinte, reinício, velocidade 0,5×/1×/2×/4× e repetição opcional. A reprodução para no fim do recorte e pausa quando a página fica oculta.
- Marcador do gráfico sincronizado com o globo; clicar na série escolhe o mês e pausa o player. Valores absolutos e anomalias podem ser alternados nos dois lugares.
- Recortes curtos continuam navegáveis, com indicação de insuficiência para a regressão anual.
- Investigação guiada em cinco passos, explicações de variáveis, sazonalidade e incerteza.
- Comparação de três períodos para testar a sensibilidade do resultado.
- Exportação da investigação em JSON e da série mensal em CSV, com declaração de dados simulados.
- Layout responsivo, navegação por teclado, diálogos nativos e preferência por movimento reduzido.

## Honestidade dos dados

**Nenhum resultado exibido é uma descoberta ambiental real.** Os valores são inventados e não foram obtidos de uma API NASA. Missões e produtos de referência são reais e aparecem como fontes previstas para futura integração.

O cálculo demonstra regressão linear sobre médias anuais completas. O intervalo de 95% usa Student-t, pressupondo erros anuais independentes. A faixa do gráfico representa o intervalo da média ajustada; não é um intervalo de previsão de cada observação mensal. Não há correção HAC, FDR ou atribuição causal. As anomalias usam a referência mensal fixa de 2001–2024, independentemente do recorte selecionado. A inferência mantém apenas as médias anuais completas do recorte. Menos de três anos completos não produz uma regressão; esse limiar é apenas o mínimo matemático desta demonstração, não uma recomendação de duração para estudos climáticos.

O mapa não representa limites reais das bacias nem tendências satelitais. Hexágonos e seleção regional são esquemáticos. Cada quadro tem valores espaciais sintéticos que variam mês a mês, com média regional consistente com a série do gráfico. A climatologia de cada célula é calculada sobre os mesmos 24 anos. A escala de cores permanece fixa por variável e modo, permitindo comparações entre quadros. A imagem Blue Marble é estática, de janeiro de 2004: a animação pertence aos campos simulados sobrepostos, sem substituir a textura por imagens reais de cada data. O JSON exportado registra período mensal, quadro atual, modo, referência, velocidade e repetição.

Este material é um protótipo exploratório anterior ao evento. Não deve ser apresentado como implementação desenvolvida durante o hackathon. Verifique as regras de reutilização e declare os materiais anteriores.

## Stack e desempenho

React **19.3.1**, React DOM **19.3.1**, TypeScript, Vite 8 e Lucide. Sem backend, credenciais ou serviços pagos. Fontes são servidas localmente, o globo é uma imagem WebP de aproximadamente 91 kB, limites são pré-projetados em SVG e as análises são calculadas localmente com memoização. Não há motor WebGL ou biblioteca de gráficos pesada. d3-geo e topojson são utilizados apenas para gerar os assets, não são carregados no frontend. O gráfico usa ResizeObserver para manter texto legível em telas pequenas.

## Organização

- `src/App.tsx`: fluxo da investigação, seleção e exportação.
- `src/components/Globe.tsx`: mapa e navegação temporal ilustrativa.
- `src/components/TimeSeries.tsx`: gráfico SVG, anomalias, cursor temporal e intervalo da média estimada.
- `src/components/PlaybackControls.tsx`: controles de reprodução mensal.
- `src/lib/playback.ts`: máquina de estados temporal, recorte mensal, campos espaciais e escalas fixas.
- `src/lib/playback.test.ts`: limites, parada/repetição, climatologia e coerência entre campo espacial e série regional.
- `src/components/Modal.tsx`: diálogo nativo acessível.
- `src/lib/analysis.ts`: dados simulados, agregação anual, regressão e exportação.
- `src/lib/analysis.test.ts`: verificações da análise.
- `src/lib/mapGeometry.ts`: coordenadas pré-projetadas das regiões.
- `public/assets/boundaries.svg`: limites e gratícula pré-projetados.
- `scripts/generate-map.mjs`: regeneração de limites e coordenadas com d3-geo/world-atlas.
- `scripts/generate-globe.py`: projeção ortográfica da base cartográfica; requer Pillow e NumPy apenas para regenerar o asset.

## Referências e créditos

- NASA Blue Marble Next Generation, janeiro de 2004: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/
- Natural Earth, via world-atlas 2: https://github.com/topojson/world-atlas
- MERRA-2: https://gmao.gsfc.nasa.gov/gmao-products/merra-2/
- GPM IMERG: https://gpm.nasa.gov/data/imerg
- MOD13Q1.061: https://cmr.earthdata.nasa.gov/search/concepts/C1748066515-LPCLOUD
- Manrope e Instrument Serif, Fontsource; licenças SIL OFL incluídas nos pacotes.
- Lucide, licença ISC.

Projeto independente, sem afiliação institucional à NASA. O conector Lovable foi consultado, mas exigiu reautenticação; o protótipo foi implementado diretamente neste repositório.
