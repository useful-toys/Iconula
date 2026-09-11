<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0007-0002]: carga no login e relógio do título

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — o mapa esparso, o cache local e o que a carga traz
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` § Decisão — a carga **não** move o relógio; documento sem carimbo exibe travessão; a data acompanha a hora quando o carimbo não é de hoje
- `docs/persistencia.md` § Operações sobre o formato — carregar é 1 leitura de `users/{uid}`
- `docs/adr/0007-persistencia-do-time-no-firestore.md` § Decisão — o SDK do Firestore sob demanda e o desenho de estado no React (efeito por `uid`, não pelo objeto `user`)
- `docs/requisitos.md` § Requisitos Não Funcionais — uma leitura por login, nenhuma requisição por figurinha
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — "carregado" é aviso de sucesso

## Objetivo
Trazer a coleção do Firestore para a tela ao entrar: uma leitura por login,
alimentando o mapa esparso em memória e o relógio do título com o `updatedAt`
gravado no documento.

## Padrões e convenções aplicáveis
- **Uma** leitura por login; nenhuma requisição por figurinha —
  `docs/requisitos.md` § Requisitos Não Funcionais e `docs/persistencia.md`
- O SDK do Firestore continua carregado sob demanda por `import()` dinâmico; o
  `firebase.js` **não** o importa — `docs/adr/0007-*` § Decisão
- A carga roda num efeito que depende de **`uid`**, não do objeto `user`, que muda
  a cada refresh de token — `docs/adr/0007-*` § Decisão
- Uma carga bem-sucedida **não** move o relógio: ela traz o `updatedAt` que
  estiver gravado — `docs/idr/0027-*` § Decisão
- Documento sem `updatedAt` exibe travessão; o formato mostra data quando o
  carimbo não é de hoje — `docs/idr/0027-*` § Decisão
- Cache local do SDK: `persistentLocalCache` com `persistentMultipleTabManager()`,
  que **não** é opcional — `docs/adr/0008-*` § Decisão

## Escopo e instruções de implementação
1. Criar o módulo de persistência da coleção em `src/lib/`, no lugar do
   `userPreferences.js` removido na Fase 2, com `import()` dinâmico memoizado do
   `firebase/firestore` e `getFirestore(app)` por dentro.
2. Inicializar o Firestore com `persistentLocalCache` e
   `persistentMultipleTabManager()` — é o que sustenta o flush da Tarefa 0007-0003
   e a segunda aba.
3. Carregar `users/{uid}` uma vez por login, devolvendo um resultado discriminado
   (encontrado / vazio / erro / indisponível) — o módulo **nunca lança**.
4. Alimentar o estado da coleção com o mapa lido; documento vazio é o fluxo normal
   do primeiro login e não é erro.
5. Alimentar o relógio do cabeçalho com o `updatedAt` lido, formatado conforme o
   IDR 0027: hora sozinha no mesmo dia, data junto quando não for de hoje,
   travessão quando não houver carimbo.
6. Emitir aviso de sucesso "carregado" e, em falha de leitura, aviso de falha com
   o detalhe técnico — usando a área da Tarefa 0007-0001.
7. Repetir a proteção de corrida do ADR 0007 adaptada ao produto novo: se o
   usuário já ajustou contagens enquanto a leitura estava em voo, a resposta do
   servidor não pode sobrescrever o que ele acabou de fazer.
8. Testes mockando `firebase/firestore` (o `vi.mock` intercepta import dinâmico):
   carga popula a coleção e o relógio; documento vazio não é erro; falha de
   leitura mantém a tela utilizável e emite a falha.

**Fora do escopo**: qualquer escrita (Tarefas 0007-0003 e 0007-0004); a guarda de
login (Fase 8); sincronização ao vivo, que é requisito futuro.

## Decisões já tomadas (não reabrir)
- Uma leitura por login; `onSnapshot` é futuro e mudaria o modelo — ver `docs/persistencia.md` § Futuro
- O relógio é o `updatedAt` do documento e a carga não o move — ver `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`
- SDK sob demanda, para não pesar o bundle de quem não entra — ver `docs/adr/0007-persistencia-do-time-no-firestore.md`
- Cache local com gerenciador multi-aba obrigatório — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- A política de erro invisível do ADR 0007 foi revista: falha aparece na tela — ver `docs/idr/0002-*` e `docs/idr/0029-*`

## Decisões em aberto nesta tarefa
- Como resolver a corrida entre a leitura em voo e ajustes já feitos —
  encaminhamento: descartar a resposta do servidor se houve ajuste depois do
  início da leitura, na linha do contador do ADR 0007; nasce um **TDR**
- Formato exato da data quando o carimbo não é de hoje — encaminhamento: forma
  curta em PT-BR, sem segundos; consta no mesmo TDR

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
- `src/lib/colecaoRemota.js` — criar
- `src/lib/colecaoRemota.test.js` — criar
- `src/lib/firebase.js` — modificar (se a inicialização do cache exigir)
- `src/components/Cabecalho.jsx` — modificar (relógio real)
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] Entrar dispara exatamente uma leitura de `users/{uid}`
- [ ] O bundle principal não passa a importar `firebase/firestore` estaticamente
- [ ] A coleção lida aparece na tela e no placar
- [ ] O relógio exibe o `updatedAt` do documento; sem carimbo, exibe `—`
- [ ] Uma carga bem-sucedida não altera o valor do relógio para "agora"
- [ ] Documento vazio não gera falha; falha de leitura gera aviso vermelho com detalhe
- [ ] Ajuste feito durante a leitura não é sobrescrito pela resposta do servidor
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0002-log-carga-no-login-e-relogio-do-titulo.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real (não `npm run dev`): completar o login e
conferir na aba Network que há **uma** requisição de leitura ao Firestore e
nenhuma violação de CSP — os headers do `firebase.json` só existem no Hosting
(TDR 0007). Conferir também o tamanho do bundle no `npm run build`.
