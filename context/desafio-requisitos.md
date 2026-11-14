# Requisitos do desafio e da avaliação

Fonte de verdade para qualquer decisão de produto, dados, estatística ou entrega. Em caso de conflito com outros documentos, vale este arquivo e o texto oficial do desafio.

Fontes:
- Desafio, aba Details: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/?tab=details
- Desafio, aba Resources: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/?tab=resources
- Vídeo oficial: [`video.md`](video.md)
- Mensagens dos avaliadores (Slack, 14/11/2026), resumidas abaixo.

## O desafio: Be An Earth System Trend Detective!

Nível: avançado. Áreas: Earth Science e Software.

**Missão:** criar uma ferramenta que selecione variáveis medidas por missões ou modelos de ciências da Terra, visualize como elas mudam no tempo e determine **o que** muda, **onde** muda, **quanto** muda e se a mudança é **significativa** (no sentido estatístico).

Ideia central: a mesma variável pode subir em uma região e cair em outra, mesmo com a mesma causa. A análise é regional; tendência global é possível, mas exceção.

### Os 4 elementos obrigatórios

Uma resposta que faz visualização **e** análise cobre o escopo completo.

1. **Variáveis:** identificar variáveis de ciências da Terra que podem ter tendência.
2. **Região:** obter os dados da variável para uma região específica (pode ser o mundo inteiro).
3. **Série temporal:** gerar e visualizar a série da variável e região, por tempo suficiente para análise estatística.
4. **Estatística:** calcular a taxa de mudança no tempo e testar a significância da tendência com métodos como teste t, Mann-Kendall ou intervalos de confiança.

Fluxo do vídeo (o app deve conseguir fazer): 1) escolher variável(is); 2) escolher a região; 3) escolher o período; 4) criar e examinar a série; 5) analisar a significância.

### Considerações opcionais (não obrigatórias)

- **Público:** estudantes do ensino médio e superior e público com algum background científico. Definições simples das variáveis ajudam. A ideia é o usuário virar um "detetive de dados".
- **Abordagem:** perguntas guiadas sobre o que ou onde investigar, que levam à busca das variáveis. Dois ou três exemplos de demonstração que o usuário possa assistir.
- **Dados:** dados diários e mensais são os mais fáceis (há também horário e 3-horário, mais difíceis). Uma tendência não significativa ainda é interessante: às vezes basta uma série mais longa. Ferramentas externas de hidrologia, como CUAHSI, são bem-vindas.
- **Escopo estatístico:** tendências lineares já são um bom começo. Tendências não lineares e remoção do ciclo sazonal são mais complexas e fora do escopo previsto.
- Resultado não significativo deve ser mostrado, não escondido. Não significativo não significa "não há tendência".

## Fontes de dados e recursos indicados pelo desafio

Para o Prêmio Global, **pelo menos uma** destas fontes precisa ser usada de fato.

NASA:
- Giovanni: https://giovanni.gsfc.nasa.gov/ (menus de variáveis, séries temporais e download)
- Hydrology Time Series (GES DISC): https://disc.gsfc.nasa.gov/information/tools?title=Hydrology%20Time%20Series
- AppEEARS: https://appeears.earthdatacloud.nasa.gov/ (inclui séries temporais)
- NOAA Climate Data Online (CDO): https://www.ncei.noaa.gov/cdo-web/
- Artigo de referência (séries temporais e significância, SeaWiFS clorofila): https://ntrs.nasa.gov/api/citations/20090042747/downloads/20090042747.pdf

Instrumentos e modelos citados no texto: MODIS, OMI, AIRS, GPM, MERRA-2, GLDAS.

Parceiros (agências espaciais):
- KNMI Climate Explorer: https://climexp.knmi.nl/
- Testes estatísticos de tendência: https://medium.com/@snp.kriss/statistical-test-methods-to-detect-trends-in-time-series-data-b361a0ec530b
- Guia de significância estatística: https://www.statsig.com/perspectives/a-comprehensive-guide-to-statistical-significance
- CSA: RCM (https://donnees-data.asc-csa.gc.ca/en/dataset/rcm), Geo.ca (http://geo.ca/), missão SWOT (https://www.asc-csa.gc.ca/eng/satellites/swot/), ecossistemas (https://www.asc-csa.gc.ca/eng/satellites/everyday-lives/monitoring-and-protecting-our-ecosystems-from-space.asp), tutorial SAR (https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial)
- Na lista da conversa: CUAHSI (https://www.cuahsi.org/data-services/solutions), citado no texto do desafio como exemplo de ferramenta externa.

A NASA não endorsa entidades não governamentais dos EUA. Para sites externos, respeite os termos de uso dos dados de cada site.

## Checklist obrigatório para o Prêmio Global (avaliadores)

- [ ] Responder a um desafio oficial da NASA, não um desafio livre.
- [ ] Usar pelo menos uma fonte de dados ou recurso da NASA indicado no desafio.
- [ ] Apresentar o projeto principalmente em **inglês**.
- [ ] Preparar demonstração de **até 30 segundos** OU apresentação de **até 7 slides**.
- [ ] **Declarar o uso de IA** e identificar os conteúdos gerados conforme as regras.
- [ ] Citar todas as fontes, ferramentas, imagens e materiais utilizados.
- [ ] Todos os links públicos e acessíveis, sem senha.
- [ ] Equipe registrada, com **2 a 6** participantes.
- [ ] Submeter até **15/11/2026, 23h59 (horário local)**. Qualquer arquivo alterado depois desse horário é desclassificado.

Avaliação: pela entrega feita **diretamente na página do SpaceApps**. Atualizar lá com frequência para os avaliadores acompanharem a evolução. Ler o regulamento para manter a elegibilidade.

## Critérios para ganhar indicação (dicas dos avaliadores)

1. Não fugir do tema do desafio.
2. Usar dados e recursos da NASA e mostrar como foram usados.
3. Inovação com diferencial claro, resolvendo um problema real (não basta ser bonito).
4. Protótipo **funcional**, com demonstração prática.
5. Demonstrar impacto: quem ganha, qual problema resolve, como evolui.
6. Documentar tudo: descrição, tecnologias, fontes dos dados, imagens, vídeos e links do protótipo e do código.
7. Apresentação simples e objetiva, pensando em avaliadores internacionais.
8. Preencher todos os campos obrigatórios e finalizar no prazo, na plataforma oficial.
9. Divisão de responsabilidades na equipe.
10. Pensar globalmente: como a solução se aplica a outros lugares, escala e públicos.

## Como aplicar no trabalho do dia a dia

Antes de implementar algo, confirme que ajuda em pelo menos um destes pontos:

- cumpre um dos 4 elementos obrigatórios;
- usa dado real de uma fonte indicada (não simulado) ou deixa claro, na interface, que é demonstração;
- mostra magnitude, unidade, período, método, valor-p ou intervalo de confiança;
- aparece na demonstração de 30 segundos ou nos 7 slides;
- é registrado como fonte, ferramenta ou conteúdo gerado por IA, se for o caso.

Se um item novo não ajuda nenhum desses pontos, deixe para depois.

## Estado da v1 frente a estes requisitos (14/11/2026)

- Interface, fluxo guiado, regressão com IC de 95% e exportação existem em `frontend/`.
- **Todas as séries são simuladas.** Nenhuma fonte NASA é consultada. Isso não cumpre os elementos 2 e 3 do desafio nem o item de usar fonte NASA do checklist.
- O deploy em `kipp-earth-trends-lab.vercel.app` respondeu `404 DEPLOYMENT_NOT_FOUND` em 14/11/2026.
- O README do frontend afirma que o protótipo é anterior ao evento. A origem do material e das contribuições deve ser declarada conforme as regras de reutilização.
