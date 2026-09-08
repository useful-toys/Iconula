<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Persistência no Firebase

Como os dados do usuário são gravados e lidos no Cloud Firestore —
modelo, mecânica, segurança e custos. As decisões de fundo vivem nos
registros: [ADR 0007](adr/0007-persistencia-do-time-no-firestore.md)
(infraestrutura e política da era do botão),
[IDR 0002](idr/0002-avisos-de-sincronizacao-visiveis.md) e
[IDR 0003](idr/0003-gravacao-agrega-ajustes.md) (comportamento de
sincronização do produto novo) e [requisitos.md](requisitos.md)
(Estado da sincronização).

## Onde os dados vivem

- Projeto Firebase `iconula`, banco Firestore `(default)`, modo Native,
  região `southamerica-east1` (São Paulo), faixa gratuita confirmada no
  plano Spark, sem conta de faturamento vinculada
- Um documento por usuário: `users/{uid}` — o uid no caminho é o que
  torna a autorização uma comparação direta nas regras, sem consulta e
  sem índice
- Fora isso, só a identidade Google (nome, e-mail, foto) — que mora no
  Firebase Auth, não no Firestore; nenhum outro dado de usuário existe

## Implementado hoje (era do botão)

`users/{uid} → { teamName: "Brazil" }`

- Escrita fire-and-forget a cada clique, sem debounce
- SDK do Firestore carregado sob demanda (`import()` dinâmico em
  `src/lib/userPreferences.js`) — o bundle principal não cresce para
  quem não faz login
- Falha de persistência invisível: vira `console.error`, nunca chega à
  tela

## Especificado para o controle de figurinhas

- `users/{uid}` passa a carregar a coleção: contagens por código de
  figurinha (`BRA05`, `FWC12`, `COC03`) — **schema pendente** (mapa de
  contagens no documento vs. subcoleção), decisão que exige ADR novo
  revisando o 0007
- Carimbo `updatedAt`: o cabeçalho exibe a data/hora da última
  alteração gravada — reverte a escolha do ADR 0007 ("sem updatedAt"),
  que valia quando não havia leitor para o carimbo
- Gravações agregam ajustes (IDR 0003): relativamente rápidas, sem
  escrita por clique; a garantia de flush ao fechar a página fica no
  ADR do schema
- Eventos notificados na tela (IDR 0002): gravado, carregado, falha —
  a falha não trava a interface e a gravação seguinte regrava o valor
  completo
- Apagar meus dados: apaga `users/{uid}` e a conta de login — exige
  autorizar `delete` nas regras
- Campo `teamName` da era do botão: manter, ignorar ou remover —
  pendência em requisitos.md

## Regras de segurança

`firestore.rules` é a única garantia de isolamento entre usuários: o
bundle é público e qualquer requisição pode ser forjada — a autorização
é avaliada no servidor, contra o ID token. Cobertura por testes no
emulador (`npm run test:rules`) rodando no CI a cada PR, e deploy pelo
próprio `firebase deploy` (TDR 0008).

O que muda com o produto novo:

- `hasOnly(["teamName"])` não vale mais: contagens e `updatedAt` exigem
  schema novo — e as regras precisam subir antes ou junto com o código
  que escreve os campos (acoplamento schema × regras, ADR 0007)
- `delete` precisa ser autorizado para "apagar meus dados" — hoje é
  negado por não ser operação do app
- `get` continua a única leitura; `list` segue negado

App Check segue de fora, com gatilho de revisão já registrado no
ADR 0007 (abuso de cota ou migração para o Blaze).

## Custos e cotas

- Plano Spark (gratuito): esgotada a cota diária (~20 mil escritas/dia),
  as requisições falham até o dia seguinte — a política de erro mantém
  o app utilizável
- Volume estimado: 1 leitura de documento por login; escritas agregadas
  (IDR 0003) — a era "uma escrita por clique" consumiria cota à toa em
  sessões de registro em rajada
- Região: `southamerica-east1` tem faixa gratuita; no Blaze é mais cara
  por operação que `us-*` — gatilho de revisão se o projeto vincular
  faturamento (ADR 0007)

## Pronto × falta

| Pronto (na main) | Falta (implementação do produto novo) |
|---|---|
| Banco criado (região, Spark) | ADR do schema (mapa vs. subcoleção) |
| `users/{uid}` + regras + testes no CI | Regras novas (schema, `updatedAt`, `delete`) |
| SDK sob demanda + CSP (TDR 0007) | Escrita agregada, flush, `updatedAt` |
| Deploy das regras (TDR 0008) | Migração do `teamName` |

## Futuro

Consulta sem rede (cache local do SDK) e sincronização ao vivo entre
dispositivos (`onSnapshot`) — futuros registrados em requisitos.md; o
segundo mudaria o modelo de leitura, hoje uma carga por login.
