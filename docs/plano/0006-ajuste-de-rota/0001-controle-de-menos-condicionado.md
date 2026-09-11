<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0006-0001]: controle de menos condicionado e no canto inferior esquerdo

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md` § Decisão e § Consequências — o controle só existe com contagem ≥ 1, fica dentro do cartão no canto inferior esquerdo e devolve o foco ao corpo do cartão ao desaparecer
- `docs/idr/0030-controle-de-menos-do-cartao.md` § Decisão — quando o controle é revelado (hover, foco, telas sem hover) continua valendo, agora só nos cartões que o têm
- `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` § Decisão — tocar no corpo do cartão soma; o menos é botão separado
- `docs/interface.md` § Figurinha, § Interações e § Medidas — a descrição e as medidas do controle (18px na lista, 16px no álbum, recuo de 3px e 2px)
- `docs/requisitos.md` § Contagem — o piso de 0 e o teto de 99 da contagem

## Objetivo
Corrigir o controle de menos do cartão: ele deixa de existir na figurinha
faltante e sai do canto superior esquerdo transbordante para dentro do cartão,
no canto inferior esquerdo. É correção de rota — o cartão foi entregue na
Tarefa 0002-0003 antes de o app ter as 994 figurinhas em tela.

## Padrões e convenções aplicáveis
- O controle **não é renderizado** com contagem 0: não é invisível nem
  desabilitado — `docs/idr/0032-*` § Decisão
- Dentro do retângulo do cartão, sem transbordar; o selo `×N` continua
  transbordando no canto inferior direito — `docs/idr/0032-*` § Decisão
- Oculto por padrão, revelado no `:hover` e no `:focus-within`, sempre visível
  em `@media (hover: none)` — `docs/idr/0030-*` § Decisão
- Botão próprio, focável, com nome acessível por extenso ("remover uma unidade
  de BRA 05") — `docs/idr/0030-*` § Decisão e `docs/requisitos.md` § Requisitos
  Não Funcionais
- Cor nunca é o único sinal de estado; o cartão faltante fica sem adorno algum
  — `docs/idr/0006-*` § Decisão

## Escopo e instruções de implementação
1. Em `Figurinha.jsx`, renderizar o botão de menos apenas quando `contagem >= 1`.
   O `onDecrementar` continua chegando por prop e o piso de 0 continua na função
   pura de `src/lib/colecao.js` — a guarda não sai de lá.
2. Em `Figurinha.css`, mover o controle para o canto inferior esquerdo **dentro**
   do cartão: `bottom`/`left` positivos com o recuo das medidas, sem
   transbordar. Aplicar o tamanho menor na variante álbum.
3. Conferir que o controle não encosta no código nem no selo `×N` em nenhuma das
   duas variantes, inclusive na figurinha 13 (paisagem).
4. Ao decrementar de 1 para 0 o botão desaparece; devolver o foco ao corpo do
   cartão, para que a navegação por teclado não caia na raiz do documento.
5. Ajustar os testes existentes de `Figurinha.test.jsx` que clicam no menos com
   contagem 0 — o caso "não decrementa abaixo de 0" deixa de ser um clique e
   passa a ser a ausência do botão.
6. Testes: o botão não existe com contagem 0; existe com 1 e com ≥ 2; decrementar
   de 1 chama o callback e, com o cartão já em 0, o botão some; o nome acessível
   continua por extenso.

**Fora do escopo**: o realce de foco visível e a área de toque ampliada
(Tarefa 0010-0001); qualquer mudança no incremento, no selo `×N` ou na marca de
metalizada; desfazer (Fase 9).

## Decisões já tomadas (não reabrir)
- Só existe com contagem ≥ 1, dentro do cartão, canto inferior esquerdo — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
- Quando o controle é revelado — ver `docs/idr/0030-controle-de-menos-do-cartao.md`
- Não há ação de zerar a contagem; o desfazer cobre o engano — ver
  `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md`

## Decisões em aberto nesta tarefa
- Nenhuma. Ambiguidade de medida que apareça no ajuste fino resolve-se por
  `docs/interface.md` § Medidas; divergência real vira IDR.

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
- `src/components/Figurinha.jsx` — modificar
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.test.jsx` — modificar

## Critérios de aceite
- [ ] Figurinha com contagem 0 não tem botão de menos no DOM
- [ ] Figurinha com contagem ≥ 1 tem o botão, no canto inferior esquerdo e
      dentro do retângulo do cartão
- [ ] O botão continua oculto até o hover ou o foco, e sempre visível em
      `@media (hover: none)`
- [ ] Decrementar de 1 para 0 remove o botão e o foco não se perde
- [ ] O nome acessível continua "remover uma unidade de SIG NN"
- [ ] `docs/interface.md` § Figurinha, § Interações e § Medidas descrevem o que
      o código faz
- [ ] `docs/plano/0006-ajuste-de-rota/logs/0001-log-controle-de-menos-condicionado.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: numa seção intocada, nenhum cartão mostra o
menos ao passar o mouse; depois de somar uma unidade, o controle aparece no
canto inferior esquerdo, dentro do cartão, sem encostar no selo `×N` do cartão
vizinho.
