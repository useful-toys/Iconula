<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0002-0003: cartão da figurinha

## Data
2026-09-10

## Resumo
Criados `src/components/Figurinha.jsx`, `src/components/Figurinha.css` e
`src/components/Figurinha.test.jsx`, com o cartão apresentacional controlado
por props (`codigo`, `contagem`, `metalizada`, `variante`, `onIncrementar`,
`onDecrementar`).

O cartão implementa os três estados da contagem: faltante (`--panel`, borda
tracejada `--muted`, opacidade 0,6), colada (`--green-card` preenchida) e
repetida (`--orange-card` preenchida com selo `×N`, onde N = contagem − 1).
O selo só aparece a partir da contagem 2 e usa `min-width` fixa para dois
 dígitos. A marca de metalizada é um ponto dourado no canto superior direito.

O controle de menos fica visualmente oculto por padrão, aparecendo em
`:hover`, `:focus-within` e quando o próprio controle recebe foco; em
dispositivos sem hover (`@media (hover: none)`) fica sempre visível. Essa
solução foi registrada como IDR 0030, conforme a decisão em aberto da tarefa.

O componente não aplica teto/piso por conta própria: chama os callbacks e
recebe a contagem já limitada. Os testes cobrem que, em 99, um toque não
muda a tela, e que em 0 o menos não muda nada.

## Decisões tomadas
- IDR 0030: comportamento do controle de menos em dispositivos com e sem
  toque (hover, foco e telas sensíveis).

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 10 arquivos de teste, 74 testes passando (incluídos os 10 do
  `Figurinha.test.jsx`).
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`: os três estados são distinguíveis em
escala de cinza, o selo transborda o canto inferior direito sem cortar, e a
marca dourada fica dentro do cartão.

## Arquivos alterados
- `src/components/Figurinha.jsx` — criado
- `src/components/Figurinha.css` — criado
- `src/components/Figurinha.test.jsx` — criado
- `docs/idr/0030-controle-de-menos-do-cartao.md` — criado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/0003-cartao-da-figurinha.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002-0003 atualizado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0003-log-cartao-da-figurinha.md` — este log
