# KIPP — NASA Earth Trends

Repositório do time KIPP para explorar o desafio **Be An Earth System Trend Detective!**, do NASA Space Apps 2026.

**[Abrir a aplicação publicada](https://nasa-earth-trends.vercel.app/)**

Os arquivos iniciais foram importados do laboratório KIPP em **14 de novembro de 2026**, iniciando um novo histórico Git. As datas e a identificação dos materiais preparatórios permanecem registradas na documentação.

## Estrutura

- [`frontend/`](frontend/): protótipo React, assets, testes e configuração de publicação na Vercel.
- [`docs/estudo-inicial.md`](docs/estudo-inicial.md): estudo inicial, análise do vídeo, prioridades de dados NASA e externos, modelos e estratégia do time.
- [`context/`](context/): referências e contexto do desafio.
- [`ml_experiments/`](ml_experiments/): experimentos, variáveis e fontes de dados.

## Rodar o frontend

Requer Node.js 24.

```sh
cd frontend
npm ci
npm run dev
```

Para validar a versão de produção:

```sh
cd frontend
npm test
npm run build
npm run preview
```

Consulte a [documentação do frontend](frontend/README.md) para conhecer a experiência, os métodos e as limitações dos dados simulados.

## Publicação

O projeto `nasa-earth-trends` da Vercel está conectado a `Luckstai/nasa-earth-trends`, com **Root Directory** `frontend` e **Production Branch** `main`.

Cada push na `main` que modificar o frontend publica uma nova versão após os testes e a build. Mudanças apenas em `context/`, `ml_experiments/` ou neste README não precisam reconstruir o site. A configuração versionada está em [`frontend/vercel.json`](frontend/vercel.json).
