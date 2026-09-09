<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0018: Usuário especialista e minimalismo como regra de ouro

## Status

Aceito. O último campo do título — descrito aqui como "data/hora da
última transação bem-sucedida (leitura ou escrita)" — foi precisado
pelo [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md):
é o `updatedAt` do documento, a última **escrita** bem-sucedida.

## Contexto

O público do produto é o colecionador que usa o app toda semana na
feira de troca — conhece o álbum, os códigos e a contagem. A interface
vinha acumulando rótulos explicativos ("12/20 · 8 faltantes · 3
repetidas"), placar em cartões, barra de progresso e espaço gasto com
reforço para iniciantes.

O usuário decidiu: assumir o usuário especialista, tratar minimalismo
como regra de ouro — e comprimir o cabeçalho todo numa única linha.

## Decisão

- O app assume usuário especialista: sem rótulos explicativos, sem
  onboarding, sem reforço redundante — o conhecimento do domínio
  (códigos, seções, contagem) é pré-requisito declarado
- Minimalismo é regra de ouro: título, busca e comandos minimalistas,
  espaço otimizado para o catálogo
- **Título único, uma linha**: `ICONULA 2026 · 412/994 · 41% · ▢582 ·
  ×37 · 12:34` — nome, coladas/total, percentual, faltantes,
  repetidas e data/hora da última transação bem-sucedida (leitura ou
  escrita); **sem barra de progresso, sem cartões**
- **Glifos**: `▢` marca faltantes (espaço vazio do álbum — eco do
  reforço vazio-vs-preenchido do cartão); `×` marca repetidas (o mesmo
  × do selinho `×N` do cartão)
- A mesma notação em **todos** os títulos — super-grupo (`Grupo C ·
  34/80 · 43% · ▢46 · ×12`) e seção (`Brasil BRA 24 · 12/20 · 60% ·
  ▢8 · ×3`)
- Acessibilidade não depende da expertise: o nome acessível (aria)
  sempre escreve por extenso — "Brasil: 12 de 20, 8 faltantes, 3
  repetidas"

## Consequências

- O cabeçalho cabe numa linha: mais espaço vertical para o catálogo
- Duas convenções para aprender (X/Y e ▢/×) — imediato para o
  especialista; a linha de título serve de legenda permanente
- Sem barra de progresso: o percentual (`41%`) cumpre o papel em menos
  espaço
- A data/hora passou a incluir leitura (carga), não só escrita —
  "quando meus dados sincronizaram por último"
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
