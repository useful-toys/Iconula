<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0034-0001: Reordena o título da seção de seleção

## Data
2026-09-18

## Resumo
O cabeçalho de seção passa a decidir ordem e presença dos spans de
identificação por tipo de seção (IDR 0068). Antes, todo cabeçalho exibia
`nome, sigla, página`; depois, seleções exibem `sigla, nome, página`
(`BRA Brasil 24`), a Coca-Cola perde a sigla (`Coca-Cola 112`) e o FWC
segue `nome, sigla, página` (`Extras FIFA FWC 0`). Pesos, cores, `gap` e
a fonte condensada até 582px (IDR 0056) não mudam. `Secao.jsx` ganhou a
montagem condicional da identificação; `Secao.test.jsx` cobre os três
casos; `docs/interface.md` § Corpo descreve a ordem condicional e cita o
IDR 0068.

## Discovery
- Código: `CabecalhoSecao` em `src/components/Secao.jsx:23-79` monta hoje
  os spans `secao__nome`, `secao__sigla` e `secao__pagina` em ordem fixa
  (linhas 55-64). `secao.tipo` existe no catálogo (`src/data/catalogo.js`:
  `"selecao"` nas 48 seleções, linha 95; `"especial"` em FWC linha 107 e
  COC linha 122). `secao.sigla` é `"COC"` só na Coca-Cola. O teste
  `Secao.test.jsx:24-48` afirma `['Brasil', 'BRA', '24']` com fixture sem
  `tipo`; o teste do FWC (`Secao.test.jsx:66-91`) afirma
  `['Extras FIFA', 'FWC', '0']`. Nenhum outro módulo consome os spans por
  ordem. Comportamento atual confere com o pedido.
- Documentação: lido o IDR 0068 inteiro (decisão dos três casos e
  consequências, inclusive que `nomeAcessivel` não muda) e o IDR 0056 pelo
  índice para confirmar que a decisão de fonte/`gap` segue intacta. Em
  `docs/interface.md`, a única linha com a ordem é a de § Corpo
  ("Cabeçalho de grupo numa linha", linhas 236-242); § Medidas não fixa
  ordem (só `gap`/fonte), então nada além de § Corpo muda.

## Plano da alteração
1. `src/components/Secao.jsx`: em `CabecalhoSecao`, montar a lista de
   spans de identificação conforme `secao.tipo` e `secao.sigla` — seleção:
   sigla, nome; COC: nome sem sigla; demais: nome, sigla — e sempre a
   página por último; renderizar a lista. `nomeAcessivel` inalterado.
2. `src/components/Secao.test.jsx`: `secaoBra` ganha `tipo: 'selecao'` e o
   teste de identificação passa a esperar `['BRA', 'Brasil', '24']`; o
   teste do FWC ganha `tipo: 'especial'` na fixture, sem mudar o esperado;
   novo teste da Coca-Cola (`tipo: 'especial'`, `sigla: 'COC'`) afirma que
   `.secao__sigla` não existe e a ordem é `['Coca-Cola', '112']`.
3. `docs/interface.md` § Corpo: descrever a ordem condicional por tipo de
   seção e a ausência da sigla na Coca-Cola, citando o IDR 0068, e
   atualizar o exemplo.
- Verificação prevista: critérios por teste em `Secao.test.jsx`; critério
  de documentação por trecho e busca pelo IDR 0068.
- Riscos: baixo — mudança restrita à montagem visual do cabeçalho, sem
  alterar `memo` nem o nome acessível.
- Desvios: nenhum.

## Decisões tomadas
- Montar a identificação como lista de spans com classe derivada do
  estado (`tipo`/`sigla`) em vez de três ramos de JSX duplicados —
  estrutura interna, nível 1, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — sem avisos (`oxlint`, saída vazia).
- `npm run test` — `Test Files 50 passed (50)`, `Tests 660 passed (660)`,
  ~221s.
- `npm run build` — `vite build`, `✓ 146 modules transformed`, `✓ built in
  1.87s`. Único aviso, pré-existente (registrado nas Tarefas 0017-0001,
  0023-0001 e 0029-0001):
  `(!) Some chunks are larger than 500 kB after minification.`

## Critérios de aceite
- [x] Seção de seleção mostra sigla antes do nome no cabeçalho — teste
      "renderiza o cabeçalho com nome, sigla, página e resumo compacto"
      (`Secao.test.jsx`) espera `['BRA', 'Brasil', '24']`; código em
      `Secao.jsx:44-46`.
- [x] Coca-Cola não mostra `.secao__sigla` no cabeçalho — teste "não mostra
      a sigla no cabeçalho da Coca-Cola e mantém nome e página (IDR 0068)":
      ordem `['Coca-Cola', '112']` e `.secao__sigla` ausente; código em
      `Secao.jsx:43`.
- [x] FWC mantém a ordem atual (nome, sigla, página) — teste "mostra a
      página 0 do FWC" espera `['Extras FIFA', 'FWC', '0']` com fixture
      `tipo: 'especial'`.
- [x] `docs/interface.md` § Corpo descreve a ordem condicional e cita o
      IDR 0068 — trecho "identificação na ordem condicional por tipo de
      seção … [IDR 0068](idr/0068-…)".

## Arquivos alterados
- `src/components/Secao.jsx` — identificação condicional no cabeçalho
- `src/components/Secao.test.jsx` — fixtures com `tipo` e testes dos três casos
- `docs/interface.md` — § Corpo descreve a ordem condicional
- `docs/plano/0034-refinamentos-visuais-do-catalogo/0001-reordena-o-titulo-da-secao-de-selecao.md` — status
- `docs/plano/README.md` — status da tarefa e da fase
