<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0028-0004]: título de seção com gaps, glifos menores e fonte condensada

## Status
Pendente

## Objetivo
Compactar horizontalmente o título da seção: gaps `8px → 6px` (cabeçalho) e
`0.35em → 0.22em` (título), glifos `▯`/`×` em `0.85em`/peso 400, nome em
Poppins 14px, e sigla/página/números em Roboto Condensed 500 até 582px — para
o título caber numa linha no celular sem remover informação.

## Documentos de referência
- `docs/idr/0056-titulo-de-secao-em-linha-unica-no-celular.md` § Decisão — os
  valores exatos (gaps, glifos, fonte condensada ≤582px).
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` — o nome segue Poppins
  600, acima do super-grupo de 13px.
- `docs/tdr/0013-tipografia-vendorizada.md` — Roboto Condensed 500 já
  vendorizada.

## Padrões e convenções aplicáveis
- Sem ponto de quebra novo por largura — a media query `582px` reaproveita o
  limite do IDR 0043.
- `interface.md` § Medidas no estado atual, com lastro em registro.

## Escopo e instruções de implementação
1. Em `Secao.css`: `.secao__cabecalho` `gap: 8px → 6px`; `.secao__titulo`
   `gap: 0.35em → 0.22em`; glifos `▯`/`×` em `0.85em`/`font-weight: 400`.
2. Nome da seção permanece Poppins 600/14px; sigla, página e números do resumo
   passam a Roboto Condensed 500 em `@media (max-width: 582px)`.
3. Atualizar `interface.md` § Medidas com os novos valores.
4. Verificar visualmente em `npm run dev` a ~360px: o título cabe numa linha;
   se os 5 nomes mais longos estourarem por poucos px, ajustar o gap ou o
   tamanho dos glifos — nunca a fonte do nome (nível 1/2).

**Fora do escopo**: a remoção do chevron e os spans (Tarefa 0028-0003); a
notação `▯`/`×` (Tarefas 0028-0001/0002).

## Decisões já tomadas (não reabrir)
- Valores de gaps, glifos e fonte condensada — ver
  `docs/idr/0056-titulo-de-secao-em-linha-unica-no-celular.md`.

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.secao__cabecalho` com `gap: 6px`; `.secao__titulo` com `gap: 0.22em`;
      `▯`/`×` em `0.85em`/400.
- [ ] Até 582px, sigla/página/números em Roboto Condensed 500; o nome segue
      Poppins 600/14px.
- [ ] Acima de 582px, nada muda (Poppins em tudo).
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- `npm run dev` — roteiro visual em ~360px (os títulos das seções em linha
  única, incluindo Bósnia-Herzegovina e Estados Unidos).
