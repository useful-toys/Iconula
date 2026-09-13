<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0001]: colapso automático de seções e super-grupos completos, com persistência do colapso manual

## Status
Pendente

## Objetivo
Colapsar por padrão as seções e super-grupos já 100% completos, para que quem
consulta ou atualiza a coleção não role por blocos sem nada a fazer — sem
esconder a seção por completo e sem lutar com quem prefere deixá-la aberta,
cujo colapso manual passa a ser lembrado entre sessões.

## Documentos de referência
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão e
  § Alternativas consideradas — "Padrão: abertas — tanto super-grupos quanto
  seções", "estado aberto/fechado vive em memória" e a alternativa recusada
  "persistir estado de colapso"
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § Decisão —
  "Super-grupos expandem por padrão"
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Decisão
  e § Alternativas consideradas — "o estado de colapso de seções e
  super-grupos continua volátil" e a alternativa recusada "restaurar 50 seções
  fechadas esconderia o catálogo na abertura"
- `docs/idr/0025-filtro-oculta-secoes-vazias.md` § Decisão — ocultação pelo
  filtro, mecanismo diferente do colapso
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` § Decisão — o salto expande
  super-grupo e seção no caminho
- `src/components/Catalogo.jsx` — colapso de **seções** num único `Set`
  (`colapsadas`), "ausente do Set" = expandida
- `src/components/SuperGrupo.jsx` — colapso do **super-grupo** como estado
  interno (`useState(true)`), exposto por `useImperativeHandle` (`expandir()`)
- `src/lib/preferenciasDeVista.js` — leitura/gravação em `localStorage` de
  ordenação/disposição/filtro
- `src/lib/progresso.js` (`calcularPlacar`) — `coladas`/`total` por seção e por
  super-grupo
- `docs/interface.md` — trechos sobre colapso e sobre o que persiste

## Padrões e convenções aplicáveis
- Nunca esconder conteúdo por completo: o auto-colapso só recolhe, um toque
  reabre — IDR 0025 (contraste com o filtro)
- O auto-colapso decide o **estado inicial** da sessão; depois, quem manda é o
  toque do usuário — reabrir uma seção completa não a fecha sozinha de novo na
  mesma sessão — IDR 0020
- Persistir a **intenção do usuário** (overrides manuais), não o estado
  resultante, no mesmo `localStorage` por dispositivo — IDR 0026
- Sem nova requisição de rede — `docs/requisitos.md` § Requisitos Não
  Funcionais
- Revisar uma decisão é atualizar os registros existentes, com a anterior em
  `## Histórico` — `docs/idr/CLAUDE.md`

## Escopo e instruções de implementação
1. Atualizar os IDRs 0020, 0019 e 0026 (ver "Decisões em aberto").
2. Levar o colapso do super-grupo para `Catalogo.jsx`, unificado com o `Set`
   das seções (dois `Set`s ou chave prefixada); `saltarPara` passa a expandir o
   super-grupo removendo a entrada do `Set`, sem `useImperativeHandle`.
3. `SuperGrupo.jsx` vira controlado: sem estado interno nem
   `useImperativeHandle`.
4. Calcular o `Set` inicial a partir de `contagens` (seções e grupos 100%
   completos), mesclado com os overrides manuais lidos do `localStorage`
   (override vence a regra automática).
5. Gravar no `localStorage` só quando o usuário alternar manualmente uma seção
   ou super-grupo.
6. Testes em `Catalogo.test.jsx`, `SuperGrupo.test.jsx` e no módulo de
   persistência: auto-colapso na carga, reabrir sem refechar na sessão,
   override sobrevivendo a recarga, salto expandindo super-grupo colapsado.
7. Atualizar `docs/interface.md` nos trechos sobre colapso e persistência,
   citando os IDRs.

**Fora do escopo**: mudar a regra de "completo" para incluir repetidas de
outro jeito; mudar o comportamento do filtro (IDR 0025).

## Decisões já tomadas (não reabrir)
- Ordenação/disposição/filtro persistem no `localStorage` — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` (mantido;
  só o trecho sobre colapso muda)
- Salto expande super-grupo e seção no caminho — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- FWC abre e Coca-Cola fecha o catálogo, sempre presentes — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- O filtro oculta seções vazias — ver `docs/idr/0025-filtro-oculta-secoes-vazias.md`

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
  § Decisão — "Padrão: abertas" e "estado vive em memória; recarregar volta ao
  padrão" → seções e super-grupos 100% completos abrem colapsados na carga da
  sessão; overrides manuais persistem. A alternativa antes recusada
  ("persistir estado de colapso") é revista com o motivo. Decide também:
  - regra de "completo": seção com `coladas === total`; super-grupo com todas
    as seções completas;
  - momento: só na carga da sessão (recomendado), não quando uma seção se
    completa durante o uso;
  - o que persiste: o conjunto de siglas/grupos alternados manualmente;
  - FWC e Coca-Cola: participam da regra ou ficam de fora.
- **Muda decisão documentada**: `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md`
  § Decisão — "Super-grupos expandem por padrão" → super-grupo completo abre
  colapsado; entrada em `## Histórico`.
- **Muda decisão documentada**: `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
  § Decisão — "o estado de colapso … continua volátil" → os overrides manuais
  de colapso persistem no `localStorage`; a alternativa recusada é respondida
  (só overrides persistem, não 50 seções fechadas); entrada em `## Histórico`.
- Onde mora a persistência do override (`preferenciasDeVista.js` ampliado ou
  módulo próprio) — decisão técnica; nasce um TDR se a escolha não for trivial.

## Arquivos impactados
- `src/components/Catalogo.jsx` — modificar
- `src/components/SuperGrupo.jsx` — modificar
- `src/lib/preferenciasDeVista.js` — modificar, ou
  `src/lib/colapsoDeVista.js` — criar
- `src/components/Catalogo.test.jsx`, `src/components/SuperGrupo.test.jsx` —
  modificar; teste do módulo de persistência — modificar ou criar
- `docs/interface.md` — modificar
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` — modificar
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` — modificar
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` —
  modificar
- `docs/tdr/` — criar, se a persistência do override pedir decisão técnica

## Critérios de aceite
- [ ] Seção 100% completa abre colapsada na carga da sessão (teste)
- [ ] Super-grupo com todas as seções completas idem (teste)
- [ ] Reabrir manualmente uma seção completa não a fecha de novo na mesma
      sessão, mesmo ajustando outras contagens (teste)
- [ ] O override manual sobrevive a um recarregamento (teste com
      `localStorage`)
- [ ] O salto pela faixa continua expandindo super-grupo e seção no caminho,
      sem `useImperativeHandle` (teste e busca em `SuperGrupo.jsx`)
- [ ] Nenhuma requisição de rede nova
- [ ] IDRs 0020, 0019 e 0026 atualizados, com as decisões anteriores em
      `## Histórico`

## Validação adicional
Verificação visual em `npm run dev`: completar uma seção inteira e conferir
que ela colapsa só na próxima carga; reabri-la, recarregar e conferir que
continua aberta; saltar pela faixa para uma seção dentro de um super-grupo
colapsado automaticamente.
