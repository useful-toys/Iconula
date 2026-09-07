<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0001: Stack Vite + React

## Status

Aceito

## Contexto

O "Iconula Button" começa como uma SPA extremamente simples (um único
botão), mas o usuário já sinaliza a intenção de evoluí-lo para uma
aplicação single-page maior no futuro. Precisamos de uma base que suporte
esse crescimento sem introduzir complexidade desnecessária hoje.

## Decisão

Usar [Vite](https://vitejs.dev/) como build tool e [React](https://react.dev/)
como biblioteca de UI, com o template padrão `react` do `create-vite`.

## Consequências

- Estrutura de pastas já separa dados (`src/data`) de componentes
  (`src/components`), preparando o terreno para crescer sem exigir
  reestruturação.
- Sem router, sem gerenciador de estado global e sem framework de CSS
  nesta fase — seriam over-engineering para um único botão. Adicionar
  quando a complexidade da SPA realmente exigir.
- Build gera arquivos estáticos em `dist/`, compatíveis diretamente com
  Firebase Hosting (ver [ADR 0003](0003-deploy-firebase-hosting-github-actions.md)).

## Alternativas consideradas

- **HTML/CSS/JS puro**: mais simples agora, mas exigiria migração
  completa quando a SPA crescesse — descartado pela intenção declarada
  de evolução futura.
- **Vue** ou **Next.js**: viáveis, mas sem vantagem clara sobre Vite+React
  para este caso; React foi escolhido por familiaridade e ecossistema.
