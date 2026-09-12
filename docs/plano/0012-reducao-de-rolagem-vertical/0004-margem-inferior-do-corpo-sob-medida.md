<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0004]: margem inferior do corpo sob medida

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Medidas — "Corpo: `padding: 20px clamp(16px, 4vw,
  40px) 60px`" — os 60px inferiores existem para o último cartão não ficar
  atrás da faixa de avisos flutuante
- `src/components/Catalogo.css` (`.catalogo`) — implementação
- `src/components/Avisos.css` — a faixa de avisos é `position: fixed`,
  colada à borda inferior (`.avisos__faixa`, `padding: 12px
  clamp(16px, 4vw, 40px)`); sua altura real depende do texto (uma linha na
  maioria dos casos, duas quando a falha mostra o detalhe técnico)
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` — decisão da
  faixa de avisos; não fixa os 60px do corpo, então ajustá-los não reabre
  este IDR

## Objetivo
Conferir se os 60px de margem inferior reservados no corpo do catálogo são
maiores do que o necessário para a faixa de avisos, e reduzi-los ao mínimo
que ainda evita sobreposição — esse espaço existe em toda tela, o tempo
todo, mesmo quando nenhum aviso está sendo exibido.

## Padrões e convenções aplicáveis
- A margem só existe para não esconder conteúdo atrás da faixa de avisos —
  não pode ficar menor que a pior altura real da faixa (falha com detalhe
  técnico em duas linhas, que é o caso mais alto)
- Não mexer em `Avisos.css` nem no comportamento da faixa — só medir a altura
  real dela para calibrar o padding do corpo

## Escopo e instruções de implementação
1. Medir em `npm run dev` a altura real de `.avisos__faixa` nos três casos:
   sucesso/aviso (uma linha) e falha com detalhe técnico expandido (o caso
   mais alto).
2. Comparar com os 60px atuais e, se houver folga, reduzir `padding` de
   `.catalogo` (`src/components/Catalogo.css`) para a medida real + uma
   margem de segurança pequena (ex.: +8px).
3. Conferir que, com o aviso de falha mais alto exibido, o último cartão do
   catálogo continua visível ao rolar até o fim.
4. Atualizar `docs/interface.md` § Medidas com o novo valor.

**Fora do escopo**: mudar a faixa de avisos em si; mudar o padding superior
ou lateral do corpo.

## Decisões já tomadas (não reabrir)
- Faixa de avisos flutuante, três severidades, detalhe técnico expansível na
  falha — ver `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`

## Decisões em aberto nesta tarefa
Nenhuma — é uma calibração de medida a partir da altura real de outro
elemento, mesmo precedente da Fase 6 Tarefa 3 (registrado direto em
`docs/interface.md`, sem IDR novo).

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
- `src/components/Catalogo.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Margem inferior calibrada pela altura real da faixa de avisos, com
      folga de segurança pequena e explícita
- [ ] O aviso de falha mais alto (com detalhe técnico) não cobre o último
      cartão do catálogo
- [ ] `docs/interface.md` reflete o novo valor

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: provocar uma falha de gravação (ex.:
offline) para exibir o aviso mais alto e rolar até o fim do catálogo,
conferindo que o último cartão não fica coberto.
