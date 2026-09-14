<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0020: Política de privacidade como vista interna, não rota

## Status

Aceito — fecha o ponto em aberto "router: tela de privacidade como rota ou
vista interna" de `docs/arquitetura.md` § Pontos em aberto, na Tarefa
0008-0004, primeira tarefa a precisar de uma terceira tela endereçável.

## Contexto

A política de privacidade precisa ser alcançável de dois lugares — o link
da tela de login (sem sessão) e o rodapé da tela principal (com sessão) —, e
voltar precisa levar de volta à tela de origem. `App.jsx` já decide qual
tela mostrar por estado (`useState`), sem router: guarda de login (Tarefa
0008-0001), tela de login (0008-0002) e atestação (0008-0003) são todas
ramos de retorno condicionais na mesma função, nunca rotas.

`AGENTS.md` § Convenções proíbe introduzir router antes de a árvore
realmente exigir. Uma terceira tela endereçável (a política) é o primeiro
caso concreto em que a pergunta se coloca de verdade.

## Decisão

- **Vistas internas**, controladas por um estado único em `App.jsx`
  (`vistaInterna: null | 'politica' | 'termos'`), no mesmo padrão dos ramos
  de retorno já existentes — nenhum router introduzido. Os termos de uso
  ([IDR 0053](../idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md))
  são a segunda vista interna.
- O estado é checado **antes** de qualquer outro ramo (guarda de login,
  atestação, tela principal): assim que `vistaInterna` volta a `null`, o
  app volta exatamente à tela que o estado de autenticação/carga já
  determinava — sem guardar "de onde vim" à parte. É esse mecanismo que
  cumpre "voltar retorna à tela de origem, sem depender do histórico do
  navegador" sem nenhum estado extra.
- `TelaDeLogin` e `Rodape` recebem callbacks (`onAbrirPolitica`,
  `onAbrirTermos`) que só escolhem a vista; `PoliticaDePrivacidade` e a
  vista de termos recebem `onVoltar`, que volta a `null`.

## Consequências

- Nenhuma URL própria para a política: não é possível linká-la direto nem
  ela sobrevive a um F5 — aceito, como o restante do app (sem histórico de
  navegação distinto entre as telas já existentes).
- O padrão de "ramo de retorno condicional em `App.jsx`" continua sendo o
  único mecanismo de multi-tela do produto, sem uma segunda forma a manter.
- **Gatilho de revisão**: se uma quinta tela endereçável aparecer, ou se
  compartilhar um link direto para a política ou os termos virar requisito,
  reavaliar — react-router (ou similar) passa a valer a complexidade.
- Um estado único impede duas vistas ligadas ao mesmo tempo.
- Implementação da vista de termos: Fase 0020, Tarefa 0020-0003.

## Alternativas consideradas

- **React Router** (ou biblioteca equivalente): daria URL própria e
  navegação pelo histórico do navegador, mas é a complexidade que
  `AGENTS.md` pede para adiar até a árvore exigir — três telas
  condicionais em um único componente ainda não exigem.
- **Estado com string da tela de origem** (`'login' | 'principal'`): mais
  explícito, mas desnecessário — o estado de autenticação/carga já sabe
  qual tela mostrar quando a política fecha; guardar a origem à parte
  duplicaria essa informação.
- **Segundo booleano para os termos** (`mostrarTermos`): mudança mínima, mas
  os dois estados poderiam ficar ligados juntos, com a ordem de checagem
  decidindo em silêncio.
- **React Router ao chegar a quarta tela** (gatilho original): duas páginas
  estáticas de leitura, sem link direto como requisito, não pagam a
  dependência.

## Histórico

- 2026-09-14 — Planejamento das Fases 0020 e 0021: a quarta tela (termos de
  uso, IDR 0053) disparou o gatilho de revisão; decidido seguir sem router,
  com estado único `vistaInterna`; implementação na Fase 0020. Antes: um
  booleano `mostrarPolitica` e gatilho na quarta tela.
