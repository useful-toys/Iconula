<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0007: Persistência do time visível no Cloud Firestore

## Status

Aceito.

## Contexto

Até aqui o login com Google ([ADR 0006](0006-login-google-sdk-modular.md))
não servia para nada: o app autenticava o usuário e não guardava nenhum
dado dele. O time visível vivia só em `useState` no `App.jsx`, então
recarregar a página sempre voltava para o primeiro time em ordem
alfabética. O [ADR 0005](0005-autenticacao-google-firebase-auth.md) já
registrava a persistência como passo futuro ("sem persistir nenhum dado
de usuário ainda").

O pedido: **gravar a bandeira visível sempre que o usuário logado clicar
no botão, e mostrar a última bandeira dele ao fazer login**. Deslogado, o
comportamento atual não muda — começa no primeiro time, avança a cada
clique, não grava nada.

O projeto não tinha nenhum banco de dados: nem Firestore, nem Realtime
Database. `firestore.googleapis.com` estava desabilitada e o
`firebase.json` só tinha o bloco `hosting`.

## Decisão

### Serviço e modelo de dados

**Cloud Firestore**, banco `(default)`, modo Native. Um documento por
usuário, com o uid no caminho:

```
users/{uid}  →  { teamName: "Brazil" }
```

- **Um único campo, sem `updatedAt`.** Não há leitor para um carimbo de
  tempo, e sua presença só alargaria o `hasOnly()` das regras de
  segurança sem contrapartida.
- **O uid no caminho, não num campo.** É o que torna a regra de
  segurança uma comparação direta (`request.auth.uid == userId`), sem
  consulta e sem índice.
- **Documento raiz por usuário**, não `users/{uid}/preferences/current`:
  preferências futuras entram como campos do mesmo documento, sem leitura
  adicional e sem dobrar a superfície das regras. A subcoleção continua
  possível depois, sem mover este documento.
- **Nenhuma query** ⇒ nenhum índice composto ⇒ nenhum
  `firestore.indexes.json`.

### Grava-se o nome do time, não o índice

O estado no React é um índice numérico em `sortedTeams`, mas o que vai
para o Firestore é o **nome** (`"Brazil"`). O índice é propriedade do
array atual, não do domínio: acrescentar um 49º time mudaria
silenciosamente o significado de todo índice já gravado. A conversão
nome↔índice acontece só nas bordas do `App.jsx` e é a única barreira
anticorrupção — um nome desconhecido (time removido ou renomeado em
`teams.js` desde a última gravação) cai no primeiro time em vez de virar
índice inválido.

### Persistência é feature opcional

Estende para o Firestore a propriedade que o ADR 0006 estabeleceu para o
Auth: sem as `VITE_FIREBASE_*`, `src/lib/firebase.js` exporta `app = null`
e a persistência simplesmente não acontece — o app continua funcionando.
Nenhuma variável de ambiente nova é necessária; o Firestore reusa a
config do mesmo Web App.

### O SDK do Firestore é carregado sob demanda

`src/lib/firebase.js` **não** importa `firebase/firestore`. Quem o
importa é `src/lib/userPreferences.js`, com `import()` dinâmico
memoizado, e é ele que chama `getFirestore(app)`.

Esta decisão foi tomada durante a implementação, ao medir: com o import
estático, o bundle principal saltava de **363 KB para 794 KB** — mais que
o dobro, e **maior que os 633 KB da era FirebaseUI** que o
[ADR 0006](0006-login-google-sdk-modular.md) tinha acabado de reduzir.
Servir 430 KB a mais para *todo* visitante, quando só quem faz login
grava alguma coisa, contradiz diretamente o que aquele ADR estabeleceu
como valor do projeto.

Com o carregamento tardio, o bundle principal fica em **366,70 KB**
(+3,6 KB, +1% sobre a base) e o Firestore vai para um chunk separado de
554,85 KB, ausente do `index.html` e baixado só quando a persistência
entra em ação. O custo é que `db` deixa de ser um `export` síncrono: o
módulo passa a expor `app` e a resolver o Firestore por dentro.

Efeito colateral favorável: uma falha ao baixar o chunk cai no mesmo
`catch` das outras falhas de persistência, então já está coberta pela
política de erro acima.

### Política de erro: falha de persistência nunca chega à tela

`src/lib/userPreferences.js` **nunca lança**. Devolve um resultado
discriminado (`found` / `empty` / `error` / `unavailable`); offline,
`permission-denied` e `resource-exhausted` caem todos no mesmo `catch`,
viram `console.error` e mantêm a bandeira que está na tela.

Deliberadamente **sem `role="alert"`**, ao contrário do
`LoginButton.jsx`: um login que falha bloqueia uma ação que o usuário
pediu e merece retorno visível; uma gravação de fundo que falha, não —
um banner de erro num app de um botão só seria pior que a preferência
perdida.

`empty` e `error` levam ao mesmo comportamento, mas são distinguidos na
origem: `empty` é o fluxo normal do primeiro login e não é defeito
nenhum; só `error` vai para o console. As mensagens de log não incluem
uid nem dados do usuário.

### Desenho de estado no React

- `index` continua sendo a fonte da verdade (o wrap-around é nativo de
  índice e o `TeamButton` já recebe `sortedTeams[index]`).
- A carga roda num efeito que depende de **`uid`, não do objeto `user`** —
  o `onAuthStateChanged` entrega uma instância nova a cada refresh de
  token, e o objeto como dependência relançaria a leitura à toa.
- **A escrita mora só no handler do clique**, nunca num efeito sobre
  `index`: um efeito também dispararia no `setIndex` da carga,
  devolvendo ao Firestore o valor que acabou de vir dele.
- A escrita fica **fora** do updater de `setIndex`, porque o StrictMode
  invoca updaters duas vezes em desenvolvimento — dentro, seriam duas
  gravações por clique.
- Um **contador de cliques** (`useRef`) desempata a corrida entre a
  leitura assíncrona e o usuário clicando enquanto ela está em voo: se o
  contador mudou, a resposta do servidor é descartada. Precisa ser
  contador com snapshot, e não um booleano "já interagiu" — senão um
  clique dado *antes* do login impediria a carga para sempre.

### Segurança: a `apiKey` exposta não é um vazamento

As `VITE_FIREBASE_*` vão para o bundle e são visíveis a qualquer
visitante — isso é por desenho, não descuido, e já estava documentado em
[docs/firebase.md](../firebase.md). Vale reafirmar aqui porque agora há
dados de usuário em jogo: **a `apiKey` identifica o projeto, não
autentica ninguém**. A credencial é o ID token emitido pelo Firebase
Auth, e o isolamento entre usuários é responsabilidade exclusiva das
regras do Firestore, avaliadas no servidor. Conhecer a `apiKey` não
permite ler o documento de outra pessoa.

Consequência prática: a garantia de isolamento **não pode** depender do
código cliente, que é público e substituível por qualquer requisição
forjada. Ela vive em `firestore.rules` e é comprovada por testes
automatizados no emulador, rodando no CI a cada PR — ver
[TDR 0008](../tdr/0008-deploy-e-teste-das-regras-do-firestore.md).

### Região e faixa gratuita

Banco criado em **`southamerica-east1`** (São Paulo).

**Resolvido empiricamente: a faixa gratuita vale nesta região.** Depois de
criado, o próprio recurso devolvido pela API do Google traz o campo
`freeTier: true`:

```bash
$ gcloud firestore databases describe --database='(default)' --project=iconula \
    --format="value(freeTier,locationId)"
True    southamerica-east1
```

Isso encerra uma divergência levantada durante o planejamento: a de que a
faixa gratuita do Firestore só valeria em `us-central1`, `us-east1` e
`us-west1`, e que São Paulo cobraria desde o primeiro byte. A pesquisa em
documentação já apontava nessa direção, e a API confirmou. As fontes,
para quem precisar refazer o raciocínio:

- [Google Cloud Free Program](https://cloud.google.com/free/docs/free-cloud-features):
  a restrição existe e está escrita — para o **Cloud Storage** ("The Free
  Tier benefits for Cloud Storage apply only to usage in the `us-east1`,
  `us-west1`, and `us-central1`"). A entrada do Firestore na mesma página
  lista a cota sem restrição geográfica.
- [Preços do Firebase](https://firebase.google.com/pricing): a nota
  "No-cost quotas are only available for buckets in the following
  regions…" aparece no Cloud Storage e não tem equivalente no Firestore.
- [Locations](https://firebase.google.com/docs/firestore/locations) e
  [quotas](https://firebase.google.com/docs/firestore/quotas) do
  Firestore não mencionam restrição de região para a cota gratuita.

A regra das três regiões `us-*` é do **Cloud Storage** — as duas notas
ficam lado a lado na mesma página de preços, o que explica a confusão.

O que procede da objeção independentemente: **no plano Blaze, São Paulo é
materialmente mais caro** por operação e por GiB que `us-central1`. Hoje
isso é inócuo porque o projeto está no **Spark, sem conta de faturamento
vinculada** (`billingEnabled: false`) — sem conta vinculada não há como
cobrar; esgotada a cota diária, as requisições falham até o dia seguinte,
e a política de erro acima garante que o app continue funcionando.

**A escolha de região não é uma porta de mão única.** Bancos Firestore
podem ser apagados (`gcloud firestore databases delete --database='(default)'`,
com exemplo explícito para o banco default na ajuda do comando), então
trocar de região é apagar e recriar. O custo é perder o que estiver
gravado — hoje, nada. Não existe `--dry-run` para
`gcloud firestore databases create`, em nenhum dos dois CLIs; a
reversibilidade acima é o que cobre esse papel.

**Gatilho de revisão**: se o projeto vier a vincular conta de faturamento
(Blaze), a região volta a ser variável de custo real e deve ser
reavaliada — inclusive migrar para uma região `us-*`, que a essa altura
já teria dados de usuário a preservar.

### App Check fica de fora, por ora

O App Check defende contra uso da API por clientes fora do app (abuso de
cota), **não** contra um usuário ler dados de outro — isso são as regras.
Sem valor prático hoje, e exigiria reCAPTCHA mais novas exceções de CSP e
um token de debug para dev/preview.

**Gatilho de revisão**: se aparecer abuso de cota, ou se o projeto for
para o Blaze (quando abuso de cota vira custo real), reavaliar.

## Consequências

- **O login passa a ter utilidade concreta.** Era a lacuna aberta pelo
  ADR 0005.
- **O bundle principal praticamente não cresce**, graças ao carregamento
  tardio: 363,09 KB → **366,70 KB** (+1%). O chunk do Firestore
  (554,85 KB / 161,91 KB gzip) só é baixado por quem faz login. Medido
  com `npm run build`:

  | | Antes | Import estático | Import dinâmico (adotado) |
  |---|---|---|---|
  | Bundle principal | 363,09 KB | 794,42 KB | **366,70 KB** |
  | Chunk sob demanda | — | — | 554,85 KB |

  A propriedade que o ADR 0006 defendeu — não penalizar quem só quer ver
  a bandeira — fica preservada.
- **`db` não é mais um `export` síncrono.** `src/lib/firebase.js` exporta
  `app`, e quem precisa do Firestore resolve a instância por dentro do
  `userPreferences.js`. Os testes mockam `firebase/firestore` normalmente
  (o `vi.mock` intercepta import dinâmico igual ao estático), mas um
  módulo futuro que queira o Firestore precisa passar pelo mesmo caminho,
  em vez de importar `db`.
- **A CSP ganha uma origem** em `connect-src` — ver
  [TDR 0007](../tdr/0007-csp-para-o-firestore.md).
- **O projeto passa a ter regras de segurança para manter**, com deploy
  próprio e testes próprios — ver
  [TDR 0008](../tdr/0008-deploy-e-teste-das-regras-do-firestore.md).
- **`hasOnly(["teamName"])` acopla schema a deploy de regras**: qualquer
  campo novo exige que as regras subam antes ou junto com o código que o
  escreve. É o preço de impedir que um usuário autenticado use o próprio
  documento como armazenamento livre.
- **Um `firebase deploy` sem `--only`** passa a publicar regras além do
  Hosting.
- **Escritas não têm debounce**, por decisão explícita: um `setDoc` por
  clique. Fiel ao pedido e mais simples de testar. Bater no limite de 20
  mil escritas/dia exigiria ~20 mil cliques do mesmo usuário num dia; se
  isso deixar de ser hipotético, o debounce é a primeira mitigação.

## Alternativas consideradas

- **`localStorage`**: mais simples, sem rede, sem regras, sem custo. Não
  atende ao pedido — não acompanha o usuário entre dispositivos nem entre
  navegadores, que é exatamente o ponto de amarrar a preferência ao
  login. Continua sendo a escolha certa para conveniências por
  dispositivo (um tema, um filtro), se aparecerem.
- **Realtime Database**: latência menor e modelo mais simples, mas árvore
  JSON única em vez de armazenamento estruturado, e exigiria abrir `wss:`
  na CSP (o SDK do RTDB usa WebSocket; o do Firestore não — ver
  [TDR 0007](../tdr/0007-csp-para-o-firestore.md)). Descartado.
- **Gravar o índice numérico** em vez do nome: espelharia o estado do
  `App.jsx` sem conversão, mas passaria a apontar para outro time se
  `teams.js` fosse reordenado ou alterado.
- **`users/{uid}/preferences/current` (subcoleção)** e
  **`teamSelections/{uid}`**: dois segmentos de caminho para um campo, ou
  uma coleção nomeada por feature que fragmentaria os dados do usuário
  conforme a SPA crescer.
- **Allow-list dos 48 nomes nas regras** em vez de `size() <= 64`:
  validaria melhor, mas exigiria deploy de regras a cada mudança em
  `teams.js`.
- **Debounce nas escritas** (~1s): protegeria a cota, mas adiciona timer,
  cleanup e um caso de borda (sair da página antes do debounce disparar
  perde a última gravação). Rejeitado por ora — ver Consequências.
