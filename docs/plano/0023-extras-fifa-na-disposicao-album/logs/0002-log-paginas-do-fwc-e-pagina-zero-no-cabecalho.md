<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0023-0002: páginas do FWC e página 0 no cabeçalho

## Data
2026-09-15

## Resumo
Antes, a seção `FWC` nascia com `paginas: null` (página do checklist ainda
pendente — TDR 0010) e `CabecalhoSecao` tratava esse caso com um ramo
condicional que omitia o número da página no cabeçalho. Como o TDR 0010 e o
MDR 0006 já registram as oito páginas físicas confirmadas pelo humano
(0–3 e 106–109), esta tarefa aplica o dado: `fwc.paginas` passa a
`[0, 1, 2, 3, 106, 107, 108, 109]`, o comentário acima da seção deixa de
falar em pendência do checklist, e `CabecalhoSecao` perde o ramo "sem
página" — toda seção agora tem `paginas` não vazio, então a primeira
página é sempre lida diretamente de `secao.paginas[0]`, preservando o `0`
(que já era mantido por `filter(Boolean)` sobre uma string, mas o ramo
condicional morto foi removido). O cabeçalho do FWC passa a mostrar
`Extras FIFA FWC 0`, como as demais seções.

`docs/modelo-memoria.md` § Catálogo estático é atualizado: `paginas`
deixa de ser descrito como "spread ou `null`" e passa a citar o MDR 0006
com a forma atual (lista das páginas físicas, seleções/COC = spread,
FWC = 0–3 e 106–109).

Testes: `catalogo.test.js` ganha duas invariantes (toda seção com
`paginas` não vazio de inteiros crescentes; FWC com as oito páginas
exatas e COC com 112–113 inalterada). `Secao.test.jsx` troca o teste
"omite o número da página…" por "mostra a página 0 do FWC" e ganha um
teste novo confirmando que o cabeçalho de uma seleção mostra a primeira
página do spread (`Brasil BRA 24`); as três fixtures de FWC que usavam
`paginas: null` passam a usar as oito páginas físicas, para não ficarem
divergentes do dado real.

Nenhuma divergência entre tarefa, documentação e código: `layoutDeSecao`
(`catalogoLayout.js`) decide o layout de álbum pela `sigla` da seção, não
por `paginas`, então a mudança não afeta o "FWC sempre em lista" (fora do
escopo desta tarefa — Tarefa 0023-0003); `catalogoOrdenacoes.js` só lê
`paginas[0]` para ordenar as seleções entre si, sem tocar no FWC.

## Discovery
- Código: `src/data/catalogo.js` (seção `fwc`, comentário), `src/components/Secao.jsx`
  (`CabecalhoSecao`, cálculo de `pagina` e `identificacao`),
  `src/data/catalogoLayout.js` (`layoutDeSecao` decide por `sigla`, não por
  `paginas` — confirma que o FWC continua sem layout de álbum, fora do
  escopo), `src/data/catalogoOrdenacoes.js` (usa `paginas[0]` só para
  ordenar seleções entre si — não toca no FWC). Testes existentes:
  `src/data/catalogo.test.js` (invariantes do catálogo, sem cobertura de
  "toda seção tem `paginas` não vazio" antes desta tarefa) e
  `src/components/Secao.test.jsx` (três fixtures de FWC com
  `paginas: null`, usadas nos testes "omite o número da página…", "FWC
  sempre usa lista contínua…" e a tabela `it.each` de cor do cabeçalho).
  Comportamento atual conferia com a tarefa: `pagina = secao.paginas ?
  ... : null` já preservava o `0` via `filter(Boolean)` sobre string, mas
  o ramo condicional ficaria morto depois da mudança do dado — removido
  conforme pedido ("o ramo de 'seção sem página' deixa de existir").
- Documentação: além das referências, conferido o texto atual de
  `docs/modelo-memoria.md` § Catálogo estático (linha com "`paginas`
  (spread ou `null`)") e o texto já vigente do MDR 0006 § Decisão ›
  Estrutura de cada seção e § Consequências (já cita a forma nova e a
  implementação "Fase 0023, Tarefa 0023-0002" — só a tarefa aplica o
  dado, o registro já existia do planejamento) e do TDR 0010 § Contexto
  › Página do FWC (idem). Nenhum dos dois precisa de edição: já
  descrevem o estado alvo.

## Plano da alteração
1. `src/data/catalogo.js`: `fwc.paginas` → `[0, 1, 2, 3, 106, 107, 108,
   109]`; comentário da seção deixa de citar a pendência do checklist.
2. `src/components/Secao.jsx`: `CabecalhoSecao` lê `secao.paginas[0]`
   direto, sem o ramo ternário de seção sem página.
3. `src/data/catalogo.test.js`: duas invariantes novas (todas as seções
   com `paginas` não vazio de inteiros crescentes; FWC com as oito
   páginas exatas, COC com `[112, 113]` inalterada).
4. `src/components/Secao.test.jsx`: troca "omite o número da página…"
   por "mostra a página 0 do FWC" (`Extras FIFA FWC 0`); teste novo de
   seleção mostrando a primeira página do spread (`Brasil BRA 24`);
   atualiza as três fixtures de FWC com `paginas: null` para as oito
   páginas.
5. `docs/modelo-memoria.md` § Catálogo estático: troca "spread ou
   `null`" pela forma atual, citando o MDR 0006.
- Verificação prevista: cada critério de aceite por teste ou busca (ver
  § Critérios de aceite abaixo).
- Riscos: nenhum além do coberto — mudança contida em dado estático e
  numa leitura direta de array, sem novo estado nem efeito colateral.
- Desvios: nenhum.

## Decisões tomadas
Nenhuma decisão significativa. A tarefa só aplica decisões já registradas
no planejamento (TDR 0010, MDR 0006, IDR 0023, IDR 0028 — "Decisões já
tomadas"). Redação exata dos dois testes novos e da fixture atualizada é
detalhe de implementação previsto pela própria tarefa (nível 1, sem
registro).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> iconula@0.0.0 lint
> oxlint
(sem avisos, saída vazia, exit 0)

$ npm run test
> iconula@0.0.0 test
> vitest run

 Test Files  41 passed (41)
      Tests  508 passed (508)

$ npm run build
> iconula@0.0.0 build
> vite build
✓ 136 modules transformed.
✓ built in 650ms
(!) Some chunks are larger than 500 kB after minification — aviso
pré-existente do chunk do SDK do Firestore (`index.esm-*.js`, carregado
sob demanda, ADR 0005), já registrado como pré-existente no log da
Tarefa 0023-0001; esta tarefa não mexeu em dependências nem em bundling.
```

`npm run test:rules` não se aplica: a tarefa não toca `firestore.rules`.

## Critérios de aceite
- [x] Seção FWC com `paginas` exatamente `[0, 1, 2, 3, 106, 107, 108,
      109]` (teste) — `src/data/catalogo.test.js` "FWC tem as oito
      páginas físicas confirmadas e a Coca-Cola mantém 112–113"
- [x] Nenhuma seção com `paginas` nulo ou vazio (teste) —
      `src/data/catalogo.test.js` "toda seção tem `paginas` como lista
      não vazia de inteiros em ordem crescente"
- [x] Cabeçalho do FWC com `Extras FIFA FWC 0` nas duas disposições
      (teste) — `src/components/Secao.test.jsx` "mostra a página 0 do
      FWC" (lista) e "FWC sempre usa lista contínua, mesmo na disposição
      álbum" (disposição álbum — mesma fixture, agora com as oito
      páginas, cobre a identificação também nesse modo, já que o FWC
      continua em lista contínua nas duas disposições — IDR 0023)
- [x] Cabeçalho de seleção com a primeira página do spread (`Brasil BRA
      24` — teste novo) — `src/components/Secao.test.jsx` "mostra a
      primeira página do spread no cabeçalho da seleção"
- [x] Ordem das seções nas duas ordenações inalterada (testes existentes
      de ordenação verdes) — `src/data/catalogo.test.js`, describe
      "ordenações", 6 testes, todos verdes
- [x] `docs/modelo-memoria.md` sem "spread ou `null`", citando o MDR 0006
      (busca) — `grep -n "spread ou" docs/modelo-memoria.md` sem
      resultado (exit 1); linha da seção cita `[MDR 0006]`

## Arquivos alterados
- `src/data/catalogo.js` — `fwc.paginas` com as oito páginas físicas;
  comentário atualizado
- `src/data/catalogo.test.js` — duas invariantes novas de `paginas`
- `src/components/Secao.jsx` — `CabecalhoSecao` sem o ramo "sem página"
- `src/components/Secao.test.jsx` — teste "omite…" trocado por "mostra a
  página 0 do FWC"; teste novo da primeira página da seleção; três
  fixtures de FWC atualizadas
- `docs/modelo-memoria.md` — § Catálogo estático, `paginas` sem "spread
  ou `null`", citando o MDR 0006
- `docs/plano/0023-extras-fifa-na-disposicao-album/0002-paginas-do-fwc-e-pagina-zero-no-cabecalho.md` — status `Concluída`
- `docs/plano/README.md` — linha da Tarefa 0023-0002 → `Concluída`
