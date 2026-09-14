<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0006]: selo `×N` inteiro na última linha da seção

## Status
Pendente

## Objetivo
Mostrar inteiro o selo `×N` das figurinhas da última linha de cada seção, que
hoje aparece cortado junto ao título da seção seguinte. A causa não é
empilhamento: `content-visibility: auto` em `.secao` implica contenção de
pintura, que recorta o que transborda da caixa da seção — e o selo transborda
~6px (5px no álbum).

## Documentos de referência
- `docs/tdr/0021-desempenho-do-catalogo.md` § Decisão (item 2) e
  § Consequências — `content-visibility` por seção
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão —
  espaçamentos de 12px, 10px e 8px entre blocos
- `docs/idr/0021-selo-conta-unidades-sobrando.md` — o selo e o seu transbordo
- `src/components/Secao.css` — `.secao` com `content-visibility` e
  `contain-intrinsic-size`
- `src/components/Figurinha.css` — `.figurinha__selo` (`right`/`bottom`
  negativos)
- `src/components/Catalogo.css`, `src/components/SuperGrupo.css` — os
  espaçamentos entre seções e super-grupos
- `src/theme.css` — `--secao-altura-estimada`, `--section-body-gap`
- `docs/interface.md` § Medidas

## Padrões e convenções aplicáveis
- `content-visibility: auto` continua em cada seção, sem rolagem própria —
  TDR 0021, IDR 0008
- Distâncias visíveis entre seções, super-grupos e cabeçalho/grade não mudam
  — IDR 0050
- Funciona nos navegadores evergreen, Safari incluído: não depender só de
  `overflow-clip-margin` — `docs/requisitos.md` § Requisitos Não Funcionais
- O selo segue transbordando do cartão — IDR 0021, `docs/interface.md`
  § Medidas

## Escopo e instruções de implementação
1. Dar ao transbordo do selo espaço dentro da caixa contida da seção, nas
   disposições lista e álbum e também na borda direita, sem mudar as
   distâncias visíveis — por exemplo, uma folga interna na base da seção
   compensada no espaçamento externo, ou a contenção num elemento que tenha
   essa folga.
2. Recalibrar `--secao-altura-estimada` se a caixa da seção mudar de altura.
3. Registrar no `## Contexto` do TDR 0021 a descoberta (a contenção de
   pintura recorta o transbordo dos adornos do cartão) e a entrada no
   `## Histórico`.

**Fora do escopo**: posição do menos (Tarefa 0019-0004); clique perto da
borda (Tarefa 0019-0005); medidas do cartão (Tarefa 0017-0004); cores do
cabeçalho de seção.

## Decisões já tomadas (não reabrir)
- `content-visibility` por seção, sem virtualização — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`
- Espaçamentos entre blocos — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`
- Selo transbordando o canto inferior direito — ver
  `docs/idr/0021-selo-conta-unidades-sobrando.md`

## Impedimentos específicos
- Se não houver forma de mostrar o selo inteiro sem mudar distância visível
  ou sem tirar o `content-visibility`, é nível 3: contraria o IDR 0050 ou o
  TDR 0021.

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `src/components/Catalogo.css`, `src/components/SuperGrupo.css` —
  modificar, se a compensação exigir
- `src/theme.css` — modificar, se recalibrar
- `docs/tdr/0021-desempenho-do-catalogo.md` — modificar (§ Contexto,
  § Histórico)

## Critérios de aceite
- [ ] Selo `×N` inteiro na última linha da seção, na lista e no álbum
      (verificação visual)
- [ ] `content-visibility: auto` presente em cada seção (busca)
- [ ] Distâncias entre seções (10px), super-grupos (12px) e
      cabeçalho/grade (8px) iguais às de antes (verificação visual com
      medição no inspetor, anotada no log)
- [ ] TDR 0021 com a descoberta no contexto e entrada no histórico

## Validação adicional
Verificação visual em `npm run dev`, nas duas ordenações e disposições, no
Chrome e num motor WebKit (Safari ou emulação disponível; se indisponível,
verificação visual pendente com roteiro): repetida na última linha de uma
seção logo acima do título da seguinte; repetida na última coluna à direita;
salto por bandeira até uma seção distante sem salto de layout.
