<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0007-0004: migração do `teamName`

## Data
2026-09-11

## Resumo
O resíduo `teamName` da era do botão é limpo sem tela, comando ou escrita
própria: se o documento carregado ainda o tem, a primeira gravação agregada
depois disso o apaga (`deleteField`) na mesma operação das contagens.

- `src/lib/colecaoRemota.js` — `gravarAlteracoes` reconhece a chave reservada
  `MARCA_APAGAR_TEAM_NAME` (`'__apagarTeamName'`, exportada) dentro do mapa
  `alteracoes`: quando presente e verdadeira, soma `teamName: deleteField()`
  ao mesmo `setDoc(merge:true)`, e a chave nunca entra no mapa `contagens`
  construído. Uma gravação só com a marca (sem nenhuma chave de contagem)
  também funciona — grava `updatedAt` e `teamName: deleteField()`, sem o
  campo `contagens` no payload.
- `src/lib/gravacaoAgregada.js` — nova marca interna
  `apagarTeamNamePendente`, deliberadamente **fora** do mapa `alteracoes`:
  a checagem de "há algo para gravar" continua olhando só para `alteracoes`,
  então a marca sozinha nunca dispara nem agenda uma escrita (critério "não
  pode virar escrita extra" do ADR 0008). Novo método
  `marcarTeamNameParaApagar(uid)` liga a marca; ela só entra no envio de uma
  gravação que já ia acontecer por causa de um ajuste real (a chave reservada
  é somada ao mapa só nesse momento, dentro de `gravarAgora`). Sucesso limpa
  a marca; falha a mantém, junto com as chaves que voltam para a fila —
  mesmo caminho de regravação da Tarefa 0007-0003, sem caso especial.
- `src/App.jsx` — o `temTeamNameRef` (criado na Tarefa 0007-0002, mas sem
  consumidor até agora) foi removido: no lugar dele, ao carregar um documento
  `encontrado` com `resultado.temTeamName`, o efeito de carga chama
  `gravacaoAgregada.marcarTeamNameParaApagar(uid)` diretamente. Sem leitura
  nem escrita adicional — a carga já trazia a marca desde a Tarefa 0007-0002.

## Decisões tomadas
- **TDR 0018** — como a marca "precisa apagar teamName" atravessa
  `gravacaoAgregada.js` → `colecaoRemota.js`: uma **chave reservada** dentro
  do próprio mapa `alteracoes` (`'__apagarTeamName'`), em vez de um terceiro
  parâmetro na função `gravar` injetada. A chave reservada não muda a
  assinatura de `gravar`, então nenhum teste da Tarefa 0007-0003 precisou ser
  reaberto — só os que passaram a chamar `marcarTeamNameParaApagar` (todos
  novos) veem a chave no mapa enviado. O literal existe duplicado (uma
  constante em cada módulo) de propósito: importar de `colecaoRemota.js`
  faria `gravacaoAgregada.test.js` carregar `firebase.js` de verdade,
  quebrando o desenho da tarefa anterior de mantê-lo testável só com
  temporizador falso.
- A "Decisão em aberto" da própria tarefa (documento com `teamName` que o
  usuário nunca ajusta) segue exatamente o encaminhamento já escrito nela:
  nada acontece — o campo fica lá, inofensivo, até a primeira gravação de
  fato. Não registra ADR/TDR à parte porque a tarefa já havia decidido isso;
  só confirmando aqui que a implementação cumpre.

## Impedimentos
Nenhum nível 2 ou 3. A única ambiguidade de implementação (como threadar a
marca entre os dois módulos) era de nível 1, resolvida pelo TDR 0018.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.`
- `vitest run`: **22 arquivos de teste, 211 testes, todos passando** —
  incluindo os 3 novos de `gravarAlteracoes` com a marca em
  `src/lib/colecaoRemota.test.js`, os 5 novos em
  `src/lib/gravacaoAgregada.test.js` (marca some/some não a escrita sozinha,
  não repete depois de sucesso, sobrevive a uma falha) e o novo cenário de
  integração em `src/App.gravacao.test.jsx` (carga com `temTeamName: true`
  seguida de um ajuste grava as contagens e a marca juntas).
- `vite build`: bundle principal `index-ClzjVCcw.js` (393,61 KB) e o chunk
  sob demanda do Firestore `index.esm-5vysxfQI.js` (505,90 KB) — inalterados
  em relação ao log da Tarefa 0007-0003; o aviso de chunk > 500 KB continua
  sendo o do Firestore sob demanda.

### Verificação visual / preview
Não pôde ser executada neste ambiente automatizado (sem deploy nem navegador
reais disponíveis aqui), pela mesma razão registrada nos logs das Tarefas
0007-0002 e 0007-0003. O comportamento — uma conta com `teamName` gravado que
ajusta uma figurinha e fica só com `contagens`/`updatedAt` depois, custando
uma única escrita — está coberto por teste (mock de `setDoc`/`deleteField` e
integração via `App.gravacao.test.jsx`), mas a confirmação no console do
Firebase de uma conta real fica pendente de verificação manual pós-merge.

## Arquivos alterados
- `src/lib/colecaoRemota.js` — `gravarAlteracoes` reconhece `MARCA_APAGAR_TEAM_NAME`
- `src/lib/colecaoRemota.test.js` — testes da marca em `gravarAlteracoes`
- `src/lib/gravacaoAgregada.js` — `marcarTeamNameParaApagar`, marca interna, envio condicional
- `src/lib/gravacaoAgregada.test.js` — testes da migração (5 casos)
- `src/App.jsx` — remove `temTeamNameRef`, chama `marcarTeamNameParaApagar` na carga
- `src/App.gravacao.test.jsx` — cenário de integração da migração
- `docs/tdr/0018-marca-de-apagar-teamname-via-chave-reservada.md` — criar
- `docs/plano/0007-persistencia-da-colecao-e-avisos/0004-migracao-do-teamname.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0004 atualizado
- `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0004-log-migracao-do-teamname.md` — este log
