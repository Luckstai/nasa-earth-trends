# Instruções do projeto KIPP

## Identidade e Git

- Este repositório pertence ao projeto pessoal do time KIPP.
- Nas operações Git/GitHub do agente, use a conta `Luckstai`, o nome `Lucas Henrique` e o e-mail `lucas.henrique.tai@gmail.com`, tanto para autor quanto para committer.
- Antes de autenticar, criar commits ou enviar código, confira a conta efetiva com `gh api user` e a identidade Git local. Não use outras identidades.
- Configure identidade e credenciais no escopo deste repositório. Não copie configurações, credenciais, dados ou documentos de projetos de trabalho.
- Use nomes de branches descritivos com prefixos `feat/`, `fix/` ou `docs/` quando uma nova branch for necessária.

## Organização

- Código, dependências, assets, testes e configuração da aplicação ficam em `frontend/`.
- Estudos e documentação compartilhada ficam em `docs/`.
- Preserve os materiais existentes em `context/` e `ml_experiments/`.
- Não versione `node_modules/`, `dist/`, `.vercel/`, arquivos de ambiente, credenciais ou capturas em `artifacts/`.

## Validação e publicação

- Use Node.js 24.
- Valide alterações funcionais com `npm --prefix frontend test` e `npm --prefix frontend run build`.
- A publicação usa a conta do time KIPP na Vercel, projeto `nasa-earth-trends`, Root Directory `frontend` e Production Branch `main`. Confira o vínculo do projeto com `Luckstai/nasa-earth-trends` antes de publicar.
- Mantenha a configuração de build em `frontend/vercel.json`. A publicação automática ocorre pela integração Git da Vercel.
- Diferencie dados simulados de observações reais. Nunca apresente os números do protótipo como descobertas científicas.

## Regras do desafio NASA Space Apps 2026

Leia [`context/desafio-requisitos.md`](context/desafio-requisitos.md) antes de propor ou implementar qualquer mudança funcional. Ele resume o desafio "Be An Earth System Trend Detective!", os recursos indicados e o checklist de elegibilidade dos avaliadores.

- Todo trabalho deve servir aos 4 elementos do desafio: variáveis, região, série temporal e análise estatística (taxa de mudança e significância, com teste t, Mann-Kendall ou intervalos de confiança).
- Use dados reais de pelo menos uma fonte indicada no desafio (Giovanni, AppEEARS, GES DISC, MERRA-2, GLDAS, GPM, MODIS, AIRS, OMI, NOAA CDO etc.). Dado simulado só com aviso explícito na interface e nos documentos.
- Mostre sempre magnitude, unidade, período, método e incerteza. Resultado não significativo também deve ser mostrado.
- Entrega principalmente em **inglês**: interface final, README, slides e submissão. Demonstração de até 30 s ou até 7 slides.
- Registre o uso de IA e identifique o conteúdo gerado por IA. Cite todas as fontes, ferramentas, imagens e materiais, incluindo materiais anteriores ao evento.
- Links públicos, sem senha. Equipe de 2 a 6 pessoas.
- Prazo final: **15/11/2026, 23h59 (horário local)**. Arquivos alterados depois disso desclassificam o projeto. Não faça commits ou deploys de mudanças funcionais após esse horário.
- Não proponha algo fora do tema do desafio. Prefira um protótipo funcional que demonstre dados reais.
