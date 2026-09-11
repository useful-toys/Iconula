<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0007-0005]: política de erro visível ponta a ponta

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0002-avisos-de-sincronizacao-visiveis.md` § Decisão — a falha não trava a interface; a gravação seguinte regrava o valor completo
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — sem rede a escrita não resolve; tempo-limite de ~5s emite o **aviso** "sem conexão, será gravado depois"
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — a gravação sem rede enfileirada é **aviso**, não falha; a falha é o que deveria ter funcionado
- `docs/idr/0017-aviso-so-na-falha-com-detalhe-tecnico.md` § Decisão — o detalhe técnico ao toque
- `docs/requisitos.md` § Contagem — falha de persistência não bloqueia o ajuste; a gravação seguinte regrava o valor completo
- `docs/persistencia.md` § Operações sobre o formato — o parágrafo sobre a escrita enfileirada no cache local
- `docs/adr/0007-persistencia-do-time-no-firestore.md` § Decisão — a política de erro antiga (falha invisível), que este produto revê

## Objetivo
Fechar o comportamento do app quando a gravação não vai bem: a tela continua
editável, a mensagem certa aparece com a severidade certa, e a gravação seguinte
conserta sozinha. Sem rede não é falha — é espera.

## Padrões e convenções aplicáveis
- Falha **não trava** a interface: a tela segue editável e a gravação seguinte
  regrava o valor completo — `docs/idr/0002-*` § Decisão
- Sem rede, a promessa de escrita nunca resolve: um tempo-limite de ~5s emite
  **aviso** (dourado), não falha — `docs/adr/0008-*` § Decisão e `docs/idr/0029-*`
- Falha (vermelha) é para o que deveria ter funcionado: gravação ou carga —
  `docs/idr/0029-*` § Decisão
- A falha some quando a operação seguinte do mesmo tipo tem sucesso —
  `docs/idr/0029-*` § Decisão
- A política "sem `role="alert"`" do ADR 0007 **não vale** para este produto —
  `docs/idr/0002-*` § Consequências
- As mensagens falam na voz do usuário e cabem numa linha; o jargão fica no
  detalhe — `docs/interface.md` § Avisos
- Log sem uid nem dados do usuário — `docs/adr/0007-*` § Decisão

## Escopo e instruções de implementação
1. Classificar os desfechos da gravação e da carga: sucesso, falha (erro do
   servidor, permissão negada, cota esgotada, falha ao baixar o chunk do SDK) e
   espera (promessa pendente além de ~5s, sem rede).
2. Emitir a severidade correspondente pela área da Tarefa 0007-0001, com a
   mensagem em PT-BR na voz do usuário — "Alterações salvas", "Falha ao gravar —
   toque para detalhes", "Conexão instável — sincronizando quando possível" — e o
   erro original guardado no detalhe.
3. Depois de uma falha, a gravação seguinte **regrava o valor completo** das
   chaves alteradas desde a última gravação bem-sucedida, não só as mudadas
   depois da falha. A escrita é idempotente, então isso é seguro.
4. A tela nunca bloqueia: durante e depois de qualquer falha, ajustar continua
   funcionando e o placar continua reagindo.
5. Uma gravação bem-sucedida dispensa a falha de gravação que estiver na tela; o
   mesmo vale para a carga.
6. Nunca registrar uid ou conteúdo da coleção nos logs de console.
7. Testes: erro do servidor gera falha vermelha com detalhe; promessa pendente
   além do tempo-limite gera aviso dourado, e não falha; depois de falhar, a
   gravação seguinte inclui as chaves da tentativa anterior; sucesso dispensa a
   falha visível; a tela continua editável em todos esses casos.

**Fora do escopo**: sincronização ao vivo e merge de sessões, que são requisitos
futuros; consulta sem rede como funcionalidade — o cache local existe pelo flush,
não como feature offline.

## Decisões já tomadas (não reabrir)
- Falha informada e interface utilizável — ver `docs/idr/0002-avisos-de-sincronizacao-visiveis.md`
- Sem rede é aviso, não falha — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md` e `docs/idr/0029-*`
- Sessões simultâneas: a última gravação vence — ver `docs/requisitos.md` § Estado da sincronização
- Cota esgotada faz as requisições falharem até o dia seguinte, e o app continua utilizável — ver `docs/persistencia.md` § Custos e cotas

## Decisões em aberto nesta tarefa
- Texto exato de cada mensagem — encaminhamento: usar os exemplos de
  `docs/interface.md` § Avisos como redação final, e registrar no log qualquer
  desvio; nasce um **IDR** se as mensagens do MVP divergirem do que está lá
- O que fazer quando a espera se resolve depois do aviso (a rede volta) —
  encaminhamento: emitir o sucesso normalmente e deixar o aviso expirar; consta
  no mesmo registro, se houver

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/lib/colecaoRemota.js` — modificar
- `src/lib/gravacaoAgregada.js` — modificar
- `src/lib/gravacaoAgregada.test.js` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] Erro de servidor gera aviso vermelho persistente, com detalhe técnico ao toque
- [ ] Promessa pendente além de ~5s gera aviso dourado, não vermelho
- [ ] Depois de uma falha, a gravação seguinte regrava as chaves da tentativa anterior
- [ ] Sucesso dispensa a falha do mesmo tipo que estiver na tela
- [ ] Ajustar continua funcionando durante e depois de qualquer falha
- [ ] Nenhum log de console contém uid ou conteúdo da coleção
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0005-log-politica-de-erro-visivel.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real: com o DevTools em modo offline, ajustar uma
figurinha e conferir o aviso dourado após ~5s; voltar a rede e conferir o sucesso;
forçar uma escrita recusada (por exemplo com regra temporária no emulador) e
conferir a faixa vermelha com detalhe.
