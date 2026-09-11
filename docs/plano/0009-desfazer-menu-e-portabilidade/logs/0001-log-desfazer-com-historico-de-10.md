<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0009-0001: desfazer com histórico das últimas 10

## Data
2026-09-11

## Resumo
Implementado o comando desfazer especificado no IDR 0010/IDR 0012 e em
`docs/requisitos.md` § Contagem: um botão `↺` no cabeçalho reverte a última
alteração de contagem e, repetido, as dez últimas, em ordem inversa.

- `src/lib/historico.js` (novo): funções puras sobre um array imutável, no
  mesmo estilo de `colecao.js` — `registrarAjuste(historico, codigo,
  contagemAnterior)` empilha uma entrada (código + contagem *antes* do
  ajuste, não o delta) e descarta a mais antiga ao passar de 10;
  `retirarUltimoAjuste(historico)` retira e devolve o topo, ou `entrada:
  null` sem erro quando vazio.
- `src/App.jsx`: novo estado `historico` (`useState([])`, ao lado de
  `contagens`). `handleAjustar` passou a registrar a entrada no histórico
  antes de aplicar o ajuste; a aplicação em si foi extraída para
  `aplicarAjuste(codigo, delta)`, reaproveitada por `handleDesfazer` — o
  mesmo caminho que atualiza `contagens` e chama
  `gravacaoAgregada.registrarAjuste`, sem caso especial para a reversão
  (IDR 0003). `handleDesfazer` retira o topo do histórico, calcula o delta
  que restaura a `contagemAnterior` gravada e chama `aplicarAjuste` com
  ele — a reversão em si nunca é empilhada de volta. Histórico vazio: a
  função não faz nada (o botão já está desabilitado). `Controles` recebe
  `podeDesfazer={historico.length > 0}` e `onDesfazer={handleDesfazer}`.
- `src/components/Controles.jsx`: a `div.controles__direita`, reservada
  desde a Fase 2/3, ganhou o botão `↺` (30×30px, raio 8px, borda e texto
  `--gold` — `docs/interface.md` § Medidas), com `aria-label="desfazer a
  última alteração"` e `disabled` quando `podeDesfazer` é falso. Sem
  `onDesfazer` (nenhum caso de uso hoje), a área volta a ficar vazia e
  `aria-hidden`, como antes desta tarefa.

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface nova: o desenho já
estava fechado pelo IDR 0010 e pelo IDR 0012, e a tarefa só os implementa.

A única pendência da própria tarefa ("Decisões em aberto") já vinha com
encaminhamento definido — não implementar atalho de teclado para o
desfazer, porque nenhum registro pede e um atalho global colidiria com o
do navegador. Mantido como está; registrado aqui, sem TDR/IDR, como o
próprio arquivo da tarefa já previa.

## Impedimentos
Nenhum. Nenhuma ambiguidade de nível 2 ou 3 apareceu durante a
implementação.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 30 arquivos de teste, 265 testes, todos passando — inclui
  `src/lib/historico.test.js` (8 casos: empilhar, não mutar, limite de 10,
  retirar em ordem inversa, histórico vazio) e o novo
  `src/App.desfazer.test.jsx` (8 casos de integração: botão desabilitado
  sem histórico, habilita com um ajuste, desfaz e desabilita de novo, dez
  ajustes + dez desfazer voltam ao estado inicial, o décimo primeiro
  desfazer não altera nada, ordem inversa entre códigos diferentes, a
  reversão vai na gravação agregada sem escrita própria, e recarregar
  a página — remontar o `App` — limpa o histórico). `Controles.test.jsx`
  ganhou 4 casos novos para o botão (ausente sem `onDesfazer`, desabilitado
  e habilitado conforme `podeDesfazer`, `onClick` chamado).
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

**Verificação visual em `npm run dev`** (pedida na tarefa: lançar sete
números, desfazer sete vezes, conferir o placar e a aba Network): não
concluída nesta sessão — a guarda de login (Tarefa 0008-0001) exige um
login real via popup do Google, que não pode ser automatizado nem
realizado em nome do usuário nesta sessão de execução. A cobertura
funcional equivalente (sete "ajustes", sete "desfazer", e a asserção de
que a gravação agregada dispara uma única escrita já com a reversão
aplicada, sem escrita própria do desfazer) está em
`App.desfazer.test.jsx`. Fica pendente para o usuário repetir a checagem
manual, mencionada aqui como não realizada.

## Arquivos alterados
- `src/lib/historico.js` — criado
- `src/lib/historico.test.js` — criado
- `src/components/Controles.jsx` — botão de desfazer na área reservada
- `src/components/Controles.css` — `.controles__desfazer`
- `src/components/Controles.test.jsx` — 4 casos novos para o botão (consequência direta do Escopo, não listado nos arquivos impactados)
- `src/App.jsx` — estado `historico`, `aplicarAjuste`, `handleDesfazer`, fiação com `Controles`
- `src/App.desfazer.test.jsx` — criado (consequência direta do item 7 do Escopo, não listado nos arquivos impactados)
- `docs/plano/0009-desfazer-menu-e-portabilidade/0001-desfazer-com-historico-de-10.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0009-0001 atualizado
- `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0001-log-desfazer-com-historico-de-10.md` — este log
