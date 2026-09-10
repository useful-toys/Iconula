<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0002-0002: cabeçalho com o título e o placar em linha única

## Data
2026-09-10

## Resumo
Criados `src/lib/progresso.js` (cálculo puro do placar geral) e
`src/components/Cabecalho.jsx` (cabeçalho sticky controlado por props),
junto de seus testes e de `src/components/Cabecalho.css`.

O placar segue o formato único sobre as 994 figurinhas:
`ICONULA 2026 · <coladas>/994 · <pct>% · ▢<faltantes> · ×<repetidas> · —`,
com `×` contando **códigos distintos** com contagem ≥ 2, conforme o IDR 0021.
O nome acessível escreve os números por extenso, deixando os glifos `▢` e `×`
apenas para leitura visual.

O relógio exibe `—` nesta fase; a prop `atualizadoEm` existe e está
documentada para ser preenchida pela Tarefa 0006-0002, conforme o IDR 0027.
A quebra em telas estreitas segue o encaminhamento da tarefa
(`flex-wrap: wrap`), preservando a ordem e sem cortar o placar; como não
mudou a forma do título, não nasceu IDR.

## Decisões tomadas
Nenhuma nova decisão de arquitetura, técnica ou de interface. A escolha de
isolar o CSS do cabeçalho em `Cabecalho.css` é organizacional e não altera
nenhuma decisão já tomada; o tema global continua em `src/theme.css`.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 9 arquivos de teste, 64 testes passando (incluídos os 4 do
  `Cabecalho.test.jsx` e os 5 do `progresso.test.js`).
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`: o cabeçalho fica colado ao topo ao rolar,
o título cabe em uma linha em janela de desktop, os números usam
`tabular-nums` e o relógio exibe `—`.

## Arquivos alterados
- `src/lib/progresso.js` — criado
- `src/lib/progresso.test.js` — criado
- `src/components/Cabecalho.jsx` — criado
- `src/components/Cabecalho.css` — criado
- `src/components/Cabecalho.test.jsx` — criado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/0002-cabecalho-e-placar-em-linha-unica.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002-0002 atualizado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0002-log-cabecalho-e-placar-em-linha-unica.md` — este log
