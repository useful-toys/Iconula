<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0042: Foco visível, retorno de toque e área de toque ampliada

## Status

Aceito — fecha as duas pendências de `interface.md` § Pendências de
interface que atravessaram todas as fases: "estados de foco, hover e
pressionado" e "alvos pequenos ganham área de toque ampliada em tela
sensível" (Tarefa 0010-0001).

## Contexto

O protótipo e as fases anteriores implementaram os alvos clicáveis sem
nenhum realce de foco visível consistente — a maioria dos botões (cartão,
segmentados, desfazer, cabeçalhos de seção e de super-grupo, rodapé) não
tinha `outline` algum; só a faixa de bandeiras e o menu de ações, entregues
depois, já traziam `:focus-visible` em `--gold`. Sem realce, navegar só de
teclado (`requisitos.md` § Requisitos Não Funcionais) é inviável: não dá
para saber onde o foco está.

O toque no cartão (`figurinha__corpo`) só se manifestava pela mudança de
cor do estado (faltante → colada) — sem retorno perceptível no instante do
toque, antes mesmo de o dedo soltar.

Os alvos de 30×30px (desfazer, menu de ações, ícones da faixa de
bandeiras) e o controle de menos do cartão (18px na lista, 16px no álbum,
IDR 0032) são pequenos para toque em tela sensível, mas `interface.md`
fixa as medidas visuais desses elementos e a Tarefa 0010-0001 proíbe
mudá-las — a área de toque precisa crescer sem o desenho crescer junto.

## Decisão

**Foco visível.** Uma única regra global, em `src/theme.css`:

```css
:focus { outline: none; }
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}
```

`:focus-visible` restringe o contorno a foco alcançado por teclado (ou
revelado pela heurística da plataforma) — clique de mouse ou toque não o
dispara, preservando o minimalismo visual do IDR 0018 sem abrir mão da
navegação por teclado. O contorno mede ≥ 8:1 de contraste contra `--turf`
e `--panel` (medido nesta tarefa — ver o log), bem acima do 3:1 do WCAG
1.4.11 para indicadores não textuais. As duas regras específicas já
existentes (ícones da faixa de bandeiras e itens do menu de ações, este
com contorno para dentro por ficar colado à borda do popup) continuam
valendo — mais específicas, seguem vencendo a regra global sem contradizê-la
(mesma cor, mesma espessura).

**Retorno de toque no cartão.** `.figurinha__corpo:active` aplica
`transform: scale(0.92)` com transição de 60ms — encolhe e volta,
percebido no instante do toque, independente da cor do estado.

**Área de toque ampliada, só em tela sensível.** `@media (pointer: coarse)`
acrescenta um `::before` invisível (`position: absolute`, sem conteúdo
visual) que estende a zona clicável ao redor do botão visível, que não
muda de tamanho nem de posição:

| Alvo | Visual | Vizinho mais próximo | Expansão (`inset`) | Alvo de toque final |
|---|---|---|---|---|
| Desfazer / menu de ações | 30×30px | um ao outro, gap 8px | −4px | 38×38px, sem se sobrepor |
| Ícone da faixa de bandeiras | 30×30px | a bandeira vizinha, gap 4px | −2px | 34×34px, sem se sobrepor |
| Menos, na lista | 18×18px | o próprio cartão (52×66px) | −4px | 26×26px, contido no cartão |
| Menos, no álbum | 16×16px | o próprio cartão (52×52px) | −3px | 22×22px, contido no cartão |

A expansão de cada alvo isolado (desfazer, menu, faixa) para exatamente na
metade do espaçamento que o separa do vizinho — nenhum dos dois lados chega
a tocar a área do outro. O controle de menos é o caso à parte: seu único
"vizinho" é o próprio corpo do cartão, que já responde ao toque (somar) —
não há como ampliar sem aumentar um pouco a faixa em que um toque perto do
canto decrementa em vez de incrementar. A expansão escolhida (4px/3px) fica
bem dentro do cartão (a folga entre o menos e a borda do cartão é de
3px/2px, então a zona ampliada extrapola só 1px o cartão, absorvido pelo
espaçamento entre cartões — 8px na lista, 6px de linha no álbum).

**Consertado no varrimento de teclado.** O menu de ações (`MenuDeAcoes.jsx`)
só fechava com `Esc` ou clique fora (`mousedown` fora do container) — tabular
para fora do último item deixava o popup visualmente aberto com o foco já em
outro lugar da tela. Acrescentado `onBlur` no container que fecha o popup
quando o foco vai para fora dele (`relatedTarget` não contido), simétrico ao
fechamento por clique fora: fecha sem roubar o foco de volta. Ver também
Contexto do IDR 0024.

## Consequências

- Todo elemento focável do app ganha o mesmo realce, sem exceção, com uma
  única regra — não uma lista de seletores por componente
- O contraste do contorno já foi medido acima do mínimo, então não há
  ajuste de paleta pendente para esta decisão
- A área de toque cresce sem o desenho mudar; em desktop (mouse fino, sem
  `pointer: coarse`) nada muda
- O controle de menos aceita uma pequena zona de ambiguidade perto do canto
  do cartão em troca de um alvo quase 40% maior — trade-off aceito e
  registrado aqui, não uma correção "perfeita"
- O menu de ações fecha corretamente ao ser abandonado por teclado, igual
  já fechava por mouse

## Alternativas consideradas

- **`:focus` em vez de `:focus-visible`**: mais simples e com suporte
  igualmente bom nos navegadores evergreen exigidos, mas acende o contorno
  também em clique de mouse — ruído visual que o IDR 0018 não pede
- **Aumentar o tamanho real dos alvos pequenos**: resolveria o toque sem
  pseudo-elemento, mas contraria a instrução explícita da tarefa de manter
  o desenho e as medidas de `interface.md`
- **`padding` em vez de `::before`**: padding jorra layout (empurra o
  conteúdo do botão) — o pseudo-elemento absoluto expande só a zona de
  hit-test, sem mexer no fluxo
- **Ampliar o menos por igual dos dois lados do cartão**: o lado que
  encosta no corpo do cartão não tem como não crescer sobre ele; tentar
  ampliar só "para fora" do cartão inverteria o problema, invadindo o
  espaçamento entre cartões vizinhos em vez do próprio cartão
