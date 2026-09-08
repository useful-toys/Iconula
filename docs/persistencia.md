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

## Formato dos dados

### Hoje (implementado): a bandeira do botão

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

### Alvo (especificado): a coleção de figurinhas

```
users/{uid}
{
  "contagens": {
    "BRA05": 3,           // código → unidades registradas
    "FWC12": 1,
    "COC03": 2
                          // chave ausente = contagem 0
  },
  "updatedAt": <timestamp>  // carimbo do servidor
}
```

Regras do formato:

- **Chave = código da figurinha** — três letras da seção + dois
  dígitos (`BRA05`, `FWC12`, `COC03`), identidade imutável do catálogo
  (requisitos.md); nunca índice, nunca nome
- **Valor = contagem, inteiro ≥ 1** — o mapa é **esparso**: chave
  ausente significa contagem 0, e zeros nunca são gravados; o documento
  só cresce com o que o usuário tem
- **Zerar a última unidade = apagar a chave** do mapa (não gravar 0)
- **`updatedAt`** é carimbo **do servidor** (`serverTimestamp()`), não
  do relógio do cliente — é o que o cabeçalho exibe como última
  alteração gravada; reverte o "sem updatedAt" do ADR 0007, que valia
  quando não havia leitor para o carimbo
- **Tipos**: `contagens` é `map<string, int>`; o teto por contagem e a
  validação exata das chaves ficam com o ADR do schema
- **Tamanho**: no pior caso (coleção completa), ~994 chaves de ~5
  caracteres — poucos KB, muito abaixo do limite de 1 MiB por documento
- **Nada além disso**: os únicos campos são `contagens` e `updatedAt`
  (+ `teamName` enquanto a migração não decide o que fazer com ele —
  pendência em requisitos.md)

### Formato físico pendente: mapa × subcoleção

O formato lógico acima vale igual nos dois candidatos físicos; o ADR
do schema decide:

- **Mapa no documento `users/{uid}`** (desenhado acima): a coleção
  inteira carrega numa leitura e a gravação agregada é uma única
  escrita — candidato natural
- **Subcoleção** (`users/{uid}/contagens/{código}`): uma escrita por
  figurinha e leitura em query; mais documentos, regras por
  subcaminho — só compensaria se a coleção não coubesse num documento

### Operações sobre o formato

| Operação | Efeito no documento |
|---|---|
| Carregar (login) | 1 leitura de `users/{uid}` → mapa inteiro no estado da tela |
| Ajustar (+1/−1) | gravação agregada com as chaves acumuladas desde a última (caminhos individuais ou mapa inteiro — detalhe do ADR; `increment()` atômico é candidato) |
| Zerar | apaga a chave do mapa |
| Apagar meus dados | `delete` do documento inteiro (contagens junto) — exige autorizar `delete` nas regras |
| Importar JSON | **substitui** o campo `contagens` inteiro (sobrescreve, sem merge; normalizado — zeros viram chave ausente) + `updatedAt` |

O comportamento de sincronização em volta do formato — gravação
agregada relativamente rápida, notificações de gravado/carregado/falha,
flush ao fechar a página — está nos
[IDRs 0002/0003](idr/0003-gravacao-agrega-ajustes.md); a garantia de
flush fica no ADR do schema.

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
- Validação do formato (seção "Formato dos dados"): `contagens` é map
  com int ≥ 1, `updatedAt` é timestamp; teto por contagem e padrão das
  chaves (regex × allow-list dos 994 códigos) ficam no TDR das regras
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
- O lado de requisito é a RNF de economia de requisições em
  [requisitos.md](requisitos.md): uma leitura por login, escritas
  agregadas, nenhuma requisição por figurinha

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
