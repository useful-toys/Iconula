<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0034-0003]: Aplica respiro por letra na ordenação por código

## Status
Concluída

## Objetivo
Na ordenação por sigla (sem super-grupos), o respiro entre uma seção e a
anterior ganha +2px sempre que a primeira letra da sigla muda — incluindo
as fronteiras com FWC e COC, sem exceção nas pontas.

## Documentos de referência
- `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
  — decisão completa
- `src/data/catalogoOrdenacoes.js` `ordenarPorSigla` — já devolve as 50
  seções na ordem exata da tela (FWC primeiro, seleções A→Z, COC por
  último)
- `src/components/Catalogo.jsx` — só usa `ordenarPorSigla` quando
  `ordenacao !== 'pagina'`; renderiza `Secao` direto (sem `SuperGrupo`)
  nesse caso
- `src/components/Catalogo.css` — `.catalogo { gap: var(--section-gap) }`
  (8px, IDR 0050)

## Padrões e convenções aplicáveis
- Nenhuma requisição por figurinha; o cálculo é local ao array de 50
  seções, uma vez por render de `Catalogo`.

## Escopo e instruções de implementação
1. Só na ordenação por sigla (`ordenacao !== 'pagina'`): para cada seção a
   partir da segunda, comparar a primeira letra de `secao.sigla` com a da
   seção anterior na mesma sequência de `ordenarPorSigla` (a comparação
   inclui FWC e COC como qualquer seção, sem tratamento especial nas
   pontas).
2. Quando a letra muda, o respiro **antes** dessa seção ganha +2px sobre
   o `--section-gap` (8px → 10px); quando repete, mantém 8px. Sugestão de
   mecanismo: uma função pura em `catalogoOrdenacoes.js` (ex.:
   `letraMudou(secoes, indice)`) reaproveitada por `Catalogo.jsx` para
   decidir uma classe/margem no contêiner de cada seção — mantém a lógica
   de ordenação junto do dado (TDR 0012).
3. A ordenação por página (super-grupos) não muda.
4. `docs/interface.md` § Corpo e § Medidas: descreve o respiro condicional
   por letra na ordenação por sigla, citando o IDR 0067.

**Fora do escopo**: qualquer rótulo ou elemento visual novo marcando a
letra (recusado no esmiuçamento); mudar a ordenação por página.

## Decisões já tomadas (não reabrir)
- Respiro +2px por mudança de letra, incluindo FWC/COC nas pontas — ver
  `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
- `--section-gap: 8px` como padrão inalterado — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`

## Arquivos impactados
- `src/data/catalogoOrdenacoes.js` — modificar (função auxiliar de
  detecção de mudança de letra, se optar pelo mecanismo sugerido)
- `src/components/Catalogo.jsx` — modificar (aplica o respiro por seção)
- `src/components/Catalogo.css` — modificar (classe/modificador de
  respiro)
- `src/components/Catalogo.test.jsx` — modificar: teste cobrindo ao menos
  uma transição sem mudança de letra (ex.: ARG→AUS, sem respiro extra),
  uma com mudança (ex.: AUT→BEL, com respiro extra) e as duas fronteiras
  com os especiais (FWC→primeira seleção, última seleção→COC, ambas com
  respiro extra)
- `docs/interface.md` — modificar (§ Corpo, § Medidas)

## Critérios de aceite
- [ ] Entre duas seções com a mesma letra inicial de sigla, o respiro
      continua 8px — coberto por teste
- [ ] Entre duas seções com letras diferentes, o respiro é 10px — coberto
      por teste
- [ ] As fronteiras FWC→primeira seleção e última seleção→COC têm o
      respiro maior — coberto por teste
- [ ] Ordenação por página (super-grupos) não muda — coberto por teste
      existente que continua passando
- [ ] `docs/interface.md` § Corpo e § Medidas descrevem a regra e citam o
      IDR 0067
