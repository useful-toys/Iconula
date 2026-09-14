<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0001]: cabeçalho todo sticky, com o avatar na primeira linha

## Status
Concluída

## Objetivo
Levar título, grupos segmentados e faixa de bandeiras para dentro do cabeçalho
sticky em qualquer largura, nesta ordem, sem o ponto de quebra de 768px; ao
quebrar, o avatar fica preso à direita da primeira linha e o desfazer à
direita da linha dos grupos. Hoje, abaixo de 768px, a linha de controles cai
abaixo das bandeiras e rola com o conteúdo.

## Documentos de referência
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão ("Título e
  controles") e § Consequências — a regra única, a posição do avatar e do
  desfazer
- `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md` § Decisão — o
  avatar como gatilho do menu
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — popup,
  fechamento fora e com `Esc`
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — áreas de toque
  ampliadas do desfazer e do avatar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.css` — o
  `display: contents` abaixo de 768px, o `order` e o bloco `__fixo`
- `src/components/Controles.jsx`, `src/components/Controles.css` —
  `controles__direita` com desfazer e `MenuDeAcoes`; padding próprio abaixo
  de 768px
- `src/components/MenuDeAcoes.css` — painel ancorado abaixo do botão, pela
  direita, `z-index: 30`
- `src/App.jsx` — `Cabecalho` recebe `Controles` como filho
- `docs/interface.md` § Cabeçalho, § Controles, § Menu de ações, § Camadas,
  § Wireframe da tela principal › Página inteira, § Medidas

## Padrões e convenções aplicáveis
- O menu de ações continua acima de tudo e fecha ao escolher, ao tocar fora e
  com `Esc` — IDR 0024, `docs/interface.md` § Camadas
- A área de toque ampliada de desfazer e avatar não sobrepõe nenhum vizinho
  — IDR 0042
- O tooltip dos grupos continua abaixo da opção, sem ser cortado — IDR 0048
- Os dois botões de comando não mudam de medida nem de visual — IDR 0049
- Nenhuma rolagem própria nova — IDR 0008

## Escopo e instruções de implementação
1. Uma regra de layout só, sem media query de 768px: o elemento sticky contém
   o título, o avatar, os grupos com o desfazer e a faixa de bandeiras, em
   qualquer largura; nada do cabeçalho rola com o conteúdo.
2. Cabendo tudo, título, grupos, desfazer e avatar dividem uma linha, com a
   faixa abaixo. Não cabendo (título em duas linhas ou grupos sem espaço), a
   primeira linha é o título com o avatar colado à direita, alinhado ao topo;
   os grupos descem para as linhas seguintes, acima da faixa, com a quebra de
   `docs/interface.md` § Controles; o desfazer fica colado à direita da linha
   dos grupos e não se move quando o filtro some (disposição álbum).
3. O popup do menu de ações abre logo abaixo do avatar, alinhado pela direita,
   acima do cabeçalho e dos avisos.
4. Ajustar os testes de `Cabecalho`, `Controles`, `MenuDeAcoes` e os de
   integração de `App` que dependem da estrutura: título, grupos, desfazer,
   avatar e faixa dentro do cabeçalho; menu abrindo e fechando como antes.
5. Em `docs/interface.md`, citando o IDR 0018:
   - § Cabeçalho: o desfazer fica na linha dos grupos; o avatar na primeira
     linha, à direita do título; a regra única de sticky substitui o
     parágrafo dos 768px; a faixa é a última linha, abaixo dos grupos
   - § Controles: primeiro item sem os 768px; o item "À direita da linha, os
     dois comandos" passa a dizer desfazer à direita da linha dos grupos e
     avatar na primeira linha
   - § Menu de ações: popup ancorado logo abaixo do avatar
   - § Wireframe da tela principal › Página inteira: desenho com avatar na
     linha do título, grupos e desfazer abaixo, faixa por último, tudo sticky;
     o item sobre o que o sticky fixa sem os 768px
   - § Medidas: "Desfazer" sem a menção à vizinhança do avatar; "Menu de
     ações" aberto logo abaixo do avatar

**Fora do escopo**: tooltip das bandeiras (Tarefa 0019-0002); conteúdo e
tipografia do título; padding do cabeçalho; cores e medidas da faixa.

## Decisões já tomadas (não reabrir)
- Cabeçalho todo sticky, avatar na primeira linha, desfazer na linha dos
  grupos — ver `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Avatar como gatilho do menu — ver
  `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md`
- Menu de ações e seus comandos — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Tooltip dos grupos abaixo da opção — ver
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`
- Áreas de toque ampliadas — ver `docs/idr/0042-foco-visivel-e-area-de-toque.md`

## Decisões em aberto nesta tarefa
- Ordem de foco por teclado (nível 2) — premissa: segue a ordem visual de
  leitura da primeira linha para baixo; registrar no log.
- Estrutura de componentes para levar o avatar à primeira linha (nível 1) —
  por exemplo, `Cabecalho` recebendo o menu à parte dos controles; registrar
  no log.

## Arquivos impactados
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.css`,
  `src/components/Cabecalho.test.jsx` — modificar
- `src/components/Controles.jsx`, `src/components/Controles.css`,
  `src/components/Controles.test.jsx` — modificar
- `src/components/MenuDeAcoes.css`, `src/components/MenuDeAcoes.test.jsx` —
  modificar, se a ancoragem exigir
- `src/App.jsx` e os testes `src/App*.test.jsx` afetados — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Controles, § Menu de ações,
  § Wireframe da tela principal, § Medidas)

## Critérios de aceite
- [ ] Nenhuma media query de 768px em `Cabecalho.css` e `Controles.css`
      (busca)
- [ ] Título, grupos, desfazer, avatar e faixa dentro do elemento sticky
      (teste de estrutura)
- [ ] Ao quebrar, avatar na primeira linha à direita do título e desfazer à
      direita da linha dos grupos (verificação visual)
- [ ] Menu abre abaixo do avatar e fecha fora e com `Esc` (testes)
- [ ] `docs/interface.md` nas cinco seções, citando o IDR 0018

## Validação adicional
Verificação visual em `npm run dev` a 375×667, 667×375, 768, 1024 e 1440px de
largura: rolar o catálogo e conferir que nada do cabeçalho rola; título
quebrando com o avatar no alto à direita; trocar para disposição álbum e
conferir o desfazer parado; abrir o menu. Anotar no log a altura do cabeçalho
sticky a 375×667 e a 667×375.
