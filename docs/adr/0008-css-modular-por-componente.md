<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0008: CSS modular por componente

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) com múltiplos componentes React.
- Precisamos de uma estratégia de estilização que escale com o crescimento do número de componentes.
- A identidade visual é definida em `theme.css` com tokens OKLCH (ver [IDR 0022](../idr/0022-tema-escuro-unico-paleta-do-prototipo.md)).

## Decisão

Cada componente React tem seu próprio arquivo CSS co-localizado, importado diretamente no arquivo do componente.

**Estrutura**:
- `src/components/Figurinha.jsx` importa `./Figurinha.css`
- `src/components/Cabecalho.jsx` importa `./Cabecalho.css`
- `src/components/Catalogo.jsx` importa `./Catalogo.css`
- E assim por diante para todos os componentes.

**Arquivos globais**:
- `src/theme.css`: tokens de design (cores OKLCH, espaçamentos, tipografia) e padrões globais (box-sizing, foco visível).
- `src/index.css`: `@font-face` da fonte Poppins vendorizada e reset mínimo.
- `src/App.css`: layout da aplicação (flex de página, tela de auth indisponível).

**Escopo**:
- Cada arquivo CSS contém apenas os estilos do respectivo componente.
- Classes CSS são nomeadas com o prefixo do componente (ex.: `.figurinha`, `.figurinha__corpo`, `.figurinha--lista`).
- Não há CSS Modules nem scoped CSS — o escopo é garantido pela convenção de nomenclatura.

**Tokens**:
- Componentes consomem tokens de `theme.css` via variáveis CSS (ex.: `var(--turf)`, `var(--gold)`, `var(--page-gutter)`).
- Não há valores mágicos espalhados — cores, espaçamentos e tipografia vêm dos tokens.

## Consequências

- **Co-localização**: CSS e JSX ficam juntos, facilitando navegação e manutenção.
- **Escalabilidade**: novos componentes trazem seu próprio CSS, sem poluir arquivos globais.
- **Consistência**: tokens em `theme.css` garantem identidade visual uniforme.
- **Simplicidade**: sem CSS Modules, sem scoped CSS, sem build step adicional — CSS puro importado diretamente.
- **Especificidade**: convenção de nomenclatura com prefixo do componente evita conflitos, mas exige disciplina.

## Alternativas consideradas

- **CSS Modules** (`.module.css`): adicionaria build step e complexidade, sem benefício claro para uma aplicação de tamanho médio.
- **Scoped CSS** (Vue-style): não é suportado nativamente pelo React.
- **CSS-in-JS** (styled-components, emotion): adicionaria dependência e complexidade, e a aplicação já tem uma estratégia de tokens que funciona bem.
- **Arquivo CSS único**: dificultaria manutenção e escalabilidade — cada componente teria que encontrar seu espaço num arquivo gigante.
- **Tailwind CSS**: adicionaria dependência e exigiria reescrita de toda a estratégia de tokens já estabelecida.
