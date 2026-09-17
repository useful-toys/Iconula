<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0029-0003: data/hora de persistência em Roboto Condensed

## Data
2026-09-17

## Resumo
O relógio do cabeçalho (`.cabecalho__relogio`, `atualizadoEm` do título —
`12:34`, `17/09 12:34` ou `—`) passa de Poppins (herdada, peso 400) para
Roboto Condensed 500, já vendorizada (TDR 0013) e usada no mesmo padrão de
pilha de fontes em `Secao.css` e `Figurinha.css`
(`'Roboto Condensed', 'Poppins', system-ui, sans-serif`). Tamanho (13px),
`tabular-nums` e cor (`--muted`) ficam como estavam. `docs/interface.md`
§ Medidas atualizado para citar a fonte do relógio.

## Discovery
- Código: `.cabecalho__relogio` em `src/components/Cabecalho.css` (linha 95
  antes da mudança), sem `font-family` própria — herdava a Poppins do corpo.
  Padrão de pilha de fontes para Roboto Condensed 500 já usado em
  `Secao.css:383` e `Figurinha.css:121`, com a mesma vírgula de
  fallback (`'Poppins', system-ui, sans-serif`). `atualizadoEm` é renderizado
  em `Cabecalho.jsx`, sem lógica a mudar (fora do escopo).
- Documentação: as referências bastaram — `docs/interface.md` § Medidas já
  descrevia o relógio ("um ponto menor (13px) também em `--muted`"); só
  acrescentei a fonte.

## Plano da alteração
1. Em `src/components/Cabecalho.css`, `.cabecalho__relogio`: acrescentar
   `font-family: 'Roboto Condensed', 'Poppins', system-ui, sans-serif;` e
   trocar `font-weight: 400` por `font-weight: 500`; manter `font-size: 13px`,
   `font-variant-numeric: tabular-nums` e `color: var(--muted)`.
2. Atualizar `docs/interface.md` § Medidas, linha do cabeçalho, citando
   Roboto Condensed 500 para o relógio.
- Verificação prevista: busca por `font-family` e `font-weight` na regra
  (critério 1); leitura da regra para os demais (critério 2); lint, test e
  build.
- Riscos: nenhum — troca puramente estética, sem impacto em teste
  automatizado (nenhum teste afirma fonte/peso do relógio).
- Desvios: nenhum.

## Decisões tomadas
Nenhuma — mudança puramente estética prevista na tarefa, seguindo o padrão
de pilha de fontes já registrado no TDR 0013 e já em uso em `Secao.css` e
`Figurinha.css`; sem decisão nova a registrar.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> iconula@0.0.0 lint
> oxlint
(sem avisos ou erros)

$ npm run test -- --run
 Test Files  43 passed (43)
      Tests  581 passed (581)

$ npm run build
✓ 138 modules transformed.
✓ built in 329ms
(aviso pré-existente de chunk > 500kB, não relacionado a esta tarefa)
```

## Critérios de aceite
- [x] `.cabecalho__relogio` com `font-family: 'Roboto Condensed'` e
      `font-weight: 500` — `src/components/Cabecalho.css:97-98`.
- [x] 13px, `tabular-nums` e `--muted` mantidos —
      `src/components/Cabecalho.css:98,100-101`.
- [x] `npm run lint && npm run test && npm run build` verdes — ver Validação.

## Arquivos alterados
- `src/components/Cabecalho.css` — `.cabecalho__relogio` ganha
  `font-family: 'Roboto Condensed', 'Poppins', system-ui, sans-serif` e
  `font-weight: 500` (era 400).
- `docs/interface.md` — § Medidas, linha do cabeçalho, cita Roboto Condensed
  500 para o relógio.
- `docs/plano/0029-compactacao-vertical/0003-data-hora-de-persistencia-em-roboto-condensed.md` —
  status `Concluída`.
- `docs/plano/README.md` — linha da Tarefa 0029-0003 → `Concluída`.
