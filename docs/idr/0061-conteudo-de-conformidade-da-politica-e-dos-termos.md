<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0061: Conteúdo de conformidade da política e dos termos

## Status

Aceito — implementação nas Fases 0031 (Tarefa 0031-0005) e 0032
(Tarefa 0032-0004).

## Contexto

- A política implementada na Tarefa 0008-0004 declara dados tratados,
  finalidade, local, retenção e direitos, mas não diz **quem** é o
  controlador, **com que base legal** trata, nem que a identidade é
  processada **fora do Brasil**.
- `southamerica-east1` vale para o Firestore; o Firebase Auth é global —
  identidade e tokens são tratados pelo Google fora do país.
- "Os dados ficam guardados enquanto a sua conta existir" não é prazo
  (arts. 15 e 16), e o app tem fim de vida previsível: a Copa acaba.
- A frase "nenhum outro dado é tratado" é falsa: há `localStorage`
  ([IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md)) e
  cache IndexedDB do SDK
  ([MDR 0007](../model-dr/0007-persistencia-no-armazenamento-local.md)).
- A exportação JSON já atende a portabilidade (art. 18, V) desde a Fase
  9 e nunca foi declarada como tal.
- Atender pedido de titular por e-mail, sem conferir a origem, entregaria
  dado alheio a quem escrevesse primeiro.
- O [IDR 0053](0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md) é
  o precedente: o roteiro de conteúdo de um texto legal do app é decisão
  de interface.

## Decisão

- **Controlador e encarregado**: Daniel Felix Ferber, pessoa física,
  Brasil, sendo o próprio controlador o encarregado; contato pelo e-mail
  já publicado. Sem CPF nem endereço.
- **Base legal, por finalidade** (art. 9º, I): conta e coleção por
  execução do contrato firmado nos Termos de uso (art. 7º, V); link do
  catálogo por consentimento específico, revogável ao desligá-lo
  (art. 7º, I); atestação de idade pelo art. 14.
- **Operador e transferência internacional** (arts. 33 e 39): Google
  como operador; a coleção em São Paulo, a identidade tratada
  globalmente pelo Firebase Auth, sob cláusulas-padrão contratuais.
- **Retenção** (arts. 15 e 16): 24 meses sem login levam ao apagamento
  da conta e da coleção; descontinuado o Iconula, os dados são apagados
  em até 90 dias, com aviso na própria tela e janela para exportar.
- **Direitos**: exclusão dentro do app (IDR 0060), portabilidade pela
  exportação JSON, os demais pelo canal de contato — respondidos em até
  15 dias (art. 19, §1º, II) e atendidos quando partem do **mesmo e-mail
  da conta Google** usada no app.
- **Armazenamento local**: declarado — `localStorage` e cache IndexedDB,
  locais ao aparelho, nunca enviados, estritamente funcionais; por isso o
  app não pede consentimento de cookies nem exibe banner.
- **Vigência e alterações**: data de "Última atualização" no topo dos
  dois textos e seção de histórico de versões; mudança material pede
  novo aceite na entrada ([IDR 0062](0062-reaceite-reusa-a-tela-de-atestacao.md)).
- Os termos de uso repetem o bloco de controlador e a mesma data de
  vigência, para os dois textos não divergirem.

## Consequências

- A política deixa de ser uma descrição do tratamento e passa a ser um
  documento de conformidade: toda finalidade tem hipótese legal
  declarada.
- A retenção de 24 meses cria uma obrigação operacional recorrente, sem
  automação possível no plano Spark — coberta pelo
  [DDR 0011](../devops-dr/0011-procedimentos-manuais-de-privacidade.md).
- Declarar o Google como operador exige o Data Processing Addendum
  aceito no Google Cloud, registrado em `docs/setup-gcloud.md`.
- A identificação por e-mail da conta dá um critério objetivo de
  atendimento, sem pedir documento ao titular.
- `docs/requisitos.md` § Privacidade muda junto, no PR do planejamento.

## Alternativas consideradas

- **Consentimento (art. 7º, I) como base única**: coerente com o aceite
  no login, mas exigiria prova de consentimento por versão, revogação
  facilitada e retratamento a cada mudança — mais peso operacional para
  o mesmo resultado de um serviço que o titular pede explicitamente.
- **Legítimo interesse (art. 7º, IX)**: exigiria teste de
  proporcionalidade documentado e não se aplica a um serviço pedido pelo
  próprio titular.
- **Retenção só até o fim do projeto**: sem processo recorrente para
  operar, mas menos aderente ao art. 16, que pede prazo.
- **Inatividade de 12 meses**: mais conservador, porém um álbum de Copa é
  colecionado em temporadas — apagaria quem só volta na edição seguinte.
- **Publicar CPF e endereço do controlador**: máxima formalidade,
  desproporcional — exporia dados pessoais do próprio controlador numa
  página pública, e a lei pede identidade e canal, não qualificação
  completa.
- **Atender pedidos de qualquer e-mail**: mais cômodo para o titular,
  mas abriria a porta para um terceiro obter dados alheios.
