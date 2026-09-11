<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0007-0001: área de avisos com três severidades

## Data
2026-09-10

## Resumo
Construído o canal de retorno do app antes de existir o que notificar: a faixa
flutuante de avisos na borda inferior, com as três severidades do
[IDR 0029](../../idr/0029-avisos-flutuantes-com-tres-severidades.md), que a
persistência (Tarefas 0007-0002 a 0007-0005) e o menu de ações (Fase 9) vão usar.

- `src/lib/avisos.js` — fila e ciclo de vida, **sem React**: mantém a fila em
  memória, expira sucesso e aviso em 5s (`setTimeout`), mantém a falha até ser
  dispensada ou até um sucesso do mesmo tipo a dispensar, e limita o
  empilhamento a três faixas (a mais antiga sai). Expõe `assinarAvisos` /
  `obterAvisos` para o componente consumir via `useSyncExternalStore`, e
  `emitirAviso` / `dispensarAviso` / `limparAvisos`.
- `src/components/Avisos.jsx` — componente que exibe as faixas empilhadas para
  cima a partir da borda inferior. A falha usa `role="alert"`; sucesso e aviso,
  `role="status"` (anúncio não intrusivo — IDR 0034). A mensagem é a área de
  toque que expande o detalhe técnico (só na falha, recolhido por padrão, em
  monospace 11px); o `×` de dispensar fica isolado na ponta direita.
- `src/components/Avisos.css` — flutuante (`position: fixed`), `z-index: 20`,
  `padding: 12px var(--page-gutter)`, sombra `0 -6px 20px`, borda superior de 2px
  na cor da severidade sobre o fundo escuro da mesma família: falha
  `oklch(0.3 0.15 25)`/`--notif-red`, sucesso `oklch(0.32 0.1 150)`/`--green-card`,
  aviso `oklch(0.34 0.13 80)`/`--gold`. A ordem de empilhamento está documentada
  no topo do arquivo: cabeçalho sticky (10) < avisos (20) < menu de ações (30,
  Fase 9).
- `src/App.jsx` — renderiza `<Avisos />` no fim do `.app`.

## Decisões tomadas
- **IDR 0034** — número fixado para "poucas mensagens empilham no máximo":
  **três faixas**, e a mais antiga sai quando chega a quarta. O IDR 0029 deixava
  o número em aberto; a Tarefa 0007-0001 o aponta como decisão em aberto e pede
  o registro. O mesmo IDR registra o anúncio a leitores de tela: falha com
  `role="alert"`, sucesso e aviso com `role="status"` (a política antiga de não
  usar `role="alert"` valia para o botão — ADR 0007 — e foi revista pelos IDRs
  0002 e 0029).

## Impedimentos
Nenhum. A ambiguidade era de nível 1 (número do limite de empilhamento e forma
de anúncio), resolvida com o IDR 0034.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.` (43 arquivos, 105 regras).
- `vitest run`: **18 arquivos de teste, 161 testes, todos passando** — incluindo
  os 7 de `src/lib/avisos.test.js` (expiração em 5s com temporizador falso,
  falha persistente, dispensar, sucesso do mesmo tipo dispensando a falha,
  sucesso de outro tipo não dispensando, limite de três) e os 6 de
  `src/components/Avisos.test.jsx` (renderização das três severidades,
  `role=alert`/`role=status`, dispensar pelo `×`, expansão do detalhe técnico,
  classe de severidade).
- `vite build`: build de produção concluído com sucesso (387,67 KB de JS
  principal, gzip 116,48 KB — crescimento natural desde a medição do ADR 0007;
  o Firestore continua carregado sob demanda e não entra no bundle principal).

### Verificação visual
A verificação visual em `npm run dev` não pôde ser executada neste ambiente
automatizado (sem navegador). O comportamento de expiração, dispensar e
empilhamento está coberto por testes com temporizador falso; a geometria (faixa
de largura total na borda inferior, sombra para cima) segue os tokens e medidas
de `interface.md` § Avisos e § Medidas, e a ordem de empilhamento está
documentada no CSS.

## Arquivos alterados
- `src/lib/avisos.js` — criar (fila e ciclo de vida, sem React)
- `src/lib/avisos.test.js` — criar
- `src/components/Avisos.jsx` — criar
- `src/components/Avisos.css` — criar
- `src/components/Avisos.test.jsx` — criar
- `src/App.jsx` — renderiza `<Avisos />`
- `docs/idr/0034-limite-de-empilhamento-dos-avisos.md` — criar (limite de três e anúncio a leitores de tela)
- `docs/plano/0007-persistencia-da-colecao-e-avisos/0001-area-de-avisos-com-tres-severidades.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0001 atualizado
- `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0001-log-area-de-avisos-com-tres-severidades.md` — este log
