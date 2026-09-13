<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0005: Persistência no Cloud Firestore

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) hospedada no Firebase Hosting (ver [ADR 0003](0003-firebase-hosting.md)).
- Login com Google via Firebase Auth (ver [ADR 0004](0004-login-google-sdk-modular.md)) autenticava, mas não guardava dado algum.
- Pedido: persistir dados do usuário logado entre dispositivos e sessões.
- Projeto sem banco de dados algum, nem Firestore nem Realtime Database.
- O produto evoluiu do "time visível" (uma string) para a coleção de figurinhas (994 contagens).

## Decisão

### Serviço

**Cloud Firestore**, banco `(default)`, modo Native.

### Infraestrutura

**Persistência é feature opcional.** Sem as `VITE_FIREBASE_*`, `src/lib/firebase.js` exporta `app = null` e a persistência simplesmente não acontece — o app continua funcionando. Nenhuma variável de ambiente nova é necessária; o Firestore reusa a config do mesmo Web App.

**O SDK do Firestore é carregado sob demanda.** `src/lib/firebase.js` **não** importa `firebase/firestore`. Quem o importa é `src/lib/colecaoRemota.js`, com `import()` dinâmico memoizado.

Com o import estático, o bundle principal saltava de **363 KB para 794 KB** — mais que o dobro. Servir 430 KB a mais para *todo* visitante, quando só quem faz login grava alguma coisa, contradiz diretamente o que o ADR 0004 estabeleceu como valor do projeto.

Com o carregamento tardio, o bundle principal fica em **366,70 KB** (+1%) e o Firestore vai para um chunk separado de 554,85 KB, ausente do `index.html` e baixado só quando a persistência entra em ação.

**Política de erro.** `src/lib/colecaoRemota.js` **nunca lança**. Devolve um resultado discriminado (`encontrado` / `vazio` / `erro` / `indisponivel`); offline, `permission-denied` e `resource-exhausted` caem todos no mesmo `catch`. As mensagens de log não incluem uid nem dados do usuário.

**Segurança: a `apiKey` exposta não é um vazamento.** As `VITE_FIREBASE_*` vão para o bundle e são visíveis a qualquer visitante — isso é por desenho, não descuido, e já estava documentado em [docs/firebase.md](../firebase.md). **A `apiKey` identifica o projeto, não autentica ninguém**. A credencial é o ID token emitido pelo Firebase Auth, e o isolamento entre usuários é responsabilidade exclusiva das regras do Firestore, avaliadas no servidor.

Consequência prática: a garantia de isolamento **não pode** depender do código cliente, que é público e substituível por qualquer requisição forjada. Ela vive em `firestore.rules` e é comprovada por testes automatizados no emulador, rodando no CI a cada PR — ver [DDR 0004](../devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md).

**Região e faixa gratuita.** Banco criado em **`southamerica-east1`** (São Paulo).

**Resolvido empiricamente: a faixa gratuita vale nesta região.** Depois de criado, o próprio recurso devolvido pela API do Google traz o campo `freeTier: true`.

O que procede da objeção independentemente: **no plano Blaze, São Paulo é materialmente mais caro** por operação e por GiB que `us-central1`. Hoje isso é inócuo porque o projeto está no **Spark, sem conta de faturamento vinculada** — sem conta vinculada não há como cobrar; esgotada a cota diária, as requisições falham até o dia seguinte.

**Gatilho de revisão**: se o projeto vier a vincular conta de faturamento (Blaze), a região volta a ser variável de custo real e deve ser reavaliada.

**App Check fica de fora, por ora.** O App Check defende contra uso da API por clientes fora do app (abuso de cota), **não** contra um usuário ler dados de outro — isso são as regras. Sem valor prático hoje.

**Gatilho de revisão**: se aparecer abuso de cota, ou se o projeto for para o Blaze, reavaliar.

### Aplicação à coleção de figurinhas

**Modelo de dados.** Os detalhes do modelo de dados (localização do documento, schema, mecanismo de gravação) estão nos [MDRs](../model-dr/):

- Localização do documento: [MDR 0001](../model-dr/0001-localizacao-do-documento-no-firestore.md)
- Schema do documento: [MDR 0002](../model-dr/0002-schema-do-documento-da-colecao.md)
- Gravação agregada: [MDR 0003](../model-dr/0003-gravacao-agregada-da-colecao.md)
- Persistência no armazenamento local: [MDR 0007](../model-dr/0007-persistencia-no-armazenamento-local.md)

**Política de erro visível.** Falha notificada na tela (IDR 0017), a interface segue utilizável, a gravação seguinte regrava o valor completo.

**Sessões simultâneas.** Sem tratamento — a última gravação vence.

## Consequências

- **O login passa a ter utilidade concreta.** Era a lacuna aberta pelo ADR 0004 (login sem persistência).
- **O bundle principal praticamente não cresce**, graças ao carregamento tardio: 363,09 KB → **366,70 KB** (+1%). O chunk do Firestore (554,85 KB) só é baixado por quem faz login.
- **A CSP ganha uma origem** em `connect-src` — ver [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md).
- **O projeto passa a ter regras de segurança para manter**, com deploy próprio e testes próprios — ver [DDR 0004](../devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md).
- **Um `firebase deploy` sem `--only`** passa a publicar regras além do Hosting.
- **Cota:** 1 leitura por login (e menos, servindo do cache local); 1 escrita por agregação; +1 escrita única de atestação por conta; import = 1 escrita — folga grande na cota do Spark.
- **Sincronização ao vivo (futuro)** trocará o modelo de leitura — gatilho de revisão deste ADR.

## Alternativas consideradas

- **`localStorage`**: mais simples, sem rede, sem regras, sem custo. Não atende ao pedido — não acompanha o usuário entre dispositivos nem entre navegadores. Continua sendo a escolha certa para conveniências por dispositivo (preferências de vista).
- **Realtime Database**: latência menor e modelo mais simples, mas árvore JSON única em vez de armazenamento estruturado, e exigiria abrir `wss:` na CSP (o SDK do RTDB usa WebSocket; o do Firestore não — ver [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md)). Descartado.
- **Subcoleção `users/{uid}/contagens/{código}`**: uma escrita por figurinha (cota em rajada), leitura em query, regras por subcaminho — só compensaria se a coleção não coubesse num documento. Decisão de modelagem detalhada no [MDR 0002](../model-dr/0002-schema-do-documento-da-colecao.md).
