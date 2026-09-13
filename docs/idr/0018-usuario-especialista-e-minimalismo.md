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
- **Título e controles** (implementação na Fase 0011, Tarefa 0011-0004):
  - a partir de 768px de largura, título e linha de controles dividem uma
    única linha dentro do cabeçalho sticky — título à esquerda, controles
    à direita; a faixa de bandeiras segue como linha à parte, abaixo
  - se não couberem, os controles quebram para a linha de baixo, ainda
    dentro do cabeçalho sticky; os grupos seguem a regra de quebra de
    `interface.md` § Controles e os dois comandos seguem colados à direita
  - abaixo de 768px, como antes: título na área sticky e controles numa
    linha própria, fora dela, que rola com o conteúdo

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
- **Título e controles numa linha em qualquer largura**: no celular os
  dois quase nunca cabem juntos — a linha quebraria sempre e ainda levaria
  os controles para a área sticky, que tira altura útil do catálogo
- **Não fundir título e controles**: desperdiça uma linha inteira em
  tablet e navegador, onde os dois cabem lado a lado

## Histórico

- 2026-09-13 — Planejamento revisado das Fases 11–17: título e controles
  passam a dividir uma linha sticky a partir de 768px. Antes: controles
  sempre numa linha própria, logo abaixo da faixa de bandeiras, fora do
  cabeçalho sticky.
