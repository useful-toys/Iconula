<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0003-0004: faixa de bandeiras e salto para seção

## Data
2026-09-10

## Resumo
Criada a faixa de bandeiras no cabeçalho, uma linha horizontal com as 50 seções do catálogo (FWC no início, COC no fim), rolável quando não cabe na tela. Cada ícone é um botão com nome acessível ("Saltar para Brasil", etc.) e a imagem é decorativa (aria-hidden).

O salto é orquestrado pelo `App.jsx` via ref do `Catalogo`, que expõe o método `saltarPara(sigla)`. O método:
1. Expande o super-grupo que contém a seção (se houver)
2. Expande a seção se estiver colapsada
3. Rola suavemente até a seção, compensando a altura do cabeçalho sticky

A ordem dos ícones acompanha a ordenação vigente (página ou sigla), sempre com FWC no início e COC no fim.

Criado o IDR 0031 documentando a decisão: se o filtro vigente oculta a seção alvo, o salto volta o filtro para "todas" e então rola até ela. Como o filtro só chega na Fase 4, o ponto de extensão está pronto mas o comportamento só será ativado lá.

## Decisões tomadas
- **IDR 0031**: Salto para seção ocultada pelo filtro volta o filtro para "todas" antes de rolar
- **Compensação do cabeçalho sticky**: o scroll offset considera a altura do cabeçalho para não cobrir o título da seção alvo
- **Expansão em cascata**: o salto expande super-grupo e seção no caminho, garantindo que a seção esteja visível

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 35 arquivos
- `vitest run`: 14 arquivos de teste, 95 testes, todos passando (incluindo 5 novos do FaixaDeSecoes.test.jsx)
- `vite build`: build de produção concluído com sucesso

## Arquivos alterados
- `src/components/FaixaDeSecoes.jsx` — criar
- `src/components/FaixaDeSecoes.css` — criar
- `src/components/FaixaDeSecoes.test.jsx` — criar
- `src/components/Cabecalho.jsx` — modificar (inclui FaixaDeSecoes)
- `src/components/Cabecalho.test.jsx` — modificar (adiciona secoes e onSaltar)
- `src/components/Catalogo.jsx` — modificar (expõe saltarPara via ref)
- `src/components/SuperGrupo.jsx` — modificar (aceita setSecaoRef)
- `src/components/SuperGrupo.test.jsx` — modificar (adiciona setSecaoRefMock)
- `src/App.jsx` — modificar (orquestra o salto via ref)
- `docs/idr/0031-salto-com-filtro-ativo.md` — criar
- `docs/plano/0003-percurso-ordenacoes-e-salto/0004-faixa-de-bandeiras-e-salto.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0004 da Fase 3 atualizado
- `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0004-log-faixa-de-bandeiras-e-salto.md` — este log
