<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0004]: título e controles em uma única linha

## Status
Pendente

## Objetivo
Avaliar e, se a medição justificar, fundir a linha de título com a linha de
controles num único container que só quebra em duas linhas quando a largura
não permite uma — para economizar espaço vertical, seguindo o minimalismo que
já levou o título a uma linha única (IDR 0018).

## Documentos de referência
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão e
  § Consequências — "Título único, uma linha" e o cabeçalho comprimido
- `docs/interface.md` § Controles — "uma única linha, logo abaixo do título"
  e a regra de quebra: grupos segmentados fluem e quebram, botões de comando
  colados à direita
- `docs/interface.md` § Cabeçalho — composição atual do cabeçalho sticky
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` e
  `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md` —
  larguras de referência de celular, tablet e navegador
- `src/components/Cabecalho.jsx`, `Cabecalho.css` — título (`h1`) e faixa de
  bandeiras dentro de um `<header>` com `position: sticky`
- `src/components/Controles.jsx`, `Controles.css` — linha separada, não
  sticky
- `src/App.jsx` — ordem de renderização: `Cabecalho` e depois `Controles`

## Padrões e convenções aplicáveis
- Minimalismo é regra de ouro; espaço otimizado para o catálogo — IDR 0018
- A faixa de bandeiras continua como última linha do cabeçalho, fora da
  fusão — `docs/interface.md` § Cabeçalho
- O filtro de status some na disposição álbum sem mover os botões de
  comando — `docs/interface.md` § Controles
- Nenhum componente ganha rolagem própria — IDR 0008
- Revisar uma decisão é atualizar o registro existente, com a anterior em
  `## Histórico` — `docs/idr/CLAUDE.md`

## Escopo e instruções de implementação
1. Medir, nas larguras de referência de celular, se título + três grupos +
   dois botões cabem numa linha ou se o celular continua vendo duas linhas.
2. Atualizar o IDR 0018 com as três decisões (ver "Decisões em aberto").
3. Reestruturar `Cabecalho.jsx`/`Controles.jsx`/`App.jsx` conforme decidido —
   em princípio, um container `flex-wrap: wrap` compartilhado entre título e
   controles, com a faixa de bandeiras como linha à parte logo abaixo.
4. Testes em `Cabecalho.test.jsx` e `Controles.test.jsx`: a composição nova
   mantém título, grupos, desfazer e menu presentes e na ordem decidida, com e
   sem o grupo de filtro.
5. Atualizar `docs/interface.md` § Cabeçalho e § Controles, citando o IDR 0018.

**Fora do escopo**: mudar o conteúdo do título ou dos controles; mudar a faixa
de bandeiras; mudar o conteúdo do menu de ações.

## Decisões já tomadas (não reabrir)
- Conteúdo do título e notação compacta — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Os três grupos segmentados e os rótulos curtos — ver `docs/interface.md`
  § Controles
- Regra de quebra dos grupos (fluem e quebram; botões de comando colados à
  direita) — ver `docs/interface.md` § Controles, mantida no novo layout

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: `docs/idr/0018-usuario-especialista-e-minimalismo.md`
  § Decisão e o trecho "uma única linha, logo abaixo do título" de
  `docs/interface.md` § Controles — título e controles em linhas separadas →
  título e controles no mesmo container, com quebra condicional pela largura;
  a decisão anterior vai para `## Histórico`. Decide também:
  - **sticky**: se os controles entram na área `position: sticky`;
  - **ordem de quebra**: se quebra primeiro entre título e controles, ou entre
    os grupos, com o título na própria posição;
  - **ganho em celular**: a medição do passo 1 e se a fusão vale abaixo de
    certa largura.

## Impedimentos específicos
- Se a medição mostrar que o celular continua em duas linhas quase sempre,
  o ganho fica concentrado em telas largas: bloqueie com a medição antes de
  refatorar, com as alternativas (fundir mesmo assim, fundir só acima de uma
  largura, não fundir).

## Arquivos impactados
- `src/components/Cabecalho.jsx` — modificar
- `src/components/Cabecalho.css` — modificar
- `src/components/Controles.jsx` — modificar
- `src/components/Controles.css` — modificar
- `src/App.jsx` — modificar (composição)
- `src/components/Cabecalho.test.jsx`, `src/components/Controles.test.jsx` —
  modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Controles)
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` — modificar

## Critérios de aceite
- [ ] IDR 0018 registra as três decisões (sticky, ordem de quebra, medição do
      ganho em celular), com a decisão anterior em `## Histórico`
- [ ] Título e controles compartilham uma linha quando a largura permite
- [ ] A linha quebra em duas quando não cabe, sem cortar nem sobrepor texto
- [ ] A faixa de bandeiras continua como linha à parte, abaixo
- [ ] Na disposição álbum (sem filtro), os botões de comando não se deslocam

## Validação adicional
Verificação visual em `npm run dev`: larguras de referência de celular, tablet
e navegador, com e sem histórico de desfazer, nas duas disposições.
