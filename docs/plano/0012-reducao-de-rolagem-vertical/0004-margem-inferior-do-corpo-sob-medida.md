<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0004]: margem inferior do corpo sob medida

## Status
Pendente

## Objetivo
Trocar os 60px fixos de margem inferior do catálogo pela altura medida da pior
faixa de aviso única mais 8px — esse espaço existe em toda tela, mesmo sem
aviso.

## Documentos de referência
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — regra da
  margem inferior: pior faixa única (falha com detalhe expandido, largura de
  celular) + 8px; pilha fora da conta
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão —
  faixa flutuante na borda inferior, detalhe técnico expansível na falha
- `src/theme.css` — `--body-padding: 20px var(--page-gutter) 60px`
- `src/components/Catalogo.css` — único consumidor do token
- `src/components/Avisos.css` — `.avisos__faixa`, altura depende do texto
- `docs/interface.md` § Medidas — "Corpo: `padding: 20px clamp(16px, 4vw,
  40px) 60px`"

## Padrões e convenções aplicáveis
- A faixa de avisos e o comportamento dela não mudam — IDR 0029
- O token segue como fonte única do valor — `src/theme.css`
- A política de privacidade mantém o próprio `padding-bottom` —
  `src/components/PoliticaDePrivacidade.css`

## Escopo e instruções de implementação
1. Medir em `npm run dev`, a 375px de largura, a altura da faixa de falha com
   o detalhe técnico expandido, usando a mensagem de falha de gravação real.
2. O valor inferior de `--body-padding` passa a essa altura + 8px.
3. Anotar a medição e o valor final no IDR 0050 § Decisão (linha da margem
   inferior) e no log.
4. Em `docs/interface.md` § Medidas, a linha "Corpo" passa ao novo valor,
   citando o IDR 0050.

**Fora do escopo**: faixa de avisos; padding superior e lateral do corpo;
vista da política de privacidade.

## Decisões já tomadas (não reabrir)
- Regra da margem (pior faixa única + 8px, sem a pilha) — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`
- Faixa flutuante, três severidades, detalhe expansível — ver
  `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` — modificar (valor
  medido)
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Margem inferior = altura medida + 8px (medição no log e no IDR 0050)
- [ ] A falha expandida não cobre o último cartão ao fim da rolagem
      (verificação visual)
- [ ] `docs/interface.md` § Medidas com o novo valor, citando o IDR 0050

## Validação adicional
Verificação visual em `npm run dev`: provocar falha de gravação (offline),
expandir o detalhe, rolar até o fim do catálogo e conferir o último cartão
visível.
