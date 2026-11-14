
# Variáveis para exploração — NASA Space Apps 2026

## Contexto

**Desafio:** Be an Earth System Trend Detective

**Objetivo:** Investigar variáveis ambientais e climáticas que permitam identificar tendências, anomalias, sazonalidade e mudanças no comportamento do sistema terrestre.

Este documento reúne variáveis candidatas para exploração científica inicial.

A seleção é preliminar e não representa uma decisão definitiva sobre quais indicadores serão utilizados na solução do hackathon.

## Critérios de seleção

As variáveis foram selecionadas considerando:

- Relevância para processos físicos do sistema terrestre.
- Potencial para análise de tendências temporais.
- Disponibilidade de séries históricas.
- Possibilidade de investigar relações entre fenômenos.
- Acessibilidade dos dados científicos.
- Diversidade de componentes do sistema terrestre.

---

## 1. Temperatura do ar

**Prioridade:** Alta

**Tipo da variável:** Temperatura atmosférica próxima à superfície.

**Variável científica:** Temperatura do ar a 2 metros (T2M).

**Unidade:** °C.

### Justificativa científica

A temperatura é um dos principais indicadores das condições climáticas.

Sua evolução temporal permite investigar tendências de aquecimento ou resfriamento, mudanças na sazonalidade e alterações na frequência de extremos térmicos.

Também influencia processos como evaporação, disponibilidade hídrica e desenvolvimento da vegetação.

### Perguntas exploratórias

- A temperatura média anual apresenta tendência significativa?
- As temperaturas máximas e mínimas evoluem de maneira diferente?
- Existem diferenças regionais nas tendências?
- O comportamento sazonal mudou ao longo do tempo?

### Fontes de dados

**Fonte principal:** NASA POWER

https://power.larc.nasa.gov/

**Produto:** POWER Daily Meteorology

**Parâmetros candidatos:**
- T2M: temperatura média a 2 metros.
- T2M_MAX: temperatura máxima.
- T2M_MIN: temperatura mínima.

**Acesso:** API REST, JSON ou CSV.

### Considerações científicas

Os valores são derivados de produtos meteorológicos e de reanálise, não necessariamente de medições diretas em estações meteorológicas.

A análise de tendências deve considerar a origem e a consistência temporal do produto.

---

## 2. Precipitação

**Prioridade:** Alta

**Tipo da variável:** Precipitação atmosférica.

**Variável científica:** Precipitação acumulada ou taxa de precipitação.

**Unidade:** mm ou mm/h, dependendo do produto.

### Justificativa científica

A precipitação é um componente fundamental do ciclo hidrológico.

Mudanças na quantidade, intensidade ou distribuição temporal das chuvas podem afetar a disponibilidade de água, a vegetação e a ocorrência de eventos extremos.

Uma região pode manter precipitação anual relativamente estável e, simultaneamente, apresentar mudanças importantes na distribuição sazonal das chuvas.

### Perguntas exploratórias

- Existe tendência na precipitação anual?
- A distribuição sazonal está mudando?
- Os períodos secos estão se tornando mais longos?
- Eventos de precipitação intensa estão se tornando mais frequentes?

### Fontes de dados

**Fonte principal:** NASA GES DISC

https://disc.gsfc.nasa.gov/

**Produto:** GPM IMERG Final Run Monthly

https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGM_07/summary

**Identificador:** GPM_3IMERGM

**Versão:** 07

**Acesso:** Earthdata / download programático.

### Considerações científicas

A precipitação possui elevada variabilidade espacial e temporal.

É necessário considerar diferenças entre estimativas por satélite, observações de superfície e produtos combinados.

Produtos mensais são adequados para tendências de longo prazo, mas não são suficientes para analisar individualmente eventos extremos de curta duração.

---

## 3. Índice de vegetação — NDVI

**Prioridade:** Alta

**Tipo da variável:** Índice espectral de vegetação.

**Variável científica:** Normalized Difference Vegetation Index.

**Unidade:** Adimensional.

### Justificativa científica

O NDVI é calculado a partir da refletância da superfície nas bandas do vermelho e infravermelho próximo.

É utilizado para investigar a atividade e o vigor da vegetação.

Mudanças no NDVI podem estar relacionadas à disponibilidade hídrica, temperatura, sazonalidade, alterações na cobertura vegetal e atividades humanas.

### Perguntas exploratórias

- O NDVI apresenta tendência de crescimento ou redução?
- Existem alterações no ciclo sazonal da vegetação?
- Períodos de seca estão associados a anomalias negativas de NDVI?
- Regiões diferentes apresentam respostas distintas às mudanças climáticas?

### Fontes de dados

**Fonte principal:** NASA LP DAAC

**Produto:** MODIS MOD13A2 Version 6.1

https://lpdaac.usgs.gov/products/mod13a2v061/

**Identificador:** MOD13A2

**Versão:** 061

**Resolução espacial:** Aproximadamente 1 km.

**Resolução temporal:** Composições de 16 dias.

**Acesso:** Earthdata / LP DAAC / serviços de subsetting.

### Considerações científicas

O NDVI não representa diretamente biomassa, desmatamento ou cobertura vegetal.

Sua interpretação deve considerar:

- Sazonalidade.
- Cobertura de nuvens.
- Qualidade das observações.
- Tipo de vegetação.
- Mudanças no uso do solo.

---

## 4. Umidade do solo

**Prioridade:** Média

**Tipo da variável:** Umidade volumétrica do solo superficial.

**Variável científica:** Soil Moisture.

**Unidade:** m³/m³.

### Justificativa científica

A umidade do solo conecta processos atmosféricos, hidrológicos e biológicos.

Ela responde à precipitação, evaporação e características do solo, influenciando a disponibilidade de água para a vegetação.

Pode ajudar a compreender diferenças entre regiões com padrões semelhantes de precipitação.

### Perguntas exploratórias

- A umidade superficial apresenta tendência de redução?
- Existe relação entre anomalias de precipitação e umidade do solo?
- Quanto tempo após uma mudança na precipitação ocorre uma resposta no solo?
- A umidade do solo está associada a mudanças no NDVI?

### Fontes de dados

**Fonte principal:** NASA NSIDC / Earthdata

**Produto:** SMAP Level-3 Soil Moisture

https://nsidc.org/data/spl3smp

**Identificador:** SPL3SMP

**Acesso:** Earthdata.

### Considerações científicas

O SMAP possui observações desde 2015, oferecendo uma série histórica mais curta que outros produtos.

A medição representa principalmente a camada superficial do solo, não toda a zona radicular.

---

## 5. Temperatura da superfície terrestre

**Prioridade:** Média

**Tipo da variável:** Temperatura radiométrica da superfície.

**Variável científica:** Land Surface Temperature (LST).

**Unidade:** Kelvin nos dados originais, com conversão possível para °C.

### Justificativa científica

A LST representa a temperatura radiométrica da superfície terrestre.

É influenciada por cobertura vegetal, propriedades do solo, umidade e urbanização.

Pode ajudar a identificar alterações térmicas associadas a mudanças na cobertura e no uso do solo.

### Perguntas exploratórias

- A temperatura da superfície apresenta tendência de aumento?
- Regiões urbanas e vegetadas apresentam comportamentos diferentes?
- Existe associação entre redução do NDVI e aumento da LST?
- As tendências diurnas e noturnas são diferentes?

### Fontes de dados

**Fonte principal:** NASA LP DAAC

**Produto:** MODIS MOD11A2 Version 6.1

https://lpdaac.usgs.gov/products/mod11a2v061/

**Identificador:** MOD11A2

**Versão:** 061

**Resolução temporal:** Composições de 8 dias.

**Acesso:** Earthdata / LP DAAC.

### Considerações científicas

LST não é equivalente à temperatura do ar.

Os dados podem ser afetados por nuvens, horários de passagem do satélite e condições de observação.

É necessário aplicar os fatores de escala e filtros de qualidade indicados na documentação.

---

## 6. Evapotranspiração

**Prioridade:** Média

**Tipo da variável:** Fluxo de água da superfície para a atmosfera.

**Variável científica:** Evapotranspiration (ET).

**Unidade:** Quantidade de água por área e período, conforme o produto.

### Justificativa científica

A evapotranspiração combina evaporação da água e transpiração da vegetação.

Representa uma parte importante do ciclo hidrológico e do balanço energético da superfície.

Sua evolução pode revelar alterações nas interações entre disponibilidade hídrica, temperatura e vegetação.

### Perguntas exploratórias

- Existe tendência na evapotranspiração?
- A evapotranspiração diminui durante períodos de seca?
- Como ela se relaciona com precipitação e temperatura?
- Mudanças no NDVI estão associadas a mudanças na evapotranspiração?

### Fontes de dados

**Fonte principal:** NASA LP DAAC

**Produto:** MODIS MOD16A2 Version 6.1

https://lpdaac.usgs.gov/products/mod16a2v061/

**Identificador:** MOD16A2

**Versão:** 061

**Resolução temporal:** 8 dias.

**Acesso:** Earthdata / LP DAAC.

### Considerações científicas

A evapotranspiração é estimada por algoritmos que combinam diferentes informações ambientais.

Não representa uma medição direta de todo o fluxo de água.

A interpretação deve considerar as hipóteses e limitações do algoritmo utilizado.

---

## Relações entre variáveis

Além de analisar tendências individuais, é interessante investigar relações entre diferentes componentes do sistema terrestre.

Algumas hipóteses exploratórias incluem:

### Temperatura × Precipitação

Investigar se mudanças nas condições térmicas estão associadas a alterações no regime de chuvas.

### Precipitação × Umidade do solo

Investigar como variações na precipitação se refletem na disponibilidade de água no solo.

### Umidade do solo × NDVI

Investigar possíveis respostas da vegetação a condições de estresse hídrico.

### NDVI × Temperatura da superfície

Investigar se mudanças na atividade ou cobertura vegetal estão associadas a alterações térmicas.

### Temperatura × Evapotranspiração

Investigar como mudanças nas condições atmosféricas se relacionam com o fluxo de água para a atmosfera.

Essas relações representam hipóteses exploratórias, não relações causais previamente estabelecidas.

## Direcionamento inicial

As variáveis prioritárias para os primeiros experimentos são:

1. Temperatura do ar.
2. Precipitação.
3. NDVI.

Elas representam componentes complementares do sistema terrestre e oferecem boas oportunidades para exploração de séries temporais e dados espaciais.

Umidade do solo, temperatura da superfície e evapotranspiração são candidatas para aprofundar as análises posteriormente.

A escolha definitiva dependerá da disponibilidade, qualidade, cobertura e adequação dos dados às perguntas científicas investigadas.
