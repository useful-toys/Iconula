<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0015-0002: Cor no título do super-grupo

## Status
Pendente

## Objetivo
Aplicar borda esquerda e fundo com opacidade reduzida da cor do grupo no título do `SuperGrupo.jsx`, usando os tokens criados na tarefa 0001.

## Documentos de referência
- `src/components/SuperGrupo.jsx` — componente do super-grupo
- `src/components/SuperGrupo.css` — estilos atuais
- `src/components/Catalogo.jsx` — componente pai que renderiza os super-grupos
- `docs/interface.md` § Corpo — cabeçalho de super-grupo

## Padrões e convenções aplicáveis
- CSS modular por componente — ver [ADR 0008](../../adr/0008-css-modular-por-componente.md)
- Memoização de componentes — ver [TDR 0021](../../tdr/0021-desempenho-do-catalogo.md)

## Escopo e instruções de implementação
1. Modificar `SuperGrupo.jsx`:
   - Adicionar classe CSS dinâmica baseada na letra do grupo: `super-grupo--grupo-{letra}`
   - A prop `grupo` já é a letra (A–L)
2. Modificar `SuperGrupo.css`:
   - Adicionar estilos para `.super-grupo__titulo` com borda esquerda de 3px
   - Criar 12 modificadores (`.super-grupo--grupo-a` a `.super-grupo--grupo-l`) que aplicam:
     - `border-left: 3px solid var(--group-{letra})`
     - `background: color-mix(in srgb, var(--group-{letra}) 15%, transparent)`
   - O texto mantém a cor `--gold` para contraste
3. Atualizar `SuperGrupo.test.jsx`:
   - Testar que cada super-grupo recebe a classe correta do grupo
   - Testar que o estilo é aplicado

**Fora do escopo**: cores de FWC e COC (não têm super-grupo — IDR 0028).

## Decisões já tomadas (não reabrir)
- Super-grupos colapsáveis — ver [IDR 0019](../../idr/0019-ordem-do-album-agrupada-e-colapsavel.md)
- FWC e COC fora dos super-grupos — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `src/components/SuperGrupo.jsx` — modificar (adicionar classe de grupo)
- `src/components/SuperGrupo.css` — modificar (adicionar estilos de cor)
- `src/components/SuperGrupo.test.jsx` — modificar (testar classes de grupo)

## Critérios de aceite
- [ ] Título do super-grupo exibe borda esquerda de 3px na cor do grupo
- [ ] Fundo com opacidade ~15% da cor do grupo
- [ ] Texto mantém cor `--gold` para contraste
- [ ] Testes atualizados e passando
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
