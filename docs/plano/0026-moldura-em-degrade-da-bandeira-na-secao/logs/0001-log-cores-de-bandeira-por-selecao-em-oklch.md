<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0026-0001: cores de bandeira por seleção em OKLCH

## Data
2026-09-16

## Resumo

## Discovery

- Código: `src/theme.css` § "Cores de seleção" (linhas 51-105) tem hoje 48
  tokens `--selection-<sigla>` de cor única, mais os alias
  `--selection-fwc`/`--selection-coc`; nenhum token é usado fora de
  `Secao.css` (que define `--selection-color` por classe modificadora
  `secao__cabecalho--<sigla>`, 48 + FWC/COC) — `Tarefa 0026-0002` vai
  reaproveitá-los. `SuperGrupo.css` e `FaixaDeSecoes.css` estabelecem a
  convenção das duas variantes (IDR 0045): o token principal `<cor>` é a
  variante ajustada (fundo tingido) e o sufixo `-raw` é a original (traços
  finos), presente só nos grupos cuja original difere da ajustada; onde a
  original já serve, um token cobre as duas finalidades. Os testes existentes
  da área (`Secao.test.jsx`, bloco "cor da seleção no cabeçalho", linhas
  510-550) só conferem a presença da classe modificadora no cabeçalho — não
  leem os valores dos tokens. Não há teste de `theme.css`. O comportamento
  atual confere com a tarefa: os 48 tokens de cor única existem e são os que
  serão substituídos.
- Documentação: lido o IDR 0046 inteiro (§ Cores das seleções, § Decisão,
  § Hierarquia de cores) e o IDR 0045 § "Especiais" — as referências da
  tarefa bastaram para os valores; a leitura do IDR 0045 confirmou a
  convenção de nomes das duas variantes (a tarefa sugeria `-bg`, mas a
  convenção vigente é o sufixo `-raw`; decisão de nível 1, ver abaixo).
  Conferido `docs/interface.md` § Paleta (linhas 738-794) — hoje a tabela
  descreve `--selection-<sigla>` como um token só, e § Medidas (linha 857)
  descreve a borda/fundo do cabeçalho; a § Medidas é escopo da Tarefa
  0026-0002, que move a identidade para a seção inteira.

## Plano da alteração

1. `src/theme.css`: reescrever o bloco "Cores de seleção" com os valores da
   tabela do IDR 0046, por seleção: `--selection-<sigla>-1/-2/-3` (cor
   original — variante usada na moldura; `-2` e `-3` só quando diferem, senão
   um único `-2`) e, para toda cor marcada "→ aj.", `--selection-<sigla>-N`
   com a variante ajustada — o sufixo `-N` sem `-raw` (convenção do
   IDR 0045: token sem sufixo = ajustada), usada no fundo tingido. Manter
   `--selection-fwc`/`--selection-coc` intocados.
2. `docs/interface.md` § Paleta: substituir a linha genérica
   `--selection-<sigla>` pela descrição do esquema de 2-3 cores (original ×
   ajustada) e o parágrafo final das seleções, citando o IDR 0046.
3. Verificação prevista: as 48 seleções têm os `-1/-2/-3` da tabela e todo
   "→ aj." tem o token ajustado → conferência por script contra a tabela do
   IDR 0046 e busca em `theme.css`; FWC/COC inalterados → `git diff` do
   bloco; `interface.md` reflete → leitura do trecho.
4. Riscos: a convenção de nomes tem dois níveis de exceção (iguais na 2ª/3ª
   cor; original = ajustada) — conferir cada seleção contra a tabela, sem
   duplicar nem omitir token; nada consome os tokens novos ainda (Tarefa
   0026-0002), então lint/test/build não mudam de resultado, só provam que
   nada quebrou.
- Desvios: nenhum

## Decisões tomadas

- **Nomes dos tokens**: em vez do `-bg` sugerido na tarefa, a variante
  ajustada é `--selection-<sigla>-N` (sem sufixo) e a original é
  `--selection-<sigla>-N-raw`, alinhando à convenção do IDR 0045
  (`--group-x` ajustada / `--group-x-raw` original) já aplicada em
  `SuperGrupo.css` e `FaixaDeSecoes.css`. A tarefa autoriza o alinhamento
  (observação de nível 1 no prompt de delegação e nome "sugerido" no
  escopo); sem registro novo, a convenção já está documentada no IDR 0045.
- **Semântica do sufixo**: onde não há ajuste, um único
  `--selection-<sigla>-N` serve à moldura e ao fundo (é original e ajustada
  ao mesmo tempo), como o IDR 0045 faz com os grupos; onde há ajuste, o
  `-N-raw` alimenta a moldura e o `-N` o fundo tingido.

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
Finished in 55ms on 85 files with 105 rules using 4 threads.
```

`npm run test`:

```
 Test Files  41 passed (41)
      Tests  514 passed (514)
   Duration  49.08s
```

(Avisos `act(...)` nos testes de `App.jsx` — pré-existentes na `main`,
conforme observação do prompt de delegação; não afetam o resultado.)

`npm run build`:

```
✓ 136 modules transformed.
dist/assets/index-CafpfjPL.css                             33.46 kB │ gzip:   6.29 kB
dist/assets/index-DTYJxBXB.js                             440.34 kB │ gzip: 135.61 kB
dist/assets/index.esm-z-m5SEl4.js                         505.90 kB │ gzip: 148.77 kB
✓ built in 479ms
(!) Some chunks are larger than 500 kB after minification.
```

(Aviso de chunk > 500 kB no `index.esm` do SDK do Firebase — pré-existente
na `main`, conforme observação do prompt de delegação.)

Conferência dos tokens contra a tabela do IDR 0046 (script local, por
posição de cor e variante): 159 tokens de posição conferem; 37 tokens
`-raw`, exatamente as posições marcadas "→ aj." que têm posição própria
(as 7 posições `-3` que repetem a `-1` — ESP, HAI, JPN, KSA, MAR, QAT, SCO
— não geram token duplicado); nenhum token proibido por duplicação
(ARG/CUW/SWE na `-3`, AUT/CAN/ENG/SUI/TUN/TUR nas `-2`/`-3`).

## Critérios de aceite
- [x] As 48 seleções têm até 3 tokens de cor original, conforme a tabela do
      IDR 0046, sem token duplicado onde a 2ª e a 3ª cor coincidem —
      conferência: 159 tokens de posição, 48 seleções distintas, 37 `-raw`
      (as 44 marcas "aj." menos as 7 posições `-3` duplicadas da `-1`);
      nenhum token proibido presente (`--selection-arg-3`,
      `--selection-cuw-3`, `--selection-swe-3`, `--selection-aut-2/-3`,
      `--selection-can-2/-3`, `--selection-eng-2/-3`, `--selection-sui-2/-3`,
      `--selection-tun-2/-3`, `--selection-tur-2/-3`, `--selection-esp-3`,
      `--selection-hai-3`, `--selection-jpn-3`, `--selection-ksa-3`,
      `--selection-mar-3`, `--selection-qat-3`, `--selection-sco-3`)
- [x] Toda cor marcada "→ aj." na tabela tem também o token da versão
      ajustada — os 37 `-raw` têm o `-N` correspondente; nas 7 posições `-3`
      duplicadas, a versão ajustada (`-1`/`-1-raw`) já cobre a cor —
      conferência por script
- [x] `--selection-fwc` e `--selection-coc` não foram alterados —
      `git diff src/theme.css`: as duas linhas finais seguem idênticas
      (`var(--group-fwc)` / `var(--group-coc)`)
- [x] `docs/interface.md` § Paleta reflete os tokens novos — tabela com as
      linhas `--selection-<sigla>-1/-2/-3` e `--selection-<sigla>-N-raw` e
      parágrafo das seleções reescrito, citando o IDR 0046

## Arquivos alterados
- `src/theme.css` — bloco "Cores de seleção": 48 tokens de cor única viram
  159 tokens de posição (`-1/-2/-3`) + 37 `-raw`, com os valores da tabela
  do IDR 0046; FWC/COC intocados
- `docs/interface.md` — § Paleta: linhas dos tokens novos e parágrafo das
  seleções (até 3 cores por posição, variante original × ajustada, FWC/COC
  de cor única)
- `docs/plano/0026-.../0001-cores-de-bandeira-por-selecao-em-oklch.md` —
  status `Em andamento`
- `docs/plano/README.md` — fase 26 e tarefa 0001 `Em andamento`
- `docs/plano/0026-.../logs/0001-log-cores-de-bandeira-por-selecao-em-oklch.md`
  — este log
