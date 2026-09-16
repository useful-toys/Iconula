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

- **Cabeçalho de seção**: `padding` de `4px 8px` (compactado de `10px 14px`
  na Fase 0012 e de `7px 12px` na Fase 0026); ícone 18px, nome 14px/600
  inalterados
- **Espaçamentos entre blocos**:
  - entre super-grupos: 16px → 12px
  - entre seções (dentro do super-grupo e soltas na ordenação por sigla):
    14px → 10px
  - entre o cabeçalho da seção e a grade: 10px → 8px → 4px (Fase 0026); do
    título do super-grupo ao corpo permanece 8px
- **Inalterados**: 8px entre cartões na lista e 20px entre páginas no álbum
- **Faixa de aviso**: respiro vertical de `12px` para `6px`, em cima e
  embaixo; margens laterais inalteradas (`--page-gutter`)
- **Margem inferior do corpo**: altura da **pior faixa de aviso única** — a
  falha com o detalhe técnico expandido, medida na largura de celular —
  mais 8px de folga
  - medição da implementação (Tarefa 0019-0003, respiro de 6px): `border-top
    2px` + `padding 6px + 6px` + mensagem `16px × 1,4` (1 linha) + detalhe
    `11px × 1,4 + 4px` (1 linha) = **55,78px**; `55,78 + 8 = 63,78` →
    **64px**
  - medição anterior (Tarefa 0012-0004, respiro de 12px): `border-top 2px`
    + `padding 12px + 12px` + mensagem `16px × 1,4` (1 linha) + detalhe
    `11px × 1,4 + 4px` (1 linha) = 67,78px → 76px
  - a pilha de até três avisos
    ([IDR 0034](0034-limite-de-empilhamento-dos-avisos.md)) não entra na
    conta: é transitória e o usuário pode rolar

## Consequências

- Economia repetida em cada cabeçalho de seção e em cada vão entre blocos
- Blocos distintos continuam distintos: nenhum espaçamento chega a zero
- A margem inferior passa a depender da altura real da faixa; se a faixa
  mudar, a medição é refeita
- A faixa de aviso tapa ~12px a menos do catálogo enquanto está visível; a
  mensagem, que é a área de toque do detalhe técnico, fica com ~30px de
  altura
- `interface.md` § Medidas (área de avisos e corpo) muda o `padding` da
  faixa e a margem inferior
- Implementação do respiro de 6px: Fase 0019, Tarefa 0019-0003.

## Alternativas consideradas

- **Compactação agressiva** (`6px 10px`; 10 / 8 / 6px): mais conteúdo por
  tela, mas blocos colados — pior com a borda colorida do cabeçalho de
  seção ([IDR 0046](0046-cores-de-selecoes.md))
- **Margem inferior fixa (44px)**: dispensa medição, mas o número não teria
  lastro na altura real da faixa
- **Margem para a pilha de três avisos**: reservaria o triplo do espaço
  para um estado raro e passageiro
- **Respiro de 8px na faixa de aviso**: redução menor do que a pedida
- **Respiro de 4px na faixa de aviso**: toque do detalhe técnico com ~26px
  e o `×` de dispensar quase encostado nas bordas

## Histórico

- 2026-09-16 — Correção da Fase 0026 (PR #64): o cabeçalho da seção ganhou o
  anel em degradê e perdeu a borda/fundo próprios; com o respiro interno da
  moldura, o `padding` do cabeçalho (`7px 12px`) e o vão título→grade (`8px`)
  ficaram generosos demais. Compactados para `4px 8px` e `4px`, puxando o
  título para a esquerda e para cima sem colar no anel (IDR 0018).

- 2026-09-14 — Medição da margem inferior (Tarefa 0019-0003): faixa de falha
  expandida a 375px, com o respiro de 6px, = 55,78px; `+ 8px` → 64px, no
  lugar da estimativa.
- 2026-09-13 — Esmiuçamento de ajustes de interface: faixa de aviso com
  respiro vertical de 6px (antes 12px) e margem inferior estimada em 64px
  (antes 76px), a confirmar por medição; implementação a planejar.

- 2026-09-13 — Medição da margem inferior (Tarefa 0012-0004): faixa de falha
  expandida a 375px = 67,78px; `+ 8px` → 76px.
- 2026-09-13 — Criado no planejamento revisado das Fases 11–17.
