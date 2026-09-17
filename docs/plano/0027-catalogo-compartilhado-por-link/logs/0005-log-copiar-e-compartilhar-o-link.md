<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0005: copiar e compartilhar o link do catálogo

## Data
2026-09-16

## Resumo
Com o link do catálogo ligado, o terceiro bloco do popup Compartilhar passa a
oferecer `Copiar link do catálogo` e, onde há folha do sistema,
`Compartilhar link do catálogo…`. Os dois itens entregam só a URL
`<origem>/catalogo/<uid>` — nada de texto junto (IDR 0055). Desligado, os
itens não existem, do mesmo jeito que os itens de compartilhar das listas só
nascem com `navigator.share` (IDR 0024).

Antes, a chave da Tarefa 0027-0004 já ligava e desligava o link, mas não havia
como obter a URL: o usuário teria de montá-la à mão. Depois, a cópia e a folha
saem do próprio popup.

Mudanças por arquivo:

- `src/components/MenuDeCompartilhar.jsx` — duas props novas (`onCopiarLink`,
  `onCompartilharLink`); com `linkAtivo`, dois `menuitem` logo abaixo da chave,
  o de compartilhar só com `navigator.share`. Ambos fecham o popup como os
  demais itens (via `escolher`).
- `src/App.jsx` — `urlDoLinkDoCatalogo` (`location.origin` + `/catalogo/<uid>`);
  `handleCopiarLink` reaproveita `copiarParaAreaDeTransferencia`, que ganhou um
  parâmetro de mensagem de sucesso (agora também `Link copiado`); `handleCompartilharLink`
  chama `navigator.share({ url })`, avisa `Link compartilhado`, ignora
  `AbortError` e cai na cópia em outra rejeição.
- Testes de componente e de integração, e a documentação viva.

Divergências: nenhuma. A tarefa confere com o código e com o IDR 0055.

## Discovery
- Código: `MenuDeCompartilhar.jsx` já concentra o popup, com `podeCompartilhar`
  lido no render e `escolher(acao)` fechando o popup; o terceiro bloco (chave)
  veio na Tarefa 0027-0004 e é o ponto de inserção dos itens. `App.jsx` já tem
  `copiarParaAreaDeTransferencia(texto, tipo)` (Lista copiada + reserva do
  IDR 0039) e `compartilharLista(texto, tipo)` (só `text`, `AbortError` mudo,
  outra rejeição cai na cópia) — os dois padrões a espelhar. O `uid` da sessão
  já existe em `App.jsx:202` e `alvoDoCatalogo` cobre o caminho `/catalogo/`.
  Os testes seguem `App.compartilhar.test.jsx`/`App.copiar.test.jsx` (fake
  timers, `fireEvent`, `Object.defineProperty` para `navigator.share`/`clipboard`,
  `window.prompt`) e `MenuDeCompartilhar.test.jsx` (RTL + `userEvent`).
  Comportamento atual confere com a tarefa; sem impacto fora dos arquivos
  impactados.
- Documentação: as referências bastaram. Conferi `docs/interface.md`
  § Menu de ações › Compartilhar e § Avisos para o texto do estado atual.

## Plano da alteração
1. `MenuDeCompartilhar.jsx`: props `onCopiarLink`/`onCompartilharLink`; com
   `linkAtivo`, abaixo da chave, `Copiar link do catálogo` e (com
   `podeCompartilhar`) `Compartilhar link do catálogo…`, ambos `menuitem`.
2. `App.jsx`: `urlDoLinkDoCatalogo`; terceiro parâmetro de mensagem em
   `copiarParaAreaDeTransferencia`; `handleCopiarLink` e `handleCompartilharLink`;
   props no `MenuDeCompartilhar`.
3. `MenuDeCompartilhar.test.jsx`: itens só com o link ligado; compartilhar só
   com `navigator.share`; callbacks.
4. `App.linkDoCatalogo.test.jsx`: URL com origem e `uid`; payload só `url`;
   avisos; `AbortError`; queda para a cópia.
5. `docs/interface.md` (§ Menu de ações › Compartilhar, § Avisos) e `AGENTS.md`
   (§ Onde fica cada coisa, linha do `MenuDeCompartilhar.jsx`), citando IDR 0055.
- Verificação prevista: critérios 1–3 → testes de componente/integração;
  critério 4 → saída dos testes; critério 5 → leitura dos trechos.
- Riscos: a mensagem de sucesso da cópia virar fixa e apagar `Lista copiada`;
  mitigado pelo parâmetro com valor padrão. O aviso de sucesso do link não
  pode dispensar a falha da chave: uso tipos distintos (`copiar-link`,
  `compartilhar-link`).
- Desvios: nenhum.

## Decisões tomadas
- `copiarParaAreaDeTransferencia` ganha um terceiro parâmetro posicional com
  padrão `'Lista copiada'` e os tipos de aviso `copiar-link`/`compartilhar-link`
  (distintos de `link`, da chave, para um sucesso de cópia não dispensar a
  falha de ligar/desligar) — nível 1, API interna.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (88 files, 105 rules).
- `npm run test` → `Test Files 43 passed (43)` / `Tests 580 passed (580)`
  (eram 571 na Tarefa 0027-0004: +9 testes desta tarefa). Os avisos de
  `act(...)` do componente `Avisos` são os já presentes nos testes de App
  pré-existentes (registrados no log da Tarefa 0027-0004), não novos.
- `npm run build` → `✓ built in 900ms`; aviso de chunk > 500 kB já conhecido
  (SDK do Firebase carregado sob demanda).
- `npm run test:rules` → não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] Link ligado: `Copiar link do catálogo` presente e, com
      `navigator.share`, `Compartilhar link do catálogo…`; desligado: nenhum —
      `MenuDeCompartilhar.test.jsx` › "itens do link do catálogo".
- [x] A URL copiada e compartilhada é `<origem>/catalogo/<uid>` —
      `App.linkDoCatalogo.test.jsx` › "copiar entrega a URL…" e "compartilhar
      manda só a url…", contra `window.location.origin` e o `uid` do login.
- [x] `navigator.share` recebe só `url` — mesmo teste,
      `toHaveBeenCalledWith({ url })`.
- [x] Avisos `Link copiado` e `Link compartilhado`; `AbortError` sem aviso;
      outra rejeição cai na cópia — `App.linkDoCatalogo.test.jsx`.
- [x] `docs/interface.md` e `AGENTS.md` atualizados (§ Menu de ações ›
      Compartilhar, § Avisos; § Onde fica cada coisa).

## Arquivos alterados
- `src/components/MenuDeCompartilhar.jsx` — props `onCopiarLink`/`onCompartilharLink`
  e os dois itens abaixo da chave, com o link ligado.
- `src/components/MenuDeCompartilhar.test.jsx` — novo bloco de testes dos
  itens do link.
- `src/App.jsx` — `urlDoLinkDoCatalogo`, `handleCopiarLink`,
  `handleCompartilharLink`; mensagem de sucesso parametrizada na cópia.
- `src/App.linkDoCatalogo.test.jsx` — testes de copiar e compartilhar o link.
- `docs/interface.md` — § Menu de ações › Compartilhar e § Avisos.
- `AGENTS.md` — linha do `MenuDeCompartilhar.jsx`.
- `docs/plano/0027-catalogo-compartilhado-por-link/0005-copiar-e-compartilhar-o-link.md`
  e `docs/plano/README.md` — status.

