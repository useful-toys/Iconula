<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0036: Atestação como passo explícito, e falha libera o app

## Status

Aceito — fecha as duas pendências que a Tarefa 0008-0003 herdou:
`interface.md` § Pendências de interface ("se a atestação é o próprio
clique de entrar ou um passo explícito só na primeira vez") e
`requisitos.md` § Decisões Pendentes ("Falha ao gravar a atestação de
menores").

## Contexto

`requisitos.md` § Acesso exige, para LGPD art. 14: "um clique atestando ter
12 anos ou mais ou estar autorizado pelos responsáveis, antes de liberar o
app — uma única vez por conta, gravada em `atestadoEm`". Duas perguntas
ficaram em aberto até esta tarefa:

1. **Esse clique é o próprio botão "Entrar com Google", ou um passo à
   parte?** O protótipo visual (`docs/prototype/`) mostra a frase de
   atestação ao lado do botão de login, sugerindo que entrar já seria
   atestar — e a exibe a cada tela de login, não só na primeira vez.
2. **O que fazer se a escrita de `atestadoEm` falhar?** Reter o usuário até
   a escrita confirmar, ou liberar o app e tentar de novo depois?

## Decisão

- **Passo explícito, uma única vez por conta.** O clique de "Entrar com
  Google" autentica; ele não atesta. Contas sem `atestadoEm` veem uma
  tela própria (`Atestacao.jsx`) com o texto exato de `interface.md` e
  um botão "Confirmar", antes de qualquer acesso ao catálogo. Contas
  com `atestadoEm` nunca veem essa tela de novo. O protótipo é
  referência visual, não vence o requisito — que pede explicitamente
  "um clique atestando… uma única vez por conta", não "a cada login".
- **Falha ao gravar libera o app assim mesmo.** O clique em "Confirmar"
  já é o ato de atestar — praticado, não pendente. `App.jsx` chama
  `gravarAtestacao` e libera o catálogo **independentemente do
  resultado**: em falha, emite o aviso vermelho de falha (IDR 0017) e
  segue. Não há fila de retentativa própria: o campo simplesmente
  continua ausente no documento, e a próxima vez que esta conta logar
  sem `atestadoEm` o passo aparece de novo — a mesma leitura da carga
  já diz isso, sem custo extra.

## Consequências

- A tela de atestação é um segundo "portão" depois do login, antes do
  catálogo — reaproveita o cartão e os tokens de `TelaDeLogin.jsx`
  (Tarefa 0008-0002), sem layout novo.
- Reter o usuário nunca é o desfecho de uma falha de rede: puniria um
  ato já praticado. A alternativa (reter até a escrita confirmar) foi
  descartada por isso.
- Sem fila de retentativa dedicada, uma conta que atesta e cuja escrita
  falha repetidamente veria o passo em todo login até a escrita enfim
  passar — aceito: é o caso raro (falha de rede no exato instante da
  atestação), e o passo em si é rápido (um toque).
- Como a decisão vem do que a própria carga da coleção já traz
  (`atestadoEm` no documento), nenhuma leitura extra é gasta — coerente
  com `requisitos.md` § Requisitos Não Funcionais (uma leitura por
  login).
- `App.jsx` decide se mostra o catálogo ou a atestação de forma
  otimista, a partir do estado inicial `precisaAtestar = false`,
  corrigido assim que a carga resolve — a mesma política já usada para
  `contagens` (Tarefa 0007-0002): sem tela de espera própria, sem
  disputar com a proteção de corrida "ajuste durante a carga" já
  estabelecida. Consequência: uma janela muito breve em que uma conta
  nova poderia, em tese, ver o catálogo antes de a carga confirmar que
  falta atestar — inevitável sem reabrir a Tarefa 0007-0002 (que já
  estabeleceu carregamento otimista) ou duplicar a leitura, e sem efeito
  prático: nenhuma ação de escrita depende desse instante.

## Alternativas consideradas

- **Atestação embutida no clique de login**: mais simples (nenhum passo
  extra), mas não atende "um clique atestando… uma única vez por conta"
  — autenticar não é o mesmo ato que atestar, e reautenticar (login de
  novo na mesma conta) não pode reacionar a atestação.
- **Reter o usuário até a escrita de `atestadoEm` confirmar**: mais
  estrito com a garantia de que o campo existe, mas puniria uma falha de
  rede por um ato que o usuário já praticou — contra a política de erro
  visível já adotada em toda a persistência (ADR 0008).
- **Fila de retentativa dedicada** (ex.: piggyback na gravação agregada
  de contagens): resolveria o caso raro de falha persistente sem
  esperar o próximo login, mas gastaria uma escrita adicional com
  `updatedAt` junto de `atestadoEm` sempre que reaproveitada — o
  ADR 0008 decidiu deliberadamente o oposto ("sem `updatedAt` junto").
  Descartada por complexidade não justificada pelo caso raro.
- **Bloquear a tela até a carga da coleção resolver, sempre**: fecharia
  de vez a janela teórica acima, mas quebraria a proteção de corrida já
  testada da Tarefa 0007-0002 ("ajuste feito durante a leitura não é
  sobrescrito pela resposta do servidor"), que depende do catálogo já
  estar montado antes da carga responder. Reabrir aquela decisão está
  fora do escopo desta tarefa.
