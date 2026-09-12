<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0004]: título e controles em uma única linha

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — "Título
  único, uma linha" **e**, no bloco de Controles de `docs/interface.md`, "uma
  única linha, **logo abaixo do título**" — é este segundo ponto que esta
  tarefa revisa
- `src/components/Cabecalho.jsx` e `Cabecalho.css` — título (`h1`) e faixa de
  bandeiras, dentro de um `<header>` com `position: sticky`
- `src/components/Controles.jsx` e `Controles.css` — linha separada, não
  sticky, com os grupos segmentados à esquerda e desfazer/menu à direita
- `src/App.jsx` — ordem de renderização atual: `Cabecalho` (título + faixa),
  depois `Controles`
- `docs/interface.md` § Controles — "os grupos segmentados fluem... e quebram
  para a linha seguinte quando não cabem na largura; os dois botões de
  comando ficam sempre colados à direita" — regra de quebra já existente que
  esta tarefa estende para incluir o título na mesma linha

## Objetivo
Avaliar e, se o desenho for aprovado, implementar a fusão da linha de título
com a linha de controles num único container que só quebra em duas linhas
quando a largura não permitir uma só — para economizar espaço vertical,
seguindo o mesmo princípio de minimalismo que já levou o título a uma linha
única (IDR 0018).

## Padrões e convenções aplicáveis
- Minimalismo é regra de ouro; espaço otimizado para o catálogo —
  `docs/idr/0018-*` § Decisão
- A faixa de bandeiras continua como última linha do cabeçalho, fora desta
  fusão — não faz parte do escopo
- O filtro de status some na disposição álbum sem mover os botões de comando
  — regra existente que precisa continuar valendo dentro do novo layout
  (`docs/interface.md` § Controles)
- Nenhum componente ganha rolagem própria (IDR 0008)
- Mudança de decisão registrada em IDR exige um IDR novo que a revise
  explicitamente, referenciando o anterior — convenção do `AGENTS.md` §
  Convenções

## Escopo e instruções de implementação
1. Registrar **IDR** revisando o trecho "logo abaixo do título" do
   `docs/interface.md` § Controles, decidindo explicitamente três pontos em
   aberto:
   a. **Sticky**: os controles (grupos + desfazer + menu) passam a fazer
      parte da área `position: sticky` do cabeçalho, ou ficam fora dela mesmo
      compartilhando a linha com o título?
   b. **Ordem de quebra**: quando não couber tudo numa linha, o que quebra
      primeiro — o título vai para uma linha e os controles para outra (como
      hoje, só que numa única quebra condicional), ou os grupos segmentados
      quebram entre si conforme a regra que já existe em `docs/interface.md`
      § Controles, com o título sempre em sua própria posição?
   c. **Ganho real em celular**: medir, nas larguras de celular já usadas como
      referência no projeto (ver `docs/idr/0015-*` e a Tarefa 0010-0003), se
      título + três grupos + dois botões cabem numa linha só ou se o celular
      continua vendo duas linhas na prática — registrar a medição no IDR
      antes de decidir se a fusão vale a pena abaixo de certa largura.
2. Reestruturar `Cabecalho.jsx`/`Controles.jsx`/`App.jsx` conforme decidido
   em 1 — provavelmente um container `flex-wrap: wrap` compartilhado entre o
   título e os controles, mantendo a faixa de bandeiras como linha à parte
   logo abaixo.
3. Conferir que a disposição álbum (sem o grupo de filtro) não desloca os
   botões de comando nem muda o ponto de quebra de forma inesperada.
4. Atualizar `docs/interface.md` § Cabeçalho e § Controles com o layout novo.

**Fora do escopo**: mudar o conteúdo do título ou dos controles; mudar a
faixa de bandeiras; mudar o que aparece dentro do menu de ações.

## Decisões já tomadas (não reabrir)
- Conteúdo do título e notação compacta — ver `docs/idr/0018-*`
- Os três grupos segmentados e os rótulos curtos — ver `docs/interface.md` §
  Controles
- Regra de quebra dos grupos (fluem e quebram; botões de comando colados à
  direita) — ver `docs/interface.md` § Controles, mantida dentro do novo
  layout

## Decisões em aberto nesta tarefa
- Se os controles entram na área sticky — encaminhamento no passo 1a; nasce
  **IDR 0044** (próximo número livre)
- Ordem de quebra entre título e grupos — mesmo IDR, passo 1b
- Se a fusão compensa em celular, dado o resultado da medição do passo 1c —
  mesmo IDR; se a medição mostrar ganho desprezível em celular, registrar a
  decisão de mesmo assim fundir (ganho em tablet/desktop) ou não fundir, com
  o raciocínio explícito

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
   **Caso concreto previsto aqui**: se a medição do passo 1c mostrar que o
   celular continua quebrando em duas linhas quase sempre, o ganho da fusão
   fica concentrado em telas largas — sinalizar ao humano antes de investir
   no refactor, em vez de assumir que vale a pena.

## Arquivos impactados
- `src/components/Cabecalho.jsx` — modificar
- `src/components/Cabecalho.css` — modificar
- `src/components/Controles.jsx` — modificar
- `src/components/Controles.css` — modificar
- `src/App.jsx` — modificar (composição)
- `src/components/Cabecalho.test.jsx`, `Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Controles)
- `docs/idr/0044-titulo-e-controles-em-uma-linha.md` — criar

## Critérios de aceite
- [ ] IDR 0044 registrado com as três decisões (sticky, ordem de quebra,
      medição do ganho em celular)
- [ ] Título e controles compartilham uma linha quando a largura permite
- [ ] A linha quebra em duas quando não cabe, sem cortar nem sobrepor texto
- [ ] A faixa de bandeiras continua como linha à parte, abaixo
- [ ] Disposição álbum (sem filtro) não desloca os botões de comando

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: testar nas larguras de referência de
celular, tablet e desktop (mesmos pontos de quebra da disposição álbum),
com e sem histórico de desfazer, nas duas disposições.
