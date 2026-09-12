<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0038: Sair da conta aborta se o flush falhar

## Status

Aceito.

## Contexto

- A Tarefa 0009-0002 move "sair da conta" da área de login provisória
  para o menu de ações do cabeçalho, mantendo a garantia já
  estabelecida na Tarefa 0007-0003 (ADR 0008): sair grava o que
  estiver pendente **antes** do `signOut`, porque depois do logout as
  regras do Firestore negam a escrita (`docs/requisitos.md` § Acesso)
  — um ajuste recente ainda não gravado se perderia.
- A tarefa deixou como pendência de desenho o que fazer quando esse
  flush final falha (erro real do servidor — não a espera sem rede, já
  tratada pelo ADR 0008 com o aviso "sincronizando quando possível"):
  sair mesmo assim descartaria o ajuste pendente sem avisar — a única
  perda de dado silenciosa do app inteiro.

## Decisão

- Se o flush ao sair devolver `status: 'erro'`, o `signOut` **não**
  acontece: a conta permanece logada, com o ajuste pendente intacto na
  fila da gravação agregada (ela já devolve as chaves para a fila em
  caso de falha — comportamento existente do ADR 0008).
- A falha é informada pelo mesmo canal já usado para qualquer falha de
  gravação (`avisos.js`, severidade falha, "Falha ao gravar — toque
  para detalhes") — sem mensagem nem `tipo` de aviso dedicados: para
  esse propósito, sair é só mais uma gravação que pode falhar, sem caso
  especial (mesmo espírito do IDR 0003 para o desfazer).
- `criarGravacaoAgregada` (`src/lib/gravacaoAgregada.js`) passa a
  devolver o resultado discriminado da escrita a partir de `flush()`
  (`{ status: 'sucesso' | 'erro' | 'nada' }`, `'nada'` quando não havia
  pendência) em vez de `undefined` — é esse retorno que `handleSignOut`
  usa para decidir.
- O usuário decide o próximo passo: tentar sair de novo (repete o
  flush) ou continuar usando o app até a rede/servidor normalizarem.

## Consequências

- Nenhuma perda silenciosa de ajustes ao sair: a única alternativa a
  uma falha de gravação é permanecer logado
- Sem rede, o flush não chega a devolver `erro` (fica em espera até o
  servidor responder — ADR 0008); sair nesse caso continua esperando a
  resposta real antes de decidir, comportamento inalterado por esta
  decisão
- `gravacaoAgregada.test.js` ganhou casos para o retorno de `flush()`
  nos três desfechos (`sucesso`, `erro`, `nada`)

## Alternativas consideradas

- **Sair mesmo com falha, avisando depois**: a última gravação nunca
  chegaria a acontecer antes de as regras negarem a escrita — perda
  silenciosa, o problema que esta decisão existe para evitar
- **Repetir o flush automaticamente até funcionar**: reintroduziria um
  laço de retentativa próprio que a política de erro do ADR 0008
  deliberadamente evitou (a gravação seguinte já regrava o valor
  completo, de forma idempotente)
- **Mensagem dedicada para a falha ao sair**: mais específico, mas cria
  um segundo texto de falha de gravação sem necessidade — o padrão já
  aceito ("toque para detalhes") já informa e já leva ao detalhe
  técnico
