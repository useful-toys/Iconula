<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0004]: histórico, prazo e identificação nos textos

## Status
Concluída

## Objetivo

Fechar o conteúdo dos dois textos com o que falta depois da Fase 0031:
histórico de versões, prazo de resposta e como o titular é identificado
quando escreve.

## Documentos de referência

- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  § Decisão — prazo de 15 dias, identificação pelo e-mail da conta,
  vigência e histórico.
- `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md` — o reaceite, que
  o texto de alterações menciona.
- `docs/interface.md` §§ Política de privacidade, Termos de uso.

## Padrões e convenções aplicáveis

- Texto em PT-BR direto; o contato usa o componente da Tarefa 0031-0004.
- A data de vigência já existe nos dois textos desde a Tarefa 0031-0005 —
  esta tarefa acrescenta o histórico, não a data.

## Escopo e instruções de implementação

1. Acrescentar aos dois textos uma seção de alterações, com o histórico
   de versões (data e uma linha do que mudou) e a nota de que mudança
   material pede novo aceite na entrada.
2. Na política, declarar o prazo de resposta aos pedidos de titular
   (15 dias, art. 19, §1º, II).
3. Na política, declarar que pedidos são atendidos quando partem do
   mesmo e-mail da conta usada no app, e que de outro endereço essa
   confirmação é pedida antes de qualquer resposta.
4. Atualizar os testes das duas vistas e `docs/interface.md` §§ Política
   de privacidade e Termos de uso.

**Fora do escopo**: o passo a passo interno do atendimento, que vive em
`docs/privacidade.md` (Tarefa 0032-0005).

## Decisões já tomadas (não reabrir)

- Prazo, critério de identificação e formato do histórico — ver
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.

## Arquivos impactados

- `src/components/PoliticaDePrivacidade.jsx` — modificar
- `src/components/PoliticaDePrivacidade.test.jsx` — modificar
- `src/components/TermosDeUso.jsx` — modificar
- `src/components/TermosDeUso.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Política de privacidade, § Termos de
  uso)

## Critérios de aceite

- [ ] Os dois textos têm seção de alterações com histórico de versões
- [ ] A política declara o prazo de 15 dias citando o art. 19, §1º, II
- [ ] A política declara a identificação pelo e-mail da conta
- [ ] O histórico menciona que mudança material pede novo aceite
- [ ] `npm run lint && npm run test && npm run build` verdes
