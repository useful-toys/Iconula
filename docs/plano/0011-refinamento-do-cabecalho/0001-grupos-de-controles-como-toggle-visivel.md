<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0001]: grupos de controles como toggle visível

## Status
Em andamento

## Objetivo
Tornar visualmente claro que Página/Sigla, Lista/Álbum e Todas/Falt./Col./Rep.
são três grupos de alternância independentes — no primeiro uso real, os três
grupos não se liam como grupos. Sem mudar rótulos, comportamento,
`aria-label`, nem introduzir token ou dependência nova.

## Documentos de referência
- `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md` § Decisão —
  contorno de 1px em `--border`, sem exigência de 3:1
- `docs/interface.md` § Controles — os três grupos segmentados e os rótulos
  curtos
- `docs/interface.md` § Medidas — linha "Controles: grupos segmentados sobre
  `--panel`, raio 9px…"
- `src/components/Controles.jsx` — cada grupo é um `role="group"` com
  `aria-label` próprio
- `src/components/Controles.css` — `.controles__segmentado` com fundo
  `--panel` e raio 9px, sem contorno; `--border` já usado em
  `.controles__desfazer`

## Padrões e convenções aplicáveis
- Rótulos curtos e a existência dos três grupos são decisão fechada —
  `docs/interface.md` § Controles
- Sem token de paleta novo — `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`
- Nenhuma medida do botão (padding, altura) muda: só o contêiner do grupo
  ganha contorno — `docs/interface.md` § Medidas

## Escopo e instruções de implementação
1. Em `src/components/Controles.css`, dar ao contêiner de cada grupo
   segmentado um contorno de 1px na cor `--border`, mantendo fundo e raio.
2. Em `docs/interface.md` § Medidas, a linha dos controles passa a dizer:
   grupos segmentados sobre `--panel`, com contorno de 1px em `--border`,
   raio 9px… — citando o IDR 0048.

**Fora do escopo**: rótulos, cores de ativo/inativo, ordem dos grupos; tooltip
(Tarefa 0011-0002); componente genérico de "segmented control".

## Decisões já tomadas (não reabrir)
- Contorno de 1px em `--border`, sem exigência de 3:1 — ver
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`
- Os três grupos e seus rótulos curtos — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- O grupo de filtro só aparece na disposição lista — ver
  `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`

## Arquivos impactados
- `src/components/Controles.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Os três grupos segmentados têm contorno de 1px em `--border`, iguais
      entre si (conferido no CSS)
- [ ] Nenhum rótulo, comportamento ou `aria-label` mudou
      (`Controles.test.jsx` inalterado e verde)
- [ ] `docs/interface.md` § Medidas descreve o contorno citando o IDR 0048

## Validação adicional
Verificação visual em `npm run dev`: os grupos nas duas disposições e com cada
opção ativa; na disposição álbum, sem o filtro, os dois grupos restantes
continuam legíveis.
