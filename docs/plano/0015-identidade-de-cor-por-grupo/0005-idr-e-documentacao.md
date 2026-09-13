<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0015-0005: IDR e documentação

## Status
Pendente

## Objetivo
Criar IDR 0045 documentando a decisão de identidade de cor por grupo de seções, e atualizar `interface.md` com as novas medidas e estilos.

## Documentos de referência
- `docs/idr/README.md` — índice de IDRs
- `docs/idr/CLAUDE.md` — guia de formato de IDR
- `docs/interface.md` — documento de interface a atualizar

## Padrões e convenções aplicáveis
- Formato de IDR (Status / Contexto / Decisão / Consequências / Alternativas) — ver `docs/idr/CLAUDE.md`
- Cabeçalho de copyright (`AGENTS.md` § Convenções)

## Escopo e instruções de implementação
1. Criar `docs/idr/0045-cores-por-grupo-de-secoes.md`:
   - **Status**: Aceito
   - **Contexto**: 12 super-grupos (A–L) + 2 especiais (FWC, COC) sem identidade visual distinta; dificuldade de orientação visual rápida no catálogo
   - **Decisão**:
     - Cada grupo recebe uma cor distinta aplicada em:
       - Título do super-grupo: borda esquerda + fundo com opacidade reduzida
       - Cabeçalho de seção: borda esquerda sutil
       - Faixa de bandeiras: fundo com opacidade reduzida (só na ordenação por página)
     - FWC: dourado (`--gold`); COC: vermelho Coca-Cola
     - 14 cores em OKLCH, ajustadas para contraste no tema escuro
   - **Consequências**:
     - Orientação visual mais rápida por grupo
     - Faixa de bandeiras mais informativa na ordenação por página
     - Sem impacto na ordenação por sigla (sem super-grupos visíveis)
   - **Alternativas consideradas**:
     - Cor como fundo cheio: rejeitado por competir com o tema escuro
     - Cores iguais em todas as ordenações: rejeitado por poluir visualmente sem super-grupos
2. Atualizar `docs/interface.md`:
   - Adicionar seção "Cores de grupo" em "Identidade visual" com a tabela de 14 cores
   - Atualizar "Medidas" com os novos estilos (borda 3px super-grupo, 4px seção, opacidade 15%/20%)
3. Atualizar `docs/idr/README.md`:
   - Adicionar linha do IDR 0045 na tabela

## Decisões já tomadas (não reabrir)
- Tema escuro único — ver [IDR 0022](../../idr/0022-tema-escuro-unico-paleta-do-prototipo.md)
- FWC e COC fora dos super-grupos — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `docs/idr/0045-cores-por-grupo-de-secoes.md` — criar
- `docs/idr/README.md` — modificar (adicionar linha do IDR 0045)
- `docs/interface.md` — modificar (adicionar seção de cores de grupo)

## Critérios de aceite
- [ ] IDR 0045 criado com estrutura completa (Status, Contexto, Decisão, Consequências, Alternativas)
- [ ] `interface.md` atualizado com especificação das cores
- [ ] `idr/README.md` com linha do IDR 0045
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
