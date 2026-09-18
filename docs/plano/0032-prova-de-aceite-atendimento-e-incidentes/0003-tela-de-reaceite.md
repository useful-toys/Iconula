<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0003]: tela de reaceite

## Status
Concluída

## Objetivo

Fazer a tela de atestação reaparecer, com texto próprio, quando a versão
aceita pela conta difere da publicada — um clique, uma vez por mudança
material.

## Documentos de referência

- `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md` § Decisão — os
  dois motivos e o que cada um mostra.
- `docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md` — o
  tratamento de falha de gravação, que vale igual aqui.
- `docs/modelo-memoria.md` § Estado do App.jsx — a tabela de campos que
  ganha a condição nova.
- `docs/interface.md` § Tela de login — onde a atestação está
  especificada.

## Padrões e convenções aplicáveis

- Texto visível em PT-BR; um clique, sem formulário.
- O passo fica entre a guarda de login e o catálogo, como hoje.
- Conta antiga sem os campos não pode ficar presa num laço de reaceite.

## Escopo e instruções de implementação

1. Em `src/components/Atestacao.jsx`, aceitar um motivo que escolha
   entre o texto de primeiro acesso (com a atestação de idade) e o de
   atualização (com links para os dois textos e o botão de concordar,
   sem repetir a idade).
2. Em `src/App.jsx`, derivar a condição de reaceite comparando as
   versões carregadas com as publicadas, e renderizar a atestação com o
   motivo certo; gravar o aceite com a função da Tarefa 0032-0002.
   Documento sem versão nenhuma passa pelo reaceite uma única vez.
3. Tratar a falha de gravação como o IDR 0036 já manda: libera o
   catálogo, avisa, e a carga seguinte repete o passo.
4. Cobrir em `src/App.atestacao.test.jsx`: versão divergente reabre;
   versão igual não reabre; documento sem versão reabre uma vez e, depois
   de gravado, não reabre; falha ao gravar não tranca o app.
5. Cobrir em `src/components/Atestacao.test.jsx` os dois motivos.
6. Atualizar `docs/interface.md` § Tela de login com os dois motivos da
   atestação, e `docs/modelo-memoria.md` § Estado do App.jsx com a
   condição de reaceite e as versões carregadas.

**Fora do escopo**: o conteúdo do histórico de versões nos textos
(Tarefa 0032-0004); mudar a regra de quando uma versão sobe.

## Decisões já tomadas (não reabrir)

- Reusar a tela de atestação em vez de criar uma nova, e não repetir a
  atestação de idade — ver
  `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md`.
- A degradação em caso de falha — ver
  `docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md`.

## Arquivos impactados

- `src/components/Atestacao.jsx` — modificar
- `src/components/Atestacao.test.jsx` — modificar
- `src/App.jsx` — modificar
- `src/App.atestacao.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Tela de login)
- `docs/modelo-memoria.md` — modificar (§ Estado do App.jsx)

## Critérios de aceite

- [ ] Versão divergente reabre a tela; versão igual não reabre
- [ ] O texto de atualização não repete a atestação de idade e traz
      links para os dois textos
- [ ] Conta sem campo de versão vê o passo uma vez só
- [ ] Falha ao gravar o aceite não impede o uso do catálogo
- [ ] `docs/modelo-memoria.md` descreve a condição nova
- [ ] `npm run lint && npm run test && npm run build` verdes

## Validação adicional

- Roteiro manual com emuladores: subir a versão publicada de um dos
  textos, recarregar e confirmar que o passo aparece uma vez só.
