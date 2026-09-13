<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0015-0003: Cor no cabeçalho de seção

## Status
Pendente

## Objetivo
Aplicar borda esquerda sutil da cor do grupo no cabeçalho de cada seção. FWC usa dourado (`--group-fwc`), COC usa vermelho (`--group-coc`), seleções usam a cor do grupo (A–L).

## Documentos de referência
- `src/components/Secao.jsx` — componente da seção
- `src/components/Secao.css` — estilos atuais
- `src/components/Catalogo.jsx` — componente pai que renderiza as seções
- `src/data/catalogo.js` — estrutura do dado da seção (campo `grupo`)
- `docs/interface.md` § Corpo — cabeçalho de seção

## Padrões e convenções aplicáveis
- CSS modular por componente — ver [ADR 0008](../../adr/0008-css-modular-por-componente.md)
- Memoização de componentes — ver [TDR 0021](../../tdr/0021-desempenho-do-catalogo.md)

## Escopo e instruções de implementação
1. Modificar `Secao.jsx`:
   - Adicionar classe CSS dinâmica baseada na cor do grupo
   - Para seleções: usar `secao.grupo` (A–L) → classe `secao--grupo-{letra}`
   - Para FWC (`secao.sigla === 'FWC'`): classe `secao--fwc`
   - Para COC (`secao.sigla === 'COC'`): classe `secao--coc`
2. Modificar `Secao.css`:
   - Adicionar estilos para `.secao__cabecalho` com borda esquerda de 4px
   - Criar modificadores:
     - `.secao--grupo-a` a `.secao--grupo-l`: `border-left: 4px solid var(--group-{letra})`
     - `.secao--fwc`: `border-left: 4px solid var(--group-fwc)`
     - `.secao--coc`: `border-left: 4px solid var(--group-coc)`
   - A borda substitui a borda padrão do cabeçalho (que é `1px solid var(--border)`)
3. Atualizar `Secao.test.jsx`:
   - Testar que seleções recebem a classe do grupo
   - Testar que FWC recebe `secao--fwc`
   - Testar que COC recebe `secao--coc`

## Decisões já tomadas (não reabrir)
- Seções colapsáveis — ver [IDR 0020](../../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md)
- FWC e COC como especiais — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `src/components/Secao.jsx` — modificar (adicionar classe de grupo)
- `src/components/Secao.css` — modificar (adicionar estilos de cor)
- `src/components/Secao.test.jsx` — modificar (testar classes de grupo)

## Critérios de aceite
- [ ] Cabeçalho de seção exibe borda esquerda de 4px na cor do grupo
- [ ] FWC usa `--group-fwc` (dourado)
- [ ] COC usa `--group-coc` (vermelho)
- [ ] Seleções usam cor do grupo (A–L)
- [ ] Testes atualizados e passando
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
