<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0003-0002: super-grupos A–L colapsáveis

## Data
2026-09-10

## Resumo
Criado o componente `SuperGrupo` que agrupa as 48 seleções nos 12 grupos da
Copa (A–L) na ordenação por página do álbum. Cada super-grupo tem título com
chevron `▾`/`▸`, nome (`Grupo A`…`Grupo L`) e progresso agregado das 4
seleções em notação compacta (`Grupo C · 34/80 · 43% · ▢46 · ×12`).

O título é um botão com `aria-expanded` e nome acessível por extenso, incluindo
o estado de colapso ("expandido" ou "colapsado"). Tocar no título alterna
aberto/fechado; o padrão é expandido e o estado é volátil (não persiste entre
recarregamentos).

O `Catalogo.jsx` foi modificado para renderizar super-grupos na ordenação por
página e seções planas na ordenação por sigla. FWC e Coca-Cola ficam fora dos
super-grupos, na primeira e na última posição (IDR 0028).

O componente expõe `ref` com método `expandir()` para a Tarefa 0003-0004
(salto para seção) abrir programaticamente um super-grupo colapsado.

## Decisões tomadas
- **Super-grupo não é sticky**: apenas o cabeçalho da página é sticky; uma
  segunda camada grudada disputaria o espaço vertical que o IDR 0018 reservou
  ao catálogo. Encaminhamento registrado na própria tarefa (nenhum IDR novo).

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 33 arquivos.
- `vitest run`: 13 arquivos de teste, 82 testes, todos passando (incluindo
  os 6 novos do `SuperGrupo.test.jsx`).
- `vite build`: build de produção concluído com sucesso.

## Arquivos alterados
- `src/components/SuperGrupo.jsx` — criar
- `src/components/SuperGrupo.css` — criar
- `src/components/SuperGrupo.test.jsx` — criar
- `src/components/Catalogo.jsx` — modificar (renderiza super-grupos na ordenação por página)
- `docs/plano/0003-percurso-ordenacoes-e-salto/0002-super-grupos-a-l-colapsaveis.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002 da Fase 3 atualizado
- `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0002-log-super-grupos-a-l-colapsaveis.md` — este log
