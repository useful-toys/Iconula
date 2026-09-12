<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0014-0002: o número zero nos textos de troca

## Data
2026-09-12

## Resumo
Os textos de troca passaram a imprimir o número da figurinha sempre com
dois dígitos, como no cartão e no código. Antes, `gerarTextoFaltantes`
usava `String(posicao)` e `gerarTextoRepetidas`, `${posicao}×${contagem - 1}`;
com `FWC00` no catálogo desde a Tarefa 0014-0001, a linha dos Extras FIFA
sairia `Extras FIFA FWC: 0 …`, e um `0` solto num grupo de WhatsApp lê como
erro de digitação ou "nenhuma". Agora saem `Extras FIFA FWC: 00 01` e
`FWC 00×1`, e as seleções também com dois dígitos: `Brasil BRA: 05 08 12 19`,
`05×2`.

A mudança ficou contida nas duas funções de `src/lib/textoDeTroca.js`
(`formatarNumero`), mais o JSDoc do módulo. O separador entre números
continua sendo o espaço — é o que `docs/requisitos.md` § Compartilhamento
especifica; a decisão muda só a quantidade de dígitos, não o formato da
linha. A ordem do álbum (IDR 0039) e a ordem crescente por posição não
mudaram.

`docs/requisitos.md` § Compartilhamento foi atualizado no mesmo commit: o
exemplo `Brasil BRA: 5 8 12 19` virou `Brasil BRA: 05 08 12 19` e o de
repetidas, `5×2` para `05×2`, para requisito e comportamento não
divergirem.

Os rótulos acessíveis de `FWC00` já derivam do próprio código em
`src/components/Figurinha.jsx` (`sigla = codigo.slice(0, 3)`,
`numero = codigo.slice(3)`), então não precisaram de mudança: um teste novo
em `Figurinha.test.jsx` trava a leitura "FWC 00, faltante" e "remover uma
unidade de FWC 00".

## Decisões tomadas
- **IDR 0044**
  (`docs/idr/0044-numero-de-dois-digitos-no-texto-de-troca.md`): decisão de
  apresentação visível ao usuário — todo número nos textos de troca sai com
  dois dígitos, em todas as seções, sem exceção por seção. Decisão de nível
  1, tomada e registrada nesta tarefa.
- **Premissa explícita (decisão de nível 2)**: adotado o encaminhamento da
  tarefa — dois dígitos em **todas** as seções — em vez da variante "só no
  FWC". O IDR 0044 deixa a alternativa registrada; se o humano preferir
  preservar o texto enxuto das seleções, a variante cabe no mesmo IDR. Esta
  é a única ambiguidade que muda comportamento visível, e foi resolvida pela
  premissa mais alinhada ao cartão (o texto passa a ser cópia fiel do que
  está impresso na figurinha).

## Impedimentos
Nenhum bloqueio. Limitação de verificação registrada (impedimento nível 2,
premissa conservadora): a "Verificação em `npm run dev`" da tarefa — marcar
`FWC00` com 2 unidades e conferir o texto colado — não foi feita numa sessão
de navegador real, porque o catálogo só existe atrás do login Google
(`requisitos.md` § Acesso) e não há sessão autenticada automatizável neste
ambiente. A verificação foi feita pelos testes da função pura
(`textoDeTroca.test.js`, com a linha do FWC e o `00×1`) e pela integração de
`App.jsx` (`App.copiar.test.jsx`, que copia o texto real e confere o
`05×2`) — mesmo caminho de código que o menu de ações executa.

## Validação
```
npm run lint && npm run test && npm run build
```

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint


  ! react(refs): Cannot access refs during render
     ,-[src/components/Catalogo.jsx:195:44]
 194 |       // (inicializador preguiçoso do `useState`, nunca recalculado).
 195 | ,->   const [superGrupoRefHandlers] = useState(() => {
 196 | |       const map = new Map();
 197 | |       for (const letra of 'ABCDEFGHIJKL') {
 198 | |         map.set(letra, (refValue) => setSuperGrupoRef(letra, refValue));
 199 | |       }
 200 | |       return map;
 201 | |->   });
     : `---- Passing a ref to a function may read its value during render
 202 |     
     `----
  help: React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected
  note: React Compiler skipped optimizing this component or hook. Additional guidance: https://react.dev/reference/eslint-plugin-react-hooks/lints/refs

Found 1 warning and 0 errors.
Finished in 43ms on 69 files with 105 rules using 4 threads.
```
Único aviso pré-existente e já documentado no TDR 0021; nada novo.

### `npm run test`
```
> iconula@0.0.0 test
> vitest run

 ✓ src/lib/textoDeTroca.test.js (13 tests) 13ms
 ✓ src/App.copiar.test.jsx (6 tests) 1906ms
 ✓ src/components/Figurinha.test.jsx (14 tests) 681ms
 (demais arquivos)

 Test Files  35 passed (35)
      Tests  374 passed (374)
   Duration  47.41s (environment 57%, tests 26%, import 14%, transform 2%, worker 1%)
```
Os avisos `An update to Avisos inside a test was not wrapped in act(...)`
no stderr são pré-existentes e não relacionados; a suíte sai verde.
`textoDeTroca.test.js` foi de 11 para 13 testes, `Figurinha.test.jsx` de 13
para 14. As asserções de número passaram de `5 8 12 19`/`5×2` para
`05 08 12 19`/`05×2`, com testes novos para o `00` no FWC (faltantes e
repetidas).

### `npm run build`
```
> iconula@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 130 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                     1.01 kB │ gzip:   0.51 kB
dist/assets/index-BCVqlIEu.css                     14.56 kB │ gzip:   3.43 kB
dist/assets/index-fvMlj38B.js                     408.66 kB │ gzip: 123.30 kB
dist/assets/index.esm-mhoVpnUy.js                 505.90 kB │ gzip: 148.77 kB
✓ built in 752ms
```
Aviso de chunk > 500 kB pré-existente, não relacionado.

## Arquivos alterados
- `src/lib/textoDeTroca.js` — `padStart(2, "0")` nas duas funções e JSDoc
- `src/lib/textoDeTroca.test.js` — fixture com `FWC00`, asserções de dois dígitos e testes do `00`
- `src/components/Figurinha.test.jsx` — teste dos rótulos acessíveis de `FWC00`
- `src/App.copiar.test.jsx` — expectativa `05×2`
- `docs/requisitos.md` § Compartilhamento — exemplos com dois dígitos
- `docs/idr/0044-numero-de-dois-digitos-no-texto-de-troca.md` — novo
- `docs/plano/0014-numeracao-dos-extras-fifa/0002-o-numero-zero-nos-textos-de-troca.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0014-0002 atualizado
- `docs/plano/0014-numeracao-dos-extras-fifa/logs/0002-log-o-numero-zero-nos-textos-de-troca.md` — este log
