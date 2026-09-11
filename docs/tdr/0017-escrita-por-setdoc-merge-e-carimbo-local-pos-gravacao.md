<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0017: Escrita por `setDoc` com merge e carimbo local pós-gravação

## Status

Aceito — desbloqueia a Tarefa 0007-0003, que deixava duas decisões
implícitas em aberto ao pé da letra do ADR 0008.

## Contexto

O ADR 0008 descreve a gravação agregada como um `updateDoc` com os caminhos
aninhados das chaves alteradas. Ao implementar a Tarefa 0007-0003, duas
lacunas de implementação apareceram:

1. **Criação do documento.** `updateDoc` exige que o documento já exista —
   falha com `not-found` caso contrário. Todo usuário que chegou à era do
   botão tem um documento (por causa do `teamName`), mas um usuário **novo**,
   que nunca gravou nada, ainda não tem `users/{uid}` na primeira vez que
   ajusta uma figurinha. As regras já previam isso (`allow create, update`
   tratados igualmente — TDR 0009), mas o ADR 0008 não resolveu qual chamada
   do SDK cobre os dois casos numa escrita só.
2. **Carimbo exibido após a gravação.** O IDR 0027 diz que o relógio mostra o
   `updatedAt` do servidor. `setDoc`/`updateDoc` com `serverTimestamp()` não
   devolvem o valor resolvido na resposta — só a confirmação de que a escrita
   aconteceu. Descobrir o carimbo exato exigiria uma leitura extra, que a RNF
   de "nenhuma leitura fora do login" (`docs/requisitos.md`) não permite.

## Decisão

- **`setDoc(ref, { contagens: {...}, updatedAt: serverTimestamp() }, { merge:
  true })`**, não `updateDoc`. A mesma chamada cria o documento na primeira
  gravação da conta e mescla o mapa `contagens` nas gravações seguintes, sem
  precisar descobrir antes se o documento existe (sem leitura extra). Dentro
  do mapa aninhado, cada chave recebe o valor absoluto ou `deleteField()` — o
  SDK oficialmente suporta `deleteField()` tanto com `update()` quanto com
  `set(..., { merge: true })`, então o comportamento de "chave zerada apaga a
  chave" (ADR 0008) continua igual.
- **`atualizadoEm` do resultado é `new Date()`** — o instante local do
  cliente no momento em que a promise de `setDoc` resolve (ou seja, depois de
  o servidor confirmar a escrita), não uma leitura do carimbo real. É uma
  aproximação aceita: o relógio do título já tolera essa diferença de
  segundos, e o objetivo do IDR 0027 ("quando minha coleção foi salva pela
  última vez") continua atendido sem gastar uma leitura por gravação.

## Consequências

- Um usuário novo grava pela primeira vez sem nenhum tratamento especial de
  "documento não existe" no código — `gravarAlteracoes` é uma função só para
  os dois casos.
- O relógio do título, depois de uma gravação, pode divergir do `updatedAt`
  real do servidor por um intervalo pequeno (o tempo de rede da própria
  escrita) — imperceptível na prática e nunca em sentido "no futuro", já que
  só é exibido depois de a escrita ser confirmada.
- Se uma sincronização ao vivo (`onSnapshot`, gatilho de revisão do ADR 0008)
  entrar no futuro, o carimbo passa a vir do próprio servidor via listener, e
  esta aproximação local deixa de ser necessária.

## Alternativas consideradas

- **`updateDoc` com fallback para `setDoc` no erro `not-found`**: cobre os
  dois casos, mas dobra a chamada (e possivelmente a cota) no caminho mais
  comum de todos — o primeiro save de uma conta nova.
- **Ler o documento de volta após gravar, para pegar o `updatedAt` real**:
  reintroduz exatamente a leitura extra por gravação que a RNF de economia de
  requisições proíbe.
- **Guardar `atestadoEm`/criação do documento como responsabilidade de outro
  fluxo (ex.: no login)**: criaria uma escrita a mais só para inicializar o
  documento, sem necessidade — a própria primeira gravação agregada já
  resolve isso de graça.
