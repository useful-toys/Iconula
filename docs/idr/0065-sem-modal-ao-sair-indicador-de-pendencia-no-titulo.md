<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0065: Sem modal ao sair — o indicador de pendência no título basta

## Status

Aceito.

## Contexto

- Pedido do esmiuçamento: avaliar se é possível mostrar um popup modal
  de aviso quando há alterações pendentes e o usuário decide sair da
  página (fechar a aba, navegar para outra URL, fechar o navegador), para
  evitar perda de dados.
- O app não tem router ([AGENTS.md](../../AGENTS.md) § O que é este
  projeto): "sair da página" só existe como descarregar a aba inteira
  (fechar, atualizar, digitar outra URL) — as demais telas (política,
  termos, catálogo compartilhado, Sobre) são vistas internas
  ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)), não
  navegação real.
- **Um popup modal customizado não intercepta o descarregamento da
  página** — só o evento `beforeunload`, que abre um diálogo **nativo do
  navegador**, com texto fixo e genérico, sem controle de estilo, texto
  ou botões.
- A garantia de não perder dados já existe, arquiteturalmente: flush
  automático em `pagehide`/`visibilitychange`
  ([App.jsx:180-195](../../src/App.jsx)) somado ao cache IndexedDB
  persistente do SDK (`persistentLocalCache` +
  `persistentMultipleTabManager()` — ver
  [MDR 0007](../model-dr/0007-persistencia-no-armazenamento-local.md)):
  escritas pendentes sobrevivem ao fechamento da aba e completam na
  carga seguinte, mesmo sem rede.
- [IDR 0010](0010-desfazer-ajustes-em-vez-de-confirmacoes.md) é decisão
  vigente: "nenhum ajuste pede confirmação" — o desfazer substitui
  confirmações em todo o app; a única exceção hoje é a importação
  (irreversível). Um diálogo de saída quebraria essa regra pela primeira
  vez para algo reversível e já coberto por outra rede de segurança.
- Os Termos de uso já avisam: "sem garantia... contra perda de dados...
  use exportar" — o produto já assume e comunica essa postura.

## Decisão

- **Nenhum popup modal, próprio ou nativo (`beforeunload`), é
  adicionado.**
- No lugar disso, o [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md)
  passa a mostrar um estado explícito de pendência no título quando há
  alteração não gravada (ver a atualização daquele registro) — aviso não
  bloqueante, coerente com o resto do produto (IDR 0029, IDR 0010).
- A garantia de não perder dados continua sendo a combinação de flush ao
  ocultar/fechar a página + cache IndexedDB persistente (MDR 0007), sem
  mudança nesta decisão.

## Consequências

- Nenhum código novo de interceptação de saída; a mitigação de perda de
  dados continua 100% no mecanismo já existente (MDR 0007).
- O sinal de "há algo não salvo" fica só no título (IDR 0027), sem
  bloquear a saída — mantém a filosofia de avisos não bloqueantes
  (IDR 0029) e "sem confirmações" (IDR 0010).
- Se o cache IndexedDB falhar por algum motivo (ex. modo privado sem
  suporte, quota esgotada), esta decisão não cobre esse caso — fica como
  risco residual aceito, não como pendência de desenho.
- Implementação: Fase 0033, Tarefa 0033-0004 (o indicador "não salvo" do
  IDR 0027 é a realização desta decisão — nenhum código de interceptação de
  saída é criado).

## Alternativas consideradas

- **`beforeunload` nativo, só quando há pendência real**: reforço extra
  contra a falha rara do cache local, mas com texto genérico e não
  customizável do navegador, e abrindo uma exceção ao IDR 0010. O humano
  avaliou a limitação técnica e decidiu não adicionar — descartado.
- **Popup modal customizado**: tecnicamente inviável para fechar
  aba/atualizar/digitar nova URL — só o diálogo nativo intercepta esses
  casos. Descartado.
