---
description: Sincroniza os MDRs (docs/model-dr/) com os modelos de dados atuais
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Sincronize os **MDRs** (`docs/model-dr/`) com o estado atual da base de código:
descubra os modelos de dados realmente vigentes, compare com o que está
documentado e proponha as correções.

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `firebase` ou `memoria`),
limite a sincronização a esse modelo; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe sobre o assunto:
   - `AGENTS.md`;
   - o guia `docs/model-dr/CLAUDE.md` — regras de redação, estrutura obrigatória
     e atualização do índice `docs/model-dr/README.md`;
   - os documentos vivos `docs/modelo-firebase.md`,
     `docs/modelo-intercambio.md` e `docs/modelo-memoria.md`;
   - **todos** os MDRs de `docs/model-dr/` e o índice
     `docs/model-dr/README.md`.
   Se algum desses arquivos não existir, pare e diga o que faltou — não invente
   formato nem índice.
2. Invoque a skill `git-remote-sync-guard` para deixar a produção (`main`) em
   dia e garantir que a branch de documentação `docs/documentacao_continua`
   está presente e atual:
   - se `docs/documentacao_continua` não existir (nem local nem em `origin`),
     crie-a a partir de `main` com worktree próprio:
     `git worktree add .worktrees/docs-documentacao_continua -b docs/documentacao_continua main`;
   - se já existir, sincronize-a seguindo a skill `git-remote-sync-guard`
     (fetch e fast-forward apenas; a integração nunca é rebaseada). Se ela não
     contiver a produção ou tiver divergido, pare e peça orientação.
3. `git status --short`: se houver alterações não commitadas na worktree da
   integração, pare e peça para resolver — não as carregue para a worktree de
   trabalho.
4. Crie a **branch de trabalho** numa worktree separada, a partir de
   `docs/documentacao_continua`, com nome sugerido pelas skills
   `git-branch-name` (tipo/assunto `docs-sincronizar-mdr`):
   `git worktree add .worktrees/<nome> -b <nome> docs/documentacao_continua`.
   Trabalhe **somente** dentro dela.

## 2. Varredura (somente leitura)
Levante os modelos de dados efetivamente usados — schema de persistência,
estrutura de documentos no banco, formato em trânsito (export/import),
representação em memória, transformações e validações, nomenclatura de campos e
chaves. A verdade primária é o código/config, não a documentação. Fontes
típicas: `src/data/catalogo.js`, `src/data/catalogoLayout.js`,
`src/data/catalogoOrdenacoes.js`, `src/lib/colecao.js`,
`src/lib/colecaoRemota.js`, `src/lib/portabilidade.js`, `firestore.rules` e os
`docs/modelo-*.md`.

Para cada modelo, compare com os MDRs existentes e classifique:
- **sem ação** — já documentado e correto;
- **atualizar `MDR NNNN`** — documentado, mas não reflete o estado atual;
- **novo `MDR NNNN`** — modelo real ainda não documentado (próximo número
  sequencial da pasta);
- **modelo mudou** — reescrever o mesmo registro (Contexto, Decisão,
  Consequências) e mover o modelo anterior para `## Histórico`, com data e
  motivo; nunca criar um registro "substituído por" (ver
  `docs/model-dr/CLAUDE.md`).

Verifique também se os `docs/modelo-*.md` (documentos vivos) descrevem a
situação atual.

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever qualquer arquivo**:
- modelos encontrados, com evidência (`arquivo:linha`);
- por item: `sem ação` / `atualizar MDR NNNN` (resumo do diff) /
  `criar MDR NNNN: título` / `reescrever MDR NNNN` (novo modelo; o anterior vira
  histórico);
- mudanças propostas nos `docs/modelo-*.md` (documentos vivos) e no índice
  `docs/model-dr/README.md`.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Para redigir os registros e atualizar o índice, siga o
  `docs/model-dr/CLAUDE.md`: estrutura obrigatória (Status / Contexto /
  Decisão / Consequências / Alternativas consideradas / Histórico), estilo de
  prosa e a tabela `Nº | Título | Status | Tags | Resumo` do
  `docs/model-dr/README.md` — atualizada no mesmo commit.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- Atualize os `docs/modelo-*.md` (documentos vivos) para refletirem a situação
  atual.
- **Escopo restrito a documentação**: não altere código, configuração,
  workflows nem configuração pública (Firebase/GCloud/GitHub/DNS).
- Valide: links relativos não quebrados e `npm run lint`.

## 5. Entregar
- Commit com a mensagem proposta pela skill `git-commit-message` (somente se a
  proposta foi aprovada).
- Rebase da branch de trabalho sobre a integração
  (`git rebase docs/documentacao_continua`); em conflito, pare e peça orientação.
- Com a worktree da integração limpa, avance `docs/documentacao_continua` para o
  resultado da branch de trabalho (fast-forward a partir da worktree dela):
  `git -C .worktrees/docs-documentacao_continua merge --ff-only <branch-de-trabalho>`.
- Não faça push nem abra PR sem o usuário pedir.
- Ofereça remover a worktree e a branch de trabalho ao final.
