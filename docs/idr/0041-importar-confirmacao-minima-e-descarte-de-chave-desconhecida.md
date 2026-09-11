<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0041: Importar com confirmação mínima e descarte de chave desconhecida

## Status

Aceito.

## Contexto

`docs/interface.md` § Demais telas deixa em aberto o diálogo de
importação. `docs/requisitos.md` § Portabilidade exige confirmação
explícita antes de substituir a coleção — ao contrário da exportação
(IDR 0040), aqui existe algo genuíno a confirmar: a substituição é
irreversível (o histórico de desfazer também é descartado) e destrói o
que não estiver no arquivo.

A Tarefa 0009-0005 também precisa decidir o que fazer com uma chave do
arquivo que está no formato certo (valor 1–99) mas cujo código não existe
no catálogo atual — situação hipotética hoje (o catálogo é estático),
mas que a validação já precisa prever.

## Decisão

- **Confirmação via `window.confirm()`** — diálogo nativo do navegador,
  sem tela nem componente próprio, coerente com o minimalismo do
  IDR 0018 e com "sem etapas adicionais" já resolvido de outro jeito para
  a exportação (aqui a etapa é necessária: a operação é destrutiva).
  Mensagem direta: a coleção atual será substituída por inteiro e a
  operação não pode ser desfeita.
- **Validação primeiro, confirmação depois**: um arquivo inválido nunca
  chega a mostrar o diálogo — é rejeitado direto, com aviso. Só um
  arquivo válido pergunta antes de aplicar.
- **Chave de código desconhecido do catálogo**: descartada, sem recusar
  o resto do arquivo — soma numa contagem de descartadas, avisada à parte
  depois de aplicar ("N figurinha(s) do arquivo não existem no catálogo
  atual e foram descartadas"). Recusar o arquivo inteiro por uma chave
  seria pior que aproveitar o resto: o cenário real é um catálogo que
  mudou entre a exportação e a importação (edição futura do jogo, por
  exemplo), não um arquivo corrompido.

## Consequências

- `window.confirm()` bloqueia a aba até ser dispensado — aceitável, é uma
  ação rara e deliberada, não um fluxo de rajada
- A mensagem de confirmação não lista o que vai mudar (quantas figurinhas,
  quais) — só afirma que a coleção atual será substituída; suficiente
  para a decisão "quero mesmo importar este arquivo", sem construir uma
  tela de prévia
- Testes de integração precisam stubar `window.confirm`
- Uma chave descartada por não pertencer ao catálogo gera um segundo
  aviso (dourado), depois do de sucesso — dois avisos empilhados nesse
  caso raro, dentro do limite de 3 do IDR 0034

## Alternativas consideradas

- **Tela ou modal de confirmação próprio**: mais controle sobre o texto e
  visual, mas cria uma tela nova só para uma ação rara — como a
  exportação, evitado
- **Sem confirmação, com desfazer disponível depois**: contraria
  `requisitos.md`, que exige confirmação explícita; além disso, o próprio
  desfazer é descartado pela importação (não haveria como desfazer o
  próprio ato)
- **Recusar o arquivo inteiro se alguma chave não existir no catálogo**:
  mais estrito, mas destrói dado válido (as demais figurinhas do arquivo)
  por causa de uma chave desatualizada — pior para o usuário que só quer
  restaurar o que ainda existe
