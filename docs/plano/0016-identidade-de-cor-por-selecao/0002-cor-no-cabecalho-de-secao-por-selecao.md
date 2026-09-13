<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0016-0002: Cor no cabeçalho de seção por seleção

## Status
Pendente

## Objetivo
Aplicar a cor individual da seleção no cabeçalho de cada seção, com borda completa e fundo com opacidade reduzida. Substitui a cor de grupo que seria aplicada pela Fase 15.

## Documentos de referência
- `src/components/Secao.jsx` — componente da seção
- `src/components/Secao.css` — estilos atuais
- `src/data/catalogo.js` — estrutura do dado da seção (campo `sigla`)
- `docs/interface.md` § Corpo — cabeçalho de seção

## Padrões e convenções aplicáveis
- CSS modular por componente — ver [ADR 0008](../../adr/0008-css-modular-por-componente.md)
- Memoização de componentes — ver [TDR 0021](../../tdr/0021-desempenho-do-catalogo.md)

## Escopo e instruções de implementação
1. Modificar `Secao.jsx`:
   - Adicionar classe CSS dinâmica baseada na sigla da seleção
   - Para seleções: classe `secao--selecao-{sigla-minuscula}` (ex.: `secao--selecao-bra`)
   - Para FWC: classe `secao--fwc`
   - Para COC: classe `secao--coc`
2. Modificar `Secao.css`:
   - Criar 48 modificadores (`.secao--selecao-alg` a `.secao--selecao-uzb`):
     - `border: 1px solid var(--selection-{sigla})`
     - `background: color-mix(in srgb, var(--selection-{sigla}) 15%, var(--panel))`
   - Criar modificadores para especiais:
     - `.secao--fwc`: borda e fundo com `var(--selection-fwc)` (dourado)
     - `.secao--coc`: borda e fundo com `var(--selection-coc)` (vermelho)
   - O texto mantém `--cream` para identificação e `--muted` para números
3. Atualizar `Secao.test.jsx`:
   - Testar que cada seleção recebe sua classe específica
   - Testar que FWC recebe `secao--fwc`
   - Testar que COC recebe `secao--coc`

**Fora do escopo**: faixa de bandeiras (mantém decisão da Fase 15 — cores de grupo).

## Decisões já tomadas (não reabrir)
- Seções colapsáveis — ver [IDR 0020](../../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md)
- FWC e COC como especiais — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `src/components/Secao.jsx` — modificar (adicionar classe de seleção)
- `src/components/Secao.css` — modificar (adicionar estilos de cor por seleção)
- `src/components/Secao.test.jsx` — modificar (testar classes de seleção)

## Critérios de aceite
- [ ] Cabeçalho de seção exibe borda completa de 1px na cor da seleção
- [ ] Fundo com opacidade ~15% da cor da seleção
- [ ] FWC usa `--selection-fwc` (dourado)
- [ ] COC usa `--selection-coc` (vermelho)
- [ ] Cada seleção usa sua cor individual
- [ ] Testes atualizados e passando
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
