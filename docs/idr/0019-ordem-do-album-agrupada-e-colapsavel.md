<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0019: Ordem do álbum agrupada em Especiais e Grupos A–L, colapsáveis

## Status

Aceito. Estendido pelo
[IDR 0020](0020-secoes-colapsaveis-em-qualquer-visualizacao.md):
seções também colapsáveis, em qualquer visualização.

## Contexto

Na ordenação por ordem do álbum, as 50 seções fluem uma abaixo da outra
— percurso longo. O álbum físico organiza as 48 seleções nos 12 grupos
da Copa (A–L, 4 seleções cada); o usuário decidiu espelhar essa
estrutura na tela: super-grupos colapsáveis — "Especiais" e os grupos
A–L —, cada um com título e números agregados.

Os grupos da Copa de cada seleção ainda não estão no catálogo
(pendência do checklist em requisitos.md).

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
- A ordem dos super-grupos segue a ordem do álbum; a posição de
  "Especiais" depende das páginas do FWC (pendência do checklist)

## Consequências

- O catálogo em ordem do álbum fica navegável em duas camadas: 13
  títulos para orientação, seções para detalhe
- Colapsar tudo encurta o percurso (13 linhas) — útil para visão geral
- O catálogo ganha um dado: grupo da Copa (A–L) por seleção — entrou
  na pendência do checklist
- Tudo expandido adiciona 13 cabeçalhos ao percurso; mitigado pelo
  colapso e pelo salto (IDR 0016)

## Alternativas consideradas

- **Flat (sem super-grupos)**: percurso único contínuo, longo demais
- **Super-grupos também na ordem por sigla**: os grupos A–L não
  respeitam a ordem alfabética — quebraria a ordenação
- **Colapsados por padrão**: página curta, mas a consulta direta
  exigiria um toque antes de ver qualquer seção
