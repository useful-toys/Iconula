<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0007: Estrutura de pastas e separação de responsabilidades

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) construída com Vite + React (ver [ADR 0002](0002-stack-vite-react.md)).
- Precisamos de uma estrutura de pastas que escale com o crescimento do catálogo, da interface e das integrações.
- A separação de responsabilidades deve ser clara para facilitar manutenção e onboarding.

## Decisão

Organizar o código fonte em três pastas principais dentro de `src/`:

- **`src/data/`**: Catálogo estático e suas derivações puras. Contém `catalogo.js` (994 figurinhas, 50 seções), `catalogoOrdenacoes.js` (funções de ordenação e agrupamento), `catalogoLayout.js` (posições de página/linha/trilha) e seus testes. São propriedades do dado, sem efeito colateral.
- **`src/lib/`**: Módulos sem React que implementam a lógica de negócio. Contém estado da coleção em memória (`colecao.js`), persistência no Firestore (`colecaoRemota.js`), gravação agregada (`gravacaoAgregada.js`), histórico de desfazer (`historico.js`), preferências de vista (`preferenciasDeVista.js`), portabilidade (`portabilidade.js`), textos de troca (`textoDeTroca.js`), fila de avisos (`avisos.js`), conversão de bandeiras (`bandeira.js`) e cálculo de progresso (`progresso.js`). Todos têm testes co-localizados.
- **`src/components/`**: Componentes React e seus estilos. Contém telas (login, atestação, política de privacidade) e a árvore da tela principal (cabeçalho, controles, catálogo, avisos, rodapé). Cada componente tem seu arquivo `.jsx`, seu arquivo `.css` e seu arquivo `.test.jsx` co-localizados.

**Arquivo único com estado**: `App.jsx` concentra todo o estado da aplicação (sessão, coleção, preferências, histórico de desfazer, atestação). Os demais componentes são apresentacionais e controlados por props.

**Assets vendorizados**: `src/assets/` contém SVGs de bandeiras (Twemoji), fontes tipográficas (Poppins) e logo do Google — todos vendorizados, sem dependência de CDN em runtime.

## Consequências

- **Separação clara**: dados puros em `data/`, lógica de negócio em `lib/`, interface em `components/`.
- **Testabilidade**: módulos em `lib/` são funções puras ou quase puras, testáveis sem DOM.
- **Co-localização**: cada componente tem seu CSS e seu teste ao lado, facilitando navegação e manutenção.
- **Escalabilidade**: a estrutura suporta crescimento sem exigir reestruturação — novos componentes vão em `components/`, novos módulos de lógica vão em `lib/`, novos dados vão em `data/`.
- **Sem router nem state manager global**: a árvore de componentes ainda não exigiu (ver [TDR 0014](../tdr/0014-estado-da-colecao-sem-context.md) e [TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)).

## Alternativas consideradas

- **Estrutura por feature** (ex.: `src/catalogo/`, `src/login/`, `src/persistencia/`): agruparia todos os arquivos de uma feature juntos, mas misturaria dados, lógica e interface — contra a separação de responsabilidades.
- **State manager global (Redux, Zustand)**: adicionaria complexidade sem benefício, dado que a árvore tem até três níveis e um único domínio de estado.
- **Router**: a aplicação tem uma única tela principal e vistas internas (login, atestação, política) — router seria over-engineering.
