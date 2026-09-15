<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0022-0003]: nome no escudo, na foto do time e nome curto

## Status
Concluída

## Objetivo
Exibir o nome em todas as figurinhas: o escudo (01) com "Escudo do time" em
até duas linhas, e toda paisagem numa linha só — a foto do time (13) com
"Foto do time" e as paisagens do FWC com o `nomeCurto` —, mantendo o nome
completo no nome acessível.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — "Escudo
  (01) e foto do time (13) das seleções", "Extras FIFA em paisagem",
  "Truncamento" e "Acessibilidade"; § Consequências — estimativas de largura e
  sobreposição do menos
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão — "Campos
  no catálogo" (quando a exibição usa `nomeLinhas`, `nomeCurto` ou `nome`)
- `src/data/catalogo.js` — figurinhas com `nomeCurto` e paisagens do FWC
  (gerado pela Tarefa 0022-0002)
- `src/components/Figurinha.css` — cartão de 60×70px e paisagem de 70×60px
  (gerado pela Tarefa 0022-0001); `.figurinha__nome` e
  `.figurinha__nome-unico`
- `src/components/Figurinha.jsx` — `propsEquivalentes`, JSDoc das props,
  `especial` e `exibeNome`
- `src/components/Secao.jsx`, `src/components/PaginaDoAlbum.jsx` — os dois
  pontos que renderizam `Figurinha`
- `src/components/Figurinha.test.jsx` — "escudo e foto do time da seleção
  mostram só o código, com o nome no rótulo", "Secao repassa nome e
  nomeLinhas ao cartão", "PaginaDoAlbum repassa nome e nomeLinhas ao cartão"
- `docs/tdr/0021-desempenho-do-catalogo.md` — props novas entram no
  comparador do `memo`
- `docs/interface.md` § Figurinha, § Medidas

## Padrões e convenções aplicáveis
- O nome visível fica fora da árvore de acessibilidade; o nome acessível usa
  sempre `nome`, nunca `nomeCurto` — IDR 0047, `Figurinha.jsx`
- `nomeCurto` entra no comparador do `memo` — TDR 0021
- Truncamento com ellipsis por linha; o nome nunca empurra o layout nem muda o
  tamanho do cartão — IDR 0047
- Menos e selo podem cobrir parte do nome; não se reserva faixa para eles —
  IDR 0047
- O cartão continua sem conhecer a seção além da sigla do código; a regra de
  linha única vem de `paisagem`, não da posição — IDR 0047

## Escopo e instruções de implementação
1. `Figurinha` aceita `nomeCurto` (ausente = como antes), o compara em
   `propsEquivalentes` e atualiza o JSDoc (`paisagem` sem "ocupa 2 trilhas";
   `nomeLinhas` sem "o cartão mostra só o código").
2. Regra de exibição, sem a exceção das posições fixas das seleções:

   ```
   sem nome              → sem bloco de nome
   paisagem              → uma linha: nomeCurto ?? nome
   com nomeLinhas        → prenomes / sobrenome, como hoje
   sem nomeLinhas        → nome em até duas linhas, como hoje
   ```

   O escudo cai no último caso ("Escudo" / "do time"); a foto do time e as
   paisagens do FWC, no segundo.
3. `Figurinha.css`: a linha única da paisagem trunca com ellipsis numa linha,
   sem o limite de duas linhas da caixa sem corte.
4. `Secao` e `PaginaDoAlbum` repassam `nomeCurto` da figurinha.
5. `Figurinha.test.jsx`:
   - o teste de escudo e foto do time "só com o código" passa a verificar:
     `BRA01` com "Escudo do time" na caixa sem corte e rótulo
     `BRA 01, Escudo do time, faltante`; `BRA13` paisagem com "Foto do time"
     na linha única;
   - `FWC10` paisagem com `nomeCurto` "Uruguai 1950": mostra o curto e o
     rótulo `FWC 10, Pôster Histórico – Uruguai 1950, faltante`;
   - `FWC04` retrato sem `nomeCurto`: nome completo em até duas linhas, como
     hoje;
   - paisagem com `nomeCurto` diferente re-renderiza (comparador);
   - `Secao` e `PaginaDoAlbum` repassam `nomeCurto`.
6. `docs/interface.md`, citando o IDR 0047:
   - § Figurinha: o bullet "Escudo (01) e foto do time (13)… sem nome visível"
     passa a dizer que mostram o nome genérico, o escudo em até duas linhas e
     a foto numa; bullet novo — toda paisagem mostra o nome numa linha só, e
     as paisagens do FWC usam o nome curto (ex.: "Uruguai 1950"), com o nome
     completo no nome acessível;
   - § Medidas: "sem nome visível (escudo e foto do time), código centrado no
     cartão inteiro" dá lugar a "na paisagem, uma linha de nome na metade de
     baixo (28px úteis)".

**Fora do escopo**: medidas e centralização do cartão (Tarefa 0022-0001);
dados de paisagem e `nomeCurto` (Tarefa 0022-0002); texto de troca e
export/import, que seguem só com o código.

## Decisões já tomadas (não reabrir)
- Nome no escudo e na foto do time, linha única na paisagem, `nomeCurto` nas
  paisagens do FWC, truncamento e nome acessível — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Campo `nomeCurto` e quando a exibição o usa — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- Cartão memoizado com comparador próprio — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`
- Escudo e foto do time com o nome genérico e FWC em paisagem com nome curto
  — `docs/requisitos.md` § Catálogo (vigente)

## Arquivos impactados
- `src/components/Figurinha.jsx`, `src/components/Figurinha.css`,
  `src/components/Figurinha.test.jsx` — modificar
- `src/components/Secao.jsx`, `src/components/PaginaDoAlbum.jsx` — modificar
- `docs/interface.md` — modificar (§ Figurinha, § Medidas)

## Critérios de aceite
- [ ] `BRA01` mostra "Escudo do time" na caixa de até duas linhas (teste)
- [ ] `BRA13` e as paisagens do FWC mostram uma linha só, com `nomeCurto`
      quando existe (teste)
- [ ] Nome acessível do corpo e do menos com o `nome` completo, também nas
      paisagens do FWC (teste)
- [ ] Retratos de jogadores, FWC04–08 e COC como antes (testes existentes
      verdes)
- [ ] `nomeCurto` no comparador; `Secao` e `PaginaDoAlbum` o repassam (busca e
      teste)
- [ ] Linha única da paisagem com ellipsis, sem limite de duas linhas (trecho
      de `Figurinha.css`)
- [ ] `docs/interface.md` § Figurinha e § Medidas sem "sem nome visível",
      citando o IDR 0047 (busca)

## Validação adicional
Verificação visual em `npm run dev`, registrando no log:
- lista, seção BRA: `01` com "Escudo" / "do time"; `13` com "Foto do time"
  numa linha;
- seção FWC (lista): `FWC10`–`FWC19` distinguíveis pelo ano; `FWC01` e `FWC02`
  como "Emblema esq." e "Emblema dir."; `FWC04`–`FWC08` em retrato com o nome
  em até duas linhas;
- medir no DevTools, para "Foto do time", "Argentina 1986" e
  "Alemanha 1954", a largura do texto contra a largura útil (`scrollWidth` ×
  `clientWidth` da linha) e anotar se cabem ou truncam — o ellipsis já é o
  comportamento decidido, a medição só documenta;
- com contagem ≥ 1 numa paisagem, o menos cobre só o início da linha; com
  contagem ≥ 2, o selo não cobre a linha.
