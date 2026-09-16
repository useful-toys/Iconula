<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0009: Testes co-localizados

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) construída com Vite + React (ver [ADR 0002](0002-stack-vite-react.md)).
- Usamos Vitest + React Testing Library para testes (ver [ADR 0002](0002-stack-vite-react.md)).
- Precisamos de uma estratégia de organização de testes que escale com o crescimento do número de componentes e módulos.

## Decisão

Cada módulo ou componente tem seu arquivo de teste co-localizado, no mesmo diretório, com o sufixo `.test.js` ou `.test.jsx`.

**Estrutura**:
- `src/data/catalogo.js` → `src/data/catalogo.test.js`
- `src/lib/colecao.js` → `src/lib/colecao.test.js`
- `src/components/Figurinha.jsx` → `src/components/Figurinha.test.jsx`
- E assim por diante para todos os módulos e componentes.

**Exceções**:
- `src/App.jsx` tem múltiplos arquivos de teste, um por funcionalidade: `App.test.jsx`, `App.auth-unavailable.test.jsx`, `App.atestacao.test.jsx`, `App.copiar.test.jsx`, `App.desfazer.test.jsx`, `App.exportar.test.jsx`, `App.gravacao.test.jsx`, `App.importar.test.jsx`, `App.persistencia.test.jsx`, `App.politica.test.jsx`.
- `firestore.rules` tem `firestore.rules.test.js` (testes das regras do Firestore contra o emulador).
- `vitest.rules.config.js` é a configuração do Vitest para os testes das regras do Firestore.
- `e2e/` (raiz do repositório) reúne os testes E2E (Playwright, contra os
  emuladores do Firebase) — não testam um módulo único, então não há
  "ao lado de quê" co-localizar ([ADR 0010](0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)).

**Configuração**:
- `vite.config.js` define o ambiente de teste como `jsdom` e exclui `.claude/**` e `**/*.rules.test.js` (estes têm config própria).
- `npm run test` roda todos os testes da aplicação.
- `npm run test:rules` roda os testes das regras do Firestore contra o emulador (requer JDK 21+).

**Cobertura**:
- Cada módulo em `src/lib/` tem testes unitários.
- Cada componente em `src/components/` tem testes de integração.
- `src/App.jsx` tem testes de integração cobrindo fluxos completos (login, persistência, importação, etc.).
- `src/data/catalogo.test.js` testa invariantes do catálogo (994 códigos, 50 seções, 20 por seleção, grupos e páginas).

## Consequências

- **Co-localização**: testes ficam junto do código testado, facilitando navegação e manutenção.
- **Descoberta**: ao abrir um módulo ou componente, o teste está logo ao lado.
- **Escalabilidade**: novos módulos/componentes trazem seus próprios testes, sem precisar saber onde colocá-los.
- **App.jsx como exceção**: a complexidade de `App.jsx` (muitas funcionalidades) justifica múltiplos arquivos de teste, um por funcionalidade, em vez de um único arquivo gigante.
- **Regras do Firestore como exceção**: testes das regras rodam contra o emulador, não em `jsdom`, e têm config e script próprios.
- **E2E como segunda exceção**: testes de navegador (Playwright) não têm um módulo único para ficar ao lado — vivem em `e2e/`, com config e scripts próprios ([ADR 0010](0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)).

## Alternativas consideradas

- **Diretório separado para testes** (ex.: `tests/` ou `__tests__/`): dificultaria navegação — ao abrir um módulo, o teste não estaria junto.
- **Todos os testes de App.jsx em um único arquivo**: tornaria o arquivo gigante e difícil de manter — separar por funcionalidade é mais claro.
- **Cobertura de testes obrigatória por CI**: não implementada — a cobertura é alta, mas não há gate automático.

## Histórico

- 2026-09-16 — Esmiuçamento: acrescentada a exceção dos testes E2E
  (`e2e/`), no mesmo molde da exceção das regras do Firestore —
  [ADR 0010](0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md).
  Implementação a planejar (/planejar).
