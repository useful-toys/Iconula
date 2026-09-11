<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0016: Carga no login — proteção de corrida e formato do carimbo

## Status

Aceito — desbloqueia a Tarefa 0007-0002, que deixava duas decisões em aberto.

## Contexto

A Tarefa 0007-0002 traz a coleção do Firestore no login (uma leitura de
`users/{uid}`). Duas ambiguidades de implementação ficaram em aberto na tarefa:

1. **Corrida entre a leitura em voo e ajustes já feitos.** O `onAuthStateChanged`
   entrega o `uid` e a leitura começa; se o usuário tocar numa figurinha
   enquanto o `getDoc` está em voo, a resposta do servidor pode chegar depois do
   ajuste e sobrescrevê-lo com um valor mais antigo.
2. **Formato exato do carimbo no relógio quando não é de hoje.** O
   [IDR 0027](../idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md)
   decide que o carimbo não-de-hoje mostra a data junto com a hora, mas não
   fixa a forma.

## Decisão

### Corrida da leitura

- Um **contador de ajustes** (`useRef`) no `App.jsx` incrementa a cada ajuste de
  contagem, fora do updater do `setContagens` — pelo mesmo motivo do
  [ADR 0007](../adr/0007-persistencia-do-time-no-firestore.md): o StrictMode
  invoca updaters duas vezes em desenvolvimento, e o contador precisa avançar
  uma única vez por gesto do usuário.
- A carga captura o valor do contador **no início da leitura** e, quando a
  promessa resolve, **descarta a resposta do servidor se o contador mudou** — o
  ajuste local vence. É o mesmo desenho do contador do ADR 0007, adaptado do
  time do botão para o mapa de contagens.
- O descarte vale para o resultado de sucesso (que sobrescreveria o estado) e
  não se aplica à falha, que não escreve nada e continua emitindo o aviso.
- Contador, e não um booleano "já interagiu": um ajuste dado **antes** do login
  não pode impedir a carga para sempre (mesma razão do ADR 0007).

### Formato do carimbo

- Mesmo dia: **`HH:mm`** (hora sozinha, zero à esquerda, 24h).
- Outro dia: **`dd/mm/aa HH:mm`** — forma curta em PT-BR, ano com dois dígitos,
  **sem segundos**. Um único formato para qualquer dia anterior, sem ramificar
  por ano: compacto o bastante para o título de uma linha e sem ambiguidade de
  ano.

## Consequências

- A função pura `formatarCarimbo(data, agora)` vive em
  `src/lib/colecaoRemota.js` e aceita o instante de referência como parâmetro,
  para testar "mesmo dia" sem depender do relógio do ambiente.
- A carga bem-sucedida **não** move o relógio para "agora": ela formata o
  `updatedAt` que estiver gravado (IDR 0027) — o teste do `formatarCarimbo`
  trava essa propriedade.
- A gravação (Tarefa 0007-0003) reusa o `formatarCarimbo` ao mover o relógio.

## Alternativas consideradas

- **Booleano "já interagiu"** em vez de contador: rejeitado — um ajuste antes do
  login descartaria a carga para sempre (ADR 0007 já documenta o porquê).
- **`Intl.DateTimeFormat` para a data**: mais correto por locale, mas depende do
  fuso e do locale do ambiente no teste; a formatação manual é determinística.
- **Data com ano em quatro dígitos (`dd/mm/aaaa`)**: mais explícita, porém mais
  larga — o título já carrega seis números antes do relógio; dois dígitos bastam.
