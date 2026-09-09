<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0003-0002]: super-grupos A–L colapsáveis

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § Decisão e § A composição dos grupos — os 12 super-grupos, o título com progresso agregado e o padrão expandido
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão — o super-grupo "Especiais" deixou de existir; são 12, com duas seções soltas nas pontas
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — a notação compacta também no título de super-grupo
- `docs/interface.md` § Corpo — o título do super-grupo, o chevron e o formato `Grupo C · 34/80 · 43% · ▢46 · ×12`
- `docs/interface.md` § Medidas — título de super-grupo 13px/600 em `--gold`, sem painel, 16px entre super-grupos
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão — o colapso vive em memória e volta ao padrão ao recarregar

## Objetivo
Na ordenação por página do álbum, agrupar as 48 seleções nos 12 grupos da Copa,
com título colapsável e progresso agregado. É o que torna o percurso de 50 seções
navegável em duas camadas.

## Padrões e convenções aplicáveis
- São **12** super-grupos, não 13: FWC e Coca-Cola ficam fora deles, no nível de
  seção — `docs/idr/0028-*` § Decisão
- Super-grupos existem apenas na ordenação por página; a ordenação por sigla é
  plana — `docs/idr/0019-*` § Decisão
- Mesma notação compacta dos demais títulos, com nome acessível por extenso —
  `docs/idr/0018-*` § Decisão
- Padrão expandido, e o estado de colapso é volátil: recarregar volta ao padrão —
  `docs/idr/0020-*` § Decisão e § Consequências
- Título em `--gold` 13px/600, sem painel; o chevron faz parte da área de toque —
  `docs/interface.md` § Medidas e § Corpo
- Nenhum contêiner com rolagem própria — `docs/idr/0008-*` § Decisão

## Escopo e instruções de implementação
1. Criar o componente de super-grupo em `src/components/`: título com chevron
   `▾`/`▸`, nome (`Grupo A` … `Grupo L`) e progresso agregado das 4 seleções em
   notação compacta.
2. Usar o agrupamento já derivado na Tarefa 0001-0003 — não recalcular grupo a
   partir de página aqui.
3. O progresso agregado usa o mesmo módulo puro de progresso, sobre a união dos
   códigos das 4 seleções (80 figurinhas por grupo). O `×` conta códigos
   distintos com contagem ≥ 2.
4. Colapso: tocar no título alterna aberto/fechado; o título permanece visível
   quando fechado. Estado em memória, padrão aberto, sem persistir.
5. Nome acessível do título por extenso, incluindo o estado
   ("Grupo C, 34 de 80, 43 por cento, 46 faltantes, 12 repetidas, expandido").
6. Expor uma forma de a Tarefa 0003-0004 abrir programaticamente um super-grupo
   colapsado — o salto precisa expandir o caminho até o alvo.
7. Na ordenação por sigla, nenhum super-grupo é renderizado; as 50 seções ficam
   no mesmo nível.

**Fora do escopo**: colapso das seções (Tarefa 0003-0003); o salto em si
(Tarefa 0003-0004); ocultar super-grupo por filtro (Tarefa 0004-0004).

## Decisões já tomadas (não reabrir)
- Os 12 grupos da Copa e sua composição — ver `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § A composição dos grupos
- Sem super-grupo "Especiais" — ver `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- Super-grupos só na ordem do álbum; sigla é plana — ver `docs/idr/0019-*` § Decisão
- Colapso volátil, padrão aberto — ver `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`

## Decisões em aberto nesta tarefa
- Se o título do super-grupo também é sticky ao rolar — encaminhamento: não;
  só o cabeçalho da página é sticky, e uma segunda camada grudada disputaria o
  espaço vertical que o IDR 0018 reservou ao catálogo; nasce um **IDR** se a
  escolha for outra

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
- `src/components/SuperGrupo.jsx` — criar
- `src/components/SuperGrupo.test.jsx` — criar
- `src/components/Catalogo.jsx` — modificar

## Critérios de aceite
- [ ] Na ordenação por página, existem exatamente 12 super-grupos, do A ao L
- [ ] FWC e Coca-Cola aparecem fora deles, na primeira e na última posição
- [ ] O título traz `Grupo X · N/80 · P% · ▢F · ×R`, com o `×` contando códigos distintos
- [ ] Tocar no título colapsa e expande; o padrão é expandido
- [ ] Recarregar a página volta todos ao padrão expandido
- [ ] Na ordenação por sigla nenhum super-grupo é renderizado
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0002-log-super-grupos-a-l-colapsaveis.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com todos os 12 colapsados, a página cabe em
poucas telas e mostra 12 títulos mais as duas seções especiais; ajustar uma
figurinha do Brasil muda o agregado do Grupo C.
