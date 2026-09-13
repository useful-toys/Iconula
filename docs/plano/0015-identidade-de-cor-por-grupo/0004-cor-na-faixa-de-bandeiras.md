<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0015-0004: Cor na faixa de bandeiras

## Status
Pendente

## Objetivo
Aplicar fundo com opacidade reduzida da cor do grupo em cada bandeira da faixa de salto, **somente na ordenação por página**. Na ordenação por sigla, todas as bandeiras usam fundo neutro (`--panel`).

## Documentos de referência
- `src/components/FaixaDeSecoes.jsx` — componente da faixa de bandeiras
- `src/components/FaixaDeSecoes.css` — estilos atuais
- `src/App.jsx` — componente pai que passa `secoes` e precisa passar `ordenacao`
- `docs/interface.md` § Cabeçalho — faixa de bandeiras

## Padrões e convenções aplicáveis
- CSS modular por componente — ver [ADR 0008](../../adr/0008-css-modular-por-componente.md)
- Área de toque ampliada — ver [IDR 0042](../../idr/0042-foco-visivel-e-area-de-toque.md)

## Escopo e instruções de implementação
1. Modificar `FaixaDeSecoes.jsx`:
   - Adicionar prop `ordenacao` (`'pagina' | 'sigla'`)
   - Adicionar classe CSS dinâmica baseada na cor do grupo, **somente se `ordenacao === 'pagina'`**:
     - Para seleções: classe `faixa-de-secoes__botao--grupo-{letra}`
     - Para FWC: classe `faixa-de-secoes__botao--fwc`
     - Para COC: classe `faixa-de-secoes__botao--coc`
   - Na ordenação por sigla, nenhuma classe de cor é aplicada
2. Modificar `FaixaDeSecoes.css`:
   - Criar modificadores com fundo de opacidade ~20%:
     - `.faixa-de-secoes__botao--grupo-a` a `--grupo-l`: `background: color-mix(in srgb, var(--group-{letra}) 20%, var(--panel))`
     - `.faixa-de-secoes__botao--fwc`: `background: color-mix(in srgb, var(--group-fwc) 20%, var(--panel))`
     - `.faixa-de-secoes__botao--coc`: `background: color-mix(in srgb, var(--group-coc) 20%, var(--panel))`
   - O hover mantém o comportamento atual (`--border`)
3. Modificar `App.jsx`:
   - Passar `ordenacao` como prop para `FaixaDeSecoes`
   - A prop já está disponível no estado (`ordenacao`)
4. Atualizar `FaixaDeSecoes.test.jsx`:
   - Testar que na ordenação `pagina` as classes de cor são aplicadas
   - Testar que na ordenação `sigla` as classes de cor NÃO são aplicadas
   - Testar que FWC e COC recebem suas classes específicas

## Decisões já tomadas (não reabrir)
- Faixa de bandeiras para salto — ver [IDR 0016](../../idr/0016-salto-pela-faixa-de-bandeiras.md)
- Ordenações do catálogo — ver [IDR 0005](../../idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md)

## Arquivos impactados
- `src/components/FaixaDeSecoes.jsx` — modificar (adicionar prop `ordenacao` e classes de cor)
- `src/components/FaixaDeSecoes.css` — modificar (adicionar estilos de cor)
- `src/components/FaixaDeSecoes.test.jsx` — modificar (testar comportamento condicional)
- `src/App.jsx` — modificar (passar `ordenacao` para `FaixaDeSecoes`)

## Critérios de aceite
- [ ] Na ordenação `pagina`, bandeiras exibem fundo com 20% da cor do grupo
- [ ] Na ordenação `sigla`, todas as bandeiras usam fundo neutro `--panel`
- [ ] FWC e COC usam suas cores próprias em ambas as ordenações
- [ ] Testes atualizados e passando
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
