<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0002-0001]: tema escuro único e tokens da paleta

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão e § Consequências — tema escuro único, sem `prefers-color-scheme`, cores como tokens
- `docs/interface.md` § Paleta (tokens CSS, OKLCH) — a tabela dos onze tokens e seus usos
- `docs/interface.md` § Tipografia — Poppins nos títulos e códigos, `system-ui` no restante, `tabular-nums` nos números
- `docs/interface.md` § Medidas — margens laterais `clamp(16px, 4vw, 40px)`, paddings do cabeçalho e do corpo, ausência de largura máxima
- `docs/requisitos.md` § Requisitos Não Funcionais — aparência e responsividade
- `docs/prototype/Iconula - Álbum de Figurinhas.html` — referência visual; em divergência, `interface.md` vence

## Objetivo
Estabelecer a base visual do produto novo: os tokens OKLCH, a tipografia
vendorizada e as medidas de espaçamento, num CSS global que todos os componentes
das fases seguintes consomem. Uma cor literal fora dos tokens é regressão.

## Padrões e convenções aplicáveis
- Arquivo CSS novo abre com `/* Copyright (c) 2026 Daniel Felix Ferber */` —
  `AGENTS.md` § Convenções
- Tema escuro único: **sem** `prefers-color-scheme`, sem tema claro, sem
  alternador — `docs/idr/0022-*` § Decisão
- Cor só pelos tokens OKLCH de `docs/interface.md` § Paleta; nada de literal
  espalhado por componente — `docs/idr/0022-*` § Consequências
- A fonte vem dos arquivos vendorizados na Tarefa 0001-0004; nenhum `@import`
  nem `<link>` externo, sob pena de violar a CSP — `docs/tdr/0005-*` § Status
- Margem lateral única `clamp(16px, 4vw, 40px)` no cabeçalho, no corpo e na faixa
  de avisos, para tudo alinhar na mesma vertical; sem largura máxima de conteúdo —
  `docs/interface.md` § Medidas
- Nenhuma regra que crie contêiner com rolagem própria (`overflow: auto/scroll`)
  — `docs/idr/0008-*` § Decisão

## Escopo e instruções de implementação
1. Criar o CSS global do produto (por exemplo `src/theme.css`, importado por
   `src/main.jsx` junto de `src/index.css`) com os onze tokens da tabela de
   `interface.md`, em `:root`, nos valores OKLCH exatos.
2. Declarar as `@font-face` de Poppins 600 e 700 apontando para os `.woff2`
   vendorizados, com `font-display: swap` e fallback `system-ui, sans-serif`.
3. Definir os padrões de página: fundo `--turf`, texto `--cream`, `system-ui` como
   fonte base, `font-variant-numeric: tabular-nums` onde `interface.md` pede
   (título e resumos), `box-sizing: border-box`.
4. Definir as variáveis de espaçamento reutilizáveis (margem lateral do conteúdo,
   paddings do cabeçalho e do corpo, distâncias entre super-grupos, seções e
   cartões), com os valores de `interface.md` § Medidas.
5. Não remover `src/index.css` nem `src/App.css` nesta tarefa — `App.css` ainda
   serve o botão, e sai na Tarefa 0002-0005. Garantir que o tema novo não
   sobrescreva o botão a ponto de deixá-lo ilegível enquanto os dois coexistem
   dentro deste PR.
6. Conferir contraste do par mais frágil apontado pelo IDR 0022: `--green-card`
   sobre `--turf`, e o texto `--ink-on-light` sobre os cartões coloridos.

**Fora do escopo**: qualquer componente (Tarefas 0002-0002 a 0002-0004); estados
de foco e hover (Tarefa 0010-0001); as medidas específicas da disposição álbum
(Fase 4).

## Decisões já tomadas (não reabrir)
- Tema escuro único, sem seguir a preferência do sistema — ver `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
- A paleta, a tipografia e as medidas são as de `interface.md` — ver `docs/idr/0022-*` § Decisão
- Onde protótipo e `interface.md` divergirem, `interface.md` vence — ver `docs/interface.md` § O que é este documento

## Decisões em aberto nesta tarefa
- Arquivo único de tema × tokens em `index.css` — encaminhamento: arquivo próprio
  importado no `main.jsx`, para o tema não se confundir com o reset; decisão
  puramente estética de organização, sem registro se seguir esse encaminhamento

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
   **Caso concreto previsto aqui**: se algum token de `interface.md` não render
   contraste suficiente, implemente o valor especificado, registre a medição no
   log e sinalize — mudar a paleta é decisão do IDR 0022, não desta tarefa.

## Arquivos impactados
- `src/theme.css` — criar
- `src/main.jsx` — modificar (importar o tema)
- `src/index.css` — modificar (se houver regra que conflite com o tema único)

## Critérios de aceite
- [ ] Os onze tokens de `interface.md` § Paleta existem em `:root` com os valores exatos
- [ ] Nenhuma ocorrência de `prefers-color-scheme` no CSS novo
- [ ] Poppins carrega dos arquivos locais, com fallback declarado
- [ ] Nenhuma cor literal fora dos tokens no CSS novo
- [ ] Nenhuma regra `overflow: auto|scroll` no CSS novo
- [ ] O botão atual continua utilizável enquanto os dois estilos coexistem
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0001-log-tema-escuro-unico-e-tokens.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: o fundo é o verde-gramado `--turf`, a fonte
do título é Poppins (conferir na aba Network que veio do próprio host), e alternar
o tema do sistema entre claro e escuro **não** muda nada na tela.
