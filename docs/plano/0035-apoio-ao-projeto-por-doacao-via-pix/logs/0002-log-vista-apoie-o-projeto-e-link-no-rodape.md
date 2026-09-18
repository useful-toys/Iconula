<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0035-0002: Vista "Apoie o projeto" e link no rodapé

## Data
2026-09-18

## Resumo
Criada a vista interna "Apoie o projeto" (IDR 0070): novo componente
`ApoieOProjeto.jsx` no molde de leitura do `Sobre` (TDR 0020), com frase de
contexto, QR code Pix gerado em runtime a partir de `montarPayloadPix()`
(Tarefa 0035-0001, TDR 0029), a chave em texto ao lado da imagem, "Copiar
chave Pix" e "Compartilhar chave Pix…" (esta só onde há `navigator.share`).
O estado único `vistaInterna` ganhou o valor `'apoie'` em `App.jsx`, e o
link "Apoie o projeto" entrou no rodapé da tela principal e na linha de
links do cartão da tela de login.

Antes, nenhuma tela citava doação/Pix; o app não tinha como receber apoio.
Agora o visitante (mesmo sem login) e o usuário autenticado chegam à chave
em um toque, com o QR e a chave em texto como caminhos equivalentes.

Divergências entre tarefa e código: o texto fala em "rodapé das duas telas",
mas a tela de login tem rodapé próprio sem links (IDR 0053) — o link entrou
na linha de links do cartão, como o "Sobre" da Tarefa 0033-0001. O `Rodape`
é compartilhado com a vista do catálogo compartilhado; ela passou a receber
`onAbrirApoie` de `App.jsx`, senão o link novo ficaria inerte lá.

## Discovery
- Código:
  - Molde de vista interna: `Sobre.jsx`/`Sobre.css` (a mais recente,
    IDR 0063) e `TermosDeUso.jsx`/`TermosDeUso.css` — `onVoltar`, "← Voltar"
    com seta em `aria-hidden`, título dourado Poppins 700/22px e corpo de
    640px; `Sobre.css` é a base direta de `ApoieOProjeto.css`.
  - `src/lib/pix.js` (Tarefa 0035-0001) exporta `montarPayloadPix()` (sem
    argumentos; overrides de nome/cidade só para teste) e `chavePix`; é
    pré-requisito de leitura, não muda nesta tarefa.
  - `qrcode` 1.5.4: o campo `browser` troca `lib/index.js` por
    `lib/browser.js`; `toString(payload, { type: 'svg' })` devolve SVG por
    string, sem canvas (o caminho `toDataURL` usa canvas e não é confiável
    no jsdom). O SVG entra num `<img>` via data URI, o que evita
    `dangerouslySetInnerHTML` (`react/no-danger` é erro no oxlint).
  - Cópia/folha do sistema: `App.jsx` (`copiarParaAreaDeTransferencia`,
    `compartilharLista`) usa `navigator.clipboard.writeText` com aviso de
    sucesso (IDR 0029) e `navigator.share`, tratando `AbortError` sem aviso;
    `MenuDeCompartilhar.jsx` lê `navigator.share` no render. A
    `ApoieOProjeto`, por receber só `onVoltar` de `App.jsx`, faz a
    cópia/compartilhamento por conta própria (importa `emitirAviso`).
  - `Rodape.jsx` é usado pela tela principal (`App.jsx:978`) e pelas duas
    telas da vista do catálogo compartilhado
    (`CatalogoCompartilhado.jsx:165,210`). A tela de login **não** usa
    `Rodape`: tem rodapé próprio (três linhas, sem links — IDR 0053) e os
    links no cartão. O ramo `compartilhado` de `CatalogoCompartilhado.jsx`
    (linha 210) já não repassava `onAbrirSobre` — divergência pré-existente
    da Fase 33, anotada em `observacoes` do relatório (não corrigida).
  - `vistaInterna` aceitava `null | 'politica' | 'termos' | 'sobre' |
    'contaApagada'`, checado antes da guarda de login (TDR 0020);
    `'apoie'` entrou como mais um ramo, com `Avisos` junto, como em
    `'politica'` (a vista emite avisos).
  - Testes da área: `Rodape.test.jsx` (linha 27 travava
    "Política de privacidade · Termos de uso · Sobre"),
    `TelaDeLogin.test.jsx` (linha 43 travava "Política de privacidade ·
    Sobre"), `Sobre.test.jsx` e `App.sobre.test.jsx` como molde;
    `App.test.jsx` não cobre o rodapé.
- Documentação:
  - `docs/interface.md` § Tela de login (links e rodapé), § Demais telas
    (subseção "Sobre" como molde e § Catálogo compartilhado), a linha de
    links do rodapé no wireframe e as medidas do rodapé.
  - `docs/idr/0070` (decisão: conteúdo da vista, acesso pelo rodapé, QR,
    chave em texto, copiar/compartilhar) e `docs/tdr/0029` (payload, chave e
    valor, já implementados).

## Plano da alteração
1. Criar `ApoieOProjeto.jsx` + `ApoieOProjeto.css`: layout de leitura do
   `Sobre`, com frase de contexto, QR gerado em runtime
   (`QRCode.toString` → SVG em `<img>` com nome acessível), chave em texto
   ao lado, "Copiar chave Pix" e "Compartilhar chave Pix…" (só com
   `navigator.share`).
2. Criar `ApoieOProjeto.test.jsx`: QR/chave/contexto/"← Voltar", cópia com
   aviso "chave copiada" e o botão de compartilhar condicionado a
   `navigator.share`.
3. `Rodape.jsx`: quarto link "Apoie o projeto" e prop `onAbrirApoie`;
   atualizar `Rodape.test.jsx` (linha de links e clique).
4. `TelaDeLogin.jsx`: link "Apoie o projeto" na linha do cartão, ao lado de
   "Política de privacidade" e "Sobre" (o rodapé da tela segue sem links);
   atualizar `TelaDeLogin.test.jsx`.
5. `App.jsx`: importar a vista, ramo `vistaInterna === 'apoie'` com
   `Avisos`, e `onAbrirApoie` para `TelaDeLogin`, `Rodape` e
   `CatalogoCompartilhado`.
6. `CatalogoCompartilhado.jsx`: aceitar e repassar `onAbrirApoie` aos dois
   `Rodape` (impacto não citado: sem o repasse, o link novo ficaria inerte
   na vista do link).
7. Criar `App.apoie.test.jsx`: integração — abrir pelo cartão da tela de
   login e pelo rodapé da tela principal e voltar à origem.
8. `docs/interface.md`: nova subseção "Apoie o projeto" em § Demais telas,
   citando o IDR 0070; linha de links da tela de login, wireframe e medidas
   do rodapé e a linha do catálogo compartilhado.
9. Status/log/README no mesmo commit.
- Verificação prevista: critérios 1–3 → `ApoieOProjeto.test.jsx`; critério
  4 → `Rodape.test.jsx`, `TelaDeLogin.test.jsx` e `App.apoie.test.jsx`;
  critério 5 → leitura de `docs/interface.md`; lint/test/build.
- Riscos: `qrcode` no jsdom (mitigado com o caminho SVG); link inerte no
  catálogo compartilhado (resolvido no passo 6); divergência pré-existente
  do `onAbrirSobre` na linha 210 (não corrigida, anotada no relatório).
- Desvios: `App.apoie.test.jsx` criado como arquivo próprio (o texto da
  tarefa citava `App.test.jsx`, que não cobre o rodapé), no mesmo padrão
  `App.sobre.test.jsx` da Tarefa 0033-0001. O ramo `'apoie'` inclui
  `Avisos`, como o ramo `'politica'`, porque a vista emite avisos — o
  pseudocódigo da tarefa mostrava só o componente. `docs/interface.md`
  ganhou os wireframes regerados (a linha de links não caberia na largura
  antiga).

## Decisões tomadas
- `ApoieOProjeto` usa `QRCode.toString` (SVG) e o SVG num `<img>` por data
  URI, em vez de `toDataURL`: o caminho SVG não depende de canvas (ausente
  no jsdom) e evita `dangerouslySetInnerHTML`. Nível 1.
- A vista faz cópia/compartilhamento por conta própria, com `emitirAviso`
  direto, e o ramo `'apoie'` de `App.jsx` renderiza `Avisos` junto — mesmo
  desenho da `'politica'`; o texto da tarefa só lhe dá `onVoltar`. Nível 1.
- Avisos de sucesso exatamente `chave copiada` e `chave compartilhada`
  (minúsculas), como citados na tarefa e no critério de aceite. Nível 1.
- `CatalogoCompartilhado.jsx` repassa `onAbrirApoie` ao `Rodape` das duas
  telas; sem isso o link novo ficaria inerte na vista do catálogo
  compartilhado (mesmo tratamento dado ao `onAbrirSobre` na Tarefa
  0033-0001). Nível 1.
- `App.apoie.test.jsx` como teste de integração próprio, porque
  `App.test.jsx` não cobre o rodapé e o critério pede "abre a vista ao
  clicar". Nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — sem avisos.
`npm run test` — 53 arquivos, 687 testes, todos passando.
`npm run build` — 177 módulos, build concluído em 896ms; o aviso
`(!) Some chunks are larger than 500 kB` é pré-existente (bundle do
Firebase; já anotado em tarefas anteriores).
`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] `ApoieOProjeto.jsx` renderiza o QR, a chave em texto, a frase de
      contexto e "← Voltar" funcional — `ApoieOProjeto.test.jsx` (6 testes):
      "renderiza o QR, a chave em texto e a frase de contexto" (o `<img>`
      com `src` data URI e nome acessível) e "voltar chama onVoltar".
- [x] Botão "Copiar chave Pix" copia a chave e mostra o aviso "chave
      copiada" — `ApoieOProjeto.test.jsx` ("o botão Copiar chave Pix copia a
      chave e avisa 'chave copiada'": `writeText` chamado com `chavePix` e o
      texto do aviso; mais o caso sem área de transferência, dourado).
- [x] Botão "Compartilhar chave Pix…" só aparece quando `navigator.share`
      existir — `ApoieOProjeto.test.jsx` ("esconde o compartilhar quando não
      há folha do sistema" e "mostra o compartilhar onde há folha do sistema
      e entrega só a chave", com `{ text: chavePix }`).
- [x] O rodapé das duas telas (login e principal) mostra o link "Apoie o
      projeto" e abre a vista ao clicar — `Rodape.test.jsx` ("o link Apoie o
      projeto chama onAbrirApoie"), `TelaDeLogin.test.jsx` ("o link Apoie o
      projeto é acionável sem sessão") e `App.apoie.test.jsx` (abre pelo
      cartão da tela de login e pelo rodapé da principal, e volta). Na tela
      de login o link vive no cartão, não no rodapé (ver "Resumo").
- [x] `docs/interface.md` descreve a vista, citando o IDR 0070 — subseção
      "### Apoie o projeto" (linha 879) e referências ao IDR 0070 na tela de
      login, no catálogo compartilhado e no rodapé.

## Arquivos alterados
- `src/components/ApoieOProjeto.jsx` — criado (vista interna com QR, chave
  em texto, copiar/compartilhar).
- `src/components/ApoieOProjeto.css` — criado (layout de leitura dos termos
  + bloco do QR e da chave).
- `src/components/ApoieOProjeto.test.jsx` — criado.
- `src/App.apoie.test.jsx` — criado (integração da vista).
- `src/components/Rodape.jsx` — quarto link "Apoie o projeto" e
  `onAbrirApoie`.
- `src/components/Rodape.test.jsx` — linha de links e teste do clique.
- `src/components/TelaDeLogin.jsx` — link "Apoie o projeto" e
  `onAbrirApoie`.
- `src/components/TelaDeLogin.test.jsx` — linha de links e teste do clique.
- `src/components/CatalogoCompartilhado.jsx` — aceita e repassa
  `onAbrirApoie` aos dois `Rodape`.
- `src/App.jsx` — ramo `'apoie'` e `onAbrirApoie` nas três telas.
- `docs/interface.md` — § Tela de login, § Demais telas › "Apoie o projeto",
  § Catálogo compartilhado, wireframes e medidas do rodapé.
- `docs/plano/0035-.../0002-vista-apoie-o-projeto-e-link-no-rodape.md` —
  status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0035-.../logs/0002-log-vista-apoie-o-projeto-e-link-no-rodape.md`
  — este log.

## Execução interrompida
Não se aplica.

## Correções pós-PR
Não se aplica.
