<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0001: Stack Vite + React

## Status

Aceito

## Contexto

A Iconula é uma single-page application para colecionadores do álbum de
figurinhas da Copa do Mundo FIFA 2026. Precisamos de uma base que suporte
o crescimento do catálogo, da interface e das integrações sem introduzir
complexidade desnecessária.

## Decisão

Usar [Vite](https://vitejs.dev/) como build tool e [React](https://react.dev/)
como biblioteca de UI, com o template padrão `react` do `create-vite`.

## Consequências

- Estrutura de pastas já separa dados (`src/data`) de componentes
  (`src/components`), preparando o terreno para crescer sem exigir
  reestruturação.
- Sem router nem gerenciador de estado global nesta fase — seriam
  over-engineering enquanto a árvore de componentes não os exigir.
- Build gera arquivos estáticos em `dist/`, compatíveis diretamente com
  Firebase Hosting (ver [ADR 0003](0003-deploy-firebase-hosting-github-actions.md)).

## Alternativas consideradas

- **HTML/CSS/JS puro**: mais simples agora, mas exigiria migração
  completa quando a SPA crescesse — descartado pela intenção declarada
  de evolução futura.
- **Vue** ou **Next.js**: viáveis, mas sem vantagem clara sobre Vite+React
  para este caso; React foi escolhido por familiaridade e ecossistema.
