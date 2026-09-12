<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0002]: tooltip nas opções de controle

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `src/components/Controles.jsx` — os arrays `ORDENACOES`, `DISPOSICOES` e
  `FILTROS` já têm `nomeAcessivel` por extenso para cada opção (ex.: "ordenar
  pela página do álbum") — é o texto candidato ao tooltip, não um texto novo
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — "sem
  rótulos explicativos" na tela; o tooltip é sob demanda (hover/foco), não
  texto sempre visível, então não contradiz a regra por si só, mas é uma
  informação nova na interface e merece registro
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — padrão de uso de
  `:focus-visible` já estabelecido; o tooltip deve responder também a foco de
  teclado, não só a `:hover`, para não criar informação exclusiva de mouse
- `docs/requisitos.md` § Requisitos Não Funcionais — nenhum componente com
  rolagem própria (IDR 0008) — o tooltip não pode empurrar layout nem abrir
  uma segunda área rolável

## Objetivo
Ao passar o mouse ou levar o foco de teclado a qualquer opção dos três grupos
de controle (ordenação, disposição, filtro), exibir uma explicação curta do
que a opção faz, reaproveitando o texto que já existe como `aria-label`.

## Padrões e convenções aplicáveis
- Um texto, duas saídas: o mesmo `nomeAcessivel` já usado no `aria-label`
  alimenta o tooltip visual — nunca duas fontes de verdade para a mesma frase
- O tooltip não pode duplicar a leitura do leitor de tela: se implementado
  via `content: attr(...)` em CSS, o texto do pseudo-elemento não entra na
  árvore de acessibilidade, então o `aria-label` continua sendo a única fonte
  para quem usa leitor de tela — evita risco de anúncio duplicado
- Aparece em `:hover` **e** em `:focus-visible`, nunca só em um dos dois
- Sem framework de tooltip novo — CSS puro sobre os tokens existentes
  (`--panel`, `--cream`, `--border`), sem biblioteca e sem JS de posicionamento
- Não pode criar rolagem própria nem ser cortado pela borda da viewport em
  tela estreita — conferir especialmente o primeiro/último botão de cada
  grupo, mais perto da borda da tela

## Escopo e instruções de implementação
1. Registrar **IDR** decidindo a técnica: tooltip CSS-only (`::after` com
   `content: attr(data-tooltip)`, mostrado em `:hover`/`:focus-visible`) em vez
   do `title` nativo do navegador — motivo: consistência com a paleta escura
   do app e leitura confiável por teclado, contra o custo de manutenção de uma
   regra CSS a mais. Registrar a alternativa do `title` nativo como
   descartada, com o motivo.
2. Em `Controles.jsx`, acrescentar `data-tooltip={opcao.nomeAcessivel}` a cada
   botão dos três grupos (reaproveitando o array existente, sem duplicar
   texto).
3. Em `Controles.css`, implementar o tooltip: posicionado acima do botão,
   oculto por padrão (`opacity: 0`/`visibility: hidden`), revelado em
   `:hover`/`:focus-visible` do botão, com pequeno atraso ou transição curta
   para não piscar ao passar o mouse de raspão.
4. Conferir em tela estreita (celular) que o tooltip do primeiro e do último
   botão de cada grupo não estoura a borda da viewport — ajustar o ponto de
   ancoragem (`left`/`right`/`transform`) se necessário.
5. Conferir que o tooltip não aparece em toque (`pointer: coarse` sem mouse
   real) de um jeito que atrapalhe — em tela sensível não há `:hover`
   persistente, então o comportamento natural (tooltip só com foco, não com
   toque solto) é aceitável; registrar essa consequência no IDR.
6. Atualizar `docs/interface.md` § Controles com a existência do tooltip.

**Fora do escopo**: tooltip no botão de desfazer, no menu de ações ou nos
ícones da faixa de bandeiras — ficam para uma tarefa futura, se decidido.

## Decisões já tomadas (não reabrir)
- O texto de cada opção por extenso já existe (`nomeAcessivel`) — ver
  `src/components/Controles.jsx`
- Minimalismo não abre mão de acessibilidade — ver `docs/idr/0018-*`

## Decisões em aberto nesta tarefa
- Técnica do tooltip (CSS puro vs. `title` nativo) — encaminhamento no passo
  1; nasce **IDR 0043** (próximo número livre)
- Comportamento em toque (sem hover persistente) — mesmo IDR

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
- `src/components/Controles.jsx` — modificar (`data-tooltip`)
- `src/components/Controles.css` — modificar (regras do tooltip)
- `src/components/Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Controles)
- `docs/idr/0043-tooltip-css-nas-opcoes-de-controle.md` — criar

## Critérios de aceite
- [ ] Toda opção dos três grupos revela seu `nomeAcessivel` em tooltip visual
- [ ] Tooltip aparece em `:hover` e em `:focus-visible`, não só em um dos dois
- [ ] Nenhum texto novo foi escrito — o tooltip reaproveita `nomeAcessivel`
- [ ] Tooltip não é cortado pela borda da viewport em celular
- [ ] Nenhuma rolagem própria foi introduzida
- [ ] IDR 0043 registrado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: passar o mouse por cada opção; tabular
por teclado por cada opção e conferir que o tooltip aparece igual; testar em
largura de celular nos botões das pontas de cada grupo.
