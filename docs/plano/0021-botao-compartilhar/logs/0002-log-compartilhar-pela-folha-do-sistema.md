<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0021-0002: compartilhar pela folha do sistema

## Data
2026-09-14

## Resumo
O popup do botão compartilhar ganhou, logo abaixo de cada cópia, um item de
compartilhar pela folha do sistema: "Compartilhar faltantes…" e "Compartilhar
repetidas…", só quando o navegador oferece `navigator.share`. Antes: o popup
tinha só as duas cópias. Depois: com a função disponível, quatro itens
(copiar/compartilhar faltantes, filete, copiar/compartilhar repetidas); sem
ela, as duas cópias de sempre. O texto compartilhado é exatamente o da cópia,
na ordem do álbum (IDR 0039), e não há nenhuma URL ou esquema de app no código.

`App.jsx` ganhou `compartilharLista(texto, tipo)`: chama `navigator.share({
text })` (só `text`, premissa do nível 2 registrada abaixo), emite "Lista
compartilhada" no sucesso, ignora `AbortError` (folha fechada sem escolha) e,
em qualquer outra rejeição, cai na cópia existente
(`copiarParaAreaDeTransferencia`), com o mesmo texto, o aviso dourado e a
reserva `window.prompt` do IDR 0039. Os handlers de compartilhar geram o texto
com `gerarTextoFaltantes`/`gerarTextoRepetidas`, como os de cópia.

`MenuDeCompartilhar.jsx` lê `navigator.share` a cada render
(`typeof navigator.share === 'function'`) e decide se renderiza os dois itens
novos; eles ficam desabilitados sem callback, como as cópias.

Arquivos e papéis:
- `src/components/MenuDeCompartilhar.jsx`: prop `onCompartilharFaltantes`/
  `onCompartilharRepetidas`; os dois itens condicionados à existência de
  `navigator.share`; JSDoc atualizado.
- `src/components/MenuDeCompartilhar.test.jsx`: helper para definir
  `navigator.share` e testes dos itens presentes/ausentes.
- `src/App.jsx`: `compartilharLista` e os handlers, montados no slot
  `compartilhar` do `Cabecalho`.
- `src/App.compartilhar.test.jsx` (novo): integração com `navigator.share`
  stubado — texto igual ao da cópia, sucesso avisa, `AbortError` não avisa,
  outra rejeição cai na cópia.
- `docs/interface.md` (§ Menu de ações › Compartilhar e § Avisos): estado
  atual, citando IDR 0024.
- `AGENTS.md` (§ Onde fica cada coisa): novo teste de `App` e a linha de
  `MenuDeCompartilhar.jsx`.

## Discovery
- Código:
  - `src/components/MenuDeCompartilhar.jsx` mantém `aberto` local, fecha por
    escolha, `mousedown` fora, `Esc` e `onBlur`; ao abrir, foca o primeiro
    `[role="menuitem"]:not(:disabled)`; itens de cópia desabilitados sem
    callback. O popup tem um único filete entre as duas listas.
  - `src/App.jsx:314-341`: `copiarParaAreaDeTransferencia(texto, tipo)` tenta
    `navigator.clipboard.writeText`, emite "Lista copiada" ou, na falha, aviso
    dourado + `window.prompt` (IDR 0039); `handleCopiarFaltantes`/`Repetidas`
    geram o texto com `gerarTextoFaltantes`/`gerarTextoRepetidas` a partir de
    `contagens` e `secoesNaOrdemDoAlbum`, o mesmo texto e a mesma ordem que o
    compartilhar deve usar.
  - `src/lib/avisos.js`: `emitirAviso({ severidade, mensagem, tipo })`; sucesso
    expira em 5s. O `tipo` só dispensa falha do mesmo tipo — nenhum aviso de
    compartilhar é falha, então o `tipo` é só rótulo.
  - Testes da área: `App.copiar.test.jsx` usa temporizadores falsos,
    `fireEvent` e mocks de `Catalogo`, `firebase/auth`, `lib/firebase` e
    `colecaoRemota`; define `navigator.clipboard` por `Object.defineProperty`.
    `MenuDeCompartilhar.test.jsx` cobre itens, filete, foco, fechamento e
    desabilitado sem callback.
  - Comportamento atual confere com a tarefa: as cópias existem e o
    compartilhar ainda não. Nenhum impacto fora dos arquivos previstos — o
    `Cabecalho` só repassa o slot `compartilhar` e o CSS do popup já
    comporta dois itens a mais (sem altura fixa nem rolagem).
- Documentação: li `docs/idr/0024` § Decisão e Consequências, `docs/idr/0039`,
  `docs/idr/0029` § Decisão, `docs/interface.md` § Menu de ações ›
  Compartilhar e § Avisos, e `docs/requisitos.md` § Compartilhamento (já no
  estado novo: entrega por cópia ou pela folha do sistema). As decisões da
  tarefa estão todas registradas; nenhum registro novo é necessário.

## Plano da alteração
1. `MenuDeCompartilhar.jsx`: props `onCompartilharFaltantes`/
   `onCompartilharRepetidas`; "Compartilhar faltantes…" logo abaixo da cópia
   de faltantes e "Compartilhar repetidas…" logo abaixo da cópia de
   repetidas, ambos só com `navigator.share` disponível e desabilitados sem
   callback; JSDoc.
2. `MenuDeCompartilhar.test.jsx`: helper `definirShare` + `afterEach` para
   limpar; testes com e sem `navigator.share`.
3. `App.jsx`: `compartilharLista` (só `text`; sucesso → "Lista
   compartilhada"; `AbortError` → nada; outra rejeição →
   `copiarParaAreaDeTransferencia`) e os dois handlers; passar as props novas
   ao `MenuDeCompartilhar`.
4. `App.compartilhar.test.jsx` (novo): texto igual ao copiado, sucesso avisa,
   `AbortError` não avisa, outra rejeição copia.
5. `docs/interface.md` § Compartilhar (os dois itens e a condição) e
   § Avisos ( "lista compartilhada" entre os sucessos); `AGENTS.md`
   § Onde fica cada coisa.
- Verificação prevista: itens presentes/ausentes → testes de
  `MenuDeCompartilhar.test.jsx`; texto idêntico ao copiado, avisos por
  desfecho → `App.compartilhar.test.jsx`; ausência de URL/esquema de app →
  busca por `whatsapp`, `wa.me`, `tg:`; docs → `git diff`.
- Riscos: a detecção de `navigator.share` em tempo de render não reagir à
  mudança da função dentro da mesma sessão (aceito: a disponibilidade do
  navegador não muda em execução); o `AbortError` variar de forma entre
  navegadores (cobrimos por `erro.name`).
- Desvios: nenhum.

## Decisões tomadas
- Enviar só `text` na chamada de `navigator.share`, sem `title` — nível 2
  (premissa já indicada em "Decisões em aberto nesta tarefa"): evita duplicar
  cabeçalho em apps que juntam os dois campos; o texto de troca já traz o
  cabeçalho da lista na primeira linha. Sem registro.
- Detectar a folha por `typeof navigator.share === 'function'` a cada render,
  e habilitar cada item de compartilhar só com o callback presente — nível 1,
  coerente com as cópias do mesmo popup e com o IDR 0024. Sem registro.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
`npm run lint`:
```
> oxlint
Found 0 warnings and 0 errors.
Finished in 50ms on 79 files with 105 rules using 4 threads.
```

`npm run test`:
```
 Test Files  41 passed (41)
      Tests  489 passed (489)
```
(antes da tarefa: 40 arquivos, 480 testes; entram `App.compartilhar.test.jsx`
com 5 e 4 casos novos em `MenuDeCompartilhar.test.jsx`. O stderr traz o aviso
`An update to Avisos inside a test was not wrapped in act(...)` em
`App.compartilhar.test.jsx` — mesmo padrão já pré-existente em
`App.copiar.test.jsx`, `App.gravacao.test.jsx` e demais suítes de integração
de `App`, não é regressão nem erro.)

`npm run build`:
```
✓ 136 modules transformed.
dist/assets/index-BTI0gXlj.css   28.46 kB │ gzip:   5.51 kB
dist/assets/index-C9pjqwJL.js   438.03 kB │ gzip: 135.07 kB
✓ built in 461ms
```
(aviso de chunk > 500 kB é pré-existente, não introduzido por esta tarefa)

`npm run test:rules`: não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] Com `navigator.share`, o popup tem os quatro itens na ordem por lista;
      sem, só as duas cópias — `MenuDeCompartilhar.test.jsx` ("traz os quatro
      itens, cada compartilhar logo abaixo da cópia da mesma lista": ordem
      copiar faltantes → compartilhar faltantes → copiar repetidas →
      compartilhar repetidas; "esconde os itens de compartilhar quando não há
      folha do sistema": só 2 itens).
- [x] O texto compartilhado é idêntico ao copiado —
      `App.compartilhar.test.jsx` ("manda para a folha o mesmo texto que a
      cópia geraria": `navigator.share` e `clipboard.writeText` recebem o
      mesmo `"Brasil BRA: 05×1"`).
- [x] Sucesso emite "Lista compartilhada"; `AbortError` não emite aviso; outra
      rejeição copia com a reserva do IDR 0039 — `App.compartilhar.test.jsx`
      ("sucesso emite 'Lista compartilhada', sem falha"; "fechar a folha sem
      escolher (AbortError) não emite aviso nem copia"; "outra rejeição cai na
      cópia, com o mesmo texto": `writeText` chamado e "Lista copiada").
- [x] Nenhuma URL ou esquema de app específico no código — busca por
      `whatsapp`, `wa.me`, `tg:` em `src/` retorna só o substantivo "WhatsApp"
      em comentários pré-existentes de `src/lib/textoDeTroca.js:4,11`; nada de
      URL ou esquema nas mudanças desta tarefa.
- [x] `docs/interface.md` nas duas seções e `AGENTS.md` atualizados —
      § Menu de ações › Compartilhar (dois itens, condição `navigator.share`,
      queda na cópia) e § Avisos ( "lista compartilhada" na linha de sucesso);
      `AGENTS.md` § Onde fica cada coisa (`App.compartilhar.test.jsx` e a linha
      de `MenuDeCompartilhar.jsx`).
- [ ] Verificação visual em celular Android/iPhone no preview — pendente
      (sem aparelho à mão); roteiro no relatório.

## Arquivos alterados
- `src/components/MenuDeCompartilhar.jsx` — itens de compartilhar por lista,
  condicionados a `navigator.share`; props novas e JSDoc
- `src/components/MenuDeCompartilhar.test.jsx` — helper de `navigator.share` e
  testes de presença/ausência dos itens
- `src/App.jsx` — `compartilharLista` (só `text`; sucesso avisa, `AbortError`
  ignora, outra rejeição copia) e os handlers; props no `MenuDeCompartilhar`
- `src/App.compartilhar.test.jsx` — criado (integração do compartilhar)
- `docs/interface.md` — § Menu de ações › Compartilhar e § Avisos
- `AGENTS.md` — § Onde fica cada coisa
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0021-botao-compartilhar/0002-compartilhar-pela-folha-do-sistema.md` —
  status
