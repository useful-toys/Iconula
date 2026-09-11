<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0007-0002: carga no login e relógio do título

## Data
2026-09-10

## Resumo
Trazida a coleção do Firestore para a tela no login: uma leitura de
`users/{uid}` por login, alimentando o mapa esparso em memória e o relógio do
título com o `updatedAt` gravado no documento.

- `src/lib/colecaoRemota.js` — criado no lugar do `userPreferences.js` removido
  na Fase 2. Único módulo que toca o SDK do Firestore, carregado sob demanda por
  `import()` dinâmico memoizado (`firebase.js` não o importa — ADR 0007).
  Inicializa o Firestore com `persistentLocalCache` +
  `persistentMultipleTabManager()` (ADR 0008) e expõe `carregarColecao(uid)` com
  resultado discriminado `encontrado | vazio | erro | indisponivel`, que **nunca
  lança**. Traz também `formatarCarimbo(data, agora)` (IDR 0027) e
  `mensagemDeErro(erro)` para o detalhe técnico.
- `src/App.jsx` — efeito de carga dependente de **`uid`** (não do objeto `user`,
  que muda a cada refresh de token — ADR 0007). Documento vazio é o fluxo normal
  do primeiro login. A carga bem-sucedida **não** move o relógio para "agora":
  exibe o `updatedAt` gravado; sem carimbo, `—`. Proteção de corrida com
  contador de ajustes (`useRef`): ajuste feito durante a leitura descarta a
  resposta do servidor. Emite sucesso "Coleção carregada" e, na falha, aviso
  vermelho com o detalhe técnico.
- `src/components/Cabecalho.jsx` — a prop `atualizadoEm` já existia; apenas o
  JSDoc foi corrigido (a nota "ainda exibe `—`" era da fase anterior).
- `src/App.test.jsx` — mocka `colecaoRemota` como indisponível para manter os
  testes de auth focados e longe do Firestore.
- `src/App.persistencia.test.jsx` — testes de integração da carga: uma leitura
  por login, coleção no placar, relógio com o carimbo, documento vazio sem
  falha, falha de leitura com aviso vermelho e proteção de corrida.

## Decisões tomadas
- **TDR 0016** — duas decisões em aberto da tarefa, num registro só:
  1. **Corrida da leitura**: contador de ajustes (`useRef`) incrementado fora do
     updater (StrictMode), capturado no início da leitura; resposta do servidor
     descartada se o contador mudou — o desenho do ADR 0007 adaptado ao mapa de
     contagens.
  2. **Formato do carimbo**: mesmo dia `HH:mm`; outro dia `dd/mm/aa HH:mm`
     (curto, PT-BR, sem segundos). A função `formatarCarimbo` aceita o instante
     de referência como parâmetro para ser testável sem depender do relógio.

## Impedimentos
Nenhum. Ambas as ambiguidades eram de nível 1 e foram resolvidas pelo TDR 0016.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.` (46 arquivos, 105 regras).
- `vitest run`: **20 arquivos de teste, 179 testes, todos passando** — incluindo
  os 14 de `src/lib/colecaoRemota.test.js` (inicialização multi-aba, encontrado,
  vazio, erro, indisponível, uma leitura por carga, `formatarCarimbo`,
  `mensagemDeErro`) e os 4 de `src/App.persistencia.test.jsx`.
- `vite build`: o Firestore saiu do bundle principal — `index-CZcNs2E0.js`
  (391,83 KB) e o chunk sob demanda `index.esm-B1AjRhPU.js` (500,78 KB,
  gzip 147,32 KB), baixado só por quem faz login. O aviso de chunk > 500 KB é do
  chunk do Firestore sob demanda, não do bundle principal.

### Verificação visual / preview
A verificação em preview deploy real (uma requisição de leitura na aba Network e
nenhuma violação de CSP) não pôde ser executada neste ambiente automatizado (sem
deploy/navegador). A separação do chunk do Firestore está comprovada pelo build;
a leitura única está coberta por teste (`getDoc` chamado uma vez).

## Arquivos alterados
- `src/lib/colecaoRemota.js` — criar (carga, cache local multi-aba, formatarCarimbo, mensagemDeErro)
- `src/lib/colecaoRemota.test.js` — criar
- `src/App.jsx` — efeito de carga por uid, relógio, proteção de corrida, avisos
- `src/components/Cabecalho.jsx` — correção do JSDoc da prop `atualizadoEm`
- `src/App.test.jsx` — mock de `colecaoRemota` indisponível
- `src/App.persistencia.test.jsx` — criar (carga, relógio, vazio, falha, corrida)
- `docs/tdr/0016-carga-no-login-corrida-e-formato-do-carimbo.md` — criar
- `docs/plano/0007-persistencia-da-colecao-e-avisos/0002-carga-no-login-e-relogio-do-titulo.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0002 atualizado
- `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0002-log-carga-no-login-e-relogio-do-titulo.md` — este log
