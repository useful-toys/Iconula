<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Persistência no Firebase

Como os dados do usuário são gravados e lidos no Cloud Firestore — segurança, custos e estado atual. O modelo de dados está em [modelo-firebase.md](modelo-firebase.md); as decisões de modelagem estão nos [MDRs](mdr/). As decisões de infraestrutura vivem no [ADR 0005](adr/0005-persistencia-no-firestore.md). O comportamento de sincronização está nos [IDR 0002](idr/0002-avisos-de-sincronizacao-visiveis.md) e [IDR 0003](idr/0003-gravacao-agrega-ajustes.md).

## Onde os dados vivem

- Projeto Firebase `iconula`, banco Firestore `(default)`, modo Native, região `southamerica-east1` (São Paulo), faixa gratuita confirmada no plano Spark, sem conta de faturamento vinculada
- Um documento por usuário: `users/{uid}` — o uid no caminho é o que torna a autorização uma comparação direta nas regras, sem consulta e sem índice ([MDR 0001](mdr/0001-localizacao-do-documento-no-firestore.md))
- Fora isso, só a identidade Google (nome, e-mail, foto) — que mora no Firebase Auth, não no Firestore; nenhum outro dado de usuário existe

### O que **não** vai para o Firestore

- **Preferências de vista** — ordenação, disposição e filtro — vivem no `localStorage` do navegador, por dispositivo, e custam zero requisição ([IDR 0026](idr/0026-preferencias-de-vista-persistidas-no-navegador.md), [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md))
- **Estado de colapso** de seções e super-grupos é volátil: some ao recarregar ([IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))
- **Histórico de desfazer** (últimas 10 alterações) vive em memória ([IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- **Cache do SDK** (IndexedDB, `persistentLocalCache` com `persistentMultipleTabManager()`) espelha o documento e sustenta o flush de gravações pendentes ([MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md))

## Modelo de dados

Ver [modelo-firebase.md](modelo-firebase.md) para o formato do documento, o mecanismo de gravação, as operações e o que não vai para o Firestore.

As decisões de modelagem estão nos MDRs:

- [MDR 0001](mdr/0001-localizacao-do-documento-no-firestore.md) — localização do documento
- [MDR 0002](mdr/0002-schema-do-documento-da-colecao.md) — schema do documento
- [MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md) — gravação agregada
- [MDR 0004](mdr/0004-formato-de-intercambio-da-colecao.md) — formato de intercâmbio (export/import)
- [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md) — persistência no armazenamento local

## Regras de segurança

`firestore.rules` é a única garantia de isolamento entre usuários: o bundle é público e qualquer requisição pode ser forjada — a autorização é avaliada no servidor, contra o ID token. Cobertura por testes no emulador (`npm run test:rules`) rodando no CI a cada PR, e deploy pelo próprio `firebase deploy` (DDR 0004).

O que está publicado:

- `allow get` apenas do próprio documento (`request.auth.uid == userId`), com `get` — nunca `read` — para que uma query na coleção `users` não seja avaliada; `list` segue negado
- `allow create, update` apenas do próprio documento, exigindo `hasOnly(["contagens", "updatedAt", "atestadoEm"])`
- `contagens` é `map` com `size() <= 994` e `values().hasOnly([1…99])` — o teto de 99 é o que torna os valores validáveis, e toda cláusula sobre `contagens` fica sob a guarda de campo ausente (`!("contagens" in …) || …`), senão a regra erra em vez de negar (TDR 0009)
- `updatedAt == request.time` quando presente (e obrigatório sempre que `contagens` é escrito); `atestadoEm is timestamp` quando presente — é o que deixa a gravação da atestação criar o documento só com `atestadoEm`
- **allow-list das chaves não entrou**: gerada a partir do catálogo e medida, a cláusula `contagens.keys().hasOnly([994 códigos])` compila (ruleset de ~14,7 KB, abaixo do limite de 256 KB), mas a avaliação estoura o limite de 1.000 expressões por requisição — até para uma chave única. As chaves seguem limitadas só em quantidade (`size() <= 994`), não em conteúdo (TDR 0009)
- `delete` segue negado — "apagar meus dados" saiu do MVP (requisito futuro em requisitos.md; quando voltar, exigirá re-autenticação e autorização nova nas regras)
- sem regra catch-all: o resto é negado por padrão

**A linguagem de regras não itera**: não há como aplicar um regex a cada chave nem uma condição a cada valor — só comparação de conjunto contra listas escritas à mão. O que isso permite, o que não permite e o teto de abuso que sobra (1 MiB por conta) estão no [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md).

App Check segue de fora, com gatilho de revisão já registrado no ADR 0005 (abuso de cota ou migração para o Blaze).

## Custos e cotas

- Plano Spark (gratuito): ~50 mil leituras e ~20 mil escritas por dia; esgotada a cota, as requisições falham até o dia seguinte — a política de erro mantém o app utilizável
- Custo por operação:

| Ação | Operações cobradas |
|---|---|
| Login (carga) | 1 leitura; com o cache local (IndexedDB), cargas repetidas podem servir do cache — leitura só quando o servidor é consultado |
| Ajustes em rajada | 1 escrita por agregação — debounce de ~2s, no máximo 1 escrita a cada ~10s de atividade contínua |
| Chegar a 0 | vai na escrita da agregação (`deleteField` conta como escrita, não como exclusão) |
| Atestação de menores | 1 escrita na vida da conta |
| Import JSON | 1 escrita (substitui `contagens` + `updatedAt`) |
| Export JSON, texto WhatsApp, desfazer | 0 — leem o estado em memória |
| Trocar ordenação, disposição ou filtro | 0 — preferência de vista vai para o `localStorage` (IDR 0026) |

- Teto estimado: um usuário pesado (1 h/dia registrando sem parar) ≈ 360 escritas/dia — a cota comporta dezenas de usuários pesados simultâneos; leituras (1 por login) são irrelevantes
- O risco de cota vem dos futuros, não do MVP: sincronização ao vivo (`onSnapshot` — cada entrega cobrada como leitura, multiplicada por dispositivo) é o primeiro candidato; import usado como "salvar" é o segundo (import é substituição rara, não gravação) — gatilhos de revisão já no ADR 0005
- Região: `southamerica-east1` tem faixa gratuita; no Blaze é mais cara por operação que `us-*` — gatilho de revisão se o projeto vincular faturamento (ADR 0005)
- O lado de requisito é a RNF de economia de requisições em [requisitos.md](requisitos.md): uma leitura por login, escritas agregadas, nenhuma requisição por figurinha

## Pronto × falta

| Pronto (na main) | Falta |
|---|---|
| Banco criado (região, Spark), `users/{uid}` + regras + testes no CI | Confirmar em uso real os números do MDR 0003 (debounce ~2s, teto ~10s, timeout ~5s sem rede) — aceitos como ponto de partida, sem deploy com usuários reais disponível durante o plano (ver `arquitetura.md` § Pontos em aberto) |
| Regras publicadas (schema, `updatedAt`, `atestadoEm` — DDR 0004/TDR 0009) | — |
| SDK sob demanda + CSP (ADR 0005, DDR 0001) | — |
| Escrita agregada, flush, `updatedAt`, `atestadoEm` (MDR 0003, Fase 7) | — |
| Carga no login, atestação de menores e política de erro visível (Fase 7/8) | — |
| Export/import JSON, sem tocar o Firestore para export (Fase 9) | — |

O produto novo está implementado por completo; o único item em aberto é operacional (confirmação em uso real dos números do MDR 0003), não de código.

## Futuro

Consulta sem rede (cache local do SDK) e sincronização ao vivo entre dispositivos (`onSnapshot`) — futuros registrados em requisitos.md; o segundo mudaria o modelo de leitura, hoje uma carga por login.
