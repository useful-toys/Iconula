<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0019: Espera sem rede via corrida com tempo-limite e callback

## Status

Aceito — desbloqueia a Tarefa 0007-0005.

## Contexto

O ADR 0008 já previa que, sem rede, a promessa de escrita do Firestore não
resolve nem rejeita — fica pendente até o servidor responder — e que um
tempo-limite de ~5s deveria emitir o **aviso** "sem conexão, será gravado
depois". A Tarefa 0007-0005 pediu o mesmo tratamento para a **carga**
(`carregarColecao`), não só para a gravação.

Duas perguntas de implementação, sem resposta pronta em nenhum registro
anterior:

1. **Como uma função `async` avisa duas vezes** — "ainda estou tentando" e,
   depois, "consegui" ou "falhei" — se ela só pode `return` (resolver) uma
   vez? A resposta óbvia é um **callback** (`aoEsperar`) chamado no meio do
   caminho, com a função ainda resolvendo no fim, mais tarde, com o
   desfecho real.
2. **Onde mora a corrida contra o tempo-limite** — `carregarColecao` e
   `gravarAlteracoes` moram em `colecaoRemota.js`; a gravação agregada
   (`gravacaoAgregada.js`) chama `gravarAlteracoes` através da função
   `gravar` injetada (TDR 0018), cujo contrato de dois argumentos
   (`uid, alteracoes`) já sustenta vários testes da Tarefa 0007-0003 que
   comparam a chamada por igualdade exata.

## Decisão

- **Callback, não um terceiro estado de retorno.** `aoEsperar` é uma função
  passada nas opções; quando o tempo-limite de 5s vence a corrida contra a
  promessa real, `aoEsperar()` é chamado uma vez, e a função **continua**
  aguardando a mesma promessa, resolvendo depois com o resultado final
  (`sucesso` ou `erro`) — nunca inventa um status `'espera'` para o retorno,
  porque isso obrigaria o chamador a lidar com uma terceira ausência de
  resposta definitiva.
- **A corrida mora em dois lugares, cada um do seu lado do contrato**:
  - Em `colecaoRemota.js`, dentro do próprio `carregarColecao(uid, {
    aoEsperar })` — não precisa atravessar nenhuma fronteira de módulo.
  - Em `gravacaoAgregada.js`, **em volta** da promessa devolvida por
    `gravar(uid, envio)` — não dentro de `gravarAlteracoes`. Isso preserva a
    assinatura de dois argumentos de `gravar` intacta (nenhum teste da
    Tarefa 0007-0003/0004 precisou mudar) e mantém a mesma separação de
    responsabilidades do TDR 0018: `gravacaoAgregada.js` decide **quando**
    gravar (debounce, teto, e agora também espera), `colecaoRemota.js`
    decide **o quê** gravar.
- **Cada módulo implementa sua própria corrida** (helper local, não
  compartilhado) — mesma razão do TDR 0018: um utilitário importado de
  `colecaoRemota.js` para dentro de `gravacaoAgregada.js` (ou vice-versa)
  reintroduziria o acoplamento que aquele registro evitou de propósito, só
  que agora para uma segunda peça de lógica.
- **Textos das mensagens**: usados exatamente como `docs/interface.md` §
  Avisos já os escreve — "Alterações salvas", "Falha ao gravar — toque para
  detalhes", "Conexão instável — sincronizando quando possível" — sem
  nenhuma redação nova. Não nasce IDR: a "Decisão em aberto" da própria
  tarefa só previa um IDR se o MVP divergisse do texto já registrado, e não
  divergiu.

## Consequências

- `carregarColecao` ganha um segundo parâmetro opcional (`{ aoEsperar }`);
  chamadas existentes (`carregarColecao(uid)`) continuam válidas.
- `gravarAlteracoes` **não muda** — continua `(uid, alteracoes)`, sem saber
  nada sobre tempo-limite ou espera.
- Um teste com temporizador falso cobre os três desfechos de cada operação
  (sucesso rápido, espera seguida de sucesso, espera seguida de falha) nos
  dois módulos e na integração via `App.jsx`.
- Se o futuro `onSnapshot` (sincronização ao vivo, gatilho de revisão do
  ADR 0008) mudar o modelo de leitura, o `aoEsperar` da carga deixa de fazer
  sentido do jeito que está — outro gatilho de revisão para quando isso
  acontecer.

## Alternativas consideradas

- **Um terceiro status `'espera'` no retorno**: mais "puro" no sentido de
  nunca usar callback, mas a função ainda precisaria devolver o desfecho
  real depois — ou o chamador teria que chamar de novo, reintroduzindo
  polling. O callback é mais simples e não multiplica chamadas.
- **Corrida centralizada num utilitário só, importado pelos dois módulos**:
  mais DRY, mas reabre o acoplamento que o TDR 0018 evitou — o import
  atravessaria exatamente a fronteira que aquele registro definiu como
  limite.
- **Passar `aoEsperar` como terceiro argumento de `gravar`**: mudaria a
  assinatura da função injetada e quebraria as comparações exatas de
  chamada dos testes da Tarefa 0007-0003 — mesmo problema que o TDR 0018 já
  havia evitado para a marca do `teamName`.
