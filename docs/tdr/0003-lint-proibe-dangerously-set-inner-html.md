<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0003: Lint proíbe `dangerouslySetInnerHTML`

## Status

Aceito

## Contexto

- Review de segurança: uso de `dangerouslySetInnerHTML` em
  `TeamButton.jsx` (via `twemoji.parse()`) era um vetor latente de XSS —
  o HTML gerado era injetado no DOM sem passar pelo escape automático do
  React.
- Correção já aplicada: trocado por um `<img>` React comum, resolvido a
  partir de SVGs vendorizados (ver
  [ADR 0002](../adr/0002-bandeiras-emoji-unicode.md)).
- Corrigir a ocorrência atual não impede uma futura reintrodução de
  `dangerouslySetInnerHTML` (novo componente, ou `twemoji.parse()`
  reintroduzido para outro problema) — sem barreira automática, é o tipo
  de regressão que passa despercebida em review manual.

## Decisão

- Regra `react/no-danger` como `"error"` em `.oxlintrc.json`, junto às
  regras React já habilitadas (`react/rules-of-hooks`,
  `react/only-export-components`).
- `npm run lint` passa a falhar sempre que `dangerouslySetInnerHTML`
  aparecer em qualquer componente, sem depender de review manual.

## Consequências

- Qualquer PR que reintroduza `dangerouslySetInnerHTML` falha o lint
  localmente e (se/quando o lint rodar em CI) no pipeline.
- Se um caso legítimo precisar de HTML bruto no futuro (deveria ser raro
  nesta SPA), a regra exige uma decisão explícita: uma
  desativação pontual (`// oxlint-disable-next-line react/no-danger`)
  acompanhada de justificativa no código e, idealmente, sanitização da
  entrada (ex. DOMPurify) antes de reativar o padrão — não apenas
  silenciar o lint.
