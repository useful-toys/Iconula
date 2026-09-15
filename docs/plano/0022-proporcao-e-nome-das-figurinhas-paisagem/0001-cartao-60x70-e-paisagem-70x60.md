<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0022-0001]: cartão de 60×70px e paisagem de 70×60px

## Status
Concluída

## Objetivo
Levar o cartão retrato a 60×70px e a figurinha paisagem a 70×60px — as
medidas do retrato com largura e altura trocadas —, com linhas do álbum de
70px, a paisagem centralizada no espaço das trilhas 3–4 no álbum e na altura
da linha na lista, para que a foto do time tenha a proporção do cromo.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — medidas do
  retrato e da paisagem, centralização no álbum (28px dos lados, 5px em cima e
  embaixo) e na lista (5px), metades de 33px; § Consequências — "Cartão de
  60×70px" e "Paisagem de 70×60px"
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão (tabela da área
  de toque) — alvo do menos de 26×26px contido no cartão
- `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
  § Decisão — menos encostado no canto, sem transbordar
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` § Decisão —
  trilhas de 60px preservadas
- `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
  § Consequências — limite de 582px amarrado à largura do spread
- `docs/tdr/0021-desempenho-do-catalogo.md` — `--secao-altura-estimada` é só o
  placeholder do `content-visibility: auto`
- `src/components/Figurinha.css` — `.figurinha--lista`, `.figurinha--album`,
  `.figurinha--paisagem` e o comentário da área de toque do menos
- `src/components/PaginaDoAlbum.css` — `grid-template-rows` e
  `.pagina-album__celula--paisagem`
- `src/components/Secao.css` — `.secao__grade`
- `src/theme.css` — `--secao-altura-estimada` e o comentário com a conta
- `docs/interface.md` § Corpo, § Disposição "Como no álbum" › Seleções — 4
  trilhas por página, § Medidas

## Padrões e convenções aplicáveis
- A largura da trilha continua 60px: página de 258px, spread de 536px e
  limite de 582px inalterados — IDR 0015, IDR 0043
- O layout de álbum não muda: a 13 segue com `trilhas: 2` em
  `src/data/catalogoLayout.js` — IDR 0009
- O menos e sua área de toque ampliada ficam contidos no cartão nos dois
  formatos — IDR 0032, IDR 0042
- O espaçamento entre cartões (8px na lista, 6px no álbum) não muda —
  IDR 0050
- O selo `×N` da última linha continua inteiro, sem corte pela contenção de
  pintura da seção — Tarefa 0019-0006 (precedente)

## Escopo e instruções de implementação
1. `Figurinha.css`: cartão retrato de 60×70px nas duas variantes; a variante
   paisagem passa a definir largura **e** altura (70×60px), deixando de ser a
   largura de duas trilhas. Comentários citam o IDR 0047, inclusive o da área
   de toque do menos ("contido no cartão de 60×68px" → as medidas novas).
2. `PaginaDoAlbum.css`: linhas do grid de 70px; a célula da paisagem continua
   cobrindo as trilhas 3–4 e centraliza o cartão nos dois eixos, sem
   esticá-lo.
3. Lista: a paisagem fica centralizada na altura da linha de cartões de 70px,
   sem mudar o espaçamento da grade nem o tamanho dos retratos.
4. `theme.css`: `--secao-altura-estimada` escalada à altura nova
   (370 × 70/68 ≈ 381px), com a conta no comentário.
5. Testes: conferir que `Secao.test.jsx` e `PaginaDoAlbum.test.jsx` seguem
   verdes com as classes de paisagem; ajustar nome ou comentário de teste que
   cite a paisagem "de duas trilhas" ou as medidas antigas.
6. `docs/interface.md`, citando o IDR 0047:
   - § Corpo: na lista, a figurinha paisagem tem 70×60px, centralizada na
     altura da linha — em vez de "mesma largura de duas trilhas do álbum";
   - § Disposição "Como no álbum" › Seleções — 4 trilhas por página: a 13 é
     paisagem de 70×60px, centralizada no espaço das trilhas 3 e 4 — em vez de
     "ocupa duas trilhas (mais larga, mesma altura)";
   - § Medidas: cartão de 60×70px, paisagem de 70×60px nas duas disposições,
     metades de 33px úteis no retrato e 28px na paisagem; no álbum, trilhas de
     60px e linhas de 70px, com a 13 centralizada no espaço de duas trilhas.

**Fora do escopo**: paisagens do FWC e `nomeCurto` no catálogo (Tarefa
0022-0002); nome no escudo, na foto do time e nas paisagens do FWC, e o texto
"sem nome visível" de `interface.md` § Figurinha e § Medidas (Tarefa
0022-0003); posições do layout de álbum; texto de troca e export/import.

## Decisões já tomadas (não reabrir)
- Cartão de 60×70px, paisagem de 70×60px, centralização no álbum e na lista —
  ver `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Trilhas de 60px e empilhamento das páginas — ver
  `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- Limite celular/tablet de 582px — ver
  `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
- Menos no canto, com alvo contido no cartão — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md` e
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`
- Estimativa de altura como placeholder do `content-visibility` — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`

## Decisões em aberto nesta tarefa
- Centralizar a paisagem na lista pela grade inteira ou só pelo cartão
  paisagem — nível 1, decidir no plano da alteração, sem registro

## Arquivos impactados
- `src/components/Figurinha.css` — modificar
- `src/components/PaginaDoAlbum.css` — modificar
- `src/components/Secao.css` — modificar
- `src/theme.css` — modificar
- `src/components/Secao.test.jsx`, `src/components/PaginaDoAlbum.test.jsx` —
  modificar, se algum nome ou comentário citar as medidas antigas
- `docs/interface.md` — modificar (§ Corpo, § Disposição "Como no álbum" ›
  Seleções — 4 trilhas por página, § Medidas)

## Critérios de aceite
- [ ] Retrato de 60×70px e paisagem de 70×60px nas duas variantes (trecho de
      `Figurinha.css`)
- [ ] Linhas do álbum de 70px e colunas de 60px (trecho de
      `PaginaDoAlbum.css` e `PaginaDoAlbum.jsx`)
- [ ] Paisagem centralizada nos dois eixos no espaço das trilhas 3–4 e
      centralizada na altura da linha na lista (trecho e verificação visual)
- [ ] `--secao-altura-estimada` recalculada, com a conta no comentário (trecho)
- [ ] `src/data/catalogoLayout.js` e `src/lib/preferenciasDeVista.js` sem
      alteração (`git diff --name-only`)
- [ ] `docs/interface.md` § Corpo, § Seleções — 4 trilhas por página e
      § Medidas com as medidas novas, citando o IDR 0047; nenhuma ocorrência de
      "126×68" ou de "60×68" nessas seções (busca)

## Validação adicional
Verificação visual em `npm run dev`:
- lista (ordenação por sigla), seção BRA: a 13 centralizada na altura entre a
  12 e a 14, sem mudar o espaçamento;
- álbum, seção BRA, página 2: a 13 centralizada nas trilhas 3–4, com sobra
  igual dos dois lados;
- largura acima de 583px: páginas lado a lado; abaixo, empilhadas;
- com contagem ≥ 2 numa figurinha da última linha, selo `×N` inteiro; com
  contagem ≥ 1 na 13, o menos dentro do cartão paisagem.
