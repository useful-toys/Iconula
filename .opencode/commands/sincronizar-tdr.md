---
description: Sincroniza os TDRs (docs/tdr/) com o estado atual da base de código
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Sincronize os **TDRs** (`docs/tdr/`) com o estado atual da base de código e
das configurações: descubra as decisões técnicas de implementação realmente
vigentes, compare com o que está documentado e proponha as correções.

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `0012` ou `catalogo`),
limite a sincronização a esse registro/assunto; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe sobre o assunto:
   - `AGENTS.md`;
   - o guia `docs/tdr/CLAUDE.md` — regras de redação, estrutura obrigatória e
     atualização do índice `docs/tdr/README.md`;
   - o documento vivo `docs/arquitetura.md`;
   - **todos** os TDRs de `docs/tdr/` e o índice `docs/tdr/README.md`.
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
   `git-branch-name` (tipo/assunto `docs-sincronizar-tdr`):
   `git worktree add .worktrees/<nome> -b <nome> docs/documentacao_continua`.
   Trabalhe **somente** dentro dela.

## 2. Varredura (somente leitura)
Levante as decisões técnicas de implementação interna efetivamente realizadas —
segurança, estrutura de dados/estado em runtime, desempenho, convenções de
código, vendorização e configuração de build/lint/testes. A verdade primária é
o código/config, não a documentação. Fontes típicas: `package.json`,
`vite.config.js`, `vitest.rules.config.js`, `.oxlintrc.json`, `.env.example`,
`firestore.rules`, `src/lib/`, `src/data/` e os workflows.

Para cada decisão, compare com os TDRs existentes e classifique:
- **sem ação** — já documentada e correta;
- **atualizar `TDR NNNN`** — documentada, mas o texto não reflete o estado atual;
- **novo `TDR NNNN`** — decisão real ainda não documentada (próximo número
  sequencial da pasta);
- **decisão mudou** — reescrever o mesmo registro (Contexto, Decisão,
  Consequências) e mover a decisão anterior para `## Histórico`, com data e
  motivo; nunca criar um registro "substituído por" (ver `docs/tdr/CLAUDE.md`).

Verifique também se `docs/arquitetura.md` referencia os TDRs corretamente.

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever qualquer arquivo**:
- decisões encontradas, com evidência (`arquivo:linha`);
- por item: `sem ação` / `atualizar TDR NNNN` (resumo do diff) /
  `criar TDR NNNN: título` / `reescrever TDR NNNN` (nova decisão; a anterior
  vira histórico);
- mudanças propostas em `docs/arquitetura.md` e no índice `docs/tdr/README.md`.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Para redigir os registros e atualizar o índice, siga o `docs/tdr/CLAUDE.md`:
  estrutura obrigatória (Status / Contexto / Decisão / Consequências /
  Alternativas consideradas / Histórico), estilo de prosa e a tabela
  `Nº | Título | Status | Tags | Resumo` do `docs/tdr/README.md` — atualizada
  no mesmo commit.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- Atualize `docs/arquitetura.md` para refletir a situação atual.
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
