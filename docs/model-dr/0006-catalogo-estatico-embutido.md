<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0006: Catálogo estático embutido

## Status

Aceito.

## Contexto

- A aplicação precisa exibir as 994 figurinhas do álbum Panini da Copa 2026, organizadas em 50 seções.
- O catálogo é a mesma fonte para todos os usuários — nunca toca o Firestore.
- A identidade da figurinha é o código (ex.: `BRA05`), imutável.

## Decisão

- **Catálogo embutido no bundle**, em `src/data/catalogo.js` — única fonte desse dado.
- **50 seções** (`secoes`): 48 seleções + Extras FIFA (`FWC`) + Coca-Cola (`COC`). FWC abre e COC fecha o array.
- **994 figurinhas** (`figurinhas`): expandidas por função pura `expandirFigurinhas(secoes)`, não escritas como literais.
- **Código da figurinha**: `SIG` + número com dois dígitos (`BRA05`, `FWC00`, `COC14`).
- **Numeração por seção**:
  - Seleções: `inicio: 1`, `total: 20` → `SIG01`…`SIG20` (48 × 20 = 960)
  - FWC: `inicio: 0`, `total: 20` → `FWC00`…`FWC19` (20)
  - COC: `inicio: 1`, `total: 14` → `COC01`…`COC14` (14)
  - Total: 960 + 20 + 14 = 994
- **Posições fixas** (seleções): `01` é metalizada; `13` é paisagem (cromo horizontal).
- **Paisagem no FWC**: `FWC00`–`FWC03` e `FWC09`–`FWC19` são paisagem (cromo horizontal, como no álbum físico); `FWC04`–`FWC08` são retrato.
- **Estrutura de cada seção**: `sigla`, `nome`, `tipo` (`selecao` | `especial`), `icone` (emoji Unicode), `grupo` (A–L ou `null`), `paginas` (lista das páginas físicas da seção, em ordem — seleções e COC: o spread; FWC: `[0, 1, 2, 3, 106, 107, 108, 109]`), `total`, `inicio` (opcional, padrão 1).
- **Estrutura de cada figurinha**: `codigo`, `secao` (sigla), `posicao` (inteiro), `metalizada` (booleano), `paisagem` (booleano), `nome` (texto), `nomeLinhas` (par prenomes/sobrenome ou `null`) e `nomeCurto` (texto ou `null`) — os três últimos definidos no [MDR 0008](0008-dados-dos-nomes-das-figurinhas.md).
- **Derivações de tela** (agrupar, ordenar, dispor) ficam em `src/data/catalogoOrdenacoes.js` e `src/data/catalogoLayout.js` — funções puras, sem efeito colateral.
- **Layout de álbum** (`catalogoLayout.js`), para as 50 seções, num formato só:
  - **páginas**: uma entrada por página da seção, com `pagina` (índice de 1 a N na lista `paginas` da seção), `linhas` e `colunas` — a dimensão da grade, que preserva linhas e colunas vazias
  - **posições**: `posicao`, `pagina`, `linha`, `trilha`, `trilhas` para cada figurinha, reproduzindo a página física
  - **spreads**: derivados, pares consecutivos de páginas (1|2, 3|4, …) — não viram campo
  - FWC: oito páginas com as dimensões e posições do [IDR 0023](../idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md)

## Consequências

- O catálogo é imutável e igual para todos os usuários.
- A expansão por função pura evita escrever 994 códigos como literais — a expansão é conferível pelo teste de invariantes.
- O FWC usa `inicio: 0` porque a numeração oficial vai de `FWC00`
a `FWC19` (ver [TDR 0010](../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)).
- A ausência de pipeline de geração significa que lacunas da fonte degradam campo a campo (TDR 0010).
- `paisagem` deixa de ser só posição fixa de seleção: a expansão marca também as 15 paisagens do FWC, e as invariantes de `catalogo.test.js` passam a conferi-las (15 no FWC, nenhuma na COC). Implementação: Fase 0022, Tarefa 0022-0002.
- O FWC ganha layout de álbum ([IDR 0023](../idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md)): as invariantes passam a conferir, por seção, que cada figurinha tem exatamente uma posição, dentro da dimensão da sua página, sem duas figurinhas na mesma casa; `paginas` e o layout têm o mesmo número de páginas. A paisagem do FWC ocupa uma casa (`trilhas: 1`) de 70×70px. Implementação: Fase 0023, Tarefa 0023-0001 (formato com dimensão e pares, invariantes) e Tarefa 0023-0003 (layout do FWC).
- `paginas` deixa de aceitar `null`: toda seção conhece suas páginas. Implementação: Fase 0023, Tarefa 0023-0002.

## Alternativas consideradas

- **Escrever os 994 códigos como literais**: mais verboso, sem vantagem sobre a expansão por função pura. Descartado.
- **Pipeline de geração a partir de fonte externa**: não existe fonte estruturada confiável; a degradação da fonte é tratada campo a campo (TDR 0010). Descartado.
- **Catálogo carregado do Firestore**: seria o mesmo para todos, gastaria leitura à toa. Descartado.
- **Casas vazias como posições sem figurinha** (dimensão deduzida da maior linha e coluna): ≈ 70 itens a mais só no FWC, e "posição sem figurinha" viraria caso novo em todo consumidor. Descartado no esmiuçamento de 2026-09-14.
- **Uma dimensão fixa por seção** (como era: 3 × 4 nas seleções, 3 × 3 na COC): o FWC mistura 4 × 3, 4 × 2 e 3 × 3 — exigiria a maior grade em todas as páginas e deformaria as posições. Descartado no esmiuçamento de 2026-09-14.

## Histórico

- 2026-09-14 — Esmiuçamento do FWC na disposição álbum (implementação a planejar): `paginas` passa a lista das páginas físicas (FWC com oito) e o layout de álbum ganha a dimensão de cada página, com spreads derivados. Antes: `paginas` era o spread ou `null`; o layout só tinha posições, com grade fixa por seção, e o FWC não tinha layout.
- 2026-09-14 — Esmiuçamento: `FWC00`–`FWC03` e `FWC09`–`FWC19` passam a paisagem, refletindo o cromo físico; a figurinha ganha `nomeCurto` ([MDR 0008](0008-dados-dos-nomes-das-figurinhas.md)). Implementação na Fase 0022. Antes: só a `13` das seleções era paisagem; figurinha sem `nomeCurto`.
- 2026-09-13 — Planejamento revisado das Fases 11–17 (implementação na Fase 0017, Tarefa 0017-0002): a figurinha ganha `nome` e `nomeLinhas`, derivados de `src/data/jogadores.js` ([MDR 0008](0008-dados-dos-nomes-das-figurinhas.md)). Antes: sem nome.
