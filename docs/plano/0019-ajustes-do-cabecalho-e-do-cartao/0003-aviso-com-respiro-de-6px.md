<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0003]: faixa de aviso com respiro de 6px

## Status
Concluída

## Objetivo
Baixar a faixa de aviso (sucesso, aviso e falha) reduzindo o respiro vertical
de 12px para 6px, e remedir a margem inferior do corpo, que é a pior faixa de
aviso mais 8px — hoje 76px, estimada em 64px.

## Documentos de referência
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão ("Faixa de
  aviso" e "Margem inferior do corpo") e § Histórico — o respiro, a fórmula e
  a medição anterior
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — a
  faixa flutuante e as severidades
- `src/components/Avisos.css` — `.avisos__faixa` com `padding: 12px
  var(--page-gutter)`; `.avisos__dispensar`
- `src/theme.css` — `--body-padding: 20px var(--page-gutter) 76px`
- `docs/interface.md` § Medidas — linhas "Corpo" e "Área de avisos"

## Padrões e convenções aplicáveis
- Margens laterais, cores, tipografia e borda superior da faixa não mudam —
  IDR 0029, `docs/interface.md` § Avisos
- A margem inferior vem da medição real, não da estimativa — IDR 0050
- A mensagem continua a área de toque do detalhe técnico e o `×` continua
  isolado na ponta — IDR 0017

## Escopo e instruções de implementação
1. Respiro vertical da faixa de aviso para 6px em cima e embaixo; lateral
   inalterada.
2. Medir, a 375px e com o mesmo método do IDR 0050, a faixa de falha com o
   detalhe técnico expandido; margem inferior do corpo = altura medida + 8px,
   arredondada para cima, em `--body-padding`.
3. No IDR 0050, trocar a estimativa de 64px pela medição (conta em passos
   curtos) e acrescentar a entrada no `## Histórico`.
4. Em `docs/interface.md` § Medidas, citando o IDR 0050: "Área de avisos" com
   `padding: 6px clamp(16px, 4vw, 40px)`; "Corpo" com a nova margem inferior.

**Fora do escopo**: duração, empilhamento e textos dos avisos (IDR 0029,
IDR 0034); outros espaçamentos do catálogo.

## Decisões já tomadas (não reabrir)
- Respiro de 6px e fórmula da margem inferior — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`
- Faixa flutuante com três severidades — ver
  `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`

## Decisões em aberto nesta tarefa
- Se o botão `×` (16px + 4px de respiro) limitar a altura da faixa (nível 2)
  — premissa conservadora: não mexer no botão; anotar a medida no log.

## Arquivos impactados
- `src/components/Avisos.css` — modificar
- `src/theme.css` — modificar
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.avisos__faixa` com respiro vertical de 6px e lateral
      `var(--page-gutter)` (trecho)
- [ ] `--body-padding` com a margem = medição + 8px, conta no log (trecho)
- [ ] IDR 0050 com a medição no lugar da estimativa e entrada no histórico
- [ ] `docs/interface.md` § Medidas citando o IDR 0050
- [ ] Testes existentes de `Avisos` verdes

## Validação adicional
Verificação visual em `npm run dev` a 375px: um sucesso, um aviso e uma falha
expandida; rolar até o fim do catálogo com a falha aberta e conferir a última
linha visível acima da faixa.
