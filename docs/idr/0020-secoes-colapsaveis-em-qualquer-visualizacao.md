<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0020: Seções colapsáveis em qualquer visualização

## Status

Aceito.

## Contexto

- O IDR 0019 tornou os super-grupos da ordem do álbum colapsáveis.
  Ficou a pergunta: e as seções — os grupos de ~20 figurinhas — podem
  fechar?
- O usuário decidiu: sim, em qualquer ordenação e disposição. Fechada,
  a seção deixa só o cabeçalho com o resumo (`Brasil BRA 24 · 12/20 ·
  ▢8 ×3`) — que por si só responde à consulta de progresso; a grade só
  ocupa espaço quando interessa ajustar ou conferir posição a posição.

## Decisão

- Cada seção é colapsável: tocar no título abre/fecha o corpo (a
  grade de figurinhas); o cabeçalho com o resumo permanece
- Vale em qualquer ordenação (álbum, sigla) e disposição (lista,
  álbum) — na ordenação por sigla, sem super-grupos (IDR 0013), as
  seções são o único nível de colapso
- Padrão: abertas — tanto super-grupos (IDR 0019) quanto seções
- O salto para seção (IDR 0016) expande super-grupo e seção no
  caminho até o alvo
- **Colapso manual lembrado** (implementação na Fase 0012, Tarefa
  0012-0001): seções e super-grupos fechados à mão são lembrados entre
  sessões, por dispositivo
  ([IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md));
  o padrão continua aberto para todo o resto
- Quando o salto abre uma seção ou super-grupo fechados, a abertura também
  é gravada — o que está na tela é o que volta na próxima abertura
- **Contrair as seções de um super-grupo de uma vez**: alternador na ponta
  direita do título do super-grupo
  ([IDR 0019](0019-ordem-do-album-agrupada-e-colapsavel.md))
  - só existe com o super-grupo expandido — fechado, as seções já estão
    ocultas
  - alguma das suas seções aberta → contrai todas; todas fechadas → expande
    todas; o super-grupo continua aberto, com as linhas de resumo
  - o resultado é colapso manual: gravado no mesmo conjunto do toque em cada
    seção (IDR 0026)
  - glifo `⊟` quando vai contrair (alguma aberta) e `⊞` quando vai expandir
    (todas fechadas); nome acessível por extenso: "contrair as seções do
    Grupo C" / "expandir as seções do Grupo C"
  - com filtro ativo, age sobre as 4 seções do grupo, inclusive as ocultas
    ([IDR 0025](0025-filtro-oculta-secoes-vazias.md)) — o colapso é do grupo,
    não da vista filtrada; `⊟`/`⊞` também decidem pelas 4
  - título do super-grupo e alternador são botões irmãos na mesma linha —
    botão dentro de botão é inválido

## Consequências

- Colapsar seções encurta o percurso para a consulta de progresso:
  ~50 linhas de resumo cobrem o catálogo inteiro
- Ajuste de contagem exige seção aberta — o cadastro em rajada anda
  com tudo aberto, que é o padrão
- Só o que o usuário fechou à mão volta fechado; nada fecha sozinho —
  o catálogo nunca abre escondido por uma regra automática
- Sem conflito de gesto: título da seção = colapso; ícone da faixa
  (IDR 0016) = salto
- O alternador dá a visão de resumo de um grupo inteiro (4 linhas) num
  toque, em vez de quatro; na ordenação por sigla, sem super-grupos, não há
  alternador
- `SuperGrupo.jsx` deixa de ter o título como único botão; `Catalogo.jsx`
  ganha a operação de contrair/expandir um conjunto de siglas;
  `interface.md` § Corpo, § Interações e § Medidas descrevem o alternador
- Implementação: Fase 0020, Tarefa 0020-0001.

## Alternativas consideradas

- **Só super-grupos colapsáveis (escopo original do IDR 0019)**: menos
  um nível de interação, perde a consulta resumida por seção
- **Seções fechadas por padrão**: página curta, mas o cadastro em
  rajada exigiria abrir seção a seção
- **Não persistir o colapso** (decisão original): quem trabalha com
  parte do catálogo fechada refazia os toques a cada abertura
- **Fechar automaticamente seções completas**: descartado no planejamento
  das Fases 11–17 — colidia com os filtros de coladas e repetidas, em que
  as completas são justamente as relevantes
- **Salto sem gravar a abertura**: a recarga mostraria fechado o que o
  usuário acabou de ver aberto
- **Sem comando de colapsar em lote** (encaminhamento da Tarefa 0003-0003):
  revisto a pedido do humano — o alternador fica no título do super-grupo,
  não na linha de controles que o IDR 0018 reserva
- **Título do super-grupo com três estados** (aberto → só resumos →
  fechado): sem alvo novo, mas abrir/fechar o grupo passaria a custar dois
  toques
- **Alternador sempre visível, também com o super-grupo fechado**: uma regra
  a mais (abrir o grupo já contraído) sem ganho sobre abrir e tocar
- **Glifo `▴▴`/`▾▾`**: ecoa o chevron do título e confunde com o colapso do
  próprio super-grupo
- **Texto "Contrair"/"Expandir"**: rótulo explicativo que gasta largura,
  contra o IDR 0018
- **Agir só sobre as seções visíveis no filtro**: ao limpar o filtro, as
  ocultas voltariam no estado anterior, misturadas

## Histórico

- 2026-09-13 — Esmiuçamento de contrair seções, rodapé e compartilhar:
  acrescenta o alternador que contrai/expande as seções de um super-grupo;
  implementação a planejar. Antes: cada seção só fechava pelo próprio
  título, e "colapsar tudo" ficara de fora na Tarefa 0003-0003.

- 2026-09-13 — Planejamento revisado das Fases 11–17: o colapso manual de
  seções e super-grupos passa a ser lembrado por dispositivo, e o salto
  grava a abertura. Antes: estado só em memória, recarregar voltava tudo
  aberto; "persistir estado de colapso" era alternativa recusada por
  minimalismo de dados — revista porque o dado é só a lista do que o
  usuário fechou, sem regra automática.
