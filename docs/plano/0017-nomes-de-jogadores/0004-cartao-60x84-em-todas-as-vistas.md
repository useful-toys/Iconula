<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0004]: cartão de 60×84px em todas as vistas

## Status
Concluída

## Objetivo
Levar o cartão a 60×84px, igual na lista e no álbum, com o código na parte de
cima e uma faixa inferior livre para o menos e o selo — o espaço onde o nome
entra na Tarefa 0017-0005. Álbum, limite de faixa de tela e estimativa de
altura acompanham.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão e
  § Consequências — medidas, composição e tipografia única
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` § Decisão —
  trilhas de 60px
- `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
  § Decisão e § Histórico — limite celular/tablet de 582px
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — área de toque
  do menos no cartão de 60×84px
- `src/components/Figurinha.css` — tamanhos por variante, código, selo,
  menos e metalizada
- `src/components/PaginaDoAlbum.jsx`, `PaginaDoAlbum.css` — trilhas e linhas
  de 52px
- `src/components/PaginaDoAlbum.test.jsx`, `src/components/Secao.test.jsx` —
  asserções de `repeat(4, 52px)` e `repeat(3, 52px)`
- `src/lib/preferenciasDeVista.js` — `LIMITE_CELULAR = 512`
- `src/theme.css` — `--secao-altura-estimada` (TDR 0021)
- `docs/interface.md` § Disposição Como no álbum, § Medidas

## Padrões e convenções aplicáveis
- Posições explícitas no grid do álbum não mudam, só as medidas — IDR 0009
- Menos dentro do cartão, encostado no canto inferior esquerdo (recuo 0, sem
  transbordar), revelado por hover e foco por teclado; selo transbordando no
  inferior direito — IDR 0032 (aplicado no cartão atual pela Tarefa
  0019-0004)
- Estados visuais e reforço não-cromático intactos — IDR 0006
- `--secao-altura-estimada` aproxima a altura real, para o
  `content-visibility` não saltar — TDR 0021

## Escopo e instruções de implementação
1. Em `Figurinha.css`: cartão de 60×84px nas duas variantes; paisagem com
   126px; código (sigla 10px sobre número 13px) centralizado no espaço acima
   de uma faixa inferior de ~22px; menos 18px, selo 10px e metalizada 6px nas
   duas variantes; o menos segue encostado no canto inferior esquerdo, com
   recuo 0 e a área de toque ampliada só para dentro do cartão.
2. Álbum: trilhas de 60px e linhas de 84px (seleções e Coca-Cola).
3. `LIMITE_CELULAR` passa a 582, com o comentário da conta do IDR 0043.
4. Recalibrar `--secao-altura-estimada` para a nova altura média de seção
   (nível 1, TDR 0021).
5. Atualizar os testes que fixam 52px e o limite de 512px.
6. Em `docs/interface.md`: § Disposição Como no álbum, trilhas de 60px; §
   Medidas, "Cartão na lista: 52×66px" e "Cartão no álbum…" viram uma linha
   "Cartão: 60×84px na lista e no álbum, paisagem 126px", e as linhas de
   código, selo, metalizada e menos perdem as variantes do álbum — citando os
   IDRs 0047, 0015 e 0042.

**Fora do escopo**: o nome no cartão e a fonte condensada (Tarefas 0017-0003
e 0017-0005); estados, cores e comportamento do toque.

## Decisões já tomadas (não reabrir)
- Medidas, composição e tipografia única — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Trilhas de 60px, empilhando quando não cabem — ver
  `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- Limite celular/tablet de 582px — ver
  `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
- Área de toque do menos — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`
- Menos encostado no canto, revelado por hover e foco por teclado — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`

## Arquivos impactados
- `src/components/Figurinha.css` — modificar
- `src/components/PaginaDoAlbum.jsx`, `src/components/PaginaDoAlbum.css`,
  `src/components/PaginaDoAlbum.test.jsx` — modificar
- `src/components/Secao.test.jsx` — modificar
- `src/lib/preferenciasDeVista.js` e o teste dele — modificar
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Disposição Como no álbum, § Medidas)

## Critérios de aceite
- [ ] Cartão 60×84px nas duas variantes e paisagem 126px (CSS)
- [ ] Trilhas de 60px e linhas de 84px no álbum (teste)
- [ ] `LIMITE_CELULAR` = 582 (teste)
- [ ] Código, menos, selo e metalizada com as medidas únicas (CSS)
- [ ] `--secao-altura-estimada` recalibrado, com a conta no log
- [ ] `docs/interface.md` atualizado citando os IDRs 0047, 0015 e 0042

## Validação adicional
Verificação visual em `npm run dev`: lista e álbum a 375px, 600px e 1024px;
spread lado a lado a partir de ~583px; menos e selo na faixa inferior sem
encostar no código; figurinha 13 em paisagem.
