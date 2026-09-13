<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0016-0003: IDR 0046 e documentação

## Status
Pendente

## Objetivo
Criar IDR 0046 documentando a decisão de identidade de cor por seleção, e atualizar `interface.md` com as novas medidas e estilos.

## Documentos de referência
- `docs/idr/README.md` — índice de IDRs
- `docs/idr/CLAUDE.md` — guia de formato de IDR
- `docs/interface.md` — documento de interface a atualizar

## Padrões e convenções aplicáveis
- Formato de IDR (Status / Contexto / Decisão / Consequências / Alternativas) — ver `docs/idr/CLAUDE.md`
- Cabeçalho de copyright (`AGENTS.md` § Convenções)

## Escopo e instruções de implementação
1. Criar `docs/idr/0046-cores-por-selecao.md`:
   - **Status**: Aceito
   - **Contexto**: 48 seleções sem identidade visual individual; dificuldade de distinguir seleções visualmente no catálogo
   - **Decisão**:
     - Cada seleção recebe uma cor distinta aplicada no cabeçalho da seção:
       - Borda completa de 1px na cor da seleção
       - Fundo com opacidade reduzida (~15%) da cor da seleção
     - FWC: dourado (`--gold`); COC: vermelho Coca-Cola
     - 50 cores em OKLCH, ajustadas para contraste no tema escuro
     - Hierarquia: cor do grupo no título do super-grupo (Fase 15), cor da seleção no cabeçalho da seção (Fase 16)
     - Faixa de bandeiras mantém cores de grupo (Fase 15)
   - **Consequências**:
     - Identificação visual mais rápida de cada seleção
     - Hierarquia clara: grupo (contexto) → seleção (identidade)
     - 50 tokens CSS adicionais em `theme.css`
   - **Alternativas consideradas**:
     - Cor apenas como borda esquerda: rejeitado por não dar destaque suficiente
     - Cores de grupo no cabeçalho de seção: rejeitado por perder identidade individual
     - Fundo cheio: rejeitado por competir com o tema escuro
2. Atualizar `docs/interface.md`:
   - Adicionar seção "Cores de seleção" em "Identidade visual" com a tabela de 50 cores
   - Atualizar "Medidas" com os novos estilos (borda 1px + fundo 15% de opacidade)
3. Atualizar `docs/idr/README.md`:
   - Adicionar linha do IDR 0046 na tabela

## Decisões já tomadas (não reabrir)
- Tema escuro único — ver [IDR 0022](../../idr/0022-tema-escuro-unico-paleta-do-prototipo.md)
- FWC e COC fora dos super-grupos — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `docs/idr/0046-cores-por-selecao.md` — criar
- `docs/idr/README.md` — modificar (adicionar linha do IDR 0046)
- `docs/interface.md` — modificar (adicionar seção de cores de seleção)

## Critérios de aceite
- [ ] IDR 0046 criado com estrutura completa (Status, Contexto, Decisão, Consequências, Alternativas)
- [ ] `interface.md` atualizado com especificação das cores de seleção
- [ ] `idr/README.md` com linha do IDR 0046
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
