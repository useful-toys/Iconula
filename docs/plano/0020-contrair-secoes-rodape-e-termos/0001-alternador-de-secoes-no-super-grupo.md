<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0020-0001]: alternador que contrai e expande as seções do super-grupo

## Status
Concluída

## Objetivo
Acrescentar ao título de cada super-grupo aberto um alternador `⊟`/`⊞` que
contrai ou expande de uma vez as suas 4 seções, deixando o grupo como 4 linhas
de resumo num toque. Hoje cada seção só fecha pelo próprio título.

## Documentos de referência
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão
  (item "Contrair as seções de um super-grupo de uma vez") e § Consequências
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § Decisão — título do
  super-grupo e o toque que colapsa o grupo
- `docs/idr/0025-filtro-oculta-secoes-vazias.md` § Decisão — seções ocultas
  pelo filtro
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Decisão
  — gravação do colapso manual
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — foco visível e
  área de toque ampliada em `pointer: coarse`
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — moldura do título
- `src/components/SuperGrupo.jsx`, `src/components/SuperGrupo.css` — título
  como botão único, `propsEquivalentes`
- `src/components/Catalogo.jsx` — `colapsadas`, `toggleSecao`,
  `toggleGrupoHandlers`, gravação por `gravarColapsoManual`
- `docs/interface.md` § Corpo, § Interações, § Medidas (título de super-grupo)

## Padrões e convenções aplicáveis
- Botão dentro de botão é inválido: título e alternador são botões irmãos —
  IDR 0020
- Nome acessível por extenso ("contrair as seções do Grupo C" / "expandir as
  seções do Grupo C"); o glifo é `aria-hidden` — IDR 0018
- A memoização de `SuperGrupo` continua pulando re-renderizações quando nada
  do grupo muda: callbacks novos precisam ser estáveis por letra, como
  `toggleGrupoHandlers` — TDR 0021 (`docs/tdr/0021-desempenho-do-catalogo.md`)
- A moldura, a barra esquerda e as cores do título não mudam — IDR 0045
- O toque no título continua colapsando só o super-grupo — IDR 0019

## Escopo e instruções de implementação
1. `Catalogo.jsx`: operação estável por letra de grupo que recebe as siglas
   das 4 seções do grupo e, se alguma estiver fora de `colapsadas.secoes`,
   acrescenta todas; senão, remove todas. O resultado vai para o mesmo
   conjunto já gravado no `localStorage`. Passa ao `SuperGrupo` o callback do
   grupo e a informação de se todas as suas seções estão fechadas.
2. `SuperGrupo.jsx`: o título vira uma linha com dois botões irmãos — o
   botão atual (chevron, nome, resumo; `aria-expanded` mantido) e, na ponta
   direita, o alternador, só renderizado com o super-grupo expandido.
   Glifo `⊟` quando alguma seção está aberta, `⊞` quando todas estão
   fechadas; decide e age pelas 4 seções, inclusive as ocultas pelo filtro.
3. `SuperGrupo.css`: a moldura continua envolvendo a linha inteira; o
   alternador em `--gold`, sem fundo próprio, com foco visível e área de
   toque ampliada iguais às dos demais botões (IDR 0042).
4. Testes: em `SuperGrupo.test.jsx`, o alternador existe só com o grupo
   aberto, alterna glifo e nome acessível e chama o callback; em
   `Catalogo.test.jsx`, contrai as 4 seções com o grupo aberto, expande
   quando todas fechadas, age sobre seção oculta pelo filtro e grava no
   `localStorage`.
5. `docs/interface.md`, citando o IDR 0020:
   - § Corpo: o título do super-grupo tem, à direita, o alternador `⊟`/`⊞`,
     só com o grupo aberto, que contrai ou expande as suas seções;
   - § Interações: tocar no alternador contrai ou expande as seções do grupo;
   - § Medidas (título de super-grupo): o alternador na ponta direita, em
     `--gold`.

**Fora do escopo**: alternador na ordenação por sigla (sem super-grupos) e
para FWC e COC; rodapé e termos (Tarefas 0020-0002 e 0020-0003).

## Decisões já tomadas (não reabrir)
- Alternador no título do super-grupo, só aberto, sobre as 4 seções, `⊟`/`⊞`
  e colapso manual gravado — ver
  `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
- Super-grupos abertos por padrão e toque no título colapsa o grupo — ver
  `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md`
- Colapso manual persistido no navegador — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Memoização sem virtualização — ver `docs/tdr/0021-desempenho-do-catalogo.md`

## Decisões em aberto nesta tarefa
- Forma de passar "todas fechadas" e o callback ao `SuperGrupo` sem quebrar a
  comparação de props (nível 1) — registrar no log.

## Arquivos impactados
- `src/components/SuperGrupo.jsx`, `src/components/SuperGrupo.css`,
  `src/components/SuperGrupo.test.jsx` — modificar
- `src/components/Catalogo.jsx`, `src/components/Catalogo.test.jsx` —
  modificar
- `docs/interface.md` — modificar (§ Corpo, § Interações, § Medidas)

## Critérios de aceite
- [ ] Com o grupo aberto e alguma seção aberta, o alternador mostra `⊟` e
      contrai as 4 seções; com todas fechadas, mostra `⊞` e expande as 4
      (testes)
- [ ] Com o grupo fechado, não há alternador (teste)
- [ ] Seção oculta pelo filtro também é contraída e expandida (teste)
- [ ] O conjunto gravado no `localStorage` reflete o resultado (teste)
- [ ] Nenhum `<button>` dentro de `<button>` no título (teste de estrutura)
- [ ] Ajustar uma figurinha de outro grupo não re-renderiza o super-grupo
      (teste existente de memoização continua verde)
- [ ] `docs/interface.md` nas três seções, citando o IDR 0020

## Validação adicional
Roteiro visual em `npm run dev` a 375px e 1440px, ordenação por página:
contrair e expandir um grupo; recarregar e conferir o estado; ativar o filtro
de faltantes, contrair, limpar o filtro e conferir as 4 seções fechadas;
navegar por teclado até o alternador.
