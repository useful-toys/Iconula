<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0007-0005: política de erro visível ponta a ponta

## Data
2026-09-11

## Resumo
Gravação e carga passam a distinguir três desfechos — sucesso, falha e
espera —, cada um com a severidade certa na área de avisos: sucesso e
espera desaparecem em 5s, falha persiste com o detalhe técnico ao toque. A
tela nunca trava, e a gravação seguinte a uma falha regrava o valor
completo.

- `src/lib/colecaoRemota.js` — `carregarColecao(uid, { aoEsperar })` ganha um
  segundo parâmetro opcional. A leitura corre contra um tempo-limite de
  ~5s (`comAvisoDeEspera`, helper interno): se ele vencer, `aoEsperar()` é
  chamado uma vez e a função continua aguardando a mesma promessa,
  resolvendo depois com o desfecho real (`encontrado`/`vazio`/`erro`).
  `gravarAlteracoes` não mudou — continua `(uid, alteracoes)`, sem saber
  nada sobre tempo-limite (TDR 0019).
- `src/lib/gravacaoAgregada.js` — `criarGravacaoAgregada` ganha a opção
  `aoEsperar`. `gravarAgora` corre a promessa de `gravar(uid, envio)` contra
  o mesmo tempo-limite de ~5s; vencendo o tempo-limite, chama `aoEsperar()`
  e continua aguardando a mesma promessa até o desfecho real, que segue o
  caminho de sempre (sucesso limpa a marca de `teamName` e agenda o
  próximo; falha devolve as chaves para a fila).
- `src/App.jsx` — liga as três severidades:
  - **Sucesso**: "Alterações salvas" (gravação) — texto ajustado de "Coleção
    gravada" (Tarefa 0007-0003) para bater exatamente com
    `docs/interface.md` § Avisos, como o encaminhamento desta tarefa pedia.
  - **Falha** (nova, `aoFalhar`): "Falha ao gravar — toque para detalhes",
    com `mensagemDeErro(resultado.erro)` no detalhe — antes desta tarefa,
    uma gravação malsucedida não emitia nenhum aviso (deferido de propósito
    na Tarefa 0007-0003).
  - **Espera** (nova, `aoEsperar`, gravação e carga): "Conexão instável —
    sincronizando quando possível".
- `src/lib/colecaoRemota.test.js` — 3 testes novos: leitura pendente chama
  `aoEsperar` e ainda resolve com o desfecho real; resolvendo antes de 5s
  nunca chama `aoEsperar`; sem `aoEsperar`, a leitura não corre contra
  tempo-limite nenhum.
- `src/lib/gravacaoAgregada.test.js` — 4 testes novos: espera chama
  `aoEsperar`, não `aoFalhar`; resolvendo antes de 5s nunca chama
  `aoEsperar`; depois de esperar, uma falha real ainda chama `aoFalhar`;
  sem `aoEsperar` injetado, a gravação segue funcionando normalmente.
- `src/App.gravacao.test.jsx` — nova `describe` de integração: erro do
  servidor gera aviso vermelho com detalhe (expansível ao toque); espera de
  ~5s gera aviso dourado, não vermelho, e o sucesso chega depois
  normalmente; a gravação seguinte a uma falha inclui as chaves da
  tentativa anterior; sucesso dispensa a falha visível; ajustar continua
  funcionando durante e depois de uma falha.
- `src/App.persistencia.test.jsx` — assinatura de `carregarColecao` mudou
  (segundo argumento `{ aoEsperar }`); a asserção de chamada exata foi
  ajustada para incluir `aoEsperar: expect.any(Function)`.

## Decisões tomadas
- **TDR 0019** — duas lacunas de implementação:
  1. **Callback, não um terceiro status de retorno**: `aoEsperar` é chamado
     no meio do caminho, e a função ainda resolve, mais tarde, com o
     desfecho real — evita inventar um status `'espera'` que obrigaria o
     chamador a lidar com uma terceira ausência de resposta definitiva.
  2. **Onde mora a corrida contra o tempo-limite**: dentro de
     `carregarColecao` para a carga; **em volta** da promessa devolvida por
     `gravar(...)` dentro de `gravacaoAgregada.js` para a gravação — não
     dentro de `gravarAlteracoes`. Preserva a assinatura de dois argumentos
     de `gravar` intacta (nenhum teste das Tarefas 0007-0003/0004 precisou
     mudar) e mantém a separação de responsabilidades do TDR 0018. Cada
     módulo tem seu próprio helper de corrida (não compartilhado), mesma
     razão de desacoplamento do TDR 0018.
- **Textos das mensagens**: usados exatamente como `docs/interface.md` §
  Avisos já os escreve. A mensagem de sucesso da gravação mudou de "Coleção
  gravada" (texto provisório da Tarefa 0007-0003) para "Alterações salvas",
  eliminando a divergência — por isso **não** nasce IDR: a decisão em
  aberto desta tarefa só previa um registro se o MVP divergisse do texto já
  registrado em `interface.md`, e agora não diverge.

## Impedimentos
Nenhum nível 2 ou 3. As duas ambiguidades de implementação eram de nível 1,
resolvidas pelo TDR 0019.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.`
- `vitest run`: **22 arquivos de teste, 223 testes, todos passando** —
  incluindo os 7 novos de espera (`colecaoRemota.test.js` e
  `gravacaoAgregada.test.js`) e os 5 novos de integração da política de
  erro em `App.gravacao.test.jsx`.
- `vite build`: bundle principal `index-Drq83r7v.js` (394,37 KB) e o chunk
  sob demanda do Firestore `index.esm-CxBUSDxf.js` (505,90 KB) — sem
  mudança relevante em relação ao log da Tarefa 0007-0004; o aviso de
  chunk > 500 KB continua sendo o do Firestore sob demanda.
- Nenhum `console.error`/`console.log` novo foi introduzido por esta
  tarefa em `colecaoRemota.js`, `gravacaoAgregada.js` ou `App.jsx` — o
  critério "nenhum log de console com uid ou conteúdo da coleção" se
  cumpre trivialmente, por ausência de log algum nesses módulos.

### Verificação visual / preview
Não pôde ser executada neste ambiente automatizado (sem deploy nem
navegador reais disponíveis aqui), pela mesma razão registrada nos logs das
Tarefas 0007-0002 a 0007-0004. Os três desfechos — sucesso, falha vermelha
com detalhe, espera dourada seguida do sucesso real — estão cobertos por
teste com temporizador falso, tanto na unidade (`colecaoRemota.test.js`,
`gravacaoAgregada.test.js`) quanto na integração
(`App.gravacao.test.jsx`); a confirmação com o DevTools em modo offline e
uma regra temporária recusando a escrita no emulador, pedida na seção
"Validação" da tarefa, fica pendente de verificação manual pós-merge.

## Arquivos alterados
- `src/lib/colecaoRemota.js` — `carregarColecao` ganha `{ aoEsperar }` e a corrida com tempo-limite
- `src/lib/colecaoRemota.test.js` — testes da espera na carga (3 casos)
- `src/lib/gravacaoAgregada.js` — `aoEsperar` na gravação, corrida com tempo-limite
- `src/lib/gravacaoAgregada.test.js` — testes da espera na gravação (4 casos)
- `src/App.jsx` — liga sucesso/falha/espera às severidades certas, com os textos de `interface.md`
- `src/App.gravacao.test.jsx` — nova `describe` de integração da política de erro (5 casos)
- `src/App.persistencia.test.jsx` — assinatura de `carregarColecao` na asserção de chamada
- `docs/tdr/0019-espera-sem-rede-via-corrida-com-timeout-e-callback.md` — criar
- `docs/plano/0007-persistencia-da-colecao-e-avisos/0005-politica-de-erro-visivel.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0005 atualizado
- `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0005-log-politica-de-erro-visivel.md` — este log
