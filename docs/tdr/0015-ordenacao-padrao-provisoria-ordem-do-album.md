<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0015: Ordenação padrão provisória — ordem do álbum

## Status

**Substituído pelo
[IDR 0043](../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)**:
a ordenação (e a disposição) da primeira abertura passa a depender da
faixa de tela, em vez de um valor único fixo. Mantido na íntegra por
registrar por que a Fase 3 precisava de um valor provisório antes dessa
decisão existir.

## Contexto

A Tarefa 0003-0001 introduz o alternador de ordenação (Página | Sigla) e
precisa de um valor inicial antes de existir preferência guardada no
`localStorage` (persistência na Tarefa 0004-0005). O `docs/interface.md` §
Pendências de interface lista explicitamente "qual ordenação e disposição são
pré-selecionadas na primeira abertura em cada faixa de tela" como pendência
da Fase 10.

Sem uma decisão provisória, o componente `App.jsx` não teria valor inicial
para o `useState` da ordenação, e a tarefa ficaria bloqueada por uma questão
que não é dela.

## Decisão

Usar a **ordem do álbum** (`'pagina'`) como valor padrão da ordenação até a
Fase 10 decidir por faixa de tela. A preferência persistida no `localStorage`
(Tarefa 0004-0005) vence o padrão a partir da segunda abertura, como em
qualquer preferência guardada.

## Consequências

- O app abre na ordenação que espelha o álbum físico — coerente com o
  primeiro contato do colecionador com o produto
- A decisão é reversível: a Fase 10 pode trocar o padrão por faixa de tela
  sem reabrir este TDR
- Nenhum custo adicional: o valor é um literal no `useState`
- A Tarefa 0010-0003 decide o par (ordenação, disposição) por faixa, não
  apenas a ordenação

## Alternativas consideradas

- **Sigla como padrão**: favorece a busca por código, mas o colecionador que
  abre o app pela primeira vez tende a conferir contra o álbum físico
- **Perguntar ao usuário na primeira abertura**: onboarding que o IDR 0018
  rejeita ("sem onboarding, sem reforço redundante")
- **Deixar a tarefa bloqueada até a Fase 10**: atrasa a Fase 3 por uma
  decisão que não é dela
