
# CONTEXT — NASA Space Apps Challenge 2026

## 1. Contexto do desafio

Este projeto faz parte do NASA International Space Apps Challenge 2026, especificamente do desafio **"Be an Earth System Trend Detective"**.

Desafio oficial:
https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

O desafio propõe investigar tendências e mudanças no sistema terrestre utilizando dados científicos de observação da Terra, especialmente aqueles disponibilizados pela NASA.

O sistema terrestre é composto por diferentes componentes interconectados, incluindo atmosfera, hidrosfera, biosfera e superfície terrestre. Mudanças nesses componentes podem ser observadas por meio de variáveis ambientais e climáticas ao longo do tempo.

A proposta envolve explorar dados históricos para identificar padrões, tendências, variações e possíveis mudanças no comportamento dessas variáveis.

Exemplos de fenômenos que podem ser investigados:

- Mudanças na temperatura ao longo das décadas.
- Alterações nos padrões de precipitação.
- Mudanças na cobertura e atividade da vegetação.
- Variações na umidade do solo.
- Mudanças em condições atmosféricas e oceânicas.
- Relações entre diferentes variáveis ambientais.

O objetivo desta etapa não é definir antecipadamente quais fenômenos serão investigados, mas compreender quais dados estão disponíveis e quais possibilidades de análise eles oferecem.

## 2. Escopo de ciência de dados

A frente de ciência de dados está inicialmente em uma fase exploratória.

O propósito é compreender o ecossistema de dados científicos disponibilizados pela NASA, identificar datasets relevantes e investigar suas características.

As atividades iniciais incluem:

- Descobrir fontes e produtos de dados relacionados ao sistema terrestre.
- Compreender o significado científico das variáveis disponíveis.
- Investigar cobertura espacial, temporal e resolução dos datasets.
- Entender os formatos utilizados para distribuição dos dados.
- Realizar downloads de amostras de dados.
- Experimentar a leitura e interpretação desses arquivos em Python.
- Realizar análises exploratórias simples para compreender a estrutura e o comportamento dos dados.

Nesta etapa, não existe um conjunto definitivo de indicadores, regiões geográficas ou períodos de análise.

Também não há compromisso inicial com uma metodologia estatística ou modelo específico.

A intenção é desenvolver familiaridade com os dados e identificar possibilidades para etapas posteriores do projeto.

## 3. Fontes de dados

A NASA disponibiliza dados científicos por meio de diferentes plataformas, centros de distribuição e produtos.

É importante distinguir:

- **Plataformas:** interfaces para descobrir, acessar ou analisar dados.
- **Produtos científicos:** conjuntos de dados específicos, produzidos a partir de observações, sensores ou modelos.
- **Variáveis:** grandezas medidas ou estimadas dentro de um produto, como temperatura, precipitação ou índices de vegetação.

### 3.1. NASA Earthdata

https://www.earthdata.nasa.gov/

Portal central do ecossistema de dados de observação da Terra da NASA.

Permite descobrir e acessar produtos relacionados a diferentes componentes do sistema terrestre.

O Earthdata Search permite pesquisar produtos por variável, região, período e outros critérios.

https://search.earthdata.nasa.gov/

### 3.2. NASA GES DISC

https://disc.gsfc.nasa.gov/

Goddard Earth Sciences Data and Information Services Center.

Centro de distribuição de dados científicos relacionados principalmente à atmosfera, hidrologia e processos climáticos.

Disponibiliza produtos de observação e reanálise, incluindo dados de precipitação, temperatura e outras variáveis ambientais.

### 3.3. NASA Giovanni

https://giovanni.gsfc.nasa.gov/giovanni/

Ferramenta de exploração e visualização de dados geofísicos.

Permite selecionar variáveis, regiões e períodos para gerar visualizações e análises sem necessariamente baixar os arquivos originais.

Pode ser utilizada para investigar rapidamente o comportamento de determinadas variáveis antes de realizar análises em Python.

### 3.4. NASA POWER

https://power.larc.nasa.gov/

Prediction Of Worldwide Energy Resources.

Disponibiliza séries históricas de variáveis meteorológicas e relacionadas à radiação solar.

Entre as variáveis disponíveis estão temperatura, precipitação, umidade e radiação.

Possui APIs que facilitam o acesso programático aos dados, incluindo respostas em JSON e CSV.

É uma opção interessante para experimentações iniciais com séries temporais.

### 3.5. NASA Earth Observatory

https://earthobservatory.nasa.gov/

Plataforma de divulgação científica que apresenta observações, imagens e análises de fenômenos terrestres.

Sua principal utilidade nesta etapa é ajudar a compreender fenômenos ambientais, contextualizar indicadores e encontrar referências para possíveis investigações.

## 4. Produtos científicos candidatos

Os produtos abaixo são referências iniciais para exploração, e não datasets obrigatórios ou previamente selecionados.

### 4.1. GISTEMP

https://data.giss.nasa.gov/gistemp/

Análise histórica da temperatura da superfície terrestre.

Disponibiliza séries temporais e anomalias de temperatura, permitindo investigar tendências de aquecimento em escalas globais e regionais.

### 4.2. GPM IMERG

https://gpm.nasa.gov/data/imerg

Produto de estimativas de precipitação baseado em observações de satélite.

Permite investigar distribuição espacial das chuvas, sazonalidade e mudanças nos padrões de precipitação.

### 4.3. MODIS — Vegetation Indices

https://lpdaac.usgs.gov/products/mod13a2v061/

Produtos derivados de observações de satélite que incluem índices de vegetação, como NDVI e EVI.

Permitem investigar mudanças na atividade da vegetação e possíveis alterações ambientais ao longo do tempo.

### 4.4. MERRA-2

https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/

Produto de reanálise atmosférica que combina observações e modelos físicos.

Disponibiliza diversas variáveis meteorológicas e atmosféricas em uma estrutura espacial e temporal consistente.

Pode ser utilizado para investigar tendências em temperatura, umidade, circulação atmosférica e outras variáveis.

## 5. Características dos dados

Os dados científicos da NASA podem apresentar estruturas diferentes das bases tabulares tradicionais.

Entre os formatos encontrados estão:

- CSV e JSON: comuns em APIs e séries temporais agregadas.
- NetCDF: utilizado para representar variáveis científicas multidimensionais.
- HDF: formato hierárquico utilizado por diversos produtos de observação.
- GeoTIFF: formato raster georreferenciado, comum em dados espaciais.

Um exemplo de estrutura multidimensional é:

temperature[time, latitude, longitude]

Nesse caso, os dados representam valores de temperatura associados a diferentes instantes e posições geográficas.

A exploração inicial deve considerar características como:

- Unidades de medida.
- Resolução espacial e temporal.
- Cobertura geográfica e histórica.
- Valores ausentes.
- Indicadores de qualidade.
- Metadados e documentação científica.
- Diferenças entre observações diretas, estimativas de satélite e dados de reanálise.

## 6. Direcionamento da exploração

A descoberta de datasets deve partir preferencialmente de perguntas sobre fenômenos terrestres, e não apenas da disponibilidade de produtos nos catálogos.

Uma sequência conceitual é:

Fenômeno de interesse
→ Variável científica
→ Produto de dados
→ Análise exploratória

Por exemplo:

Mudanças no regime de chuvas
→ Precipitação
→ GPM IMERG
→ Exploração de séries temporais e distribuição espacial

Ou:

Mudanças na vegetação
→ NDVI
→ MODIS
→ Exploração da evolução temporal do índice

Esses exemplos não representam decisões sobre o projeto final.

Nesta fase, o foco é explorar diferentes possibilidades, compreender a natureza dos dados e desenvolver uma base de conhecimento que permita tomar decisões fundamentadas posteriormente.
