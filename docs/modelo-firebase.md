<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Modelo de dados — Persistência no Firebase

Como a aplicação representa a coleção do usuário no Cloud Firestore. As decisões de modelagem estão nos [MDRs](mdr/); este documento mostra o estado atual do modelo em produção.

## Onde os dados vivem

- Projeto Firebase `iconula`, banco Firestore `(default)`, modo Native, região `southamerica-east1` (São Paulo), faixa gratuita confirmada no plano Spark
- Um documento por usuário: `users/{uid}` — o uid no caminho é o que torna a autorização uma comparação direta nas regras, sem consulta e sem índice ([MDR 0001](mdr/0001-localizacao-do-documento-no-firestore.md))
- Fora isso, só a identidade Google (nome, e-mail, foto) — que mora no Firebase Auth, não no Firestore; nenhum outro dado de usuário existe

## Formato do documento

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
                             // (uma vez por conta)
}
```

### Regras do formato

- **Chave = código da figurinha** — três letras da seção + dois dígitos (`BRA05`, `FWC12`, `COC03`), identidade imutável do catálogo; nunca índice, nunca nome
- **Valor = contagem, inteiro ≥ 1** — o mapa é **esparso**: chave ausente significa contagem 0, e zeros nunca são gravados; o documento só cresce com o que o usuário tem
- **Contagem chegando a 0 = apagar a chave** do mapa (não gravar 0)
- **Teto de 99 por contagem** — imposto pelas regras e respeitado pela interface
- **`updatedAt`** é carimbo **do servidor** (`serverTimestamp()`), não do relógio do cliente — carimbo da última escrita no documento
- **`atestadoEm`** é gravado uma única vez, na atestação de menores do primeiro login — sem `updatedAt` junto
- **Nada além disso**: os únicos campos são `contagens`, `updatedAt` e `atestadoEm`
- **Tamanho**: no pior caso (coleção completa), ~994 chaves de ~5 caracteres — poucos KB, muito abaixo do limite de 1 MiB por documento

Detalhes no [MDR 0002](mdr/0002-schema-do-documento-da-colecao.md).

## Mecanismo de gravação

- **Escrita por chaves alteradas**: `setDoc` com `merge: true` e os caminhos aninhados acumulados — valor absoluto ou `deleteField` — numa única operação de escrita por agregação
- **Gravação agregada**: debounce de ~2s após o último ajuste, teto de espera de ~10s em rajada contínua
- **Flush imediato ao fechar a página** (`pagehide`/`visibilitychange`)
- **Flush garantido por persistência local**: cache IndexedDB do SDK, `persistentLocalCache` com `persistentMultipleTabManager()` — escritas pendentes sobrevivem ao fechamento e completam na carga seguinte
- **Sem rede, a escrita não resolve**: com cache local, a promise só resolve quando o servidor confirma — offline ela fica pendente para sempre; um tempo-limite de ~5s emite o aviso "sem conexão, será gravado depois"
- **Sair da conta dá flush antes**: depois do `signOut` o ID token some e as regras negam a escrita

Detalhes no [MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md).

## Operações sobre o documento

| Operação | Efeito no documento |
|---|---|
| Carregar (login) | 1 leitura de `users/{uid}` → mapa inteiro no estado da tela |
| Ajustar (+1/−1) | gravação agregada com as chaves alteradas desde a última — valores absolutos ou `deleteField`, numa única escrita |
| Chegar a 0 (decremento) | apaga a chave do mapa |
| Atestação de menores | grava `atestadoEm`, uma única vez por conta |
| Importar JSON | **substitui** o campo `contagens` inteiro (sobrescreve, sem merge; normalizado — zeros viram chave ausente) + `updatedAt` |

## O que **não** vai para o Firestore

- **Preferências de vista** — ordenação, disposição e filtro — vivem no `localStorage` do navegador, por dispositivo, e custam zero requisição
- **Estado de colapso** de seções e super-grupos é volátil: some ao recarregar
- **Histórico de desfazer** (últimas 10 alterações) vive em memória
- **Cache do SDK** (IndexedDB, `persistentLocalCache` com `persistentMultipleTabManager()`) espelha o documento e sustenta o flush de gravações pendentes

## Regras de segurança

`firestore.rules` é a única garantia de isolamento entre usuários: o bundle é público e qualquer requisição pode ser forjada — a autorização é avaliada no servidor, contra o ID token. Cobertura por testes no emulador (`npm run test:rules`) rodando no CI a cada PR.

O que está publicado:

- `allow get` apenas do próprio documento (`request.auth.uid == userId`), com `get` — nunca `read` — para que uma query na coleção `users` não seja avaliada; `list` segue negado
- `allow create, update` apenas do próprio documento, exigindo `hasOnly(["contagens", "updatedAt", "atestadoEm"])`
- `contagens` é `map` com `size() <= 994` e `values().hasOnly([1…99])` — o teto de 99 é o que torna os valores validáveis
- `updatedAt == request.time` quando presente (e obrigatório sempre que `contagens` é escrito); `atestadoEm is timestamp` quando presente
- **allow-list das chaves não entrou**: gerada a partir do catálogo e medida, a cláusula `contagens.keys().hasOnly([994 códigos])` compila, mas a avaliação estoura o limite de 1.000 expressões por requisição — as chaves seguem limitadas só em quantidade (`size() <= 994`), não em conteúdo
- `delete` segue negado
- sem regra catch-all: o resto é negado por padrão

## Custos e cotas

- Plano Spark (gratuito): ~50 mil leituras e ~20 mil escritas por dia; esgotada a cota, as requisições falham até o dia seguinte
- Custo por operação:

| Ação | Operações cobradas |
|---|---|
| Login (carga) | 1 leitura; com o cache local (IndexedDB), cargas repetidas podem servir do cache |
| Ajustes em rajada | 1 escrita por agregação — debounce de ~2s, no máximo 1 escrita a cada ~10s de atividade contínua |
| Chegar a 0 | vai na escrita da agregação (`deleteField` conta como escrita, não como exclusão) |
| Atestação de menores | 1 escrita na vida da conta |
| Import JSON | 1 escrita (substitui `contagens` + `updatedAt`) |
| Export JSON, texto WhatsApp, desfazer | 0 — leem o estado em memória |
| Trocar ordenação, disposição ou filtro | 0 — preferência de vista vai para o `localStorage` |

- Teto estimado: um usuário pesado (1 h/dia registrando sem parar) ≈ 360 escritas/dia — a cota comporta dezenas de usuários pesados simultâneos; leituras (1 por login) são irrelevantes

## Futuro

Consulta sem rede (cache local do SDK) e sincronização ao vivo entre dispositivos (`onSnapshot`) — futuros registrados em requisitos.md; o segundo mudaria o modelo de leitura, hoje uma carga por login.
