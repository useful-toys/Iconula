<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0033-0001: Tela Sobre, vista interna

## Data
2026-09-18

## Resumo
Criada a vista interna "Sobre" (IDR 0063), a quinta vista interna do app:
novo componente `Sobre.jsx` (padrão TDR 0020, com o layout de leitura dos
termos), ligado ao estado único `vistaInterna` em `App.jsx` como o valor
`'sobre'`, e três portas de entrada — o link no cartão da tela de login, o
terceiro link do rodapé da tela principal e o mesmo rodapé na vista do
catálogo compartilhado. Antes, nenhuma tela citava o GitHub; agora há o link
"Reportar um problema ou sugerir algo".

O texto da tarefa presumia que a tela de login usasse o componente `Rodape`
("as duas telas que usam `Rodape` (login e principal)"); na verdade, a tela
de login tem rodapé próprio (sem links, IDR 0053) e seus links ficam no
cartão. Para cumprir o acesso duplo do IDR 0063 sem contrariar o IDR 0053, o
"Sobre" entrou na linha de links do cartão, ao lado de "Política de
privacidade".

O `Rodape` é compartilhado com a vista do catálogo compartilhado, que passou
a receber `onAbrirSobre` de `App.jsx` — sem isso, o botão novo ficaria
inerte lá. `docs/interface.md` ganhou a subseção "Sobre" e teve atualizados
o wireframe da tela de login, o do rodapé da tela principal, a linha do
rodapé do catálogo compartilhado e a descrição das medidas do rodapé.

## Discovery
- Código:
  - `TermosDeUso.jsx`/`PoliticaDePrivacidade.jsx` são o molde da vista
    interna: `onVoltar`, "← Voltar" com seta em `aria-hidden`, título
    dourado e corpo de 640px; `TermosDeUso.css` serve de base para
    `Sobre.css`.
  - `Rodape.jsx` é usado pela tela principal (`App.jsx:947`) e pela vista
    do catálogo compartilhado (`CatalogoCompartilhado.jsx:159,200`); as duas
    recebem `onAbrirPolitica`/`onAbrirTermos`. A tela de login **não** usa
    `Rodape`: tem rodapé próprio em `TelaDeLogin.jsx` (três linhas, sem
    links — IDR 0053) e os links no cartão (termos na frase de aceite e
    política numa linha própria). Isso diverge do texto da tarefa ("as duas
    telas que usam `Rodape` (login e principal)"), que presumia a tela de
    login sobre `Rodape`.
  - `vistaInterna: null | 'politica' | 'termos' | 'contaApagada'` já é o
    estado único (TDR 0020), checado antes da guarda de login; 'sobre' entra
    como mais um ramo.
  - Testes da área: `Rodape.test.jsx` (quatro linhas, `linhas[3]` com os
    dois links), `TelaDeLogin.test.jsx` (texto exato de
    `.tela-de-login__links` = "Política de privacidade"), e
    `App.politica.test.jsx`/`App.termos.test.jsx` como molde dos testes de
    integração de vista interna. `App.test.jsx` não cobre o rodapé.
  - Comportamento atual confere com a tarefa exceto pela premissa do
    `Rodape` na tela de login (impacto não citado: `TelaDeLogin.jsx`,
    `CatalogoCompartilhado.jsx`).
- Documentação:
  - `docs/interface.md` § Tela de login (links e rodapé), § Demais telas
    (subseções Política, Termos e Catálogo compartilhado), wireframe da
    linha de links do rodapé da tela principal e a descrição das medidas
    dos links.
  - `docs/idr/0063` (decisão: vista Sobre, acesso duplo, conteúdo) e
    `docs/tdr/0020` (vista interna sem router).

## Plano da alteração
1. Criar `Sobre.jsx` + `Sobre.css` + `Sobre.test.jsx` — mesmo layout de
   `TermosDeUso`, com nome/descrição do app e os dois links externos em aba
   nova.
2. `Rodape.jsx`: terceiro link "Sobre" com o separador `·`, nova prop
   `onAbrirSobre`; atualizar `Rodape.test.jsx` (linha de texto e clique).
3. `TelaDeLogin.jsx` + `TelaDeLogin.css`: nova prop `onAbrirSobre` e link
   "Sobre" ao lado de "Política de privacidade" na linha do cartão (o
   rodapé da tela segue sem links — IDR 0053); atualizar
   `TelaDeLogin.test.jsx`.
4. `App.jsx`: ramo `vistaInterna === 'sobre'`; `onAbrirSobre` para
   `TelaDeLogin`, `Rodape` e `CatalogoCompartilhado`.
5. `CatalogoCompartilhado.jsx`: aceitar e repassar `onAbrirSobre` ao
   `Rodape` das duas telas (impacto não citado: sem isso, o link novo
   ficaria inerte na vista do link).
6. `App.sobre.test.jsx`: integração — abrir pelo cartão da tela de login e
   pelo rodapé da tela principal, voltar à origem e `'sobre'` substituir a
   tela por inteiro.
7. `docs/interface.md`: § Tela de login (links), § Demais telas › nova
   subseção "Sobre" citando o IDR 0063, linha do rodapé da tela principal e
   do catálogo compartilhado.
8. Status/log/README no mesmo commit.
- Verificação prevista: critérios 1–4 → testes `Sobre.test.jsx`,
  `Rodape.test.jsx`, `TelaDeLogin.test.jsx`, `App.sobre.test.jsx` e leitura
  de `docs/interface.md`; lint/test/build.
- Riscos: divergência do texto da tarefa sobre a tela de login (resolvida
  abaixo); link inerte no catálogo compartilhado (resolvido no passo 5).
- Desvios: dois arquivos além de "Arquivos impactados", ambos por impacto
  não citado descoberto no discovery — `TelaDeLogin.jsx` (o texto da tarefa
  presumia a tela de login sobre `Rodape`; sem ele, o critério 2 não se
  cumpre) e `CatalogoCompartilhado.jsx` (sem o repasse, o link novo ficaria
  inerte no `Rodape` compartilhado). Os respectivos testes também.

## Decisões tomadas
- O link "Sobre" da tela de login entra na linha de links do cartão, ao
  lado de "Política de privacidade" (`·`), e não no rodapé da tela — o
  rodapé de login segue sem links, como decidido no IDR 0053 e coberto por
  teste. Nível 2 (premissa sobre detalhe visível não previsto; o texto da
  tarefa presumia a tela de login sobre `Rodape`).
- `CatalogoCompartilhado.jsx` repassa `onAbrirSobre` ao `Rodape`, mantendo
  o padrão já vigente de política/termos na vista do link; sem isso o
  botão novo ficaria inerte. Nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — sem avisos.
`npm run test` — 50 arquivos, 647 testes, todos passando; os avisos
`act(...)` e o de tamanho de chunk no build são pré-existentes (testes de
`Avisos` e bundle, fora do escopo desta tarefa).
`npm run build` — 146 módulos, build concluído em 592ms.
`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] `Sobre.jsx` renderiza título, descrição, os dois links (com `href`
      exatos) e "← Voltar" funcional — `Sobre.test.jsx` (3 testes):
      "mostra o título e a descrição do app", "traz os dois links externos,
      para o repositório e as issues" (com `href`, `target` e `rel`) e
      "voltar chama onVoltar".
- [x] O rodapé das duas telas (login e principal) mostra o link "Sobre" e
      abre a vista ao clicar — `TelaDeLogin.test.jsx` (8 testes, inclui "o
      link Sobre é acionável sem sessão"), `Rodape.test.jsx` (5 testes,
      inclui "o link Sobre chama onAbrirSobre") e `App.sobre.test.jsx`
      (abre pela tela de login e pelo rodapé da principal). Na tela de
      login o link vive no cartão, não no rodapé (ver "Decisões tomadas").
- [x] `vistaInterna === 'sobre'` substitui a tela por inteiro, como
      `'politica'`/`'termos'` — `App.sobre.test.jsx`: o catálogo sai do
      documento ao abrir e volta no "Voltar"; aberta a vista, não há botão
      "Termos de uso".
- [x] `docs/interface.md` descreve a tela Sobre, citando o IDR 0063 —
      subseção "### Sobre" (linha 831) e referências ao IDR 0063 nas linhas
      da tela de login, do catálogo compartilhado e do rodapé.

## Arquivos alterados
- `src/components/Sobre.jsx` — criado (vista interna com os dois links).
- `src/components/Sobre.css` — criado (layout de leitura dos termos).
- `src/components/Sobre.test.jsx` — criado.
- `src/App.sobre.test.jsx` — criado (integração da vista).
- `src/components/Rodape.jsx` — terceiro link "Sobre" e `onAbrirSobre`.
- `src/components/Rodape.test.jsx` — linha de links e teste do clique.
- `src/components/TelaDeLogin.jsx` — link "Sobre" e `onAbrirSobre`.
- `src/components/TelaDeLogin.css` — separador `·` da linha de links.
- `src/components/TelaDeLogin.test.jsx` — linha de links e teste do clique.
- `src/components/CatalogoCompartilhado.jsx` — repassa `onAbrirSobre` ao
  `Rodape`.
- `src/App.jsx` — ramo `'sobre'` e `onAbrirSobre` nas três telas.
- `docs/interface.md` — § Tela de login, § Demais telas › "Sobre", § Catálogo
  compartilhado e medidas/rodapé.
- `docs/plano/0033-.../0001-tela-sobre-vista-interna.md` — status.
- `docs/plano/README.md` — status da fase e da tarefa.
- `docs/plano/0033-.../logs/0001-log-tela-sobre-vista-interna.md` — este log.

## Execução interrompida
Não se aplica.

## Correções pós-PR
Não se aplica.
