<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0050: Compactação vertical do catálogo

## Status

Aceito — implementação na Fase 0012 (Tarefas 0012-0002 a 0012-0004).

## Contexto

- Mapeando para onde vai a altura da tela: cada seção e super-grupo carrega
  respiro fixo que se repete até 50 vezes, e o corpo reserva 60px embaixo
  para a faixa de avisos mesmo sem aviso.
- As medidas vêm do protótipo
  ([IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md)); este registro
  as ajusta pelo uso real, sem mexer em tipografia, ícones nem no
  espaçamento dentro do conteúdo.

## Decisão

- **Cabeçalho de seção**: `padding` de `10px 14px` para `7px 12px`; ícone
  18px, nome 14px/600, borda e raio 12px inalterados
- **Espaçamentos entre blocos**:
  - entre super-grupos: 16px → 12px
  - entre seções (dentro do super-grupo e soltas na ordenação por sigla):
    14px → 10px
  - entre o cabeçalho da seção e a grade (e do título do super-grupo ao
    corpo): 10px → 8px
- **Inalterados**: 8px entre cartões na lista e 20px entre páginas no álbum
- **Margem inferior do corpo**: altura da **pior faixa de aviso única** — a
  falha com o detalhe técnico expandido, medida na largura de celular —
  mais 8px de folga
  - medição da Tarefa 0012-0004, a 375px, com a mensagem real de falha de
    gravação: `border-top 2px` + `padding 12px + 12px` + mensagem
    `16px × 1,4` (1 linha) + detalhe `11px × 1,4 + 4px` (1 linha) =
    **67,78px**; `67,78 + 8 = 75,78` → adotado **76px**
  - a pilha de até três avisos
    ([IDR 0034](0034-limite-de-empilhamento-dos-avisos.md)) não entra na
    conta: é transitória e o usuário pode rolar

## Consequências

- Economia repetida em cada cabeçalho de seção e em cada vão entre blocos
- Blocos distintos continuam distintos: nenhum espaçamento chega a zero
- A margem inferior passa a depender da altura real da faixa; se a faixa
  mudar, a medição é refeita

## Alternativas consideradas

- **Compactação agressiva** (`6px 10px`; 10 / 8 / 6px): mais conteúdo por
  tela, mas blocos colados — pior com a borda colorida do cabeçalho de
  seção ([IDR 0046](0046-cores-de-selecoes.md))
- **Margem inferior fixa (44px)**: dispensa medição, mas o número não teria
  lastro na altura real da faixa
- **Margem para a pilha de três avisos**: reservaria o triplo do espaço
  para um estado raro e passageiro

## Histórico

- 2026-09-13 — Medição da margem inferior (Tarefa 0012-0004): faixa de falha
  expandida a 375px = 67,78px; `+ 8px` → 76px.
- 2026-09-13 — Criado no planejamento revisado das Fases 11–17.
