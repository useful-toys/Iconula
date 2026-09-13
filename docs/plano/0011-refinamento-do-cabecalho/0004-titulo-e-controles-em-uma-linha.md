<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0004]: título e controles em uma única linha

## Status
Concluída

## Objetivo
A partir de 768px de largura, título e controles dividem uma única linha
dentro do cabeçalho sticky, economizando uma linha de altura em tablet e
navegador; abaixo de 768px o layout continua como hoje.

## Documentos de referência
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão ("Título e
  controles") e § Histórico — a regra de 768px, a quebra dentro da área
  sticky e o celular inalterado
- `docs/interface.md` § Cabeçalho e § Controles — composição atual e a regra
  de quebra dos grupos (fluem e quebram; comandos colados à direita)
- `src/components/Cabecalho.jsx`, `Cabecalho.css` — `h1` e faixa dentro do
  `<header>` sticky
- `src/components/Controles.jsx`, `Controles.css` — linha própria, fora do
  sticky
- `src/App.jsx` — ordem de renderização: `Cabecalho` e depois `Controles`

## Padrões e convenções aplicáveis
- A faixa de bandeiras continua a última linha do cabeçalho —
  `docs/interface.md` § Cabeçalho
- Sem o filtro (disposição álbum), os comandos não se movem —
  `docs/interface.md` § Controles
- Nenhum componente ganha rolagem própria — IDR 0008
- Sem estado global nem leitura de largura em JS: a regra de 768px é de CSS
  — `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. Reorganizar `App.jsx`/`Cabecalho.jsx`/`Controles.jsx` para que título e
   controles fiquem num mesmo contêiner dentro do `<header>` sticky, com a
   faixa de bandeiras depois dele.
2. A partir de 768px: título à esquerda e controles à direita na mesma
   linha; sem espaço, os controles quebram para a linha de baixo, ainda no
   sticky, com a regra de quebra atual dos grupos.
3. Abaixo de 768px: resultado visual igual ao de hoje — título no sticky,
   controles numa linha própria fora dele, rolando com o conteúdo.
4. Testes em `Cabecalho.test.jsx` e `Controles.test.jsx`: título, grupos,
   desfazer e menu presentes e na ordem, com e sem o grupo de filtro.
5. Em `docs/interface.md` § Cabeçalho e § Controles, substituir "uma única
   linha, logo abaixo da faixa de bandeiras — fora do cabeçalho sticky" pela
   regra do IDR 0018: a partir de 768px, título e controles na mesma linha
   sticky, quebrando os controles para baixo quando não cabem; abaixo de
   768px, como antes.

**Fora do escopo**: conteúdo do título e dos controles; faixa de bandeiras;
avatar (Tarefa 0011-0005).

## Decisões já tomadas (não reabrir)
- Título e controles numa linha a partir de 768px; celular inalterado — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Os três grupos, rótulos curtos e regra de quebra — ver
  `docs/interface.md` § Controles e
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.css`,
  `src/components/Cabecalho.test.jsx` — modificar
- `src/components/Controles.jsx`, `src/components/Controles.css`,
  `src/components/Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Controles)

## Critérios de aceite
- [ ] A partir de 768px, título e controles na mesma linha, dentro do
      cabeçalho sticky (verificação visual a 1024px e 1440px)
- [ ] Sem espaço, os controles quebram para a linha de baixo sem cortar nem
      sobrepor texto, ainda no sticky (verificação visual a 768px)
- [ ] Abaixo de 768px, layout igual ao anterior (verificação visual a 375px)
- [ ] Faixa de bandeiras continua como linha à parte, abaixo
- [ ] Na disposição álbum (sem filtro), os comandos não se deslocam
- [ ] `docs/interface.md` § Cabeçalho e § Controles descrevem a regra citando
      o IDR 0018

## Validação adicional
Verificação visual em `npm run dev` a 375px, 768px, 1024px e 1440px, nas duas
disposições, com e sem histórico de desfazer; rolar a página e conferir o que
fica sticky em cada largura.
