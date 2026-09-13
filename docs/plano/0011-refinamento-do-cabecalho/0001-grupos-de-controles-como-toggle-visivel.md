<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0001]: grupos de controles como toggle visível

## Status
Pendente

## Objetivo
Tornar visualmente claro que Página/Sigla, Lista/Álbum e Todas/Falt./Col./Rep.
são três grupos de alternância independentes — no primeiro uso real, os três
grupos não se liam como grupos. Sem mudar rótulos, comportamento,
`aria-label`, nem introduzir dependência nova.

## Documentos de referência
- `docs/interface.md` § Controles — os três grupos segmentados (ordenação,
  disposição, filtro) e os rótulos curtos já decididos
- `docs/interface.md` § Medidas — "Controles: grupos segmentados sobre
  `--panel`, raio 9px…" — onde o contorno passa a ser descrito
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão — as
  medidas do protótipo, transcritas em `interface.md`, lastreiam a medida
  alterada aqui
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — padrão de
  contraste mínimo de 3:1 para elementos não textuais
- `src/components/Controles.jsx` — cada grupo já é um `role="group"` com
  `aria-label` próprio
- `src/components/Controles.css` — `.controles__segmentado` já tem fundo
  `var(--panel)` e `border-radius: 9px`, sem contorno
- `src/theme.css` § Paleta — tokens `--panel`, `--border`, `--turf`, `--gold`

## Padrões e convenções aplicáveis
- Rótulos curtos e a existência dos três grupos são decisão fechada —
  `docs/interface.md` § Controles
- Cor nunca é o único sinal de estado — `docs/requisitos.md` § Requisitos Não
  Funcionais (o contorno é reforço de agrupamento, não de estado)
- Sem token de paleta novo — reaproveitar `--border`, já usado em
  `.controles__desfazer`
- Nenhuma mudança de medida do botão (`padding`, altura) — só o contêiner do
  grupo ganha contorno

## Escopo e instruções de implementação
1. Acrescentar `border: 1px solid var(--border)` a `.controles__segmentado`
   em `src/components/Controles.css`, mantendo fundo e raio atuais.
2. Medir o contraste do contorno (`--border` sobre `--turf`) e registrar a
   medição.
3. Atualizar o IDR 0022 e `docs/interface.md` § Medidas com o contorno do
   grupo (ver "Decisões em aberto").

**Fora do escopo**: mudar rótulos, cores de estado ativo/inativo ou a ordem
dos grupos; criar um componente genérico de "segmented control".

## Decisões já tomadas (não reabrir)
- Os três grupos e seus rótulos curtos — ver `docs/interface.md` § Controles
- O grupo de filtro só aparece na disposição lista — ver
  `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`
- Cor de fundo ativa é `--gold` — ver `src/components/Controles.css`

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
  § Decisão — "a paleta, a tipografia e as medidas são as do protótipo" →
  acrescenta o contorno de 1px `--border` nos grupos segmentados como ajuste
  feito em uso, com entrada em `## Histórico`. Se, pelo guia
  `docs/idr/CLAUDE.md`, o ajuste for decisão genuinamente nova, nasce um IDR
  sobre o contorno dos grupos em vez de atualizar o 0022.

## Impedimentos específicos
- Contraste do contorno abaixo de 3:1 com os tokens existentes: não crie token
  novo — bloqueie com a medição e as alternativas.

## Arquivos impactados
- `src/components/Controles.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` — modificar (ou
  `docs/idr/` — criar, conforme a decisão em aberto)

## Critérios de aceite
- [ ] Os três grupos segmentados têm contorno visível e consistente entre si
- [ ] Nenhum rótulo, comportamento ou `aria-label` mudou (testes de
      `Controles.test.jsx` inalterados e verdes)
- [ ] Contraste do contorno medido e ≥ 3:1 sobre `--turf`

## Validação adicional
Verificação visual em `npm run dev`: os três grupos nas duas disposições
(lista e álbum) e com cada opção ativa; na disposição álbum, sem o filtro, os
dois grupos restantes continuam legíveis.
