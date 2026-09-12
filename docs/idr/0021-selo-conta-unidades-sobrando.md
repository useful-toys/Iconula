<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0021: O selo `×N` conta as unidades sobrando

## Status

Aceito — resolve a contradição entre o
[IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md) ("selinho
`×N` = repetidas (N−1 sobrando)", em que N seria a contagem) e
interface.md ("`×N` = unidades sobrando").

## Contexto

- O glifo `×` aparecia com três leituras diferentes na especificação:
  - **no cartão**, o selinho `×N` — o IDR 0006 dizia que N é a contagem
    (N−1 sobrando), interface.md dizia que N são as sobrando
  - **nos títulos** (placar, super-grupo, seção), `×37` conta **códigos
    distintos** com contagem ≥ 2 (requisitos.md)
  - **no texto do WhatsApp**, `5×2` são as **unidades sobrando** do
    número 5 (requisitos.md)
- O usuário decidiu a leitura do cartão: `×1` = uma figurinha colada no
  álbum e uma sobrando; `×2` = uma colada e duas sobrando; `×3` = uma
  colada e três sobrando.

## Decisão

- O selo do cartão mostra **as unidades sobrando**: `×N` com
  N = contagem − 1; aparece só a partir da contagem 2 (`×1`)
- O selo tem largura fixa para **dois dígitos** (`×99`) — a caixa não
  muda de tamanho ao passar de `×9` para `×10`
- O selo do cartão e o `×` do texto do WhatsApp passam a ter a mesma
  leitura: unidades sobrando
- Nos títulos (placar, super-grupo, seção), `×` continua contando
  **códigos distintos** com contagem ≥ 2 — leitura diferente, agregada,
  registrada explicitamente em requisitos.md e interface.md

## Consequências

- Cartão e lista de troca falam a mesma língua: o que o selo mostra é o
  que sobra para trocar
- O IDR 0006 fica corrigido nesse ponto (nota no seu Status)
- Restam duas leituras do `×` — unidade (cartão, WhatsApp) e código
  (títulos) —, agora declaradas em vez de implícitas
- A contagem em si não aparece na tela: quem tem 3 unidades vê `×2` e o
  cartão preenchido — a primeira unidade é a colada, presumida pelo
  próprio estado do cartão

## Alternativas consideradas

- **`×N` = contagem** (leitura do IDR 0006): mostra o número que o
  usuário registrou, mas obriga a subtrair de cabeça para saber o que
  pode trocar — e discorda do `5×2` do WhatsApp
- **Selo com a contagem e a sobra** (`3 (×2)`): explícito, ocupa espaço
  demais num cartão de 52px
- **Unificar também os títulos** (× nos títulos contando unidades):
  perderia "de quantas figurinhas distintas eu tenho repetida", que é o
  número útil na troca
