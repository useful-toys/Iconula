<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0005]: clique perto da borda do cartão soma

## Status
Concluída

## Objetivo
Fazer o clique perto da borda do cartão somar uma unidade. Hoje o corpo do
cartão encolhe no `:active` (`scale(0.92)`): o botão diminui no instante do
pressionar, o soltar cai fora dele e o navegador não gera o `click`.

## Documentos de referência
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão ("Retorno de
  toque no cartão") — o efeito visual a manter
- `docs/idr/0051-pressao-longa-decrementa-no-toque.md` § Decisão — gesto e
  supressão do clique depois da pressão longa
- `src/components/Figurinha.css` — `.figurinha__corpo:active` e o
  escurecimento `.figurinha--pressionando`
- `src/components/Figurinha.jsx` — `aoClique` e os manipuladores de ponteiro
- `src/components/Figurinha.test.jsx` — padrão dos testes do cartão

## Padrões e convenções aplicáveis
- O retorno visual continua: o cartão encolhe e volta, 60ms — IDR 0042
- Pressão longa em toque e a supressão do clique ao soltar seguem iguais —
  IDR 0051
- Cartão memoizado com comparador próprio — TDR 0021

## Escopo e instruções de implementação
1. O encolhimento do toque deixa de reduzir a caixa que recebe o ponteiro: o
   corpo do cartão mantém o tamanho durante o pressionar, e a escala passa a
   um elemento visual dentro dele (ou equivalente), com o mesmo efeito
   percebido.
2. Pressão longa, escurecimento na espera e supressão do clique depois da
   pressão longa sem mudança.
3. Testes: o clique continua somando e a pressão longa continua
   decrementando sem somar; se a estrutura do cartão mudar, os testes de
   rótulo e de estado seguem verdes.
4. Registrar no `## Contexto` do IDR 0042 a descoberta: escala no `:active`
   do próprio botão faz o `click` se perder perto da borda; e a entrada no
   `## Histórico`.

**Fora do escopo**: posição e visibilidade do menos (Tarefa 0019-0004); selo
`×N` (Tarefa 0019-0006); medidas e cores do cartão.

## Decisões já tomadas (não reabrir)
- Retorno de toque que encolhe e volta — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`
- Pressão longa em toque — ver
  `docs/idr/0051-pressao-longa-decrementa-no-toque.md`
- Cartão memoizado — ver `docs/tdr/0021-desempenho-do-catalogo.md`

## Impedimentos específicos
- Se a correção só for possível mudando o efeito visível do toque (sem
  encolher, ou encolhendo outra coisa que o usuário perceba diferente), é
  nível 3: contraria o IDR 0042.

## Arquivos impactados
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.jsx`, `src/components/Figurinha.test.jsx` —
  modificar, se a estrutura mudar
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — modificar (§ Contexto,
  § Histórico)

## Critérios de aceite
- [ ] Nenhuma transformação de escala no próprio elemento que recebe o
      clique (busca e trecho)
- [ ] O cartão continua encolhendo e voltando ao toque (verificação visual)
- [ ] Clique soma e pressão longa decrementa sem somar (testes)
- [ ] IDR 0042 com a descoberta no contexto e entrada no histórico

## Validação adicional
Verificação visual em `npm run dev`, lista e álbum: clicar a 1–3px de cada
borda do cartão e conferir que soma; clicar no centro e conferir o
encolhimento; em emulação de toque, segurar 500ms e conferir o decremento.
