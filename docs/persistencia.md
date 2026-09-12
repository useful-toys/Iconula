<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Persistência no Firebase

Como os dados do usuário são gravados e lidos no Cloud Firestore —
formato dos dados, segurança e custos. As decisões de fundo vivem nos
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

### O que **não** vai para o Firestore

- **Preferências de vista** — ordenação, disposição e filtro — vivem no
  `localStorage` do navegador, por dispositivo, e custam zero requisição
  ([IDR 0026](idr/0026-preferencias-de-vista-persistidas-no-navegador.md))
- **Estado de colapso** de seções e super-grupos é volátil: some ao
  recarregar ([IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))
- **Histórico de desfazer** (últimas 10 alterações) vive em memória
  ([IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- **Cache do SDK** (IndexedDB, `persistentLocalCache` com
  `persistentMultipleTabManager()`) espelha o documento e sustenta o
  flush de gravações pendentes (ADR 0008)

## Formato dos dados

### Histórico: a bandeira do botão

```
users/{uid}
{
  "teamName": "Brazil"    // string, 1–64 caracteres
}
```

- Escrita fire-and-forget a cada clique (`setDoc` com merge), sem
  debounce; leitura de um documento no login
- SDK do Firestore carregado sob demanda (`import()` dinâmico em
  `src/lib/userPreferences.js`) — o bundle principal não cresce para
  quem não faz login
- Falha de persistência invisível: vira `console.error`, nunca chega à
  tela

### Vigente: a coleção de figurinhas

```
users/{uid}
{
  "contagens": {
    "BRA05": 3,           // código → unidades registradas
    "FWC12": 1,
    "COC03": 2
                          // chave ausente = contagem 0
  },
  "updatedAt": <timestamp>,  // carimbo do servidor
  "atestadoEm": <timestamp>  // quando atestou ser maior/autorizado
                             // (uma vez por conta — requisitos.md)
}
```

Regras do formato:

- **Chave = código da figurinha** — três letras da seção + dois
  dígitos (`BRA05`, `FWC12`, `COC03`), identidade imutável do catálogo
  (requisitos.md); nunca índice, nunca nome
- **Valor = contagem, inteiro ≥ 1** — o mapa é **esparso**: chave
  ausente significa contagem 0, e zeros nunca são gravados; o documento
  só cresce com o que o usuário tem
- **Contagem chegando a 0 = apagar a chave** do mapa (não gravar 0)
- **`updatedAt`** é carimbo **do servidor** (`serverTimestamp()`), não
  do relógio do cliente — carimbo da última escrita no documento, e é
  exatamente esse valor que o relógio do cabeçalho exibe
  ([IDR 0027](idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md)):
  a carga o traz, a gravação o move; reverte o "sem updatedAt" do
  ADR 0007, que valia quando não havia leitor para o carimbo
- **Tipos**: `contagens` é `map<string, int 1–99>`; o teto de 99 existe
  para que as regras consigam validar os valores — é a única forma, e a
  interface para o incremento nele
  ([TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md)). As **chaves** o
  cliente escreve como códigos do catálogo, mas nas regras elas se limitam
  só em quantidade (`size() <= 994`), não em conteúdo: a allow-list dos
  994 códigos foi medida e **não coube** no orçamento de expressões
  ([TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md))
- **Tamanho**: no pior caso (coleção completa), ~994 chaves de ~5
  caracteres — poucos KB, muito abaixo do limite de 1 MiB por documento
- **Nada além disso**: os únicos campos são `contagens`, `updatedAt` e
  `atestadoEm`; o `teamName` da era do botão é apagado na migração
  (primeira gravação do schema novo — ADR 0008)

### Formato físico: mapa no documento (ADR 0008)

Decidido: mapa esparso no documento `users/{uid}` — a coleção inteira
carrega numa leitura e a gravação agregada é uma única escrita (por
chaves alteradas). A subcoleção foi descartada: uma escrita por
figurinha e leitura em query, sem caber melhor — ~994 chaves ficam em
poucos KB. Detalhes (debounce, flush, migração) no
[ADR 0008](adr/0008-schema-da-colecao-mapa-esparso.md).

### Operações sobre o formato

| Operação | Efeito no documento |
|---|---|
| Carregar (login) | 1 leitura de `users/{uid}` → mapa inteiro no estado da tela |
| Ajustar (+1/−1) | gravação agregada com as chaves alteradas desde a última — valores absolutos ou `deleteField`, numa única escrita (ADR 0008) |
| Chegar a 0 (decremento) | apaga a chave do mapa |
| Atestação de menores | grava `atestadoEm`, uma única vez por conta |
| Importar JSON | **substitui** o campo `contagens` inteiro (sobrescreve, sem merge; normalizado — zeros viram chave ausente) + `updatedAt` |

Sem rede, a escrita não falha nem confirma: fica enfileirada no cache
local e a promise só resolve quando o servidor responde. Depois de ~5s a
tela emite o aviso "sem conexão, será gravado depois" (ADR 0008).

O comportamento de sincronização em volta do formato — gravação
agregada relativamente rápida, aviso flutuante na borda inferior a cada
resultado (IDR 0029: sucesso e aviso somem em 5s, a falha fica), o
`updatedAt` exibido no título, flush ao fechar a página — está nos
[IDRs 0002/0003](idr/0003-gravacao-agrega-ajustes.md); a garantia de
flush fica no ADR do schema.

Sessões simultâneas do mesmo usuário não são tratadas no MVP: a última
gravação vence e ajustes da outra sessão podem ser perdidos — decisão
consciente registrada em requisitos.md (merge é futuro).

## Regras de segurança

`firestore.rules` é a única garantia de isolamento entre usuários: o
bundle é público e qualquer requisição pode ser forjada — a autorização
é avaliada no servidor, contra o ID token. Cobertura por testes no
emulador (`npm run test:rules`) rodando no CI a cada PR, e deploy pelo
próprio `firebase deploy` (TDR 0008).

O que está publicado (schema novo):

- `allow get` apenas do próprio documento (`request.auth.uid == userId`),
  com `get` — nunca `read` — para que uma query na coleção `users` não
  seja avaliada; `list` segue negado
- `allow create, update` apenas do próprio documento, exigindo
  `hasOnly(["contagens", "updatedAt", "atestadoEm"])`
- `contagens` é `map` com `size() <= 994` e
  `values().hasOnly([1…99])` — o teto de 99 é o que torna os valores
  validáveis, e toda cláusula sobre `contagens` fica sob a guarda de
  campo ausente (`!("contagens" in …) || …`), senão a regra erra em vez
  de negar (TDR 0009)
- `updatedAt == request.time` quando presente (e obrigatório sempre que
  `contagens` é escrito); `atestadoEm is timestamp` quando presente — é o
  que deixa a gravação da atestação criar o documento só com `atestadoEm`
- **allow-list das chaves não entrou**: gerada a partir do catálogo e
  medida, a cláusula `contagens.keys().hasOnly([994 códigos])` compila
  (ruleset de ~14,7 KB, abaixo do limite de 256 KB), mas a avaliação
  estoura o limite de 1.000 expressões por requisição — até para uma
  chave única. As chaves seguem limitadas só em quantidade
  (`size() <= 994`), não em conteúdo (TDR 0009)
- `delete` segue negado — "apagar meus dados" saiu do MVP (requisito
  futuro em requisitos.md; quando voltar, exigirá re-autenticação e
  autorização nova nas regras)
- sem regra catch-all: o resto é negado por padrão

**A linguagem de regras não itera**: não há como aplicar um regex a cada
chave nem uma condição a cada valor — só comparação de conjunto contra
listas escritas à mão. O que isso permite, o que não permite e o teto de
abuso que sobra (1 MiB por conta) estão no
[TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md).

App Check segue de fora, com gatilho de revisão já registrado no
ADR 0007 (abuso de cota ou migração para o Blaze).

## Custos e cotas

- Plano Spark (gratuito): ~50 mil leituras e ~20 mil escritas por dia;
  esgotada a cota, as requisições falham até o dia seguinte — a política
  de erro mantém o app utilizável
- Custo por operação (schema do ADR 0008):

| Ação | Operações cobradas |
|---|---|
| Login (carga) | 1 leitura; com o cache local (IndexedDB), cargas repetidas podem servir do cache — leitura só quando o servidor é consultado |
| Ajustes em rajada | 1 escrita por agregação — debounce de ~2s, no máximo 1 escrita a cada ~10s de atividade contínua |
| Chegar a 0 | vai na escrita da agregação (`deleteField` conta como escrita, não como exclusão) |
| Atestação de menores | 1 escrita na vida da conta |
| Import JSON | 1 escrita (substitui `contagens` + `updatedAt`) |
| Export JSON, texto WhatsApp, desfazer | 0 — leem o estado em memória |
| Trocar ordenação, disposição ou filtro | 0 — preferência de vista vai para o `localStorage` (IDR 0026) |
| Migração do `teamName` | 1 escrita única por usuário da era do botão |

- Teto estimado: um usuário pesado (1 h/dia registrando sem parar) ≈
  360 escritas/dia — a cota comporta dezenas de usuários pesados
  simultâneos; leituras (1 por login) são irrelevantes
- Volume estimado: 1 leitura de documento por login; escritas agregadas
  (IDR 0003) — a era "uma escrita por clique" consumiria cota à toa em
  sessões de registro em rajada
- O risco de cota vem dos futuros, não do MVP: sincronização ao vivo
  (`onSnapshot` — cada entrega cobrada como leitura, multiplicada por
  dispositivo) é o primeiro candidato; import usado como "salvar" é o
  segundo (import é substituição rara, não gravação) — gatilhos de
  revisão já no ADR 0007
- Região: `southamerica-east1` tem faixa gratuita; no Blaze é mais cara
  por operação que `us-*` — gatilho de revisão se o projeto vincular
  faturamento (ADR 0007)
- O lado de requisito é a RNF de economia de requisições em
  [requisitos.md](requisitos.md): uma leitura por login, escritas
  agregadas, nenhuma requisição por figurinha

## Pronto × falta

| Pronto (na main) | Falta |
|---|---|
| Banco criado (região, Spark), `users/{uid}` + regras + testes no CI | Confirmar em uso real os números do ADR 0008 (debounce ~2s, teto ~10s, timeout ~5s sem rede) — aceitos como ponto de partida na Tarefa 0007-0003, sem deploy com usuários reais disponível durante o plano (ver `arquitetura.md` § Pontos em aberto) |
| Regras publicadas (schema, `updatedAt`, `atestadoEm` — TDR 0008/0009) | — |
| SDK sob demanda + CSP (ADR 0007, TDR 0007) | — |
| Escrita agregada, flush, `updatedAt`, `atestadoEm` (ADR 0008, Fase 7) | — |
| Migração: `teamName` da era do botão apagado na primeira gravação (Tarefa 0007-0004) | — |
| Carga no login, atestação de menores e política de erro visível (Fase 7/8) | — |
| Export/import JSON, sem tocar o Firestore para export (Fase 9) | — |

O produto novo está implementado por completo; o único item em aberto é
operacional (confirmação em uso real dos números do ADR 0008), não de
código.

## Futuro

Consulta sem rede (cache local do SDK) e sincronização ao vivo entre
dispositivos (`onSnapshot`) — futuros registrados em requisitos.md; o
segundo mudaria o modelo de leitura, hoje uma carga por login.
