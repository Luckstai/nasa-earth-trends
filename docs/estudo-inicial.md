# Estudo inicial — KIPP / NASA Space Apps 2026

Data de referência: **1º de novembro de 2026**. Evento informado pelo time: **14 e 15 de novembro de 2026**.

Equipe: **6 pessoas — 2 cientistas de dados, 3 engenheiros de software e 1 pessoa de produto**.

Este documento registra o estudo inicial elaborado na conversa do projeto. As prioridades representam uma recomendação de escopo; as hipóteses ambientais precisam ser testadas com dados reais.

## Estudo e recomendação

**Minha melhor aposta para o time é uma ferramenta que investigue mudanças em água, calor e vegetação numa região brasileira — e mostre o quanto podemos confiar em cada conclusão.** Com dois cientistas de dados, três engenheiros e uma pessoa de produto, vocês têm capacidade para combinar análise científica, experiência visual e uma apresentação convincente nos dois dias.

O diferencial competitivo seria responder: **“Essa tendência continua existindo quando mudamos o período, removemos a sazonalidade e verificamos a qualidade dos dados?”**

Fiz um levantamento amplo das principais fontes relevantes da NASA, analisei a transcrição completa e os gráficos do vídeo e examinei scripts e o notebook do projeto anterior. A pesquisa está atualizada em **1º de novembro de 2026**; não calculei tendências ambientais nesta etapa. As propostas abaixo são hipóteses de projeto, não descobertas já demonstradas.

Há uma informação importante para o planejamento: a aba Resources informa que os recursos específicos do desafio serão publicados em **13 de novembro**. Os guias de submissão e julgamento de 2026 também estavam previstos para essa data. O guia oficial permite estudar os desafios antecipadamente e estabelece o início do trabalho no projeto em **14 de novembro, às 9h locais**. Portanto, esta pesquisa serve para preparar a decisão e conhecer os dados. [Desafio](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/?tab=resources), [guia de equipes](https://www.spaceappschallenge.org/resources/team-formation-guide/), [FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/).

**O vídeo deixa o objetivo bastante concreto.** O autor, Dr. James Acker, apresenta cinco passos: escolher variável, região e período; gerar a série temporal; testar a significância da tendência. Alguns trechos orientam diretamente a estratégia:

| Trecho        | O que ele apresenta                                                                                              | Consequência para o projeto                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **1:25–2:21** | Exemplos em oceanos, recursos hídricos, meteorologia e estações do ano                                           | Vocês podem escolher um domínio específico e trabalhar tendências sazonais.                     |
| **2:24–3:33** | AOD, uma medida de aerossóis, com médias mensais sobre Wisconsin desde 2002, para investigar fumaça de incêndios | Uma variável bem escolhida e uma pergunta compreensível já sustentam uma demonstração.          |
| **3:35–4:14** | Significância, usando p < 0,05 como introdução                                                                   | O teste precisa aparecer no produto; um resultado não significativo também merece ser mostrado. |
| **4:16–5:22** | Fluxo da investigação e preferência prática por dados semanais ou mensais                                        | Não é necessário suportar todo o acervo NASA nem começar por dados horários.                    |

A leitura estratégica é: **o desafio pede uma investigação guiada, com análise verificável e explicações acessíveis.** [Vídeo oficial, 5min25s](https://www.youtube.com/watch?v=Cd9Q48LhNbo).

Também há um concorrente funcional importante: **Giovanni já oferece mapas, séries regionais, análises sazonais, correlações, regressão e exportação.** O projeto precisa acrescentar valor à interpretação e à confiabilidade da conclusão. [Manual oficial do Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/doc/UsersManualworkingdocument.docx.html).

As três opções que fazem mais sentido para vocês são estas. A ordem representa meu julgamento sobre adequação ao desafio, execução em dois dias e potencial de demonstração.

| Prioridade          | Opção                                                       | Pergunta central                                                                         | Diferencial proposto                                                                                | Principal dificuldade                                                                           |
| ------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **1 — recomendada** | **Água, calor e vegetação: a estação seca está mudando?**   | Como temperatura, chuva e resposta da vegetação mudaram numa bacia ou corredor regional? | Revelar tendências que a média anual pode esconder e mostrar sua robustez                           | Controlar sazonalidade, diferenças de resolução e mudanças no uso do solo                       |
| **2**               | **O oceano está mudando de forma persistente?**             | Onde há aquecimento e mudanças simultâneas em indicadores biológicos?                    | Aproveitar a experiência anterior e apresentar tendências com incerteza e comparação entre produtos | Recuperar uma série longa e tratar problemas de calibração de ocean color                       |
| **3**               | **Quem está vivendo numa superfície cada vez mais quente?** | Como o calor de superfície mudou entre áreas de uma cidade ou região metropolitana?      | Conectar tendências, cobertura vegetal e contexto populacional                                      | Distinguir temperatura da superfície e do ar; trabalhar nuvens, resolução e horário de passagem |

Para a **opção 1**, eu escolheria uma bacia ou corredor no **Cerrado/São Francisco**, sujeito à disponibilidade e qualidade dos dados. O público principal pode ser estudantes, professores e pessoas interessadas em investigar sua região, com relevância adicional para organizações locais.

A pergunta inicial poderia ser:

> “A estação seca desta região está ficando mais quente, com mudança na chuva e na resposta da vegetação?”

O produto mostraria a resposta de cada variável separadamente. Isso permite apresentar, por exemplo, uma tendência robusta numa variável e um resultado inconclusivo em outra, sem forçar uma narrativa.

**As fontes NASA devem entrar por prioridade, e não pela quantidade disponível.** Para essa opção, eu adotaria a seguinte ordem:

| Prioridade | Fonte e produto                                       | Histórico e resolução aproximada                                               | Por que usar e cuidado principal                                                                                                                                                                                                                 |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1**      | **MERRA-2 — `M2TMNXSLV`, V5.12.4**                    | Desde **1980**; mensal; **0,5° × 0,625°**                                      | Temperatura do ar a 2 m, vento e outras variáveis. Excelente base regional; é reanálise e tem resolução de dezenas de quilômetros. [NASA](https://cmr.earthdata.nasa.gov/search/concepts/C1276812859-GES_DISC)                                   |
| **2**      | **GPM IMERG Final — `GPM_3IMERGM`, V07**              | **1998–setembro/2025**; mensal; **0,1°**                                       | Chuva com histórico longo. O campo em mm/h precisa ser convertido corretamente para total mensal. [NASA](https://cmr.earthdata.nasa.gov/search/concepts/C2723754851-GES_DISC)                                                                    |
| **3**      | **MODIS vegetação — `MOD13Q1.061`**                   | Desde **2000**; **250 m**, 16 dias                                             | NDVI/EVI para investigar resposta da vegetação. Exige controle de qualidade, nuvens e sazonalidade; pode ser agregado mensalmente. [NASA](https://cmr.earthdata.nasa.gov/search/concepts/C1748066515-LPCLOUD)                                    |
| **4**      | **GRACE/GRACE-FO — JPL Mascons CRI**                  | Desde **2002**; mensal; grade de **0,5°**, informação efetiva muito mais ampla | Armazenamento total de água em grandes bacias. Não mede apenas água subterrânea; tem lacunas e não sustenta detalhe municipal. [JPL](https://grace.jpl.nasa.gov/data/get-data/jpl_global_mascons/)                                               |
| **5**      | **GLDAS — `GLDAS_NOAH025_M`, V2.1**                   | Desde **2000**; mensal; **0,25°**                                              | Umidade do solo, evapotranspiração e escoamento. Útil para aprofundar a seca; são estimativas de modelo. [NASA](https://ldas.gsfc.nasa.gov/gldas)                                                                                                |
| **6**      | **MODIS temperatura — `MOD11A2.061`**                 | Desde **2000**; **1 km**, 8 dias                                               | Detalhe espacial de temperatura de superfície, diurna e noturna. Mede superfície sob condições observáveis, com limitações de nuvens e horário. [Produto](https://doi.org/10.5067/MODIS/MOD11A2.061)                                             |
| **7**      | **SMAP — `SPL3SMP_E`, V006**                          | Desde **2015**; diário; grade de **9 km**                                      | Umidade superficial para contexto recente. A pegada observacional é maior que a grade; floresta densa limita a interpretação. [NSIDC](https://nsidc.org/data/spl3smp_e/versions/6)                                                               |
| **8**      | **MODIS ET/GPP — `MOD16A2GF.061` e `MOD17A2HGF.061`** | Desde **2000**; **500 m**, 8 dias                                              | Extensões para evapotranspiração ou produtividade vegetal. Escolheria apenas uma delas depois de concluir o núcleo. [ET](https://doi.org/10.5067/MODIS/MOD16A2GF.061), [GPP](https://cmr.earthdata.nasa.gov/search/concepts/C2565791029-LPCLOUD) |

**Meu conjunto mínimo seria MERRA-2 + IMERG + MODIS vegetação.** Começaria com dados mensais em **2001–2024**, preservando as resoluções originais e agregando por região. Não interpolaria temperatura de dezenas de quilômetros para 250 m para aparentar detalhe.

Duas atualizações recentes precisam orientar a análise:

- **IMERG Final V07 termina em setembro de 2025.** A transição para V08 estava em andamento. É melhor manter uma versão homogênea; Final, Late e Early não devem ser emendados sem avaliação. [Aviso NASA](https://gpm.nasa.gov/data/news/update-imerg-v08-transition-schedule-aug-2026).
- **Terra/Aqua apresentam deriva orbital**, com alterações na amostragem espacial e diurna. Para MODIS, especialmente temperatura, eu compararia o resultado do período principal com um período anterior e verificaria consistência com MERRA-2/INMET. [Aviso de qualidade NASA](https://landweb.modaps.eosdis.nasa.gov/displayissue?id=1254).

Para a **opção oceânica**, a prioridade muda:

| Prioridade no caso oceânico | Fonte                                  | Aplicação e limitação                                                                                                                                                                                                                                                                          |
| --------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**                       | **MUR SST v4.1**                       | Temperatura da superfície do mar desde **2002**, diária, grade **0,01°**. Excelente núcleo regional; é uma análise multissensor interpolada, com incerteza associada. [PO.DAAC](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1)                                                      |
| **2**                       | **MODIS Aqua ocean color — CHL e Rrs** | Clorofila e reflectância desde **2002**, com compósitos mensais de 4/9 km. Para um recorte conservador, investigaria **2003–2022**, verificando versão e qualidade. [OB.DAAC](https://oceancolor.gsfc.nasa.gov/), [aviso de degradação](https://forum.earthdata.nasa.gov/viewtopic.php?t=5333) |
| **3**                       | **NASA-SSH Simple Gridded v1.1**       | Nível do mar desde **1992**, grade de **0,5°**, semanal. Série longa; suavização e sobreposição temporal limitam o detalhe e a independência das amostras. [Produto](https://doi.org/10.5067/NSREF-SG0V11)                                                                                     |
| **4**                       | **OSCAR v2**                           | Correntes superficiais desde **1993**, diárias, **0,25°**. Ajuda a contextualizar padrões; é derivado de outros campos e não constitui validação independente deles. [PO.DAAC](https://podaac.jpl.nasa.gov/dataset/OSCAR_L4_OC_FINAL_V2.0)                                                     |
| **5**                       | **SMAP salinidade**                    | Salinidade desde **2015**. Boa extensão para plumas e ciclo hídrico; resolução efetiva é de dezenas de quilômetros. [PO.DAAC](https://podaac.jpl.nasa.gov/dataset/SMAP_JPL_L3_SSS_CAP_MONTHLY_V5)                                                                                              |

Uma extensão cientificamente interessante seria analisar **reflectância multibanda, Rrs**, além de clorofila. Um estudo destacado pela NASA detectou mudanças de cor em uma área oceânica maior do que aquela identificada apenas pela clorofila. Isso sustenta explorar Rrs, mas não garante um sinal significativo num recorte brasileiro. Eu trataria essa análise multivariada como extensão. [NASA e referência ao estudo](https://science.nasa.gov/earth/earth-observatory/climate-change-lends-new-color-to-the-ocean-151894/).

Outras famílias NASA também podem contribuir, dependendo da pergunta escolhida:

| Fonte                                 | Quando faz sentido                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AOD MODIS — `MOD08_M3`/`MYD08_M3`** | Fumaça e aerossóis em séries mensais desde 2000/2002. É o caminho mais próximo do exemplo do vídeo. AOD mede a coluna atmosférica, não PM2,5 na superfície. [NASA](https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD08_M3/)                                            |
| **MAIAC — `MCD19A2.061`**             | Aerossóis com maior detalhe espacial, grade de 1 km. Processamento e controle de qualidade mais trabalhosos. [NASA](https://cmr.earthdata.nasa.gov/search/concepts/C2324689816-LPCLOUD)                                                                                                            |
| **FIRMS MODIS/VIIRS**                 | Contextualizar incêndios e fumaça. Contagem de focos depende do sensor e não equivale a área queimada. [API NASA](https://firms.modaps.eosdis.nasa.gov/api/)                                                                                                                                       |
| **AIRS / OMI**                        | Perfis atmosféricos, vapor e NO₂. Úteis para perguntas sobre atmosfera; exigem cuidado com qualidade e interpretação de colunas. [AIRS](https://airs.jpl.nasa.gov/), [OMI NO₂](https://cmr.earthdata.nasa.gov/search/concepts/C3333493715-GES_DISC)                                                |
| **CERES EBAF**                        | Radiação, balanço energético e nuvens, mensalmente desde 2000. Adequado a análises regionais amplas. [NASA](https://ceres.larc.nasa.gov/Data/)                                                                                                                                                     |
| **Landsat / HLS**                     | Mudança de cobertura e detalhe local. Landsat oferece histórico de décadas; HLS harmoniza Landsat/Sentinel-2 a 30 m. Maior volume e trabalho com nuvens. [Landsat](https://www.usgs.gov/landsat-missions/landsat-collection-2), [HLS](https://hls.gsfc.nasa.gov/about-hls/)                        |
| **PACE / SWOT / NISAR**               | Evidência recente e demonstrações complementares. Seus registros próprios ainda são curtos para sustentar tendências climáticas de décadas. [PACE](https://pace.oceansciences.org/access_pace_data.htm), [SWOT](https://swot.jpl.nasa.gov/), [NISAR](https://science.nasa.gov/mission/nisar/data/) |
| **OCO-2**                             | Perguntas avançadas sobre CO₂. XCO₂ não permite inferir diretamente emissões locais sem considerar transporte e inversão atmosférica. [NASA](https://ocov2.jpl.nasa.gov/science/measurement-approach/)                                                                                             |

Esse levantamento cobre as famílias com maior utilidade para as opções propostas; não representa uma enumeração de todo o acervo NASA.

**Para acessar os dados, eu usaria poucos serviços com funções claras:**

| Serviço                                                                                                              | Papel no projeto                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **[Earthdata Search + CMR](https://search.earthdata.nasa.gov/)**                                                     | Descobrir coleções, versões, datas e arquivos realmente disponíveis. CMR fornece metadados.                           |
| **[Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/)**                                                             | Explorar variáveis e conferir séries regionais; excelente referência para validar a análise.                          |
| **[AppEEARS](https://appeears.earthdatacloud.nasa.gov/)**                                                            | Extrair MODIS e outros produtos por pontos/polígonos, incluindo qualidade. Trabalhos são assíncronos.                 |
| **[earthaccess](https://earthaccess.readthedocs.io/), [Harmony](https://harmony.earthdata.nasa.gov/docs) e OPeNDAP** | Aquisição e recorte programático. As capacidades variam por coleção.                                                  |
| **[NASA POWER](https://power.larc.nasa.gov/docs/tutorials/service-data-request/api/)**                               | Acesso simples a séries meteorológicas por coordenada. Preservar a informação sobre origem e composição dos produtos. |
| **[Worldview](https://worldview.earthdata.nasa.gov/) / [GIBS](https://nasa-gibs.github.io/gibs-api-docs/)**          | Imagens e camadas visuais. As estatísticas devem vir dos valores científicos, não das cores dos mapas.                |

Muitos downloads exigem **Earthdata Login gratuito**. Há ainda uma mudança que invalida recomendações antigas: o **NASA Earth Observations, NEO, foi desativado em setembro de 2026**. A própria NASA aponta Worldview, Giovanni e AppEEARS como alternativas. [Comunicado NASA](https://science.nasa.gov/earth/nasa-earth-observations-neo/).

**As fontes externas mais úteis seriam estas, com prioridade condicionada ao tema:**

| Prioridade                          | Fonte                                                                                                              | Contribuição                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Alta — qualquer caso brasileiro** | **[INMET](https://portal.inmet.gov.br/dadoshistoricos/)**                                                          | Temperatura e chuva medidas em estações. Comparação observacional, respeitando falhas e mudanças de estação.            |
| **Alta — água/vegetação**           | **[CHIRPS v3](https://www.chc.ucsb.edu/data/chirps3)**                                                             | Chuva desde **1981**, grade **0,05°**. Histórico longo para comparação com IMERG; fixar uma versão em toda a série.     |
| **Alta — água/vegetação**           | **[MapBiomas Coleção 11](https://brasil.mapbiomas.org/mapbiomas-lanca-colecao-11-de-cobertura-e-uso-da-terra/)**   | Cobertura e uso da terra de **1985–2025**. Ajuda a distinguir mudança de vegetação associada à conversão do território. |
| **Alta — hidrologia**               | **[ANA/HidroWeb](https://www.snirh.gov.br/hidroweb/)**                                                             | Chuva, nível e vazão por estação. Verificar antecipadamente requisitos de acesso à API.                                 |
| **Alta — comparação meteorológica** | **[ERA5 / ERA5-Land](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land-monthly-means?tab=overview)** | Histórico longo de temperatura e ciclo hídrico. É outra reanálise, podendo compartilhar observações com produtos NASA.  |
| **Alta — contexto territorial**     | **[IBGE](https://www.ibge.gov.br/geociencias/todos-os-produtos-geociencias/15774-malhas.html)**                    | Limites, população e indicadores territoriais. Essencial para comunicar onde ocorre a mudança e quem vive ali.          |
| **Média — vegetação/fogo**          | **[INPE/TerraBrasilis](https://terrabrasilis.dpi.inpe.br/downloads/)**                                             | PRODES, DETER e dados ambientais. Alertas DETER e taxas anuais PRODES têm funções distintas.                            |
| **Alta — oceano**                   | **[NOAA OISST](https://www.ncei.noaa.gov/products/optimum-interpolation-sst)**                                     | SST diária desde **1981**, grade **0,25°**. Histórico adequado a referências climatológicas mais longas.                |
| **Alta — corais**                   | **[NOAA Coral Reef Watch](https://coralreefwatch.noaa.gov/satellite/)**                                            | SST e indicadores de estresse térmico. Estresse térmico não é observação direta de branqueamento.                       |
| **Média — oceano**                  | **[Copernicus Marine](https://data.marine.copernicus.eu/products)**                                                | Produtos físicos e biogeoquímicos, incluindo séries harmonizadas entre sensores.                                        |
| **Condicional — biodiversidade**    | **[OBIS](https://manual.obis.org/access) / [GBIF](https://techdocs.gbif.org/en/data-use/api-downloads)**           | Ocorrências de espécies. Sem controlar esforço amostral, registros não demonstram abundância, ausência ou migração.     |

Se escolherem ondas de calor marinhas, eu usaria OISST ou outra série longa para a referência histórica. O MUR sozinho começa em 2002 e ainda não fornece os 30 anos usados na definição clássica. [Método de referência](https://repository.library.noaa.gov/view/noaa/63891).

**Quanto aos modelos, a prioridade deve ser a inferência estatística; ML entra quando acrescentar uma capacidade demonstrável.**

| Prioridade                                 | Método/modelo                                                 | Função recomendada                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Obrigatório**                            | **Regressão com sazonalidade e incerteza temporal adequada**  | Estimar mudança por década, intervalo de confiança e significância. Erros HAC são uma opção para tratar autocorrelação, após diagnóstico. [Documentação](https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.OLSResults.get_robustcov_results.html)                                                                                                                    |
| **Alta**                                   | **Theil–Sen / Sen sazonal e Mann–Kendall apropriado à série** | Comparar a conclusão com métodos menos sensíveis a extremos. Sazonalidade e dependência temporal precisam ser tratadas explicitamente. [SciPy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html), [USGS](https://pubs.usgs.gov/publication/70011649)                                                                                                               |
| **Alta, se houver mapa com muitos testes** | **Correção FDR**                                              | Controlar falsos positivos ao examinar muitas células, regiões ou variáveis. Definir a família de testes antes de procurar resultados. [Documentação](https://www.statsmodels.org/dev/_modules/statsmodels/stats/multitest.html)                                                                                                                                                                    |
| **ML opcional nº 1**                       | **LightGBM/XGBoost/Random Forest + SHAP**                     | Modelar associações ou prever uma variável bem definida. Validar em períodos futuros e blocos espaciais; SHAP explica o modelo, sem estabelecer causalidade. [XGBoost](https://arxiv.org/abs/1603.02754), [limites do SHAP](https://shap.readthedocs.io/en/latest/example_notebooks/overviews/Be%20careful%20when%20interpreting%20predictive%20models%20in%20search%20of%20causal%20insights.html) |
| **ML opcional nº 2**                       | **PCA/EOF + clustering**                                      | Descobrir regiões com trajetórias semelhantes e sugerir investigações. Não substitui teste de tendência.                                                                                                                                                                                                                                                                                            |
| **Extensão**                               | **PELT/BFAST**                                                | Investigar mudanças abruptas. Uma quebra pode refletir ambiente, sensor ou processamento. [PELT](https://arxiv.org/abs/1101.1438), [BFAST](https://p5g.robjhyndman.com/publications/bfast1/)                                                                                                                                                                                                        |
| **Exploratório**                           | **Prithvi-EO-2.0**                                            | Modelo NASA/IBM multitemporal para imagens HLS. Faz sentido em tarefas de cobertura, inundação ou cicatrizes; eu não o colocaria no caminho crítico da análise de tendências. [NASA](https://ntrs.nasa.gov/citations/20240015391)                                                                                                                                                                   |

Eu deixaria LSTM e Transformers treinados do zero fora do escopo inicial. Uma camada de linguagem natural pode ajudar a escolher variáveis e explicar termos, enquanto os cálculos permanecem reproduzíveis.

No produto, cada conclusão deveria mostrar **magnitude, unidade, período, cobertura válida, incerteza e método**. Também deveria distinguir “evidência de tendência”, “resultado sensível às escolhas” e “evidência insuficiente”. O valor-p não é a probabilidade de a hipótese ser verdadeira, e significância estatística não mede sozinha a importância prática.

**O repositório do ano passado oferece experiência útil, mas alguns resultados precisam ser reconstruídos.** Encontrei:

- Ingestão com `earthaccess`, processamento NetCDF, agregação H3 e interface geoespacial aproveitáveis como referência. [Repositório](https://github.com/Luckstai/kipp-shark).
- Scripts de clorofila/SST configurados para **compósitos mensais de 9 km**, apesar de comentários mencionarem diário/4 km. A resolução real deve vir dos arquivos e da configuração. [Clorofila](https://github.com/Luckstai/kipp-shark/blob/main/download_full_plancton.py), [SST](https://github.com/Luckstai/kipp-shark/blob/main/download_full_sst.py).
- No processamento SWOT, vento e parâmetros de ondas são gerados com números aleatórios. Esses campos devem ficar fora da evidência científica do novo projeto. [Script SWOT](https://github.com/Luckstai/kipp-shark/blob/main/download_full_swot.py).
- O notebook utiliza LightGBM/SHAP com divisão aleatória de treino/teste. Para avaliar generalização espacial e temporal, seria necessário refazer a validação. [Notebook](https://github.com/Luckstai/kipp-shark/blob/main/model.ipynb).

Qualquer reutilização precisa ser declarada, com origem e licenças identificadas, respeitando a contribuição produzida durante o evento. [Termos oficiais](https://www.spaceappschallenge.org/legal/).

**Para competir, eu concentraria o produto numa pergunta e numa demonstração que suporte escrutínio.** A página geral apresenta categorias como Best Use of Science, Best Use of Data e Local Impact; elas são direções coerentes para essa proposta. Os detalhes do julgamento de 2026 ainda precisam ser conferidos quando publicados. [Prêmios oficiais](https://www.spaceappschallenge.org/awards/).

O escopo que eu atribuiria ao time seria:

| Pessoa                   | Responsabilidade                                                      |
| ------------------------ | --------------------------------------------------------------------- |
| **Cientista de dados 1** | Qualidade, agregação temporal/espacial e cálculo das tendências       |
| **Cientista de dados 2** | Sensibilidade, comparação com fontes brasileiras e interpretação      |
| **Engenheiro 1**         | Ingestão, cache e exportação reproduzível                             |
| **Engenheiro 2**         | Mapa, séries e representação da incerteza                             |
| **Engenheiro 3**         | Fluxo da aplicação, integração e implantação                          |
| **Produto**              | Investigação guiada, compreensão do usuário, narrativa e apresentação |

Nas primeiras horas de **14/11**, a meta seria obter uma série real e fechar a pergunta. Até o fim do dia, ter a análise e o fluxo completos. Em **15/11**, validar as conclusões, concluir dois exemplos guiados — incluindo um resultado inconclusivo — e ensaiar a apresentação. Uma extensão de ML só entraria depois que esse percurso estivesse funcionando.

## Evolução da experiência: reprodução temporal

A experiência exploratória posterior ao estudo usa **KIPP** como identidade provisória do time. O frontend está em [`../frontend/`](../frontend/), com os detalhes técnicos e científicos no [README do frontend](../frontend/README.md).

A escolha de um período e sua reprodução mensal fazem sentido para investigar sazonalidade, eventos e a evolução de padrões. O mapa, o mês em exibição e o cursor do gráfico devem permanecer sincronizados. O valor do quadro atual e a tendência do período completo são leituras distintas.

- Escolha de mês inicial/final e controles de play, pausa, avanço, reinício, velocidade e repetição.
- Escala de cores fixa por variável e modo, para permitir comparação entre meses.
- Anomalias comparadas com o mesmo mês de uma referência fixa; no protótipo, 2001–2024.
- Recortes curtos continuam reproduzíveis, sem inventar estimativas anuais quando faltam anos completos. O mínimo matemático de três anos adotado na demonstração não indica duração suficiente para uma conclusão climática.
- Séries e campos espaciais **ainda são simulados**. A textura Blue Marble é estática e não representa uma sequência de imagens reais mensais.
- Na implementação científica futura, a animação deve usar produtos científicos com qualidade e disponibilidade verificadas; imagens GIBS/Worldview podem apoiar a visualização, enquanto os cálculos usam os valores originais.

A preparação anterior ao evento deve ser declarada conforme as regras de reutilização. A prioridade continua sendo uma investigação reproduzível, didática e sustentada por evidências.
