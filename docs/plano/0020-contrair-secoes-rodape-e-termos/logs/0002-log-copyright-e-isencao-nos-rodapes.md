<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0020-0002: copyright e isenção de responsabilidade nos rodapés

## Data
2026-09-14

## Resumo
Acrescenta o copyright `© 2026 Daniel Felix Ferber` e a linha de isenção
"Uso por sua conta e risco, sem garantias." aos dois rodapés, na ordem do
IDR 0053. Antes: o rodapé principal (`Rodape.jsx`) tinha o aviso de
independência e marcas num `<p>` e o botão da política; o da tela de login
(`TelaDeLogin.jsx`) tinha o mesmo aviso num `<p>` próprio, sem filete. Depois:
os dois exibem três linhas empilhadas — copyright, aviso de marcas, isenção —
e o principal mantém o link "Política de privacidade" como quarta linha.
`Rodape.css` e `TelaDeLogin.css` ganham a classe de linha (11px `--muted`;
filete só no principal), sem mudar fonte, cor nem filete. `docs/interface.md`
passa a descrever o desenho e as medidas dos dois rodapés, citando o IDR 0053.

## Discovery
- Código: li `Rodape.jsx`/`Rodape.css` (rodapé da tela principal: filete
  superior, um `<p>` com o aviso de marcas e o botão da política),
  `TelaDeLogin.jsx`/`TelaDeLogin.css` (rodapé próprio, um `<p>` sem filete),
  os testes `Rodape.test.jsx` e `TelaDeLogin.test.jsx` e o uso em
  `App.jsx:569` (`<Rodape onAbrirPolitica=...>`, que não depende da
  estrutura). Grep por "projeto independente" confirma que só os dois testes
  de componente leem o texto do rodapé — nenhum teste de integração depende
  do número de linhas. Convenções locais: classes BEM `bloco__elemento`,
  tokens `--muted`/`--border`, 11px no rodapé.
  - **Divergência**: o login hoje tem um único `<p>` (não "linhas
    empilhadas") e o principal tem `<p>` + botão. Não muda o pedido: troco
    por uma linha por item.
- Documentação: as referências bastaram. Confirmei em `IDR 0053` § Decisão a
  ordem e os textos exatos, em `IDR 0037` § Decisão o link da política no
  rodapé principal e em `requisitos.md` § Privacidade (linhas 261-270) os
  requisitos de copyright, aviso de marcas e isenção.

## Plano da alteração
1. `Rodape.jsx`: três `<p className="rodape__linha">` (copyright; aviso de
   marcas; isenção) e o botão `.rodape__politica` como hoje; comentário
   citando o `IDR 0053`.
2. `Rodape.css`: `.rodape__linha` em 11px `--muted` com `margin: 0`; manter
   `.rodape__politica` com os resets e 8px de respiro acima, sem mexer em
   fonte, cor ou filete.
3. `TelaDeLogin.jsx`: o rodapé passa de `<p>` a contêiner com três
   `<p className="tela-de-login__rodape-linha">`.
4. `TelaDeLogin.css`: `.tela-de-login__rodape` vira contêiner (mantém
   padding e `text-align: center`) e `.tela-de-login__rodape-linha` em 11px
   `--muted`.
5. Testes: `Rodape.test.jsx` e `TelaDeLogin.test.jsx` verificam presença e
   ordem das linhas pela posição no `textContent`; no login, que o rodapé
   não tem link/botão. Mantenho os testes existentes de aviso e clique.
6. `docs/interface.md`: § Tela de login (desenho e bullet, citando o
   `IDR 0053`), § Wireframe da tela principal › Página inteira (rodapé com
   as linhas novas) e § Medidas (Rodapé) (linhas empilhadas na ordem).
- Verificação prevista: critérios de rodapé → testes de `Rodape.test.jsx`/
  `TelaDeLogin.test.jsx`; `interface.md` → leitura das três seções.
- Riscos: quebrar a busca por `/projeto independente/i` (preservada);
  desalinhar o desenho ASCII (larguras medidas a partir das linhas atuais).
- Desvios: nenhum.

## Decisões tomadas
- Estrutura: `<p className="rodape__linha">` no principal e contêiner com
  `.tela-de-login__rodape-linha` no login (este deixa de ser `<p>`). Nível 1
  (estrutura interna e nome de classe), sem registro.
- Espaçamento: linhas com `margin: 0` e o link da política com 8px acima,
  preservando fonte (11px), cor (`--muted`) e filete. Nível 1, sem registro.
- Sem registro novo: textos e ordem são decisão vigente do `IDR 0053`, que a
  tarefa implementa.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 55ms on 73 files with 105 rules using 4 threads.

$ npx vitest run src/components/Rodape.test.jsx src/components/TelaDeLogin.test.jsx
 Test Files  2 passed (2)
      Tests  9 passed (9)

$ npm run test
 Test Files  37 passed (37)
      Tests  459 passed (459)
 Duration  49.41s
 (+ avisos `act(...)` pré-existentes em App.gravacao/importar/copiar/exportar,
    não tocados por esta tarefa)

$ npm run build
vite v8.2.2 building client environment for production...
✓ 132 modules transformed.
✓ built in 568ms
(aviso de chunk > 500 kB pré-existente do bundle do Firebase)
```

## Critérios de aceite
- [x] Rodapé principal com `© 2026 Daniel Felix Ferber`, aviso de marcas,
      "Uso por sua conta e risco, sem garantias." e o link da política, nessa
      ordem — `Rodape.test.jsx` › "mostra as quatro linhas na ordem do
      IDR 0053" lê os quatro filhos de `.rodape` na sequência
- [x] Rodapé do login com as três primeiras linhas, sem link —
      `TelaDeLogin.test.jsx` › "mostra as três linhas do rodapé na ordem do
      IDR 0053, sem link" lê os três filhos de `.tela-de-login__rodape` e
      confirma que não há `button` nem `a`
- [x] `docs/interface.md` nas três seções, citando o IDR 0053 —
      § Wireframe da tela principal › Página inteira (`interface.md:348`),
      § Tela de login (`interface.md:482` no desenho, `interface.md:493` no
      bullet e `interface.md:510` no texto das medidas) e § Medidas
      (`interface.md:734`)

Verificação visual: **pendente** neste ambiente (sem navegador). Roteiro em
`npm run dev` a 375px: conferir os rodapés da tela de login e da tela
principal sem corte nem quebra estranha.

## Arquivos alterados
- `src/components/Rodape.jsx` — três linhas empilhadas e o link da política
- `src/components/Rodape.css` — `.rodape__linha` e respiro do link
- `src/components/Rodape.test.jsx` — teste de presença e ordem das linhas
- `src/components/TelaDeLogin.jsx` — rodapé com três linhas empilhadas
- `src/components/TelaDeLogin.css` — contêiner e `.tela-de-login__rodape-linha`
- `src/components/TelaDeLogin.test.jsx` — teste de presença e ordem, sem link
- `docs/interface.md` — § Tela de login, § Wireframe da tela principal ›
  Página inteira e § Medidas (Rodapé), citando o IDR 0053
