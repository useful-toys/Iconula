<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0011-0004: título e controles em uma única linha

## Data
2026-09-13

## Resumo
A partir de 768px de largura, o título e a linha de controles passam a dividir
uma única linha dentro do cabeçalho sticky — título à esquerda e controles à
direita —, e a faixa de bandeiras continua como linha à parte, abaixo. Sem
espaço na linha, os controles quebram para a linha de baixo, ainda no sticky, e
só então a faixa desce. Abaixo de 768px nada muda no resultado: o título e a
faixa seguem sticky e os controles ficam numa linha própria, fora do sticky,
rolando com o conteúdo (IDR 0018).

Antes, `Cabecalho` (sticky: título + faixa) e `Controles` eram irmãos em
`.app`, com os controles sempre fora do sticky. Agora `App` passa `Controles`
como `children` de `Cabecalho`, que renderiza `<header>` com um bloco fixo
(título + faixa) e os controles como irmão. No móvel o `<header>` não gera
caixa (`display: contents`) e só o bloco fixo é sticky — o bloco precisa de um
ancestral alto para fixar a página toda, e sem a caixa do `<header>` o
ancestral passa a ser `.app`; os controles rolam com o conteúdo, como antes. A
partir de 768px o próprio `<header>` vira a linha sticky em flex (`flex-wrap`),
o bloco fixo vira `display: contents` e o `order` do CSS põe os controles entre
o título e a faixa, mesmo com a faixa vindo antes no DOM (ordem que o móvel
exige). Os controles crescem para ocupar a sobra (`flex: 1 1 auto`), de modo
que os dois comandos continuem colados à direita, inclusive na linha quebrada.

Arquivos: `App.jsx` (controles como `children` do cabeçalho); `Cabecalho.jsx`
(`children` + bloco `.cabecalho__fixo`); `Cabecalho.css` (regra responsiva);
`Controles.css` (padding zerado a partir de 768px, já que o padding passa a ser
do cabeçalho); testes em `Cabecalho.test.jsx` e `Controles.test.jsx`;
`docs/interface.md` § Cabeçalho, § Controles e um item do wireframe. Nenhum
registro novo: a regra de 768px já está no IDR 0018, atualizado no
planejamento.

## Discovery
- Código: `App.jsx:485` renderizava `Cabecalho` e `Controles` como irmãos;
  `Controles.jsx` é um `div.controles` autossuficiente (grupos + comandos) e
  não precisou de mudança de JSX; `Cabecalho.css` tinha o `position: sticky`,
  o `padding` (`--header-padding`), o fundo e a borda em `.cabecalho`. Os
  testes usam RTL + jest-dom por papel/`aria-label` e por classe
  (`.faixa-de-secoes__botao--inicio-de-grupo`); nenhum teste consulta
  `getByRole('banner')` nem a estrutura de `.app`. Comportamento atual confere
  com a tarefa. Impacto não citado: nenhum outro consumidor de `Cabecalho`.
- Documentação: li o `## Decisão` e o `## Histórico` do IDR 0018 (a regra de
  768px, o celular inalterado e a quebra dos controles) e o `## Decisão` do
  IDR 0048 (contorno e tooltip, mantidos). As referências bastaram; nenhum
  registro novo.

## Plano da alteração
1. `src/App.jsx` — passar `<Controles .../>` como `children` de `Cabecalho`.
2. `src/components/Cabecalho.jsx` — receber `children` e envolver título +
   faixa em `.cabecalho__fixo`, com `{children}` depois.
3. `src/components/Cabecalho.css` — base móvel: `.cabecalho`
   `display: contents`; `.cabecalho__fixo` sticky com padding/fundo/borda; a
   partir de 768px: `.cabecalho` sticky flex com `flex-wrap` e
   `justify-content: space-between`, `.cabecalho__fixo` `display: contents`,
   `order` (título 1, controles 2, faixa 3), controles `flex: 1 1 auto` e faixa
   `flex-basis: 100%`.
4. `src/components/Controles.css` — a partir de 768px, `padding: 0` (o padding
   passa a ser do cabeçalho).
5. Testes — `Cabecalho.test.jsx`: título, grupos, desfazer e menu dentro do
   `<header>` e na ordem, com e sem o grupo de filtro; `Controles.test.jsx`: a
   área de comandos depois dos grupos, com e sem filtro.
6. `docs/interface.md` — § Cabeçalho e § Controles passam a descrever a regra
   de 768px citando o IDR 0018; o item do wireframe que dizia que os controles
   rolam com o conteúdo é ajustado.
- Verificação prevista: critérios visuais (375/768/1024/1440px) → roteiro, sem
  navegador; critério de documentação → leitura; ordem/estrutura → testes.
- Riscos: `position: sticky` só persiste dentro do bloco ancestral — o bloco
  fixo no móvel precisa de ancestral alto, resolvido com `display: contents`
  no `<header>` (ancestral passa a `.app`); a ordem que o móvel exige (faixa
  antes dos controles no DOM) é corrigida no desktop com `order`.
- Desvios: nenhum.

## Decisões tomadas
- Reorganizar com `<header>` `display: contents` no móvel e bloco
  `.cabecalho__fixo` sticky; no desktop, `<header>` vira a linha flex e o
  bloco fixo vira `display: contents`, com `order` — nível 1, sem registro: é
  a técnica interna para a decisão de interface já registrada no IDR 0018.
- Controles com `flex: 1 1 auto` no desktop, para os comandos seguirem colados
  à direita mesmo quando o bloco quebra de linha (`interface.md` § Controles) —
  nível 1, sem registro.
- `Controles.jsx` sem mudança de JSX (só `Controles.css`): o componente já é
  autossuficiente e passou a ser filho do cabeçalho — nível 1, sem registro.

## Impedimentos
Nenhum. Achado fora do escopo, não corrigido: os `aria-label` dos grupos de
ordenação e disposição em `Controles.jsx:95` e `:114` usam
`\u00e7`/`\u00e3` dentro de literal JSX de atributo, que não interpreta a
escape — o leitor de tela lê a sequência literal. Registrado em `observacoes`.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 1 warning and 0 errors.` Aviso pré-existente e alheio
  à tarefa: `react(refs)` em `src/components/Catalogo.jsx:195`.
- `npm run test` → `Test Files 35 passed (35)` e `Tests 383 passed (383)`
  (antes: 379; +4 testes desta tarefa), incluindo `Cabecalho.test.jsx` (9) e
  `Controles.test.jsx` (26).
- `npm run build` → `✓ built in 490ms`, exit 0. O aviso de chunk > 500 kB é
  pré-existente (bundle do Firebase/SDK).
- `npm run test:rules` → não se aplica: `firestore.rules` não foi tocado.
- Verificação visual em `npm run dev` → **pendente**: sem navegador no
  ambiente; roteiro abaixo.

## Critérios de aceite
- [ ] A partir de 768px, título e controles na mesma linha, dentro do cabeçalho
      sticky (visual a 1024/1440px) — implementado (`.cabecalho` sticky flex
      com `order`, `Cabecalho.css:28`) e coberto por teste de estrutura
      ("coloca título, controles e faixa dentro do cabeçalho, na ordem",
      `src/components/Cabecalho.test.jsx`); verificação visual pendente.
- [ ] Sem espaço, os controles quebram para a linha de baixo sem cortar nem
      sobrepor, ainda no sticky (visual a 768px) — implementado
      (`flex-wrap: wrap` + `flex: 1 1 auto`, `Cabecalho.css:33-63`);
      verificação visual pendente.
- [ ] Abaixo de 768px, layout igual ao anterior (visual a 375px) — implementado
      (`.cabecalho` `display: contents` e `.cabecalho__fixo` sticky,
      `Cabecalho.css:8-20`; controles em fluxo normal); verificação visual
      pendente.
- [x] Faixa de bandeiras continua como linha à parte, abaixo — `order: 3` e
      `flex-basis: 100%` no desktop (`Cabecalho.css:60-63`) e a faixa presente
      no `<header>` (teste de estrutura).
- [x] Na disposição álbum (sem filtro), os comandos não se deslocam —
      `.controles { flex: 1 1 auto }` (`Cabecalho.css:52-57`) mantém a borda
      direita do bloco no cabeçalho e `.controles__direita { margin-left:
      auto }` (`Controles.css:101`) ancora os comandos à direita; teste "mantém
      a ordem dos comandos sem o grupo de filtro"
      (`src/components/Cabecalho.test.jsx`).
- [x] `docs/interface.md` § Cabeçalho e § Controles descrevem a regra citando o
      IDR 0018 — `docs/interface.md:51` e `:58`.

## Arquivos alterados
- `src/App.jsx` — passa `Controles` como `children` de `Cabecalho`
- `src/components/Cabecalho.jsx` — `children` e bloco `.cabecalho__fixo`
- `src/components/Cabecalho.css` — regra responsiva (768px)
- `src/components/Controles.css` — padding zerado a partir de 768px
- `src/components/Cabecalho.test.jsx` — estrutura e ordem com/sem filtro
- `src/components/Controles.test.jsx` — comandos depois dos grupos
- `docs/interface.md` — § Cabeçalho, § Controles e o item do wireframe
- `docs/plano/0011-refinamento-do-cabecalho/0004-titulo-e-controles-em-uma-linha.md` — status
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0011-refinamento-do-cabecalho/logs/0004-log-titulo-e-controles-em-uma-linha.md` — este log
