<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0020-0003: vista de termos de uso e aceite na tela de login

## Data
2026-09-14

## Resumo
Cria a quarta tela do app, a vista interna "Termos de uso", alcançável da
tela de login e do rodapé da tela principal, e faz a frase da tela de login
declarar a concordância com os termos. Antes: a única vista interna era a
política de privacidade, guardada no booleano `mostrarPolitica`; o cartão da
tela de login tinha só o link "Política de privacidade" e a frase terminava
em "…autorizado pelos responsáveis."; o rodapé principal tinha o botão único
"Política de privacidade". Depois: `App.jsx` guarda `vistaInterna`
(`null | 'politica' | 'termos'`), `TelaDeLogin` e `Rodape` ganham
`onAbrirTermos`, o cartão e o rodapé exibem "Política de privacidade · Termos
de uso" e a frase de aceite termina em "…e concorda com os Termos de uso.",
com "Termos de uso" acionando a vista.

## Discovery
- Código: li `App.jsx` (o estado `mostrarPolitica` na linha 81 e o ramo de
  retorno na linha 475, antes da guarda de login; `TelaDeLogin` na linha 508;
  `Rodape` na linha 569), `PoliticaDePrivacidade.jsx`/`.css`/`.test.jsx` (molde
  da vista: `onVoltar`, `.politica__corpo`, largura máxima 640px,
  `.politica__voltar` em `--gold`, contato `dff4321@gmail.com`),
  `TelaDeLogin.jsx`/`.css`/`.test.jsx` e `Rodape.jsx`/`.css`/`.test.jsx` (estado
  atual com copyright e isenção da Tarefa 0020-0002), e `App.politica.test.jsx`
  (padrão do teste de integração das vistas internas, com os mocks de
  `firebase/auth`, `./lib/firebase`, `./lib/colecaoRemota.js` e
  `./components/Catalogo.jsx`). Comportamento atual confere com a tarefa; não
  há uso de `Rodape`/`TelaDeLogin` fora de `App.jsx` nem outro ponto de
  impacto. Convenções: classes BEM `bloco__elemento`, tokens `--gold`,
  `--muted`, `--border`, `--page-gutter`, componentes com cabeçalho de
  copyright.
  - **Observação**: o comentário de topo de `TelaDeLogin.jsx` está defasado
    ("O link da política ainda não tem destino" e cita a Tarefa 0008-0004);
    como a tarefa mexe no arquivo, o comentário é corrigido.
- Documentação: li o `IDR 0053` § Decisão (vista, ordem do rodapé, frase de
  aceite e roteiro de conteúdo), o `TDR 0020` § Decisão (estado único
  `vistaInterna`, checado antes dos demais ramos), o `IDR 0036` § Decisão
  (atestação e `atestadoEm` não mudam), `requisitos.md` § Acesso (Nota) e
  § Privacidade (termos de uso, copyright e isenção) e `docs/interface.md`
  § Tela de login, § Wireframe da tela principal › Página inteira, § Demais
  telas › Política de privacidade e § Medidas. Confirmei que os links de
  rodapé/cartão são `--muted` com sublinhado (a regra de "Links: `--gold`" de
  § Medidas descreve os links de conteúdo, como o `mailto:` da política, cujo
  CSS é `.politica__corpo a { color: var(--gold) }`).

## Plano da alteração
1. `src/components/TermosDeUso.jsx` + `.css` (criar): vista no molde de
   `PoliticaDePrivacidade` — "← Voltar", título "Termos de uso" e as seções do
   roteiro do IDR 0053 na ordem (aceite; o que é o serviço; uso no estado em
   que se encontra; sua conta Google; limitação de responsabilidade; marcas;
   alterações dos termos; lei brasileira; contato), com o contato
   `dff4321@gmail.com`.
2. `src/App.jsx`: `mostrarPolitica` → `vistaInterna` (`null | 'politica' |
   'termos'`), checado antes dos demais ramos; `TelaDeLogin` e `Rodape` recebem
   `onAbrirTermos`.
3. `src/components/TelaDeLogin.jsx`/`.css`: frase de aceite acrescida de ", e
   concorda com os Termos de uso." com "Termos de uso" como botão inline; o
   link único vira a linha "Política de privacidade · Termos de uso"; comentário
   de topo atualizado.
4. `src/components/Rodape.jsx`/`.css`: a última linha vira "Política de
   privacidade · Termos de uso" (dois botões e o separador `·`).
5. Testes: `TermosDeUso.test.jsx` (seções na ordem e contato, voltar);
   `App.termos.test.jsx` (abre do login e do rodapé, volta à origem; com a
   política aberta não há como abrir os termos); ajustes em
   `TelaDeLogin.test.jsx`, `Rodape.test.jsx` e `App.politica.test.jsx`.
6. `docs/interface.md`: § Tela de login (frase de aceite e links),
   § Demais telas (nova subseção "Termos de uso"; política convive com ela,
   uma por vez), § Wireframe da tela principal › Página inteira (dois links) e
   § Medidas (Rodapé: dois destinos), citando IDR 0053 e TDR 0020.
7. `AGENTS.md` § Onde fica cada coisa: linha de `TermosDeUso.jsx`; as de
   `App.jsx`, `TelaDeLogin.jsx` e `Rodape.jsx` citando os termos; novo arquivo
   de teste de `App`.
- Verificação prevista: critérios de código → testes de componente e de
  integração; busca sem `mostrarPolitica`; `docs/interface.md` e `AGENTS.md` →
  leitura das seções.
- Riscos: ambiguidade de nome acessível "Termos de uso" (aparece na frase e na
  linha de links) — testes usam escopo por classe/`within`; quebrar os testes de
  `Rodape`/`TelaDeLogin` que leem a ordem das linhas — atualizados.
- Desvios:
  - `src/App.politica.test.jsx` **não precisou de ajuste**: o botão "Política de
    privacidade" continua único em cada tela, então o teste de integração da
    política segue válido sem mudança; a garantia de "uma vista por vez" ficou
    no novo `src/App.termos.test.jsx` (terceiro caso).
  - Docs além dos previstos em `## Arquivos impactados`
    (`docs/modelo-memoria.md`, `docs/model-dr/0005-representacao-em-memoria-na-spa.md`
    e `docs/arquitetura.md`): o estado `vistaInterna` substitui `mostrarPolitica`
    e a quarta tela aparece nessas descrições do estado atual; atualizados com
    lastro no TDR 0020 e no IDR 0053 (documentação viva).

## Decisões tomadas
- Frase de aceite com "Termos de uso" como `<button>` inline dentro do `<p>`
  (mesma classe de link do cartão), em vez de um `<a>` sem destino — mantém o
  padrão sem router do TDR 0020. Nível 1, sem registro.
- Linha "Política de privacidade · Termos de uso" como `<p>` com dois botões e
  um separador `·` `aria-hidden`, preservando o visual `--muted` sublinhado dos
  links existentes. Nível 1, sem registro.
- Redação de cada seção dos termos dentro do roteiro (nível 2) — premissa
  conservadora: frases curtas, sem prometer nada além do que o app faz; revisão
  do humano no PR da fase.
- Sem registro novo: a vista, os links, a frase de aceite e o roteiro são
  decisão vigente do IDR 0053; o estado único `vistaInterna` é decisão vigente
  do TDR 0020 (atualizado no planejamento). A tarefa implementa ambas e
  propaga o estado para `docs/modelo-memoria.md` e MDR 0005.

## Impedimentos
Nenhum. O texto dos termos é aprovado pelo humano no PR da fase, antes do
merge — a verificação fica `pendente` no relatório, como a tarefa prevê.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 61ms on 76 files with 105 rules using 4 threads.

$ npx vitest run src/components/TermosDeUso.test.jsx src/components/TelaDeLogin.test.jsx src/components/Rodape.test.jsx src/App.politica.test.jsx src/App.termos.test.jsx
 Test Files  5 passed (5)
      Tests  19 passed (19)
   Duration  11.62s

$ npm run test
 Test Files  39 passed (39)
      Tests  467 passed (467)
   Duration  55.64s
 (+ avisos `act(...)` pré-existentes em App.gravacao/importar/copiar/exportar,
    não tocados por esta tarefa)

$ npm run build
vite v8.2.2 building client environment for production...
✓ 134 modules transformed.
✓ built in 548ms
(aviso de chunk > 500 kB pré-existente do bundle do Firebase)
```

Busca por `mostrarPolitica` em `src/`: nenhuma ocorrência (restam só menções
históricas em `docs/plano/`, `docs/tdr/0020-*` § Histórico e no próprio log).

## Critérios de aceite
- [x] `vistaInterna` substitui `mostrarPolitica` em `App.jsx` — busca em `src/`
      sem `mostrarPolitica`; estado em `src/App.jsx:78-83`, ramos em
      `src/App.jsx:478-484`
- [x] Termos abrem da tela de login e do rodapé principal e "← Voltar" devolve à
      tela de origem — `src/App.termos.test.jsx` › "é alcançável a partir da
      tela de login…", "…a partir do rodapé da tela principal…" e "com a
      política aberta não há como abrir os termos"
- [x] `TermosDeUso` tem as seções do roteiro, na ordem, e o contato da política
      — `src/components/TermosDeUso.test.jsx` › "traz as seções do roteiro do
      IDR 0053, na ordem" e "usa o mesmo canal de contato da política"
- [x] Frase de aceite exata na tela de login, com o link —
      `src/components/TelaDeLogin.test.jsx` › "mostra os textos exatos…" e "os
      links dos termos (frase de aceite e cartão) são acionáveis sem sessão"
- [x] Rodapé principal com "Política de privacidade · Termos de uso" —
      `src/components/Rodape.test.jsx` › "mostra as quatro linhas na ordem do
      IDR 0053"
- [x] `docs/interface.md` e `AGENTS.md` atualizados, citando IDR 0053 e
      TDR 0020 — § Tela de login, § Wireframe da tela principal › Página
      inteira, § Demais telas › Política de privacidade e § Termos de uso,
      § Medidas; `AGENTS.md` § Onde fica cada coisa (linha de `TermosDeUso.jsx`
      e as de `App.jsx`, `TelaDeLogin.jsx`, `Rodape.jsx`)

Verificação visual: **pendente** neste ambiente (sem navegador). Roteiro em
`npm run dev` a 375px e 1440px: abrir os termos pela tela de login (frase de
aceite e linha de links) e pelo rodapé da tela principal; conferir o "← Voltar"
devolvendo à tela de origem; conferir a leitura. O **texto dos termos** também
fica pendente de aprovação do humano no PR da fase, como a tarefa prevê
(componente `src/components/TermosDeUso.jsx`).

## Arquivos alterados
- `src/components/TermosDeUso.jsx` — vista interna dos termos (criar)
- `src/components/TermosDeUso.css` — layout da vista (criar)
- `src/components/TermosDeUso.test.jsx` — seções, contato e voltar (criar)
- `src/App.jsx` — `mostrarPolitica` → `vistaInterna`, ramo dos termos e
  `onAbrirTermos` em `TelaDeLogin`/`Rodape`
- `src/App.termos.test.jsx` — integração da vista (criar)
- `src/components/TelaDeLogin.jsx` — frase de aceite com link e linha dos dois
  links; comentário de topo atualizado
- `src/components/TelaDeLogin.css` — `.tela-de-login__links`, `__link` e
  `__separador` no lugar de `__politica`
- `src/components/TelaDeLogin.test.jsx` — textos exatos e clique nos termos
- `src/components/Rodape.jsx` — última linha com os dois links
- `src/components/Rodape.css` — `.rodape__links`, `__link` e `__separador`
- `src/components/Rodape.test.jsx` — linha com os dois links e clique nos termos
- `docs/interface.md` — § Tela de login, § Wireframe da tela principal ›
  Página inteira, § Demais telas (política convive; nova subseção Termos de uso)
  e § Medidas (Rodapé)
- `docs/arquitetura.md` — telas e vistas internas citando TDR 0020 e IDR 0053
- `docs/modelo-memoria.md` — `vistaInterna` no lugar de `mostrarPolitica`
- `docs/model-dr/0005-representacao-em-memoria-na-spa.md` — `vistaInterna` e
  entrada no Histórico
- `AGENTS.md` — § Onde fica cada coisa
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0020-contrair-secoes-rodape-e-termos/0003-termos-de-uso-e-aceite-no-login.md`
  — status

## Correções pós-PR
- 2026-09-14 — Revisão do PR #53: na tela de login, "Termos de uso" aparecia
  duas vezes (link dentro da frase de aceite e de novo na linha de links do
  cartão). O humano pediu para remover a repetição e escolheu manter o link
  na frase de aceite, tirando-o da linha. Correção: `TelaDeLogin.jsx` deixa a
  linha só com "Política de privacidade" (o `.tela-de-login__separador` foi
  removido do CSS, sem uso), e `TelaDeLogin.test.jsx` e `App.termos.test.jsx`
  refletem a linha única.
  Como isso altera decisão documentada vigente (nível 3), o
  [IDR 0053](../../../idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md)
  foi atualizado (Decisão e Histórico) com a aprovação do humano, e
  `docs/interface.md` § Tela de login acompanhou.
