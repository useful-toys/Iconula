<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0003]: bandeiras mais compactas

## Status
Pendente

## Objetivo
Reduzir ainda mais o espaçamento horizontal entre as bandeiras da faixa de
salto, para caber mais seções na largura da tela sem precisar rolar, mantendo
a área de toque ampliada sem sobreposição entre bandeiras vizinhas.

## Documentos de referência
- `src/components/FaixaDeSecoes.css` — `gap: 4px` atual entre as bandeiras e
  o `::before` da área de toque ampliada
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — tabela de área
  de toque ampliada: "Ícone da faixa de bandeiras | 30×30px | a bandeira
  vizinha, gap 4px | −2px | 34×34px, sem se sobrepor" — a expansão para na
  metade do espaçamento até a vizinha
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão — as
  medidas do protótipo, transcritas em `interface.md`, lastreiam o
  espaçamento
- `docs/plano/0006-ajuste-de-rota/0003-faixa-de-bandeiras-mais-compacta.md` —
  precedente: a Fase 6 já reduziu o espaçamento de 8px para 4px pelo mesmo
  motivo
- `docs/interface.md` § Medidas — "Faixa de bandeiras: … espaçamento 4px"

## Padrões e convenções aplicáveis
- O ícone continua 30×30px; só o espaçamento muda — `docs/interface.md`
  § Medidas
- A área de toque ampliada é exatamente a metade do gap, para não sobrepor a
  vizinha — IDR 0042
- Sem rolagem vertical nova nem mudança na rolagem horizontal existente —
  IDR 0008 / IDR 0016

## Escopo e instruções de implementação
1. Reduzir `gap` em `.faixa-de-secoes` (`src/components/FaixaDeSecoes.css`),
   partindo de 2px; o valor final é o menor que ainda separa visualmente duas
   bandeiras em celular estreito com as 50 seções.
2. Ajustar o `inset` do `::before` de `.faixa-de-secoes__botao` (regra
   `@media (pointer: coarse)`) para a metade exata do novo gap.
3. Atualizar o IDR 0042 (tabela) e o IDR 0022 e `docs/interface.md` § Medidas
   com os novos valores (ver "Decisões em aberto").

**Fora do escopo**: mudar o tamanho do ícone; mudar a ordem ou o conteúdo da
faixa.

## Decisões já tomadas (não reabrir)
- Ícone de 30×30px, rolagem horizontal, 🏆 no início e 🥤 no fim — ver
  `docs/interface.md` § Cabeçalho e
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- Área de toque ampliada é a metade do espaçamento — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md` (mantida; só os números
  mudam)

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: `docs/idr/0042-foco-visivel-e-area-de-toque.md`
  § Decisão, linha "Ícone da faixa de bandeiras" da tabela de área de toque
  ampliada — gap 4px, expansão −2px, alvo final 34×34px → novo gap, expansão
  igual à metade dele e o alvo final resultante, com entrada em
  `## Histórico`.
- **Muda decisão documentada**: `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
  § Decisão — "as medidas são as do protótipo" → acrescenta o novo
  espaçamento da faixa como ajuste feito em uso, com entrada em
  `## Histórico`. Se, pelo guia `docs/idr/CLAUDE.md`, o ajuste for decisão
  genuinamente nova, nasce um IDR próprio em vez de atualizar o 0022.

## Arquivos impactados
- `src/components/FaixaDeSecoes.css` — modificar
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — modificar
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` — modificar (ou
  `docs/idr/` — criar, conforme a decisão em aberto)
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Espaçamento entre bandeiras menor que 4px e ainda legível como itens
      separados em celular
- [ ] `inset` da área de toque ampliada é exatamente a metade do novo gap
      (conferido no CSS)
- [ ] A linha da faixa de bandeiras na tabela do IDR 0042 mostra o novo gap,
      a nova expansão e o novo alvo final

## Validação adicional
Verificação visual em `npm run dev`, em largura de celular: mais seções cabem
na faixa sem rolar e o toque numa bandeira não aciona a vizinha.
