<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0002: Avisos de sincronização visíveis

## Status

Aceito — revê, para este produto, a política de erro do
[ADR 0007](../adr/0007-persistencia-do-time-no-firestore.md) (falha
invisível, só log). A revisão formal fica registrada como pendência do
ADR do schema.

## Contexto

O ADR 0007 decidiu que falha de persistência **nunca chega à tela**:
vira `console.error` e nada mais. Raciocínio válido para o botão de um
clique — a preferência perdida era pequena e um banner de erro num app
de um botão só seria pior que a perda silenciosa.

No produto novo, a escala mudou: o usuário investe horas registrando
~994 contagens. Perder alterações sem saber é catastrófico. A POC
mostrou o padrão de referência — área de avisos com mensagens coloridas
e timestamp (carregando, salvo, erro, mudança vinda de outro
dispositivo) — e o pedido foi explícito: falhas informadas claramente,
data/hora da última alteração no cabeçalho e notificações de eventos.

## Decisão

- Notificar eventos de persistência: gravado com sucesso, dados
  carregados com sucesso e falhas — falhas informadas claramente
- Exibir no cabeçalho a data/hora da última alteração gravada
- A falha **não trava a interface**: a tela segue editável e a gravação
  seguinte regrava o valor completo — informar não é bloquear

## Consequências

- A política "sem `role="alert"`" do ADR 0007 deixa de valer para este
  produto; o ADR do schema (pendência em `requisitos.md`) deve assumir
  a revisão
- A área de avisos entra no cabeçalho da tela principal
  (`interface.md`)
- Risco de ruído: notificar a cada gravação seria frequente demais —
  mitigado pelo [IDR 0003](0003-gravacao-agrega-ajustes.md)

## Alternativas consideradas

- **Manter invisível** (ADR 0007 intacto): descartado — o custo da
  perda silenciosa mudou de escala com o volume de registro
- **Avisar só em erro**: menos ruído, mas o usuário perde a confirmação
  de que gravou — e sem o estado normal visível, o erro sozinho não
  diz se os dados atuais estão salvos
