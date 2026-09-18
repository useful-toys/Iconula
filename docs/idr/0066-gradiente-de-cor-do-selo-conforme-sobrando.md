<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0066: Gradiente de cor do selo `×N` conforme as unidades sobrando

## Status

Aceito.

## Contexto

- O selo `×N` do cartão mostra as unidades sobrando (contagem − 1),
  aparecendo a partir da contagem 2 (IDR 0021), sempre na cor fixa
  `--orange-card` (`Figurinha.css`, `.figurinha__selo`).
- O humano pediu que a cor do selo fique gradualmente mais intensa, de
  laranja a vermelho, conforme o número sobrando cresce até 10, saturando
  no vermelho máximo a partir de 10.
- O nome acessível do cartão (`estadoLabel`/`nomeAcessivel`, `Figurinha.jsx`)
  já lê a contagem e o estado por extenso, independente do selo (que é
  `aria-hidden`) — a cor é reforço visual, não o único sinal
  (`requisitos.md` § Requisitos Não Funcionais).
- O IDR 0054 já registra, como referência sem token próprio, o laranja
  (`#D86000`) e o vermelho (`#D80000`) da capa oficial do álbum FIFA
  2026 — cores candidatas para revisões de paleta.

## Decisão

- O selo `×N` passa a variar de cor conforme o valor sobrando (`N`):
  - `N = 1` (primeiro selo visível, contagem 2): laranja `#D86000`.
  - `N ≥ 10`: vermelho `#D80000` (intensidade máxima).
  - `N` entre 2 e 9: interpolação suave entre as duas cores.
- Fundo (`--bg-deep`) e borda/texto seguem o mesmo tom interpolado (a
  borda e o texto do selo usam a cor do gradiente, como hoje usam
  `--orange-card` fixo).
- Só o selo do cartão muda; os `×` agregados dos títulos (placar,
  super-grupo, seção) continuam na cor de texto atual, sem gradiente —
  contam códigos distintos, não o valor de um cartão (IDR 0021).

## Consequências

- `interface.md` § Medidas (selo `×N`) passa a descrever a cor variável
  em vez de `--orange-card` fixo, citando as duas cores de referência.
- `Figurinha.css`: a regra `.figurinha__selo` deixa de usar
  `--orange-card` sozinho; a tarefa decide o mecanismo (`color-mix()`,
  variável CSS calculada por `style` inline a partir de `sobrando`, ou
  faixa de classes) — nível 1, não é decisão desta esmiuçamento.
- `--orange-card` permanece como está, usado em outros lugares (estado
  "repetida" do cartão) — o gradiente é exclusivo do selo.
- Implementação: Fase 0034, Tarefa 0034-0004.

## Alternativas consideradas

- **Gradiente também nos `×` agregados dos títulos**: recusada — são uma
  leitura diferente (códigos distintos, não unidades de um cartão) e não
  fazem sentido saturar em 10 quando o total pode passar de 900.
- **Reforçar o nome acessível a partir de `N ≥ 10`** (ex.: "muitas
  sobrando"): recusada pelo humano — o nome acessível já lê o número por
  extenso, a cor é só reforço visual redundante.
- **Tons livres, sem referência ao IDR 0054**: recusada — usar o laranja
  e o vermelho já registrados como referência da capa oficial evita
  inventar uma terceira paleta de laranja/vermelho no produto.
