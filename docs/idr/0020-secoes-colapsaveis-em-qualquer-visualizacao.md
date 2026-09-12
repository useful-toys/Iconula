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

## Consequências

- Colapsar seções encurta o percurso para a consulta de progresso:
  ~50 linhas de resumo cobrem o catálogo inteiro
- Ajuste de contagem exige seção aberta — o cadastro em rajada anda
  com tudo aberto, que é o padrão
- Estado aberto/fechado vive em memória; recarregar volta ao padrão
  (aberto) — nada gravado
- Sem conflito de gesto: título da seção = colapso; ícone da faixa
  (IDR 0016) = salto

## Alternativas consideradas

- **Só super-grupos colapsáveis (escopo original do IDR 0019)**: menos
  um nível de interação, perde a consulta resumida por seção
- **Seções fechadas por padrão**: página curta, mas o cadastro em
  rajada exigiria abrir seção a seção
- **Persistir estado de colapso**: estado além de contagens, contra o
  minimalismo de dados
