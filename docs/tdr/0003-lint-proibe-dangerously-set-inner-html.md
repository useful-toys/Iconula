<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0003: Lint proíbe `dangerouslySetInnerHTML`

## Status

Aceito

## Contexto

Um review de segurança apontou o uso de `dangerouslySetInnerHTML` em
`TeamButton.jsx` (via `twemoji.parse()`) como um vetor latente de XSS: o
HTML gerado era injetado no DOM sem passar pelo escape automático do
React. A correção removeu esse uso, trocando por um `<img>` React comum
resolvido a partir de SVGs vendorizados (ver
[ADR 0002](../adr/0002-bandeiras-emoji-unicode.md)).

Corrigir a ocorrência atual não impede que uma futura mudança reintroduza
`dangerouslySetInnerHTML` — seja por um novo componente, seja por alguém
reintroduzindo `twemoji.parse()` para resolver um problema diferente. Sem
uma barreira automática, essa é exatamente o tipo de regressão que passa
despercebida em review manual.

## Decisão

Adicionar a regra `react/no-danger` como `"error"` em `.oxlintrc.json`,
junto às regras React já habilitadas
(`react/rules-of-hooks`, `react/only-export-components`). Isso faz
`npm run lint` falhar sempre que `dangerouslySetInnerHTML` aparecer em
qualquer componente, sem precisar de review manual para pegar o caso.

## Consequências

- Qualquer PR que reintroduza `dangerouslySetInnerHTML` falha o lint
  localmente e (se/quando o lint rodar em CI) no pipeline.
- Se um caso legítimo precisar de HTML bruto no futuro (deveria ser raro
  nesta SPA), a regra exige uma decisão explícita: uma
  desativação pontual (`// oxlint-disable-next-line react/no-danger`)
  acompanhada de justificativa no código e, idealmente, sanitização da
  entrada (ex. DOMPurify) antes de reativar o padrão — não apenas
  silenciar o lint.
