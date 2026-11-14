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
- A publicação usa a conta do time KIPP na Vercel, Root Directory `frontend` e Production Branch `main`. Confira o vínculo do projeto com `Luckstai/nasa-earth-trends` antes de publicar.
- Mantenha a configuração de build em `frontend/vercel.json`. A publicação automática ocorre pela integração Git da Vercel.
- Diferencie dados simulados de observações reais. Nunca apresente os números do protótipo como descobertas científicas.
