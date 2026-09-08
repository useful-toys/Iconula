<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0010: Desfazer ajustes em vez de confirmações

## Status

Aceito. As pendências de desenho (lugar na tela e profundidade) foram
resolvidas pelo
[IDR 0012](0012-desfazer-no-cabecalho-historico-de-10.md). Nota: o
"zerar" foi depois removido dos ajustes (só incremento e decremento —
requisitos.md); o desfazer reverte incrementos e decrementos.

## Contexto

Tocar-para-somar ([IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md))
é rápido mas propenso a toques acidentais — inclusive zerar uma
contagem por engano. As saídas clássicas para isso são confirmação
antes de ações destrutivas (atrito em **todo** uso) ou um comando
desfazer (atrito só quando há erro).

O usuário pediu explicitamente: um comando que desfaz a última
alteração e, repetido, desfaz as N últimas — aumentar ou diminuir a
quantidade de uma figurinha. A velocidade do fluxo essencial de
cadastrar fica preservada, e o erro vira recuperável.

Interação com a gravação agregada ([IDR 0003](0003-gravacao-agrega-ajustes.md)):
desfazer é um ajuste como qualquer outro — a correção entra na gravação
seguinte, sem caso especial.

## Decisão

- Comando desfazer reverte a última alteração — incremento, decremento
  ou zerar — e pode ser repetido para reverter as N últimas
- Nenhum ajuste pede confirmação: o desfazer torna a confirmação
  desnecessária, inclusive para zerar
- O gesto/atalho e a profundidade do histórico ficam como pendência de
  desenho em `interface.md`

## Consequências

- Zerar sem confirmação fica seguro: é reversível
- O histórico de ajustes passa a existir em memória (pelo menos os
  recentes), com limite a definir
- Testes do fluxo de contagem passam a cobrir a sequência ajuste →
  desfazer → gravação
- O gesto de zerar (pendência) pode ser simples, já que não precisa se
  defender sozinho contra acidentes

## Alternativas consideradas

- **Confirmação antes de zerar**: atrito em todo uso para proteger
  contra o erro raro — descartado pelo desfazer
- **Histórico completo com interface de listagem de ações**: mais
  poder, mais peso — o desfazer repetido cobre o caso prático
- **Confiar só no ícone de menos**: corrige um ajuste isolado, não uma
  sequência de erros
