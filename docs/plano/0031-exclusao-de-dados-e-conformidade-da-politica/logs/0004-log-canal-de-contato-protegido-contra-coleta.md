<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0004: canal de contato protegido contra coleta

## Data
2026-09-17

## Resumo
O e-mail do controlador deixa de existir como literal contíguo em `src/` e
passa a ser montado em runtime. Antes: duas âncoras
`<a href="mailto:dff4321@gmail.com">` literais, uma em
`PoliticaDePrivacidade.jsx` e outra em `TermosDeUso.jsx`. Depois:
`src/lib/contato.js` guarda o endereço em partes (`usuario`, `dominio`) e
exporta `enderecoDeContato()` e `hrefDeContato()`; `src/components/LinkDeContato.jsx`
monta `href` e texto visível pela mesma função e leva
`rel="nofollow noreferrer"` (TDR 0028); as duas vistas passam a usar o
componente. O alcance da proteção — derrota o raspador que lê o HTML
servido, não o que executa JavaScript — fica documentado no próprio
módulo, como pede o TDR 0028.

## Discovery
- Código: `src/lib/contato.js`, `src/components/LinkDeContato.jsx`/`.css`
  não existem. As âncoras literais são
  `src/components/PoliticaDePrivacidade.jsx:181` e
  `src/components/TermosDeUso.jsx:82`; os dois CSS já pintam `a` de
  `var(--gold)` (`.politica__corpo a`, `.termos__corpo a`). Busca em
  `src/` por `mailto|dff4321` só encontra esses dois arquivos mais os
  testes `PoliticaDePrivacidade.test.jsx:23,61` e
  `TermosDeUso.test.jsx:38-40`, que checam texto visível e `href` — o
  componente preserva ambos, então seguem válidos. Convenções locais:
  arquivos com copyright no topo; `.js` com teste `.test.js` em `src/lib/`;
  `.jsx` com `.css` e `.test.jsx` co-localizados; testes em RTL +
  jest-dom + userEvent. Impacto fora de "Arquivos impactados": nenhum.
  `vite.config.js` não habilita sourcemap e os testes não entram no
  bundle, então o literal não deve aparecer em `dist/`.
- Documentação: as referências bastaram; li o TDR 0028 inteiro (a
  técnica e o alcance), o IDR 0061 § Decisão (o endereço publicado
  continua o atual), os ADR 0007/0008 e `docs/interface.md`
  §§ Política de privacidade e Termos de uso, para citar o TDR no
  lastro do texto alterado.

## Plano da alteração
1. Criar `src/lib/contato.js` — partes do endereço e as funções
   `enderecoDeContato()` (junta com `String.fromCharCode(64)`) e
   `hrefDeContato()`; comentário com o alcance declarado (TDR 0028).
2. Criar `src/lib/contato.test.js` — prova que a junção devolve o
   endereço correto e que o `mailto:` acompanha.
3. Criar `src/components/LinkDeContato.jsx`, `.css` e `.test.jsx` —
   âncora com `href` e texto pela mesma função e `rel="nofollow
   noreferrer"`; teste confere `href`, texto visível e `rel`.
4. Substituir as duas âncoras literais pelo componente em
   `PoliticaDePrivacidade.jsx` e `TermosDeUso.jsx`.
5. `docs/interface.md` §§ Política de privacidade e Termos de uso —
   registrar que o contato é um componente comum às duas vistas
   (lastro: TDR 0028).
6. `AGENTS.md` § Onde fica cada coisa — linhas de `src/lib/contato.js` e
   `src/components/LinkDeContato.jsx`.
7. Validação: `npm run lint && npm run test && npm run build` e as
   buscas dos critérios.
- Verificação prevista: critério 1 → build + busca por
  `dff4321@gmail.com` (e por `dff4321`) em `dist/`; critério 2 → teste
  `LinkDeContato.test.jsx`; critério 3 → busca por `href="mailto:` em
  `src/`; critério 4 → lint, test e build.
- Riscos: o literal reaparecer no bundle por sourcemap (evitado: sem
  sourcemap e sem o literal contíguo) ou por cópia em teste que vá ao
  bundle (evitado: testes não são importados pelo app); regressão visual
  dos links (mitigado pelo CSS do componente e pelos seletores `.corpo a`
  já existentes).
- Desvios: nenhum.

## Decisões tomadas
- API interna de `contato.js` (`enderecoDeContato`, `hrefDeContato`) e
  nome do componente `LinkDeContato` — nível 1, estrutura/nomes.
- O CSS do componente repete `color: var(--gold)` para não depender do
  seletor do pai — nível 1, interna ao código.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` → `Found 0 warnings and 0 errors.` (96 arquivos, 105 regras).

`npm run test` → `Test Files 47 passed (47)` / `Tests 617 passed (617)`.
Os novos: `src/lib/contato.test.js` (2) e `src/components/LinkDeContato.test.jsx`
(2). As vistas seguem verdes em `PoliticaDePrivacidade.test.jsx` e
`TermosDeUso.test.jsx` (texto visível e `href` inalterados).

`npm run build` → `✓ built in 530ms`; um aviso de chunk acima de 500 kB
(`index.esm-*.js`, 505.99 kB), pré-existente e não relacionado a esta
tarefa.

Buscas dos critérios (saída real):
- `dff4321@gmail.com` em `dist/` → `NENHUMA ocorrencia`;
- `dff4321` em `dist/` → 1 ocorrência (a parte `USUARIO` do módulo);
- `mailto` em `dist/` → 1 ocorrência (o prefixo montado no componente);
- `href="mailto:` / `href=.mailto:` em `src/` → `NENHUMA ancora mailto literal`.

## Critérios de aceite
- [x] Depois de `npm run build`, uma busca pelo endereço completo em
      `dist/` não encontra nada — busca por `dff4321@gmail.com` em `dist/`
      sem ocorrência.
- [x] O teste do componente confirma que o `href` montado é o endereço
      correto e que o texto visível bate com ele —
      `src/components/LinkDeContato.test.jsx` ("monta o href e o texto
      visível…"), verde.
- [x] Nenhuma âncora `mailto:` literal resta em `src/` (verificável por
      busca) — busca por `href="mailto:`/`href=.mailto:` sem ocorrência.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas
      acima.

## Arquivos alterados
- `src/lib/contato.js` — criado: endereço em partes e `enderecoDeContato()`.
- `src/lib/contato.test.js` — criado: junção do endereço e ausência do
  literal contíguo no módulo (`?raw`).
- `src/components/LinkDeContato.jsx` — criado: âncora com `href`/texto pela
  mesma função e `rel="nofollow noreferrer"`.
- `src/components/LinkDeContato.css` — criado: cor do link em `var(--gold)`.
- `src/components/LinkDeContato.test.jsx` — criado: `href`, texto visível e
  `rel`.
- `src/components/PoliticaDePrivacidade.jsx` — âncora literal pelo
  `LinkDeContato`.
- `src/components/TermosDeUso.jsx` — âncora literal pelo `LinkDeContato`.
- `docs/interface.md` — §§ Política de privacidade e Termos de uso: o
  contato é o componente comum `LinkDeContato` (lastro TDR 0028).
- `AGENTS.md` — § Onde fica cada coisa: linhas de `src/lib/contato.js` e
  `src/components/LinkDeContato.jsx`.
- `docs/plano/0031-.../0004-...md` — status `Em andamento` → `Concluída`.
- `docs/plano/README.md` — linha da tarefa e status da fase.

