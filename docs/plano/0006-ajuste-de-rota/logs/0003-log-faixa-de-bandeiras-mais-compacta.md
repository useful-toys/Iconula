<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0006-0003: faixa de bandeiras mais compacta

## Data
2026-09-10

## Resumo
Apertado o espaçamento horizontal entre as bandeiras da faixa de salto do
cabeçalho, de 8px para 4px, para caber mais seções na largura da tela antes de
precisar rolar.

- `src/components/FaixaDeSecoes.css`: `gap` de `.faixa-de-secoes` passou de
  `8px` para `4px`. O `padding` vertical da faixa (`8px var(--page-gutter)`) e as
  medidas do ícone (30×30px, raio 8px, glifo de 15px) ficaram como estavam — só o
  espaço morto entre botões mudou.

`docs/interface.md` § Medidas já descrevia o espaçamento de 4px (revisão de
planejamento da Fase 6); não precisou mudar. Nenhum teste novo era exigido por
uma medida: `FaixaDeSecoes.test.jsx` continuou passando sem ajuste.

## Decisões tomadas
Nenhuma. Espaçamento é medida, já fixada em `docs/interface.md` § Medidas; não
gera IDR (conforme a própria tarefa).

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.` (39 arquivos, 105 regras).
- `vitest run`: **16 arquivos de teste, 148 testes, todos passando** — os 5 de
  `FaixaDeSecoes.test.jsx` passaram sem ajuste.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

### Verificação visual
A verificação visual em `npm run dev` não pôde ser executada neste ambiente
automatizado (sem navegador). Por geometria: com o `gap` reduzido de 8px para
4px, cada seção passa a ocupar 34px (30px do ícone + 4px de vão) em vez de 38px,
ou seja ~89% da largura anterior por item; o botão continua com 30×30px e o vão
de 4px mantém duas bandeiras vizinhas distinguíveis, inclusive com uma delas em
destaque (fundo `--gold`). A rolagem horizontal da faixa não foi alterada.

## Arquivos alterados
- `src/components/FaixaDeSecoes.css` — `gap` de 8px para 4px
- `docs/plano/0006-ajuste-de-rota/0003-faixa-de-bandeiras-mais-compacta.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0003 atualizado
- `docs/plano/0006-ajuste-de-rota/logs/0003-log-faixa-de-bandeiras-mais-compacta.md` — este log
