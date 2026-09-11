<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0018: Marca de apagar o `teamName` via chave reservada em `alteracoes`

## Status

Aceito — desbloqueia a Tarefa 0007-0004.

## Contexto

A Tarefa 0007-0004 pede que a primeira gravação do schema novo, quando o
documento carregado ainda tem `teamName`, apague o campo na mesma escrita das
contagens — sem virar uma escrita à parte. A marca "precisa apagar" nasce na
carga (`App.jsx`, quando `carregarColecao` devolve `temTeamName: true`) e
precisa atravessar `gravacaoAgregada.js` (que decide **quando** grava) até
`colecaoRemota.js` (que decide **o quê** grava).

Duas formas de passar essa marca entre os dois módulos:

1. Um terceiro parâmetro na função `gravar` injetada — `gravar(uid,
   alteracoes, { apagarTeamName })`.
2. Uma chave reservada dentro do próprio mapa `alteracoes` — nunca colide com
   um código de catálogo real (`XXX00`) — que `gravarAlteracoes` reconhece e
   retira antes de montar `contagens`.

A primeira muda a assinatura da função injetada, e todo teste que já
verificava `gravar` chamado com `(uid, alteracoes)` (criados na Tarefa
0007-0003, antes desta) passaria a falhar por comparação exata de argumentos
— `gravacaoAgregada.test.js` e `App.gravacao.test.jsx` precisariam ser
reabertos só por causa da assinatura, não por comportamento novo.

## Decisão

- **Chave reservada `'__apagarTeamName'`** dentro do mapa `alteracoes`.
  `gravacaoAgregada.js` a inclui só no envio de uma gravação que **já vai
  acontecer** por causa de um ajuste real (nunca sozinha — ver abaixo).
  `colecaoRemota.gravarAlteracoes` a reconhece, retira do que vira
  `contagens` e soma `teamName: deleteField()` à mesma escrita.
- **O literal existe duas vezes** — uma constante em `colecaoRemota.js`
  (exportada, para os testes daquele arquivo) e outra igual em
  `gravacaoAgregada.js` (não exportada) — em vez de uma só, importada. Um
  `import` faria `gravacaoAgregada.test.js` carregar `colecaoRemota.js` e,
  por tabela, `firebase.js` de verdade (mesmo sem mockar nada), quebrando o
  desenho da Tarefa 0007-0003 de manter aquele módulo testável só com
  temporizador falso, sem tocar o SDK do Firestore.
- **A marca de apagar fica fora do mapa `alteracoes` no estado interno de
  `gravacaoAgregada`** (variável própria, não uma chave a mais no mapa):
  assim a checagem "há algo para gravar?" (`Object.keys(alteracoes).length`)
  não conta a marca sozinha, e ela nunca dispara uma escrita própria — só
  entra no envio quando uma gravação por ajuste real já ia acontecer,
  cumprindo "não pode virar escrita extra" (ADR 0008).

## Consequências

- Nenhum teste da Tarefa 0007-0003 precisou mudar por causa desta tarefa —
  os que não chamam `marcarTeamNameParaApagar` continuam vendo `gravar`
  chamado exatamente como antes (mapa só com códigos).
- `gravarAlteracoes` ganha uma leitura a mais (filtrar a chave reservada) mas
  a assinatura pública (`uid, alteracoes`) não muda.
- Duplicar um literal de uma linha entre dois arquivos é uma pequena
  redundância aceita em troca do desacoplamento — cada lado comenta onde o
  irmão está.

## Alternativas consideradas

- **Terceiro parâmetro `{ apagarTeamName }` em `gravar`**: mais explícito no
  tipo, mas reabriria testes que não têm nada a ver com esta tarefa só por
  causa da forma da chamada.
- **Constante compartilhada num módulo à parte** (ex.:
  `colecaoConstantes.js`): resolveria a duplicação, mas criaria um arquivo
  novo só para uma string, para um acoplamento que já é pequeno e documentado
  nos dois lados.
- **Importar a constante de `colecaoRemota.js` em `gravacaoAgregada.js`**:
  mais DRY, mas reintroduz o próprio acoplamento (e o `console.error` de
  `firebase.js` sem configuração) que a Tarefa 0007-0003 evitou de propósito.
