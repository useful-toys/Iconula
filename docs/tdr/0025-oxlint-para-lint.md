<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0025: oxlint para lint

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](../adr/0001-aplicacao-spa.md))
  construída com Vite + React (ver [ADR 0002](../adr/0002-stack-vite-react.md)).
- O [TDR 0003](0003-lint-proibe-dangerously-set-inner-html.md) estabeleceu
  a regra `react/no-danger` como erro para barrar o vetor de XSS, mas
  não especificou a ferramenta de lint.
- A configuração inicial usava ESLint, mas o oxlint oferece desempenho
  significativamente melhor (escrito em Rust) e cobertura suficiente
  para as regras de React necessárias ao projeto.

## Decisão

- **oxlint** como ferramenta de lint, configurado em `.oxlintrc.json`.
- Plugins habilitados: `react` e `oxc`.
- Regras configuradas:
  - `react/rules-of-hooks`: **erro** — garante que hooks sejam chamados
    na ordem correta e apenas em componentes/funs de hook.
  - `react/no-danger`: **erro** — proíbe `dangerouslySetInnerHTML`,
    reforçando o [TDR 0003](0003-lint-proibe-dangerously-set-inner-html.md).
  - `react/only-export-components`: **aviso** (com
    `allowConstantExport: true`) — desencoraja exportar não-componentes
    de arquivos de componente, mas permite exportar constantes.
- `npm run lint` executa `oxlint`.
- O CI (`ci.yml`) roda `npm run lint` como etapa do workflow.

## Consequências

- **Desempenho**: oxlint é ordens de magnitude mais rápido que ESLint,
  tornando o lint praticamente instantâneo mesmo em máquinas modestas.
- **Sem configuração de regras de estilo**: oxlint foca em erros e
  padrões problemáticos, não em estilo (formatação fica a cargo do
  Prettier/editor). Isso alinha com a escolha de não adotar Prettier —
  o projeto não tem formatador automático de código.
- **Cobertura suficiente**: as três regras configuradas cobrem as
  necessidades do projeto (hooks, XSS e organização de exports). Regras
  adicionais podem ser acrescentadas no `.oxlintrc.json` sem mudar a
  ferramenta.
- **Sem plugin de React para TypeScript**: oxlint não substitui a
  verificação de tipos — o projeto usa `@types/react` e `@types/react-dom`
  como devDependencies, mas não roda `tsc --noEmit` como parte do CI
  (ver [ADR 0002](../adr/0002-stack-vite-react.md) § Alternativas
  consideradas sobre TypeScript).

## Alternativas consideradas

- **ESLint**: o lint tradicional do ecossistema React/JS. Mais maduro e
  com mais plugins, mas significativamente mais lento e com configuração
  mais verbosa. Para as três regras necessárias, o oxlint basta.
- **biome**: alternativa Rust-based ao ESLint+Prettier. Viável, mas o
  oxlint já atendia e é mais leve (sem formatador embutido, o que evita
  a decisão sobre adoção de Prettier/biome format).
- **Sem lint**: descartado — o [TDR 0003](0003-lint-proibe-dangerously-set-inner-html.md)
  já estabeleceu a necessidade de barrar `dangerouslySetInnerHTML`
  automaticamente.
