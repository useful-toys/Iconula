<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Modelo de dados — Representação em memória na SPA

Como a aplicação representa a coleção do usuário em memória durante a execução da Single Page Application. As decisões de modelagem estão nos [MDRs](mdr/); este documento mostra o estado atual do modelo em runtime.

## Estado da coleção

A coleção em memória é um mapa esparso `Record<string, number>` (código → contagem), espelhando o schema do Firestore ([MDR 0002](mdr/0002-schema-do-documento-da-colecao.md)).

- **Chave ausente = contagem 0** — zeros nunca são guardados
- **Contagem chegando a 0 remove a chave** — o mapa só cresce com o que o usuário tem
- **Teto de 99, piso de 0** — respeitados pela interface e pelas funções puras de `colecao.js`

```javascript
// Exemplo de coleção em memória
{
  "BRA05": 3,
  "FWC12": 1,
  "COC03": 2
  // chave ausente = contagem 0
}
```

## Estado do App.jsx

Todo o estado da coleção vive em `App.jsx`, consumido por prop-drilling (sem Context — ver [TDR 0014](tdr/0014-estado-da-colecao-sem-context.md)).

| Campo | Tipo | Descrição |
|---|---|---|
| `contagens` | `Record<string, number>` | A coleção em memória (mapa esparso) |
| `atualizadoEm` | `string \| null` | Carimbo formatado da última gravação — aproximação local do instante de confirmação do servidor, não o `updatedAt` real ([TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md)) |
| `historico` | `Array<{codigo, contagemAnterior}>` | Últimas 10 alterações, em memória (volátil) |
| `precisaAtestar` | `boolean` | Se a conta precisa atestar maiores de idade |
| `mostrarPolitica` | `boolean` | Vista interna da política de privacidade |
| `ordenacao` | `'pagina' \| 'sigla'` | Ordenação vigente do catálogo |
| `disposicao` | `'lista' \| 'album'` | Disposição vigente do catálogo |
| `filtro` | `'todas' \| 'faltantes' \| 'coladas' \| 'repetidas'` | Filtro de status vigente |
| `user` | `object \| null` | Objeto do Firebase Auth (ou `null` se deslogado) |
| `authResolvido` | `boolean` | Se o `onAuthStateChanged` já emitiu |

## Preferências de vista

Lidas uma vez do `localStorage` na abertura (chave `iconula.preferencias-vista.v1`), com padrões por faixa de tela na primeira abertura ([IDR 0043](idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)). Detalhes no [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md).

```javascript
// Exemplo de preferências gravadas no localStorage
{
  "ordenacao": "pagina",
  "disposicao": "album",
  "filtro": "todas"
}
```

- **Persistência**: `localStorage`, por dispositivo, zero requisição ao Firestore
- **Padrões por faixa de tela** (primeira abertura):
  - Celular (≤512px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Tablet (513–1024px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Navegador (>1024px): `ordenacao: 'sigla'`, `disposicao: 'lista'`
  - Filtro sempre começa em `'todas'`
- **Campos inválidos**: se existe um objeto gravado mas algum campo está fora do domínio conhecido, a faixa é ignorada e o campo inválido cai no padrão neutro fixo (`ordenacao: 'pagina'`, `disposicao: 'lista'`, `filtro: 'todas'`)

## Gravação agregada

Instância criada uma única vez por sessão (inicializador preguiçoso do `useState`), acumulando as chaves alteradas desde a última gravação. Detalhes no [MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md) e [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md).

```javascript
// Estado interno da gravação agregada
{
  uidAtual: string,
  alteracoes: Record<string, number>,  // chaves alteradas desde a última gravação
  idDebounce: timeout,                 // debounce de ~2s
  idTeto: timeout,                     // teto de ~10s
}
```

- **Debounce**: ~2s após o último ajuste
- **Teto de espera**: ~10s em rajada contínua
- **Flush**: gravação imediata ao fechar a página (`pagehide`/`visibilitychange`) ou antes do `signOut`
- **Persistência local**: cache IndexedDB do SDK (`persistentLocalCache` com `persistentMultipleTabManager()`) — escritas pendentes sobrevivem ao fechamento da aba
- **`descartarPendencias()`**: limpa alterações acumuladas e temporizadores antes da importação — para não reintroduzir dado já substituído
- **`marcarTeamNameParaApagar(uid)`**: agenda `deleteField()` do campo legado `teamName` piggyback na próxima gravação de contagens — sem escrita à parte ([TDR 0018](tdr/0018-marca-de-apagar-teamname-via-chave-reservada.md))

Detalhes no [MDR 0003](mdr/0003-gravacao-agregada-da-colecao.md).

## Proteção de corrida na carga

- **`ajustesRef`** (contador em `App.jsx`): se o usuário ajusta contagens enquanto a leitura do Firestore está em voo, a resposta do servidor é descartada — o valor local, mais recente, prevalece
- O ajuste local já foi registrado na gravação agregada e será gravado na próxima escrita
- Sem essa proteção, o valor do servidor (mais antigo) sobrescreveria o ajuste local feito durante a carga

## Histórico de desfazer

Array imutável de `{codigo, contagemAnterior}`, com limite de 10 entradas (pilha LIFO).

```javascript
// Exemplo de histórico
[
  { codigo: "BRA05", contagemAnterior: 2 },
  { codigo: "FWC12", contagemAnterior: 0 },
  { codigo: "COC03", contagemAnterior: 1 }
]
```

- **Volátil**: descartado ao recarregar a página
- **Zerado pela importação**: a coleção anterior deixou de existir, o histórico não faz sentido
- **Desfazer**: retira o topo da pilha e reaplica a contagem anterior como um ajuste comum — a reversão em si não entra no próprio histórico

## Catálogo estático

Embutido no bundle, nunca toca o Firestore — igual para todos os usuários. Detalhes no [MDR 0006](mdr/0006-catalogo-estatico-embutido.md).

- **`secoes`**: array de 50 seções — `sigla`, `nome`, `tipo` (`selecao` | `especial`), `icone` (emoji Unicode), `grupo` (A–L ou `null`), `paginas` (spread ou `null`), `total`, `inicio` (opcional, padrão 1)
- **`figurinhas`**: array de 994 figurinhas expandidas por `expandirFigurinhas(secoes)` — `codigo`, `secao` (sigla), `posicao` (inteiro), `metalizada` (booleano), `paisagem` (booleano)
- **Numeração**: seleções `SIG01`…`SIG20` (48 × 20 = 960), FWC `FWC00`…`FWC19` (20), COC `COC01`…`COC14` (14) — total 994
- **Posições fixas** (seleções): `01` é metalizada; `13` é paisagem
- **Derivações**: funções puras em `catalogoOrdenacoes.js` (`ordenarPorSigla`, `ordenarPorPagina`, `extrairSecoes`) e `catalogoLayout.js` (posições de página/linha/trilha) — propriedades do dado, sem efeito colateral

## Progresso

Calculado sob demanda por `calcularPlacar(contagens, codigosTodasFigurinhas)`, não armazenado.

```javascript
// Resultado de calcularPlacar
{
  coladas: 123,        // contagem >= 1
  faltantes: 871,      // contagem === 0
  repetidas: 45,       // contagem >= 2
  percentual: 12       // Math.round((coladas / 994) * 100) — inteiro
}
```

## Textos de troca

Gerados sob demanda por `textoDeTroca.js`, zero requisição ao Firestore.

- **Formato**: uma linha por seção, `Nome SIG: nn nn nn`, números em ordem crescente
- **Ordem fixa** do álbum (FWC abre, COC fecha), independente da ordenação vigente na tela
- **Número**: sempre com dois dígitos (`01`, `05`, `13`)
- **Faltantes**: `contagem === 0`
- **Repetidas**: `contagem >= 2`, formato `nn×k` onde `k` é unidades sobrando (contagem − 1)
- **Seção sem nada a listar**: não entra no texto

```
// Exemplo de texto de faltantes
Extras FIFA FWC: 00 03 07
Brasil BRA: 02 05 11

// Exemplo de texto de repetidas
Brasil BRA: 05×2 11×1
```

## Avisos

Fila com limite de empilhamento (3), severidade, expiração.

```javascript
// Exemplo de aviso
{
  id: 42,                    // auto-incremento
  severidade: 'sucesso' | 'aviso' | 'falha',
  mensagem: 'Alterações salvas',
  detalhe: '...',            // opcional, para falhas
  tipo: 'gravacao'           // para dispensar a falha no sucesso seguinte do mesmo tipo
}
```

- **Sucesso e aviso**: somem em 5s
- **Falha**: persiste até ser dispensada ou até um sucesso do mesmo `tipo` a dispensar
- **Limite de empilhamento**: 3 avisos; ao chegar o quarto, o mais antigo sai

## O que é volátil

- **Histórico de desfazer**: descartado ao recarregar
- **Estado de colapso** de seções e super-grupos: some ao recarregar
- **Avisos**: expiram ou são dispensados

## O que persiste

- **Coleção**: no Firestore (ver [modelo-firebase.md](modelo-firebase.md))
- **Preferências de vista**: no `localStorage`, por dispositivo (ver [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md))
- **Atestação de menores**: no Firestore, uma única vez por conta
- **Cache do Firestore**: no IndexedDB, multi-aba, escritas pendentes sobrevivem ao fechamento da aba (ver [MDR 0007](mdr/0007-persistencia-no-armazenamento-local.md))

## O que é calculado sob demanda

- **Progresso** (`calcularPlacar`): `{coladas, faltantes, repetidas, percentual}` — não armazenado
- **Textos de troca** (`textoDeTroca.js`): uma linha por seção, ordem fixa do álbum — não armazenado
- **`atualizadoEm`**: formatado por `formatarCarimbo` a partir do `Date` devolvido por `gravarAlteracoes`/`carregarColecao` — não é o `updatedAt` do servidor, é uma aproximação local do instante de confirmação ([TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md))
