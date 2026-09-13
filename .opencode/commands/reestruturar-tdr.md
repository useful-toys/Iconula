---
description: Reestrutura os TDRs (docs/tdr/): funde duplicatas, resolve contradições e revisa a redação
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Reorganize os **TDRs** (`docs/tdr/`): entenda todas as decisões, elimine
sobreposição, repetição, duplicidade, redundância e contradição, una decisões do
mesmo assunto e revise a redação. O objetivo é remover ruído e deixar a coleção
coerente — **sem** buscar decisões novas na base de código (para isso existe o
`sincronizar-tdr`).

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `0007-0014` ou `catalogo`),
limite a reestruturação a esses registros/assunto; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe: `AGENTS.md`; o guia
   `docs/tdr/CLAUDE.md` (estrutura, regras de redação e atualização do índice);
   o documento vivo `docs/arquitetura.md`; **todos** os TDRs de `docs/tdr/` e o
   índice `docs/tdr/README.md`. Se algum desses arquivos não existir, pare e diga
   o que faltou — não invente formato nem índice.
2. Registre a **branch original**: `git branch --show-current`. Se for
   `main`/`master`, detached HEAD ou vazia, pare e pergunte qual é a branch
   original antes de continuar.
3. `git status --short`: se houver alterações não commitadas, pare e peça para
   resolver — não as carregue para a worktree.
4. Sincronize a branch original seguindo a skill `git-remote-sync-guard`.
5. Crie a worktree de trabalho a partir da branch original, com nome sugerido
   pelas skills `git-branch-name` (tipo/assunto `docs-reestruturar-tdr`):
   `git worktree add .worktrees/<nome> -b <nome> <branch-original>`.
   Trabalhe **somente** dentro dela.

## 2. Diagnóstico (somente leitura)
Monte o entendimento de cada decisão — título, status, assunto técnico, posição
cronológica (datas/ordem no `## Histórico`) e referências cruzadas. Depois
aponte:
- **sobreposição / repetição / duplicidade** — registros que decidem o mesmo
  ponto, no todo ou em parte;
- **redundância** — conteúdo repetido entre registros ou dentro de um mesmo;
- **contradição** — decisões incompatíveis entre si;
- **mesmo assunto** — candidatos a virar um único registro;
- **desfaz / muda / substitui** — quando um registro revoga, altera ou substitui
  outro, consolidar num registro só, com a decisão anterior no `## Histórico`;
- **ordem cronológica** — registros fora de ordem ou sequências de decisões que
  podem ser reorganizadas/reagrupadas por data;
- **tipo fora do lugar** — o registro está numa pasta cujo tipo não corresponde
  ao assunto (ex.: um TDR sobre DevOps ou sobre interface); aplique as regras de
  classificação do `CLAUDE.md` da pasta e proponha mover para a pasta correta;
- **slug desatualizado** — o nome do arquivo (`NNNN-slug.md`) não condiz mais
  com o assunto da decisão (ex.: após fusão ou reescrita); proponha renomear
  preservando o número;
- **redação** — desvios das regras de estilo do `AGENTS.md` e do § Estilo de
  prosa do `docs/tdr/CLAUDE.md`.

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever ou apagar qualquer arquivo**, item a
item:
- registros lidos e o que cada um decide;
- por grupo: `manter como está` / `reescrever NNNN` (redação/estrutura) /
  `fundir NNNN + NNNN em NNNN` (qual número permanece, por quê, e o que vai para
  o `## Histórico`) / `resolver contradição` (qual prevalece e por quê) /
  `reordenar` (ordem cronológica) / `mover NNNN para docs/<destino>/` (tipo fora
  do lugar) / `renomear NNNN-slug → NNNN-slug-novo` (slug desatualizado);
- referências a registros absorvidos ou movidos que precisam ser reapontadas;
- para cada mover: renumere para o próximo número livre da pasta de destino (o
  fim da sequência), com o novo prefixo/título (`TDR 0007` → `DDR 0008`), a
  linha removida do índice de origem e a adicionada ao de destino, e registre o
  número original no `## Histórico`;
- mudanças no índice `docs/tdr/README.md` e no documento vivo
  `docs/arquitetura.md`.

**Não renumere os registros que ficam na pasta de origem**: preserve o número
dos registros mantidos; a numeração pode ficar não sequencial — isso é aceito.
Ao fundir, escolha o número a manter (de preferência o mais antigo, para reduzir
churn de referências) e registre os números absorvidos no `## Histórico`. A
exceção é o registro movido entre pastas, que recebe o próximo número livre do
destino.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Siga o `docs/tdr/CLAUDE.md` para redação, estrutura e atualização do
  `docs/tdr/README.md` (tabela `Nº | Título | Status | Tags | Resumo`, no mesmo
  commit).
- Ao fundir, apague os arquivos absorvidos e preserve o número do que permanece;
  registre a decisão anterior no `## Histórico` com data e motivo — nunca use
  "substituído por".
- Reaponte os links relativos para o registro que permanece.
- Ao mover, renumere o registro para o próximo número livre da pasta de destino
  (fim da sequência), ajuste o prefixo/título do documento, remova a linha do
  índice de origem e adicione-a ao de destino, reaponte as referências e registre
  o número original no `## Histórico`.
- Ao renomear o arquivo, preserve o número e troque o slug; reaponte as
  referências e a linha do índice.
- Atualize `docs/arquitetura.md` para refletir a situação atual.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- **Escopo restrito a documentação**: não altere código, configuração,
  workflows nem configuração pública (Firebase/GCloud/GitHub/DNS).
- Valide: links relativos não quebrados e `npm run lint`.

## 5. Entregar
- Commit com a mensagem proposta pela skill `git-commit-message` (somente se a
  proposta foi aprovada).
- Rebase da branch de trabalho sobre a original
  (`git rebase <branch-original>`); em conflito, pare e peça orientação.
- Com a árvore principal limpa, avance a branch original para o resultado
  (`git merge --ff-only <branch-de-trabalho>` ou
  `git branch -f <original> <branch>`).
- Não faça push nem abra PR sem o usuário pedir.
- Ofereça remover a worktree e a branch de trabalho ao final.
