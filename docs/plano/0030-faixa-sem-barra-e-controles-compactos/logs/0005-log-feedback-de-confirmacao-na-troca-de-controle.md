<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0030-0005: feedback de confirmação na troca de controle

## Data
2026-09-17

## Resumo
Antes, trocar ordenação, disposição ou filtro só mudava o estado ativo em
dourado e o catálogo, sem nenhum retorno textual — o que a Tarefa 0030-0003
tornou mais notável ao trocar os rótulos de texto por ícones/glifos
compactos. Agora, `App.jsx` emite um aviso de sucesso (5s, fila de
`lib/avisos.js` já existente) com o nome por extenso a cada troca: "Ordenado
pela página do álbum"/"Ordenado pelo código do país" na ordenação,
"Disposição em lista"/"Disposição como no álbum" na disposição e "Mostrando
todas"/"Mostrando apenas as faltantes/coladas/repetidas" no filtro. Os
handlers `handleTrocarOrdenacao` e `handleTrocarDisposicao` (novos) e
`handleTrocarFiltro` (já existia, ganhou o aviso) chamam `setOrdenacao` /
`setDisposicao` / `setFiltro` e, na sequência, `emitirAviso`. `interface.md`
§ Avisos ganhou o evento na linha de sucesso, citando o IDR 0059 (que já
trazia a decisão do feedback, registrado no esmiuçamento anterior a esta
fase). Nenhuma divergência entre tarefa, documentação e código.

## Discovery
- Código: `App.jsx` já tinha `handleTrocarFiltro` (só `setFiltro`);
  ordenação e disposição eram ligadas direto a `setOrdenacao`/`setDisposicao`
  como `onTrocarOrdenacao`/`onTrocarDisposicao` do `Controles`. A fila de
  avisos (`src/lib/avisos.js`, `emitirAviso`) já é usada em toda a
  persistência/portabilidade/compartilhamento (`App.jsx`), com `tipo`
  opcional — só necessário para dispensar uma falha do mesmo tipo no sucesso
  seguinte, o que não se aplica aqui (troca de controle não tem falha
  correspondente). `Avisos.jsx` renderiza a fila sem mock em `App.test.jsx`,
  então os avisos aparecem de verdade nos testes de integração; outros
  arquivos de teste de `App` já chamam `limparAvisos()` em `beforeEach`/
  `afterEach` para isolar a fila entre casos — `App.test.jsx` ainda não
  fazia isso (não havia aviso disparado ali) e passou a fazer.
  `Controles.jsx` expõe os `aria-label` usados nos testes ("ordenar pela
  página do álbum", "disposição em lista contínua", "mostrar apenas as
  figurinhas repetidas" etc.), inalterados por esta tarefa.
- Documentação: IDR 0059 (Decisão) já lista as cinco mensagens exatas
  (citadas na tarefa) e cobre a alteração em `interface.md` § Avisos nas
  Consequências; IDR 0029 (Decisão) já cita a troca de ordenação/disposição/
  filtro na severidade Sucesso — nenhum dos dois precisou de novo registro
  ou histórico, só a tabela de eventos em `interface.md` estava desatualizada.

## Plano da alteração
1. `App.jsx`: adicionar `handleTrocarOrdenacao` e `handleTrocarDisposicao`
   (chamam o `set` e emitem o aviso de sucesso); estender
   `handleTrocarFiltro` com o aviso; trocar `onTrocarOrdenacao={setOrdenacao}`
   e `onTrocarDisposicao={setDisposicao}` pelos novos handlers na chamada de
   `Controles`. Mapa `MENSAGENS_FILTRO` em escopo de módulo, ao lado das
   demais constantes (`PREFIXO_CATALOGO`).
2. `docs/interface.md` § Avisos: acrescentar "trocou ordenação/disposição/
   filtro" à célula de eventos da severidade Sucesso, citando o IDR 0059.
3. `src/App.test.jsx`: importar `limparAvisos` e chamá-lo em `beforeEach`/
   `afterEach` (padrão já usado nos demais arquivos de teste de `App`);
   acrescentar um teste de integração que troca ordenação, disposição e
   filtro e confere cada mensagem na tela.
- Verificação prevista: cada critério de aceite → o teste novo, um `expect`
  por mensagem, com `findByText` (aguarda o aviso efêmero renderizar).
- Riscos: a fila de avisos é module-level — sem `limparAvisos()` entre
  testes do mesmo arquivo, um aviso de um caso vazaria para o próximo;
  mitigado seguindo o padrão dos demais arquivos de teste de `App`.
- Desvios: nenhum.

## Decisões tomadas
- `tipo` omitido nas quatro chamadas novas de `emitirAviso` (nível 1): não
  há falha correspondente à troca de controle para dispensar, então o
  parâmetro opcional fica sem uso, como em outros sucessos sem falha
  equivalente (`Coleção exportada`, `Lista compartilhada`).
- `MENSAGENS_FILTRO` em escopo de módulo, não recriado a cada render
  (nível 1) — segue o padrão das demais constantes de `App.jsx`.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> iconula@0.0.0 lint
> oxlint
(sem saída — zero avisos/erros)

$ npm run test
> iconula@0.0.0 test
> vitest run
 Test Files  43 passed (43)
      Tests  586 passed (586)

$ npm run build
> iconula@0.0.0 build
> vite build
✓ 138 modules transformed.
✓ built in 351ms
(aviso pré-existente de chunk >500kB, não relacionado a esta tarefa)
```

## Critérios de aceite
- [x] Trocar ordenação emite "Ordenado pela página do álbum" ou "Ordenado
      pelo código do país" — teste `App.test.jsx` "emite um aviso de
      sucesso com o nome por extenso ao trocar ordenação, disposição e
      filtro".
- [x] Trocar disposição emite "Disposição em lista" ou "Disposição como no
      álbum" — mesmo teste.
- [x] Trocar filtro emite "Mostrando todas / apenas as …" — mesmo teste,
      cobre `todas` e `repetidas`; as quatro mensagens estão em
      `MENSAGENS_FILTRO` (`src/App.jsx`).
- [x] O aviso é de sucesso e some em 5s — `emitirAviso` com
      `SEVERIDADE.SUCESSO` (`src/lib/avisos.js` já expira sucesso em 5s,
      `DURACAO_EFEMERO_MS`, coberto pelos testes existentes da fila).
- [x] `npm run lint && npm run test && npm run build` verdes — ver
      Validação.

## Arquivos alterados
- `src/App.jsx` — `handleTrocarOrdenacao` e `handleTrocarDisposicao` novos;
  `handleTrocarFiltro` emite o aviso; `MENSAGENS_FILTRO` em escopo de
  módulo; `Controles` passa a usar os novos handlers.
- `src/App.test.jsx` — importa e chama `limparAvisos`; novo teste de
  integração das três trocas com aviso.
- `docs/interface.md` — § Avisos, evento de sucesso da troca de controle.
