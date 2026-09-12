<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0019: Ordem do álbum agrupada em Especiais e Grupos A–L, colapsáveis

## Status

Aceito quanto aos 12 grupos da Copa como super-grupos colapsáveis.
Estendido pelo
[IDR 0020](0020-secoes-colapsaveis-em-qualquer-visualizacao.md): seções
também colapsáveis, em qualquer visualização. O super-grupo
"Especiais" foi **dissolvido** pelo
[IDR 0028](0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md): o FWC abre o
catálogo e a Coca-Cola o fecha, as duas no nível de seção — restam 12
super-grupos, não 13.

## Contexto

- Na ordenação por ordem do álbum, as 50 seções fluem uma abaixo da
  outra — percurso longo. O álbum físico organiza as 48 seleções nos
  12 grupos da Copa (A–L, 4 seleções cada); o usuário decidiu espelhar
  essa estrutura na tela: super-grupos colapsáveis — "Especiais" e os
  grupos A–L —, cada um com título e números agregados.
- Os grupos da Copa de cada seleção eram, na redação original,
  pendência do checklist. Deixaram de ser: o dado é **derivável da
  ordem do álbum** e foi verificado contra o sorteio de dezembro de
  2025 — ver "A composição dos grupos", abaixo.

## Decisão

- Na ordenação "ordem do álbum", as seções agrupam-se em super-grupos
  colapsáveis: "Especiais" (FWC e COC) e os 12 grupos da Copa (A–L),
  cada um com suas 4 seleções
- O título do super-grupo mostra o nome ("Grupo A", "Especiais") e o
  progresso agregado em notação compacta (ex.: `Grupo C · 34/80 ·
  43% · ▢46 · ×12` — IDR 0018)
- Super-grupos expandem por padrão; tocar no título colapsa/expande
- O salto para seção (IDR 0016) expande automaticamente o super-grupo
  que contém a seção alvo
- A ordenação por sigla permanece flat (sem super-grupos): especiais
  primeiro (IDR 0013), seleções alfabéticas — os grupos da Copa não
  coincidem com a ordem alfabética
- A ordem dos super-grupos segue a ordem do álbum — do Grupo A (páginas
  8–15) ao Grupo L (98–105); FWC e Coca-Cola ficam fora deles, nas
  pontas (IDR 0028)

## A composição dos grupos

O álbum ordena as seleções **por grupo**: cada bloco de quatro páginas
pares consecutivas é um grupo, do A ao L. A regra foi verificada seleção
por seleção contra o sorteio de dezembro de 2025 — os doze blocos batem
com os doze grupos, sem exceção.

Cada seleção ocupa um spread de duas páginas: a par (figurinhas 01–10) e
a ímpar seguinte (11–20). O bloco 56–57 fica de fora — nenhuma seleção o
ocupa.

| Grupo | Páginas | Seleções |
|---|---|---|
| A | 8–15 | MEX, RSA, KOR, CZE |
| B | 16–23 | CAN, BIH, QAT, SUI |
| C | 24–31 | BRA, MAR, HAI, SCO |
| D | 32–39 | USA, PAR, AUS, TUR |
| E | 40–47 | GER, CUW, CIV, ECU |
| F | 48–55 | NED, JPN, SWE, TUN |
| G | 58–65 | BEL, EGY, IRN, NZL |
| H | 66–73 | ESP, CPV, KSA, URU |
| I | 74–81 | FRA, SEN, IRQ, NOR |
| J | 82–89 | ARG, ALG, AUT, JOR |
| K | 90–97 | POR, COD, UZB, COL |
| L | 98–105 | ENG, CRO, GHA, PAN |

Dentro de cada grupo, a ordem das páginas é a do sorteio (o cabeça de
chave abre o grupo). O grupo e as duas páginas de cada seleção estão no
Anexo de requisitos.md e vão **explícitos** para `src/data/` — dado
conferido, não derivado em tempo de execução: se uma página do álbum
real desmentir a regra, corrige-se a linha, não o algoritmo.

## Consequências

- O catálogo em ordem do álbum fica navegável em duas camadas: 13
  títulos para orientação, seções para detalhe
- Colapsar tudo encurta o percurso (13 linhas) — útil para visão geral
- O catálogo ganha um dado: grupo da Copa (A–L) por seleção — resolvido
  pela tabela acima, sem depender do checklist
- Tudo expandido adiciona 13 cabeçalhos ao percurso; mitigado pelo
  colapso e pelo salto (IDR 0016)

## Alternativas consideradas

- **Flat (sem super-grupos)**: percurso único contínuo, longo demais
- **Super-grupos também na ordem por sigla**: os grupos A–L não
  respeitam a ordem alfabética — quebraria a ordenação
- **Colapsados por padrão**: página curta, mas a consulta direta
  exigiria um toque antes de ver qualquer seção
