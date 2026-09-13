<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0004]: margem inferior do corpo sob medida

## Status
Pendente

## Objetivo
Conferir se os 60px de margem inferior reservados no corpo do catálogo são
maiores que o necessário para a faixa de avisos e reduzi-los ao mínimo que
ainda evita sobreposição — esse espaço existe em toda tela, mesmo sem aviso
exibido.

## Documentos de referência
- `docs/interface.md` § Medidas — "Corpo: `padding: 20px clamp(16px, 4vw,
  40px) 60px`"; os 60px inferiores evitam que o último cartão fique atrás da
  faixa de avisos
- `docs/plano/0012-reducao-de-rolagem-vertical/logs/0002-log-cabecalho-de-secao-mais-compacto.md`
  § Decisões tomadas — qual registro lastreia as medidas compactadas da fase
  (gerado pela Tarefa 0012-0002)
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — faixa
  flutuante na borda inferior; não fixa os 60px do corpo
- `docs/idr/0034-limite-de-empilhamento-dos-avisos.md` § Decisão — até três
  faixas empilham
- `src/theme.css` — token `--body-padding: 20px var(--page-gutter) 60px`, onde
  mora o valor
- `src/components/Catalogo.css` (`.catalogo`) — `padding: var(--body-padding)`,
  único consumidor do token
- `src/components/Avisos.css` — `.avisos__faixa` `position: fixed`, `padding:
  12px var(--page-gutter)`; altura depende do texto
- `src/components/PoliticaDePrivacidade.css` — `padding-bottom: 60px` próprio
  da vista da política, independente do token

## Padrões e convenções aplicáveis
- A margem não fica menor que a pior altura real de uma faixa (falha com
  detalhe técnico em duas linhas) — IDR 0029
- `Avisos.css` e o comportamento da faixa não mudam — IDR 0029

## Escopo e instruções de implementação
1. Medir em `npm run dev` a altura real de `.avisos__faixa`: sucesso/aviso
   (uma linha) e falha com detalhe técnico expandido.
2. Se houver folga, reduzir o valor inferior do token `--body-padding` em
   `src/theme.css` para a medida real mais uma margem de segurança pequena e
   explícita (ex.: +8px), mantendo o token como fonte única do valor.
3. Atualizar o registro escolhido na Tarefa 0012-0002 com o novo valor e a
   medição, e `docs/interface.md` § Medidas, citando-o.

**Fora do escopo**: mudar a faixa de avisos; mudar o padding superior ou
lateral do corpo; o `padding-bottom: 60px` da vista da política de privacidade
(`PoliticaDePrivacidade.css`).

## Decisões já tomadas (não reabrir)
- Faixa de avisos flutuante, três severidades, detalhe técnico expansível na
  falha — ver `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`
- Até três avisos empilhados — ver
  `docs/idr/0034-limite-de-empilhamento-dos-avisos.md`
- O registro que lastreia as medidas compactadas da fase — escolhido na
  Tarefa 0012-0002 (ver o log dela)

## Decisões em aberto nesta tarefa
- A margem cobre a pior faixa única ou a pilha de até três faixas? —
  encaminhamento: a pior faixa única, já que a pilha é transitória e o usuário
  pode rolar; registrada no mesmo registro da medida.
- **Muda decisão documentada**: o registro escolhido na Tarefa 0012-0002
  (IDR 0022 ou o IDR da compactação vertical) — margem inferior do corpo 60px
  → valor medido mais a folga de segurança, com a medição; entrada em
  `## Histórico`.

## Arquivos impactados
- `src/theme.css` — modificar (`--body-padding`)
- `docs/interface.md` — modificar (§ Medidas)
- `docs/idr/` — modificar (o registro escolhido na Tarefa 0012-0002)

## Critérios de aceite
- [ ] Margem inferior calibrada pela altura medida da faixa, com folga
      explícita
- [ ] O aviso de falha mais alto (com detalhe técnico) não cobre o último
      cartão do catálogo
- [ ] A medição que justifica o valor está no registro e no log

## Validação adicional
Verificação visual em `npm run dev`: provocar uma falha de gravação (ex.:
offline) para exibir o aviso mais alto e rolar até o fim do catálogo,
conferindo que o último cartão não fica coberto.
