<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0014: Estado da coleção sem Context por enquanto

## Status

Aceito — desbloqueia a Tarefa 0002-0004 e responde ao ponto em aberto de
`docs/arquitetura.md` § Pontos em aberto.

**Revisitado na Tarefa 0007-0003** (gravação agregada), como esta decisão já
previa: mantido. A gravação agregada (`gravacaoAgregada.js`) é criada e usada
inteiramente dentro de `App.jsx` — nenhum componente novo passou a consumir
ou modificar a coleção, e a profundidade de prop-drilling não mudou (`App →
Catalogo → Secao → Figurinha`, três níveis). Não há motivo para Context
ainda.

## Contexto

A coleção de contagens precisa ser acessível pelo cabeçalho (placar geral),
pelo corpo (seções e cartões) e, em breve, pelo menu de ações (export/import,
listas de troca) e pela persistência. A convenção do `AGENTS.md` e o ponto em
aberto de `arquitetura.md` perguntam: prop-drilling ou Context?

Nesta fase a árvore é rasa: `App.jsx` detém o estado e passa para
`Cabecalho` e `Catalogo`; `Catalogo` passa para `Secao`; `Secao` passa para
`Figurinha`. São três níveis de passagem (`App → Catalogo → Secao → Figurinha`).

## Decisão

- Manter a coleção no estado local de `App.jsx` e usar **prop-drilling**
  enquanto a profundidade for de até três níveis.
- Reavaliar na Tarefa 0007-0003 (gravação agregada com flush), quando a
  persistência e o histórico de desfazer podem exigir que mais componentes
  acessem ou modifiquem a coleção sem que a prop atravesse novos ramos.
- Se a profundidade ultrapassar três níveis ou se o mesmo estado precisar
  descer por mais de um ramo da árvore, aí sim introduzir Context (ou outra
  forma de estado compartilhado) com registro próprio.

## Consequências

- A árvore permanece explícita: quem consome a coleção recebe por prop.
- Evita abrir mão da convenção do `AGENTS.md` antes de necessário.
- O `App.jsx` concentra a função de ajuste, o que facilita a futura
  integração com persistência e desfazer.

## Alternativas consideradas

- **Context para a coleção já nesta tarefa**: anteciparia a solução, mas
  criaria abstração antes de a árvore exigir — contra a convenção vigente.
- **State manager externo (Zustand, Redux, etc.)**: desproporcional para
  uma SPA com uma única tela e um único domínio de estado.
