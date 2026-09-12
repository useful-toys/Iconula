<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0013-0001]: pressão longa decrementa no mobile

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `src/components/Figurinha.jsx` — o corpo do cartão (`figurinha__corpo`) já é
  um `<button>` cujo `onClick` incrementa; o botão de menos
  (`figurinha__menos`) é sobreposto, já visível sem hover em toque
  (`@media (hover: none)`, `src/components/Figurinha.css:178`)
- `src/lib/historico.js` — `registrarAjuste` empilha **uma entrada por
  chamada** de `onAjustar`; a implementação precisa gerar exatamente uma
  chamada por pressão longa reconhecida, nunca mais de uma (IDR 0012)
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — retorno de toque
  existente (`figurinha__corpo:active { transform: scale(0.92) }`) e a área
  de toque ampliada do controle de menos; a pressão longa precisa de seu
  próprio retorno visual, distinto desse
- `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` — decisão
  original de "tocar soma, ícone de menos remove"; esta tarefa acrescenta um
  segundo caminho para remover, sem mudar o primeiro
- Conversa que originou esta tarefa: avaliação de duplo clique no desktop
  (descartado — ambiguidade nativa entre clique simples e duplo clique força
  escolher entre atrasar todo clique simples ou poluir o histórico de
  desfazer com múltiplas entradas por acionamento) e de pressão longa no
  mobile (sem esse problema — pressão longa e toque curto são gestos já
  distintos por tempo, sem depender do mesmo evento nativo)

## Objetivo
Pressionar e segurar o cartão (em qualquer ponto, não só no botão de menos)
decrementa a contagem em uma unidade — atalho por toque para quem já usa o
botão de menos, sem precisar mirar no alvo pequeno do canto.

## Padrões e convenções aplicáveis
- **Só em toque** (`pointerType === 'touch'`), nunca em mouse — em desktop
  não há atalho de clique para decrementar (decisão desta conversa: duplo
  clique, clique direito e botão do meio foram avaliados e descartados; o
  botão de menos continua sendo o único caminho no desktop)
- Uma pressão longa reconhecida gera **exatamente uma** chamada a
  `onDecrementar` — nunca incrementa antes, nunca chama duas vezes; o clique
  sintético que o navegador dispararia ao soltar o dedo precisa ser suprimido
- Mover o dedo além de um limiar pequeno depois do toque inicial cancela o
  reconhecimento (é rolagem da página, não pressão longa)
- Retorno visual **durante** a espera, distinto do `scale(0.92)` de toque
  simples já existente — sem isso, meio segundo de silêncio parece trava
- `-webkit-touch-callout: none` no cartão, para o iOS Safari não abrir o
  menu de seleção/cópia no toque longo (o `user-select: none` já existe mas
  não cobre esse caso)
- Ativação por teclado (Enter/Espaço) continua disparando `onIncrementar`
  direto, sem passar pelo temporizador — a pressão longa é só de ponteiro

## Escopo e instruções de implementação
1. Registrar **IDR** com: o limiar de tempo (recomendado ~500ms, o mesmo
   padrão de menus de contexto nativos), o limiar de movimento que cancela o
   reconhecimento, e a forma do retorno visual durante a espera.
2. Implementar com **Pointer Events** (`onPointerDown`/`onPointerUp`/
   `onPointerMove`/`onPointerCancel`) em `Figurinha.jsx`, filtrando por
   `event.pointerType === 'touch'`:
   - `onPointerDown` (touch): inicia o temporizador e o retorno visual
     progressivo
   - `onPointerMove` além do limiar, ou `onPointerUp` antes do temporizador
     completar: cancela tudo, comportamento normal de toque (incrementa)
   - Temporizador completo: chama `onDecrementar()` uma única vez e marca a
     interação como "consumida", para o `onClick` que o navegador dispara ao
     soltar não incrementar em cima
3. Retorno visual: uma transição contínua (ex.: o próprio `scale` avançando
   mais, ou uma borda que preenche) do início do toque até o limiar, para o
   usuário perceber que está sendo reconhecida antes de soltar.
4. Acrescentar `-webkit-touch-callout: none` a `.figurinha__corpo` em
   `Figurinha.css`.
5. Conferir que soltar antes do limiar incrementa normalmente (comportamento
   atual intacto) e que soltar depois decrementa, sem incrementar antes.
6. Conferir que a contagem em 0 não decrementa abaixo de 0 (mesma regra que
   já vale para o botão de menos).
7. Atualizar `docs/interface.md` com o gesto novo.

**Fora do escopo**: qualquer atalho de clique no desktop (decisão desta
conversa: descartado); mudar o botão de menos existente, que continua igual
nas duas plataformas.

## Decisões já tomadas (não reabrir)
- Tocar soma, ícone de menos remove — ver `docs/idr/0006-*`
- Botão de menos sempre visível em toque, sem precisar de hover — ver
  `src/components/Figurinha.css`
- Sem atalho de clique no desktop — decidido nesta conversa; o botão de
  menos continua sendo o único caminho lá

## Decisões em aberto nesta tarefa
- Limiar de tempo, limiar de movimento e forma do retorno visual —
  encaminhamento no passo 1; nasce **IDR 0047** (próximo número livre)

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/components/Figurinha.jsx` — modificar
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.test.jsx` — modificar
- `docs/interface.md` — modificar
- `docs/idr/0047-pressao-longa-decrementa-no-mobile.md` — criar

## Critérios de aceite
- [ ] Segurar o cartão além do limiar decrementa uma unidade, em qualquer
      ponto do cartão, não só no botão de menos
- [ ] Soltar antes do limiar incrementa normalmente (comportamento atual
      intacto)
- [ ] Nenhuma pressão longa gera mais de uma chamada a `onAjustar` (uma
      entrada só no histórico de desfazer, IDR 0012)
- [ ] Mover o dedo (rolagem) cancela o reconhecimento sem decrementar
- [ ] Retorno visual perceptível durante a espera
- [ ] iOS não abre menu de seleção/cópia no toque longo
- [ ] Teclado (Enter/Espaço) continua incrementando direto, sem pressão longa
- [ ] Mouse/trackpad sem toque não aciona o gesto (`pointerType` filtrado)
- [ ] IDR 0047 registrado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev` com emulação de toque (ou dispositivo
real): segurar o cartão além do limiar e conferir o decremento único; soltar
antes do limiar e conferir o incremento normal; rolar a página a partir de um
toque no cartão e conferir que não decrementa.
