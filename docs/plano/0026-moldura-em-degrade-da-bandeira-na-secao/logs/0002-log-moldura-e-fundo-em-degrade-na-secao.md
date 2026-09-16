<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0026-0002: moldura e fundo em degradê na seção

## Data
2026-09-16

## Resumo
A identidade de cor de cada seleção saiu do cabeçalho e passou a abraçar a
seção inteira (título + grade), como manda o IDR 0046. Antes: o botão do
cabeçalho tinha borda de 1px e fundo com 45% de uma cor única
(`--selection-color`); depois: a `<section class="secao secao--<sigla>">`
ganha um wrapper `.secao__moldura` com anel-gradiente de 2px e fundo tingido
no mesmo degradê a 25%, e o cabeçalho perde cor própria. `Secao.jsx` move o
modificador para o `<section>` e envolve cabeçalho + corpo na moldura;
`Secao.css` troca as 50 classes de cor única pelas posições `-1/-2/-3` (fundo
ajustado) e `-raw` (moldura original); `Secao.test.jsx` confere o modificador
na seção (e a ausência dele no cabeçalho); `docs/interface.md` § Medidas
descreve a moldura/fundo novos. FWC e COC seguem de cor única.

## Discovery
- Código: `src/components/Secao.jsx:46` põe a classe modificadora
  `secao__cabecalho--<sigla>` no botão do cabeçalho; o `<section
  className="secao">` (`Secao.jsx:169`) não tem identidade de cor.
  `src/components/Secao.css` tem a identidade no `.secao__cabecalho`
  (linhas 40-47: `background` a 45% + `border` 1px) e 50 classes
  modificadoras (linhas 59-108) ligando `--selection-color` aos tokens de
  cor única. A Tarefa 0026-0001 já trocou esses tokens por posições
  `--selection-<sigla>-1/-2/-3` (ajustada, no fundo) e `-raw` (original, na
  moldura), com posições ausentes quando a 2ª/3ª cor repete a anterior
  (contagens reais em `theme.css`: 48 `-1`, 42 `-2`, 32 `-3`, 37 `-raw`).
  O `.secao` tem `--secao-folga-selo` (6px de `padding` só à direita e
  embaixo + `margin` negativa) para o selo `×N`, que transborda 6px do
  cartão, não ser recortado pela contenção de pintura do
  `content-visibility: auto` (TDR 0021). Nenhum outro arquivo consome
  `--selection-color` ou as classes `secao__cabecalho--*`; os testes da área
  (`Secao.test.jsx`, bloco "cor da seleção no cabeçalho", linhas 510-550)
  só conferem a presença da classe modificadora no cabeçalho. O
  comportamento atual confere com a tarefa.
- Documentação: lido o IDR 0046 § Decisão, § "Hierarquia de cores" e
  § "Cores das seleções" (onde a cor original e a ajustada entram), o
  IDR 0023 § Decisão (o FWC é o único com moldura própria de página, que
  não muda) e `docs/interface.md` § Paleta e § Medidas (linha 868: descreve
  a borda/fundo antigos do cabeçalho de seção; § Paleta já descreve os
  tokens de posição desde a Tarefa 0026-0001). As referências bastaram.

## Plano da alteração
1. `src/components/Secao.jsx`: mover o modificador de cor para o
   `<section>` (`secao--<sigla>`) e envolver cabeçalho + corpo num wrapper
   `.secao__moldura`, que passa a ser o contêiner flex com
   `gap: var(--section-body-gap)`.
2. `src/components/Secao.css`: `.secao` mantém a folga do selo e o
   `content-visibility`, ganha os defaults de posição (`--sel-1/-2/-3` e
   `-raw`, com fallback para a posição 1) e perde o flex/gap (vão para a
   moldura). `.secao__moldura` ganha a técnica de anel-gradiente: `border`
   de 2px transparente + `border-radius: 14px`; quatro camadas de
   `background` (duas metades, esquerda e direita) — por dentro o degradê
   "lavado" a 25% sobre `--panel` (`padding-box`) e, por fora, o degradê de
   cor original (`border-box`). O `.secao__cabecalho` perde `background` e
   `border`, mantendo padding, raio, cursor e layout. As 48 classes
   modificadoras viram `.secao--<sigla>`, cada uma ligando as posições 1-3
   (ajustada e `-raw` com fallback); FWC/COC só definem a posição 1 e as
   demais caem nela (cor única, sem degradê).
3. `src/components/Secao.test.jsx`: o bloco da cor passa a conferir o
   modificador no `.secao` e a ausência dele no cabeçalho.
4. `docs/interface.md` § Medidas: reescrever o item "Cabeçalho de seção"
   para descrever a moldura/fundo em degradê da seção inteira (IDR 0046).
- Verificação prevista: moldura abraça título e grade → estrutura do
  `<section>` e leitura do CSS; fundo em degradê a 25% → camadas do
  `background`; cabeçalho sem borda/fundo → `git diff` de
  `.secao__cabecalho`; FWC/COC de cor única → classes só com `--sel-1`;
  selo `×N` não cortado → mantida a folga de 6px e a moldura dentro do
  `content box` (verificação visual pendente).
- Riscos: o anel de 2px encolhe o conteúdo em 4px de largura (a moldura é
  filha de bloco do `.secao`), o que pode mudar a quebra da grade em
  algumas larguras — aceito, o anel ocupa espaço real; conferir que o
  selo continua dentro da caixa de `padding` (badge a 4px da borda contra
  folga de 6px).
- Verificação extra (executada): script local (fora do repositório) resolve
  a cadeia `var()` de `Secao.css` contra `theme.css` e confere as posições
  de BRA, ARG, BEL, JPN, HAI, QAT, CIV, FWC e COC, além de a moldura só
  usar `--sel-*` e o cabeçalho não ter `background`/`border`. Todos os
  casos conferem.
- Desvios: nenhum. Antes do commit, a primeira versão das classes usava o
  fallback `var(--selection-<sigla>-N-raw, var(--sel-N))`; para a posição
  ausente isso caía na cor ajustada (`--sel-N` → `--sel-1`), e a moldura
  daquela posição deveria usar a cor original da posição 1. Corrigido para
  `var(--selection-<sigla>-N-raw, var(--selection-<sigla>-N, var(--sel-1-raw)))`,
  que distingue "posição presente sem `-raw`" (usa a própria) de "posição
  ausente" (cai na `-1-raw`); validado pelo script (JPN/HAI/QAT × CIV).

## Decisões tomadas
- **Wrapper `.secao__moldura`**: em vez de aplicar o anel no próprio
  `.secao`, a moldura é um contêiner interno que fica dentro do content box
  do `.secao` — assim a folga do selo (`--secao-folga-selo`, que recorta a
  pintura) continua sendo do `.secao` e o anel não é cortado nem a largura
  do conteúdo muda por causa da folga. O `.secao` passa a `display: block` e
  o flex/gap vai para a moldura (nome e estrutura BEM do próprio
  componente). Nível 1; sem registro novo.
- **Anel de 2px, raio externo 14px**: a tarefa admite 1-2px; 2px dá mais
  presença ao degradê, e o raio externo 14px deixa o interno em 12px, igual
  ao do cabeçalho (IDR 0050). Nível 1; sem registro novo.
- **Fallback da posição ausente também na variante `-raw`**: a posição que a
  bandeira não tem cai na posição 1 inclusive na cor original, conforme a
  nota da tarefa e o IDR 0046 ("cor original é sempre a que aparece na
  moldura"). Nível 1; sem registro novo — a decisão de cor é do IDR 0046,
  isto é a leitura do esquema de tokens da Tarefa 0026-0001.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
`npm run lint`:

```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 48ms on 85 files with 105 rules using 4 threads.
```

`npm run test`:

```
 Test Files  41 passed (41)
      Tests  514 passed (514)
   Duration  47.68s
```

(Avisos `act(...)` nos testes de `App.*` — pré-existentes na `main`,
conforme observação do prompt de delegação; não afetam o resultado.)

`npm run build`:

```
✓ 136 modules transformed.
dist/assets/index-DFIjEnZs.css                             47.48 kB │ gzip:   7.88 kB
dist/assets/index-laZSNG0-.js                             440.39 kB │ gzip: 135.62 kB
dist/assets/index.esm-yeqVNVcN.js                         505.90 kB │ gzip: 148.77 kB
✓ built in 464ms
(!) Some chunks are larger than 500 kB after minification.
```

(Aviso de chunk > 500 kB no `index.esm` do SDK do Firebase — pré-existente
na `main`, conforme observação do prompt de delegação.)

Verificação extra da resolução das variáveis (script local, não commitado):
`ok` em 33 casos — BRA (três cores, `-3-raw` = 0.31 azul original), ARG
(duas cores, `-3` cai na `-1`), BEL (`-1-raw` = 0.00 preto, `-1` = 0.51
ajustado), JPN/HAI/QAT (`-3-raw` cai na `-1-raw`, original), CIV (`-3` sem
`-raw` usa a própria 0.60), FWC (`0.78 0.14 85` nas três posições) e COC
(`0.55 0.2 29`); a moldura não referencia `--selection-*` e o cabeçalho não
tem `background`/`border`.

## Critérios de aceite
- [x] A moldura em degradê envolve o título e a grade de figurinhas da
      seção, não só o cabeçalho — `.secao__moldura` (anel + fundo) envolve
      `CabecalhoSecao` e `.secao__corpo` em `Secao.jsx:169`; o modificador
      `secao--<sigla>` agora vive no `<section>`, conferido por teste em
      `Secao.test.jsx` ("cor da seleção na seção")
- [x] O fundo tingido segue o mesmo degradê a 25%, não uma cor sólida —
      camadas `padding-box` do `.secao__moldura` em duas metades, cada cor
      em `color-mix(in oklch, var(--sel-N) 25%, var(--panel))`
- [x] `.secao__cabecalho` não tem mais borda nem fundo próprios — regra sem
      `background`/`border`; conferido no `git diff` e pelo script
- [x] FWC e COC continuam com moldura/fundo de cor única — as classes
      `.secao--fwc`/`.secao--coc` só definem `--sel-1`, e as três posições
      resolvem para `--selection-fwc`/`--selection-coc` (script)
- [ ] O selo "×N" não é cortado nem deslocado pela moldura nova — a folga de
      6px do `.secao` foi mantida e o selo (a 4px da caixa de padding) fica
      inteiro e acima do anel; **verificação visual pendente** no preview.
      Roteiro em `npm run dev`: abrir o álbum e conferir, na lista e na
      disposição álbum —
      1. **Brasil** (3 cores): anel com amarelo no topo, verde no canto
         inferior esquerdo e azul no direito; fundo do mesmo degradê, suave.
      2. **Argentina** (2 cores): anel celeste nas três posições (as de baixo
         repetem o topo) e fundo acompanhando.
      3. **Bélgica** ou **Alemanha** (cor clareada): anel superior na cor
         original (preto/cinza-escuro) e fundo na clareada; título e números
         legíveis sobre o tingido.
      4. **Selo `×N`**: numa repetida que encoste na borda direita e na última
         linha da seção, o selo transborda o cartão inteiro, sem corte e sem
         deslocamento.
      5. **FWC e COC**: moldura e fundo de cor única (dourado e vermelho),
         sem degradê.
      6. As duas ordenações (página e sigla) e as duas disposições (lista e
         álbum) mantêm o desenho.

## Arquivos alterados
- `src/components/Secao.jsx` — modificador de cor move para o `<section>`;
  wrapper `.secao__moldura` em volta do cabeçalho e do corpo
- `src/components/Secao.css` — defaults de posição no `.secao`; anel +
  fundo em degradê no `.secao__moldura`; cabeçalho sem cor própria; 50
  classes modificadoras `secao--<sigla>` ligando as posições 1-3 (ajustada e
  `-raw`, com fallback)
- `src/components/Secao.test.jsx` — bloco "cor da seleção na seção": classe
  no `.secao`, ausência no cabeçalho
- `docs/interface.md` — § Medidas: item "Seção" descreve a moldura/fundo em
  degradê (IDR 0046)
- `docs/plano/0026-.../0002-moldura-e-fundo-em-degrade-na-secao.md` —
  status `Em andamento` → `Concluída`
- `docs/plano/README.md` — fase 26 e tarefa 0002 `Concluída`
- `docs/plano/0026-.../logs/0002-log-moldura-e-fundo-em-degrade-na-secao.md`
  — este log
