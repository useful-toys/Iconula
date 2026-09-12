<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0034: Três avisos empilham no máximo, e o mais antigo sai

## Status

Aceito — fecha a pendência de desenho do
[IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md), que deixava
"poucas mensagens empilham no máximo" sem número fixado.

## Contexto

- O IDR 0029 estabelece a área de avisos flutuante na borda inferior,
  com sucesso e aviso efêmeros de 5s e a falha persistente. Ele diz que
  "poucas mensagens empilham no máximo" e proíbe log com scroll
  ([IDR 0008](0008-uma-unica-pagina-scrollavel.md)), sem fixar quantas
  são "poucas". A Tarefa 0007-0001 precisa do número para implementar o
  limite de empilhamento.
- Sem teto, a área cresceria para cima sem limite — em tela curta,
  faixas de falha acumuladas (que não expiram sozinhas) tapariam o
  catálogo inteiro, reintroduzindo, por outro caminho, o "log com
  scroll" proibido.

## Decisão

- A área de avisos empilha **no máximo três faixas** ao mesmo tempo
- Ao chegar a **quarta** faixa, a mais antiga sai — sem animação, sem
  confirmação, sem log
- O limite vale para as três severidades em conjunto: uma falha
  persistente que chega à posição de mais antiga é descartada
  silenciosamente quando a quarta faixa entra
- Anúncio a leitores de tela: a falha é anunciada de forma intrusiva
  (`role="alert"`), como exige a atenção que ela pede; sucesso e aviso
  são anunciados de forma não intrusiva (`role="status"`, que equivale
  a `aria-live="polite"`). A política antiga de não usar
  `role="alert"` ([ADR 0007](../adr/0007-persistencia-do-time-no-firestore.md))
  valia para o botão e foi revista pelo
  [IDR 0002](0002-avisos-de-sincronizacao-visiveis.md)

## Consequências

- A área nunca ocupa mais do que três faixas de altura — o teto de
  impacto em tela curta fica limitado e previsível
- Uma falha antiga pode sumir sem o usuário dispensá-la, se duas outras
  faixas chegarem depois dela. Aceito: a falha já esteve visível e a
  operação seguinte do mesmo tipo continua a dispensá-la no sucesso
  (IDR 0029); o descarte por lotação é o caso raro, não o caminho normal
- Os testes da Tarefa 0007-0001 cobrem o limite: cinco falhas resultam
  nas três mais recentes na tela

## Alternativas consideradas

- **Sem teto fixo, crescer até a janela**: reintroduz o acúmulo que o
  IDR 0008 proíbe; rejeitado
- **Um aviso por vez** (o novo substitui o anterior): mais simples, mas
  a falha persistente taparia o aviso de sucesso da operação que a
  dispensou, e o aviso dourado de "sem rede" taparia o sucesso que o
  resolve
- **Cinco ou mais**: mais contexto simultâneo, mas em tela curta três já
  são generosas; cinco competiriam com o conteúdo
