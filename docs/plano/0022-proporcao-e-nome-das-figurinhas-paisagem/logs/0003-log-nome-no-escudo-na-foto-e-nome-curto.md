<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0022-0003: nome no escudo, na foto do time e nome curto

## Data
2026-09-15

## Resumo
Antes: só os jogadores (com corte) e os Extras FIFA/Coca-Cola mostravam nome;
escudo (`BRA01`) e foto do time (`BRA13`) das seleções ficavam só com o código,
e as paisagens do FWC mostravam o nome completo do pôster na caixa de duas
linhas. Depois: o escudo mostra "Escudo" / "do time" na caixa de até duas
linhas, a foto do time mostra "Foto do time" numa linha só e toda paisagem do
FWC mostra o `nomeCurto` numa linha (ex.: "Uruguai 1950"), com o nome completo
preservado no nome acessível do corpo e do controle de menos.

- `src/components/Figurinha.jsx`: aceita `nomeCurto`, compara-o em
  `propsEquivalentes` e troca a regra `exibeNome`/renderização por
  `sem nome → nada` / `paisagem → nomeCurto ?? nome` numa linha / `nomeLinhas →
  prenomes e sobrenome` / `sem nomeLinhas → nome` em até duas linhas; o JSDoc de
  `paisagem`, `nomeLinhas` e o novo `nomeCurto` acompanham.
- `src/components/Figurinha.css`: `.figurinha__nome-paisagem` entra no grupo que
  trunca com ellipsis numa linha, sem o `-webkit-line-clamp: 2` da caixa sem
  corte (`.figurinha__nome-unico`).
- `src/components/Secao.jsx` e `src/components/PaginaDoAlbum.jsx`: repassam
  `nomeCurto={figurinha.nomeCurto}`.
- `src/components/Figurinha.test.jsx`: o teste de escudo/foto do time passa a
  exigir o nome visível; novos testes para `FWC10` com `nomeCurto` (uma linha e
  nome completo no rótulo do corpo e do menos), `FWC04` em retrato sem
  `nomeCurto` (duas linhas), re-render com `nomeCurto` diferente (comparador) e
  o repasse em `Secao`/`PaginaDoAlbum`.
- `docs/interface.md`: § Figurinha troca "sem nome visível" por escudo em até
  duas linhas e foto numa linha, e ganha o bullet de toda paisagem numa linha
  com o nome curto do FWC; o desenho e o bullet da § Figurinha do álbum deixam
  de dizer "só com o código"; § Medidas troca "sem nome visível… código
  centralizado no cartão inteiro" por "na paisagem, uma linha de nome na metade
  de baixo (28px úteis)".

Divergências: nenhuma de comportamento entre código, IDR 0047 e tarefa. A
única mudança além do texto previsto foi atualizar a § Figurinha da disposição
álbum (desenho e bullet), que ainda dizia "só com o código" e ficaria em
contradição com a decisão — já prevista no plano da alteração.

## Discovery
- Código: `Figurinha.jsx` decidia o nome com
  `exibeNome = Boolean(nomeLinhas) || (Boolean(nome) && especial)`
  (`especial = sigla === 'FWC' || sigla === 'COC'`); renderizava
  prenomes/sobrenome quando `nomeLinhas` existia e, senão, `nome` na caixa
  `.figurinha__nome-unico`. `propsEquivalentes` (comparador do `memo`) compara
  `codigo`, `contagem`, `metalizada`, `variante`, `paisagem`, `nome` e
  `nomeLinhas` — faltava `nomeCurto`. A figurinha do catálogo já expõe
  `nomeCurto` e `paisagem` (Tarefa 0022-0002); `Secao.jsx` e
  `PaginaDoAlbum.jsx` são os dois pontos que renderizam `Figurinha` e ainda não
  repassavam `nomeCurto`. `layoutDeSecao` põe a `13` (paisagem) na página 2 do
  spread. Comportamento atual confere com a tarefa. Impacto não citado: nenhum.
- Documentação: as referências bastaram; li no IDR 0047 § Decisão as regras de
  exibição (escudo em duas linhas, foto e paisagens do FWC numa linha com
  `nomeCurto`, nome completo no nome acessível) e no TDR 0021 a regra de que
  toda prop nova entra no comparador do `memo`.

## Plano da alteração
1. `src/components/Figurinha.jsx`: aceitar `nomeCurto`; trocar a regra de
   exibição por `sem nome → nada`, `paisagem → nomeCurto ?? nome` numa linha,
   `nomeLinhas → prenomes/sobrenome`, `sem nomeLinhas → nome` em duas linhas;
   incluir `nomeCurto` no comparador; atualizar o JSDoc.
2. `src/components/Figurinha.css`: nova linha de paisagem
   (`.figurinha__nome-paisagem`) no grupo que trunca com ellipsis numa linha.
3. `src/components/Secao.jsx` e `src/components/PaginaDoAlbum.jsx`: repassar
   `nomeCurto`.
4. `src/components/Figurinha.test.jsx`: ajustar o teste de escudo/foto do time;
   cobrir `FWC10` com `nomeCurto` (nome acessível do corpo e do menos), `FWC04`
   em retrato (duas linhas), re-render com `nomeCurto` diferente e o repasse em
   `Secao`/`PaginaDoAlbum`.
5. `docs/interface.md` § Figurinha e § Medidas: trocar o texto "sem nome
   visível" pelo comportamento novo, com o bullet da paisagem e o nome curto do
   FWC, todos citando o IDR 0047.
- Verificação prevista: cada critério por teste (novos e existentes), trecho de
  `Figurinha.css` e busca em `docs/interface.md`.
- Riscos: o teste "mostra nome sem corte de FWC e COC" usa `FWC01` sem
  `paisagem`; segue válido pelo ramo "sem `nomeLinhas`". `BRA13` está na
  página 2 do layout, então o teste de `PaginaDoAlbum` renderiza as duas páginas
  para alcançá-la.
- Desvios: nenhum.

## Decisões tomadas
- Classe `figurinha__nome-paisagem` para a linha única (nível 1, interna) —
  sem registro.
- Desenho e bullet da § Figurinha do álbum atualizados junto (consistência da
  mesma seção) — sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — `Found 0 warnings and 0 errors.` (79 arquivos)
- `npm run test` — `Test Files 41 passed (41)`, `Tests 499 passed (499)`
  (47,55s). `src/components/Figurinha.test.jsx` com 34 testes.
- `npm run build` — `✓ built in 500ms`; aviso de chunks > 500 kB pré-existente
  (não introduzido por esta tarefa).
- `npm run test:rules` — não se aplica (nenhuma alteração em `firestore.rules`).

## Critérios de aceite
- [x] `BRA01` mostra "Escudo do time" na caixa de até duas linhas — teste
  "escudo e foto do time da seleção mostram o nome genérico, com o nome no
  rótulo" (`Figurinha.test.jsx:396`) verifica `.figurinha__nome-unico`.
- [x] `BRA13` e as paisagens do FWC mostram uma linha só, com `nomeCurto` —
  testes `Figurinha.test.jsx:396` (`.figurinha__nome-paisagem` com "Foto do
  time") e `:432` (`FWC10` com "Uruguai 1950").
- [x] Nome acessível do corpo e do menos com o `nome` completo, também nas
  paisagens do FWC — teste `Figurinha.test.jsx:432` verifica
  `FWC 10, Pôster Histórico – Uruguai 1950, colada` e
  `remover uma unidade de FWC 10, Pôster Histórico – Uruguai 1950`.
- [x] Retratos de jogadores, FWC04–08 e COC como antes — testes existentes
  verdes (`renderiza prenomes e sobrenome…`, `mostra nome sem corte de FWC e
  COC…`) e teste novo `Figurinha.test.jsx:459` para `FWC04`.
- [x] `nomeCurto` no comparador; `Secao` e `PaginaDoAlbum` o repassam — teste
  `Figurinha.test.jsx:477` (re-render) e `:537`/`:581`; `Secao.jsx:198` e
  `PaginaDoAlbum.jsx:54`.
- [x] Linha única da paisagem com ellipsis, sem limite de duas linhas —
  `Figurinha.css:121-130` (`.figurinha__nome-paisagem` no grupo com
  `white-space: nowrap`); a caixa de duas linhas continua só em
  `.figurinha__nome-unico`.
- [x] `docs/interface.md` § Figurinha e § Medidas sem "sem nome visível",
  citando o IDR 0047 — busca por "sem nome vis" sem resultados; o IDR 0047 é
  citado nos bullets novos (`interface.md:279`, `:500`) e na § Medidas
  (`:776`).

## Arquivos alterados
- `src/components/Figurinha.jsx` — `nomeCurto` (prop, comparador, JSDoc) e nova
  regra de exibição.
- `src/components/Figurinha.css` — `.figurinha__nome-paisagem` numa linha.
- `src/components/Secao.jsx`, `src/components/PaginaDoAlbum.jsx` — repasse de
  `nomeCurto`.
- `src/components/Figurinha.test.jsx` — testes de escudo/foto, `FWC10`,
  `FWC04`, comparador e repasse.
- `docs/interface.md` — § Figurinha (prosa e desenho do álbum) e § Medidas.
- `docs/plano/0022-proporcao-e-nome-das-figurinhas-paisagem/0003-nome-no-escudo-na-foto-e-nome-curto.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0022-proporcao-e-nome-das-figurinhas-paisagem/logs/0003-log-nome-no-escudo-na-foto-e-nome-curto.md`
  — novo.
