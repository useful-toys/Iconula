<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0017-0005: nome no cartão

## Data
2026-09-14

## Resumo
Exibe o nome da figurinha no cartão, entre o código e a faixa inferior, nas
duas disposições. Jogadores vêm em duas linhas — prenomes em caixa normal
(`nomeLinhas[0]`) e sobrenome em caixa alta (`nomeLinhas[1]`, caixa alta só
visual); nomes sem corte (`nomeLinhas: null`, posições fixas, Extras FIFA e
Coca-Cola) caem numa caixa única de até duas linhas com ellipsis. Sem nome, o
cartão fica exatamente como antes. O `nome` completo entra no nome acessível
do corpo e do controle de menos, entre o código e o estado.

`Figurinha.jsx` ganha as props `nome` e `nomeLinhas`, o bloco visual
(`aria-hidden`, como o código e o selo) e os dois rótulos acessíveis; o
comparador do `memo` passa a incluí-las (TDR 0021). `Figurinha.css` estiliza o
nome em Roboto Condensed 500, 10px, centralizado, na cor de texto do estado
(`color: inherit`), com uma linha por elemento e ellipsis. `Secao.jsx` e
`PaginaDoAlbum.jsx` repassam `figurinha.nome`/`figurinha.nomeLinhas`.
`docs/interface.md` § Figurinha e § Tipografia descrevem o nome, citando o
IDR 0047. Como o nome passou a entrar no nome acessível, `Catalogo.test.jsx`
teve as buscas por cabeçalho de seção e por figurinha ancoradas no prefixo.


## Discovery
- Código: `Figurinha.jsx` é memoizado com `propsEquivalentes` próprio (TDR
  0021); o corpo é um `button` flex column centralizado com
  `padding: 0 0 22px` (faixa inferior do IDR 0047, Tarefa 0017-0004) e filhos
  `figurinha__codigo`/`figurinha__selo`/`figurinha__menos` — o nome entra
  entre o código e a faixa. `Secao.jsx` (lista) e `PaginaDoAlbum.jsx` (álbum)
  são os únicos que montam `Figurinha`; os testes desses componentes usam
  `figurinhas` sem nome (props ausentes continuam válidas). O catálogo
  (`expandirFigurinhas`) já emite `nome`/`nomeLinhas` com referências estáveis
  por figurinha (Tarefa 0017-0002), então a igualdade estrita no comparador
  basta. `index.css` já declara a Roboto Condensed 500 (latin/latin-ext).
  Comportamento atual confere com a tarefa: nenhum ponto passa nome ao cartão
  ainda (busca por `figurinha.nome`/`nomeLinhas` em `src/**/*.jsx` sem
  resultados).
- Documentação: reli o IDR 0047 § Decisão (linhas, caixa, nomes sem corte,
  ellipsis por linha, nome acessível), o MDR 0008 § Decisão (`nome` e
  `nomeLinhas`) e o TDR 0021 §1 (props novas entram no comparador). As
  referências bastaram; a § Figurinha e a § Tipografia de `docs/interface.md`
  foram lidas no estado atual para a atualização.

## Plano da alteração
1. `src/components/Figurinha.jsx` — props `nome`/`nomeLinhas` na assinatura e
   na JSDoc; `propsEquivalentes` compara as duas; bloco visual do nome
   (`aria-hidden`) após o código; `aria-label` do corpo e do menos inclui o
   nome quando presente.
2. `src/components/Figurinha.css` — `.figurinha__nome` (Roboto Condensed 500,
   10px, `line-height` curta, largura total, centralizado, `color: inherit`,
   ellipsis por linha) e a variante de duas linhas (`nome-prenomes`/
   `nome-sobrenome`, sobrenome `text-transform: uppercase`) e a caixa única
   (`nome-unico`, `-webkit-line-clamp: 2`).
3. `src/components/Secao.jsx` e `src/components/PaginaDoAlbum.jsx` — repassam
   `nome={figurinha.nome}` e `nomeLinhas={figurinha.nomeLinhas}`.
4. `src/components/Figurinha.test.jsx` — testes do nome (duas linhas com
   classes distintas; nome único só no sobrenome; nome sem corte numa caixa;
   sem nome, rótulos como antes; rótulos com o nome) e do repasse por `Secao`
   e `PaginaDoAlbum`.
5. `src/components/Catalogo.test.jsx` — desvio (ver abaixo): as buscas por
   cabeçalho de seção e por figurinha do catálogo real passam a ancorar no
   prefixo, porque o nome entrou no rótulo acessível.
6. `docs/interface.md` — § Figurinha (nome entre o código e a faixa) e
   § Tipografia (Roboto Condensed 500 no nome), citando o IDR 0047.
7. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - nomes e rótulos → testes de `Figurinha` (classes e `getByLabelText`);
  - repasse → testes que renderizam `Secao`/`PaginaDoAlbum` e buscam o nome;
  - comparador → leitura de `propsEquivalentes`;
  - `docs/interface.md` com o IDR → leitura da seção;
  - CSS (fonte, caixa alta, ellipsis) → leitura de `Figurinha.css`;
  - visual → roteiro (sem navegador autenticável no ambiente).
- Riscos: o nome pode empurrar o código para cima; mitigado pela
  `line-height` curta (~11px por linha) e pela largura do cartão, e o
  `overflow: hidden` do corpo não é introduzido (o nome não transborda a
  faixa inferior). Nenhum risco estrutural (o bloco é mais um filho do flex).
- Desvios: `src/components/Catalogo.test.jsx` não consta em "Arquivos
  impactados", mas quebrou com a mudança exigida pela própria tarefa (o nome
  entra no nome acessível): 17 testes usavam `getByRole('button', { name:
  /Brasil/ })` para achar o cabeçalho de seção e `getByLabelText('BRA 01,
  faltante, metalizada')` para achar a figurinha — o catálogo real agora tem
  figurinhas cujo nome contém "Brasil" (pôsteres históricos) e o rótulo da
  figurinha ganhou o nome. As buscas passaram a ancorar no prefixo do
  cabeçalho (`/^Brasil:/`) e a casar o nome com `.+` no rótulo da figurinha
  (`/^BRA 01, .+, faltante, metalizada$/`); `getByText(/Brasil/)` virou
  `getByText('Brasil BRA 24')`. A intenção de cada asserção foi preservada.

## Decisões tomadas
- Cor do nome por `color: inherit` (nível 1): a tarefa admite `--cream` **ou**
  a cor de texto do estado (IDR 0047 fala em `--cream` sobre o fundo do
  estado, mas o código já segue o estado). Herdar o `color` do corpo mantém o
  nome consistente com a sigla/número e preserva o contraste sobre os cartões
  claros (verde/laranja), onde `--cream` seria ilegível.
- Classes `figurinha__nome-prenomes`/`figurinha__nome-sobrenome`/
  `figurinha__nome-unico` (nível 1): nomes de classe internos ao componente,
  seguindo o padrão BEM já usado em `Figurinha.css`.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

```
> npm run lint
Found 0 warnings and 0 errors.
Finished in 48ms on 73 files with 105 rules using 4 threads.

> npm run test
 Test Files  37 passed (37)
      Tests  442 passed (442)
(os avisos de act(...) em App.importar/App.copiar/App.gravacao/
App.exportar são pré-existentes, não introduzidos aqui)

> npm run build
✓ 132 modules transformed.
dist/assets/index-H6BkirjD.css   25.26 kB │ gzip:   5.23 kB
dist/assets/index-CpxIy81N.js   429.12 kB │ gzip: 132.71 kB
✓ built in 633ms
(o aviso de chunk > 500 kB é pré-existente)
```

`npm run test:rules` não se aplica: `firestore.rules` não foi tocado.

## Critérios de aceite
- [x] Prenomes e sobrenome em linhas distintas; nome único só na segunda;
      nome sem corte numa caixa (teste) — `Figurinha.test.jsx` ("renderiza
      prenomes e sobrenome em linhas distintas com classes próprias", "põe
      nome único só na linha do sobrenome...", "mostra nome sem corte numa
      caixa única..."); render em `Figurinha.jsx:205-217`
- [x] Nome acessível do corpo e do menos com o nome (teste) —
      `Figurinha.test.jsx` ("inclui o nome no nome acessível do corpo e do
      menos"); `Figurinha.jsx:191,230`
- [x] Sem nome, cartão e rótulos como antes (teste) —
      `Figurinha.test.jsx` ("sem nome, não renderiza o bloco de nome...") e
      os testes de rótulo sem nome; suíte verde
- [x] `nome` e `nomeLinhas` no comparador; `Secao` e `PaginaDoAlbum` repassam
      (busca e teste) — `Figurinha.jsx:31-32` (comparador), `Secao.jsx:196-197`,
      `PaginaDoAlbum.jsx:52-53`; testes em `Figurinha.test.jsx` ("Secao
      repassa nome e nomeLinhas ao cartão", "PaginaDoAlbum repassa...")
- [x] Sobrenome em caixa alta, Roboto Condensed 10px, ellipsis por linha
      (CSS e verificação visual) — `Figurinha.css:79-115` (Roboto Condensed
      500/10px, `text-overflow: ellipsis`, `white-space: nowrap`,
      `text-transform: uppercase` e `-webkit-line-clamp: 2`); visual pendente
      (roteiro abaixo)
- [x] `docs/interface.md` § Figurinha e § Tipografia citando o IDR 0047 —
      § Figurinha (`docs/interface.md:221-227` e `:429-430`); § Tipografia
      (`:602-603`)

## Validação visual
Pendente — sem navegador autenticável no ambiente. Roteiro em `npm run dev`,
nas duas disposições, com uma seção aberta: Trent/Alexander-Arnold,
Juan José/Cáceres e Rodri truncam ou cabem sem empurrar o layout; FWC e COC
com nomes sem corte; selo `×N` e menos na faixa inferior sem cobrir o nome.

## Arquivos alterados
- `src/components/Figurinha.jsx` — props, comparador, bloco visual e rótulos
- `src/components/Figurinha.css` — estilo do nome
- `src/components/Secao.jsx` — repasse de `nome`/`nomeLinhas`
- `src/components/PaginaDoAlbum.jsx` — repasse de `nome`/`nomeLinhas`
- `src/components/Figurinha.test.jsx` — testes do nome e do repasse
- `src/components/Catalogo.test.jsx` — buscas ancoradas ao prefixo (desvio)
- `docs/interface.md` — § Figurinha e § Tipografia
- `docs/plano/0017-nomes-de-jogadores/0005-nome-no-cartao.md` — status
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0017-nomes-de-jogadores/logs/0005-log-nome-no-cartao.md` — este log
