<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0045: Cores de super-grupos

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 organiza as 48 seleções em 12 super-grupos (A-L), cada um com 4 seleções. Atualmente, os super-grupos são exibidos apenas com texto, sem identidade visual própria.

## Decisão

Atribuir uma cor distinta a cada super-grupo, aplicada em:
- **Título do super-grupo**: borda esquerda 3px + fundo com 15% de opacidade
- **Cabeçalho de seção**: borda esquerda 3px (herda a cor do super-grupo)
- **Faixa de bandeiras**: fundo com 20% de opacidade (apenas na ordenação por página)

### Cores dos super-grupos

| Grupo | Cor | Hex |
|---|---|---|
| A | Verde | #4CAF50 |
| B | Vermelho | #E53935 |
| C | Verde-limão | #C0CA33 |
| D | Azul-índigo | #3F51B5 |
| E | Laranja | #F4511E |
| F | Verde-azulado | #00695C |
| G | Lilás | #B39DDB |
| H | Azul-petróleo | #26A69A |
| I | Roxo | #6A1B9A |
| J | Salmão | #E8B4A8 |
| K | Rosa | #EC407A |
| L | Vermelho-vinho | #8D2E2E |

### Especiais

- **Extras FIFA (FWC)**: dourado (`--gold`)
- **Coca-Cola (COC)**: vermelho (`--notif-red`)

## Consequências

- Identificação visual imediata do super-grupo
- Hierarquia clara: grupo → seleção → figurinha
- 14 tokens CSS adicionais em `theme.css`

## Alternativas consideradas

- **Cores mais saturadas**: Rejeitado - competiria com o tema escuro
- **Cores apenas no título**: Rejeitado - perderia contexto nas seções
- **Cores na faixa de bandeiras em todas ordenações**: Rejeitado - inconsistência visual
