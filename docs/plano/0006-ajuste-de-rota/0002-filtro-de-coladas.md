<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0006-0002]: filtro de coladas

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0033-filtro-de-coladas.md` § Decisão e § Consequências — o quarto valor do filtro, a ordem dos segmentos e a sobreposição deliberada com repetidas
- `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md` § Decisão — o filtro continua existindo só na disposição lista
- `docs/idr/0025-filtro-oculta-secoes-vazias.md` § Decisão — seção e super-grupo sem resultado somem inteiros, também com `coladas`
- `docs/idr/0031-salto-com-filtro-ativo.md` § Decisão — saltar para seção oculta devolve o filtro para `todas`
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Decisão — o filtro é lembrado entre sessões e valor não reconhecido cai para o padrão
- `docs/interface.md` § Controles — os rótulos `Todas | Falt. | Col. | Rep.` e a quebra da linha de controles
- `docs/requisitos.md` § Progresso e listas e § UX — coladas é contagem ≥ 1; a lista de coladas é vista em tela, não texto de troca

## Objetivo
Acrescentar `coladas` (contagem ≥ 1) ao filtro de status, entre `faltantes` e
`repetidas`, com tudo o que já vale para os outros valores. Fecha a lacuna
observada em uso: a consulta "o que eu já colei" não tinha vista.

## Padrões e convenções aplicáveis
- Quatro valores, nesta ordem: todas, faltantes (0), coladas (≥ 1), repetidas
  (≥ 2) — `docs/idr/0033-*` § Decisão
- Rótulos curtos `Todas | Falt. | Col. | Rep.`, forma por extenso só no nome
  acessível — `docs/interface.md` § Controles e `docs/idr/0018-*`
- O grupo de filtro continua invisível na disposição álbum, e os dois comandos
  da direita não se movem — `docs/idr/0001-*` e `docs/idr/0023-*`
- Seção e super-grupo sem figurinha no estado filtrado somem inteiros —
  `docs/idr/0025-*` § Decisão
- O placar não muda ao filtrar — `docs/idr/0025-*` § Consequências
- Filtrar custa zero requisição — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. `src/lib/colecao.js`: acrescentar `coladas` ao predicado `filtraFigurinha`
   (contagem ≥ 1) e atualizar o tipo do parâmetro nos JSDoc de `Catalogo.jsx`,
   `Secao.jsx`, `SuperGrupo.jsx` e `Controles.jsx`.
2. `src/components/Controles.jsx`: quarto item no grupo segmentado, entre
   `Falt.` e `Rep.`, com nome acessível "mostrar apenas as figurinhas coladas".
3. `src/lib/preferenciasDeVista.js`: incluir `coladas` na lista de valores
   válidos do filtro; o padrão continua `todas` e valor desconhecido continua
   caindo para o padrão, sem erro.
4. Conferir que ocultar seções vazias, o salto com filtro ativo e a persistência
   funcionam com o valor novo sem caso especial — se algum deles tiver a lista de
   valores duplicada, passar a derivá-la de uma fonte só.
5. Verificar a linha de controles em largura de celular: com quatro segmentos o
   terceiro grupo pode quebrar para a linha seguinte; os dois comandos da direita
   continuam colados à direita, como na Tarefa 0003-0001.
6. Testes: `coladas` mostra contagem 1 e contagem ≥ 2 e esconde os 0; seção sem
   nenhuma colada some inteira e o super-grupo também; o placar não muda; o valor
   sobrevive ao recarregar; o grupo de filtro continua ausente na disposição
   álbum.

**Fora do escopo**: um comando de cópia de coladas — as listas de troca
continuam sendo faltantes e repetidas (Tarefa 0009-0003); mudar o placar, o selo
`×N` ou a notação compacta.

## Decisões já tomadas (não reabrir)
- Coladas é contagem ≥ 1 e se sobrepõe a repetidas de propósito — ver
  `docs/idr/0033-filtro-de-coladas.md`
- Filtro só na disposição lista — ver `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`
- Seções e super-grupos vazios somem da vista — ver `docs/idr/0025-filtro-oculta-secoes-vazias.md`
- Salto para seção oculta devolve o filtro para `todas` — ver `docs/idr/0031-salto-com-filtro-ativo.md`

## Decisões em aberto nesta tarefa
- Nenhuma.

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/lib/colecao.js` — modificar
- `src/lib/colecao.test.js` — modificar
- `src/lib/preferenciasDeVista.js` — modificar
- `src/lib/preferenciasDeVista.test.js` — modificar
- `src/components/Controles.jsx` — modificar
- `src/components/Controles.test.jsx` — modificar
- `src/components/Catalogo.jsx`, `src/components/Secao.jsx`, `src/components/SuperGrupo.jsx` — modificar (tipo do filtro no JSDoc)
- `src/components/Catalogo.test.jsx` — modificar

## Critérios de aceite
- [ ] A linha de controles mostra `Todas | Falt. | Col. | Rep.` na disposição lista
- [ ] `Col.` mostra as figurinhas com contagem ≥ 1, repetidas incluídas
- [ ] Seção sem nenhuma colada some inteira, e o super-grupo sem seções visíveis também
- [ ] O placar do título não muda ao filtrar
- [ ] A escolha `coladas` é restaurada na abertura seguinte; valor desconhecido cai para `todas`
- [ ] Saltar pela faixa para uma seção oculta por `Col.` devolve o filtro para `Todas`
- [ ] O grupo de filtro continua ausente na disposição álbum, sem mover os comandos da direita
- [ ] `docs/plano/0006-ajuste-de-rota/logs/0002-log-filtro-de-coladas.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com algumas unidades lançadas, `Col.` mostra
exatamente os cartões verdes e laranjas e esconde os cinzas; `Rep.` mostra um
subconjunto do que `Col.` mostrou.
