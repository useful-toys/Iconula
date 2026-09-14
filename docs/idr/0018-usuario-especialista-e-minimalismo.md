<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0018: Usuário especialista e minimalismo como regra de ouro

## Status

Aceito. O último campo do título — descrito aqui como "data/hora da
última transação bem-sucedida (leitura ou escrita)" — foi precisado
pelo [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md):
é o `updatedAt` do documento, a última **escrita** bem-sucedida.

## Contexto

- O público do produto é o colecionador que usa o app toda semana na
  feira de troca — conhece o álbum, os códigos e a contagem.
- A interface vinha acumulando rótulos explicativos ("12/20 · 8
  faltantes · 3 repetidas"), placar em cartões, barra de progresso e
  espaço gasto com reforço para iniciantes.
- O usuário decidiu: assumir o usuário especialista, tratar
  minimalismo como regra de ouro — e comprimir o cabeçalho todo numa
  única linha.

## Decisão

- O app assume usuário especialista: sem rótulos explicativos, sem
  onboarding, sem reforço redundante — o conhecimento do domínio
  (códigos, seções, contagem) é pré-requisito declarado
- Minimalismo é regra de ouro: título, busca e comandos minimalistas,
  espaço otimizado para o catálogo
- **Título único, uma linha**: `ICONULA 2026 · 412/994 · 41% · ▢582 ·
  ×37 · 12:34` — nome, coladas/total, percentual, faltantes,
  repetidas e data/hora da última **escrita** bem-sucedida (`updatedAt`
  do documento — [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md));
  **sem barra de progresso, sem cartões**
- **Glifos**: `▢` marca faltantes (espaço vazio do álbum — eco do
  reforço vazio-vs-preenchido do cartão); `×` marca repetidas (o mesmo
  × do selinho `×N` do cartão)
- A mesma notação em **todos** os títulos — super-grupo (`Grupo C ·
  34/80 · 43% · ▢46 · ×12`) e seção (`Brasil BRA 24 · 12/20 · 60% ·
  ▢8 · ×3`)
- Acessibilidade não depende da expertise: o nome acessível (aria)
  sempre escreve por extenso — "Brasil: 12 de 20, 8 faltantes, 3
  repetidas"
- **Título e controles** — uma regra só, em qualquer largura:
  - tudo no cabeçalho sticky, nesta ordem: título → grupos segmentados →
    faixa de bandeiras; nada do cabeçalho rola com o conteúdo
  - cabendo, título, grupos, desfazer (`↺`) e avatar dividem uma linha;
    a faixa de bandeiras segue como linha à parte, abaixo
  - quebrando (título em duas linhas ou grupos sem espaço), o **avatar
    fica sempre na primeira linha, à direita** do título; os grupos descem
    para as linhas seguintes, ainda acima da faixa, pela regra de quebra
    de `interface.md` § Controles
  - o desfazer acompanha os grupos: colado à direita da linha dos grupos,
    não da linha do título
  - sem ponto de quebra de 768px

## Consequências

- O cabeçalho cabe numa linha: mais espaço vertical para o catálogo
- Duas convenções para aprender (X/Y e ▢/×) — imediato para o
  especialista; a linha de título serve de legenda permanente
- Sem barra de progresso: o percentual (`41%`) cumpre o papel em menos
  espaço
- A data/hora reflete só a escrita (`updatedAt`), não a carga —
  "quando minha coleção foi salva por último"
- Reforço não-cromático e nomes acessíveis seguem valendo — minimalismo
  visual não é minimalismo de acessibilidade
- Grupos e bandeiras ficam a um toque em qualquer ponto da rolagem, também
  no celular — ao custo de ~40px a mais de sticky no celular, aceito pelo
  humano
- Avatar e desfazer deixam de ser vizinhos quando a linha quebra: a área de
  toque ampliada de cada um (`inset: -4px`,
  [IDR 0042](0042-foco-visivel-e-area-de-toque.md)) continua sem sobrepor
  a do outro
- `interface.md` § Cabeçalho e § Controles perdem o ponto de quebra de
  768px e a linha de controles fora do sticky
- Implementação: Fase 0019, Tarefa 0019-0001.

## Alternativas consideradas

- **Rótulos por extenso** ("8 faltantes · 3 repetidas"): legível para
  qualquer um, gasta espaço e repete o óbvio para o especialista
- **Placar em cartões com barra de progresso**: bonito, ocupa três
  linhas do espaço mais caro da tela
- **Sinais −/+** (`−582 +37`): legível, mas o − lê como número
  negativo e o + colide com o × do cartão
- **✗/♻**: ✗ confunde com ×; ♻ vira emoji colorido em celular —
  inconsistente com texto
- **Omitir zeros** (`12/20 · ▢8` quando não há repetidas): mais curto,
  quebra o alinhamento visual
- **Não fundir título e controles**: desperdiça uma linha inteira em
  tablet e navegador, onde os dois cabem lado a lado
- **Controles fora do sticky abaixo de 768px** (regra anterior): poupava
  altura no celular, mas a linha de controles aparecia abaixo das bandeiras
  e sumia ao rolar
- **Só título e comandos sticky no celular, controles e bandeiras rolando**:
  preserva altura, mas não atende a linha de controles fixa e tira o salto
  por bandeira da vista
- **Nova ordem só a partir de 768px**: menor mudança, mas mantém abaixo de
  768px o comportamento que motivou o pedido
- **Desfazer junto do avatar na linha do título**: mantém a dupla de
  comandos, mas tira ~38px da largura do título, que quebra antes no
  celular

## Histórico

- 2026-09-13 — Esmiuçamento de ajustes de interface: tudo no cabeçalho
  sticky em qualquer largura (título → grupos → bandeiras), avatar preso à
  direita da primeira linha e desfazer à direita da linha dos grupos;
  implementação a planejar. Antes: a partir de 768px, título e controles
  numa linha sticky, com os dois comandos colados à direita dos controles;
  abaixo de 768px, controles numa linha própria abaixo das bandeiras, fora
  do sticky. A alternativa "título e controles numa linha em qualquer
  largura", recusada pela altura do sticky no celular, foi retomada pelo
  humano na forma acima.

- 2026-09-13 — Planejamento revisado das Fases 11–17: título e controles
  passam a dividir uma linha sticky a partir de 768px. Antes: controles
  sempre numa linha própria, logo abaixo da faixa de bandeiras, fora do
  cabeçalho sticky.
