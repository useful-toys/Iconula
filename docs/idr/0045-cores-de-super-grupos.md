<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0045: Cores de super-grupos

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 organiza as 48 seleções em 12 super-grupos (A-L), cada um com 4 seleções. Atualmente, os super-grupos são exibidos apenas com texto, sem identidade visual própria.

## Decisão

Atribuir uma cor distinta a cada super-grupo, aplicada em:
- **Título do super-grupo**: borda esquerda 3px + fundo com 15% de opacidade
- **Faixa de bandeiras**: fundo com 20% de opacidade, apenas na ordenação por página — na ordenação por sigla, fundo neutro, inclusive FWC e COC

O cabeçalho de seção não recebe cor de grupo: cada seção recebe a cor da sua seleção ([IDR 0046](0046-cores-de-selecoes.md)).

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

FWC e COC entram como alias dos tokens existentes (`--group-fwc: var(--gold)`, `--group-coc: var(--notif-red)`), não como cores novas.

## Consequências

- Identificação visual imediata do super-grupo
- Hierarquia clara: grupo (título do super-grupo, faixa de bandeiras) → seleção (cabeçalho de seção, [IDR 0046](0046-cores-de-selecoes.md)) → figurinha
- 14 tokens CSS adicionais em `theme.css`: 12 cores de grupo + 2 alias

## Alternativas consideradas

- **Cores mais saturadas**: Rejeitado - competiria com o tema escuro
- **Cores apenas no título**: Rejeitado - perderia o contexto na faixa de bandeiras
- **Cores na faixa de bandeiras em todas ordenações**: Rejeitado - na ordenação por sigla não há super-grupos visíveis, e a cor viraria ruído sem referência
- **Cor de grupo no cabeçalho de seção**: Rejeitado na revisão do planejamento - a Fase 16 aplica a cor da seleção no cabeçalho ([IDR 0046](0046-cores-de-selecoes.md)); aplicar as duas em sequência seria trabalho descartável

## Histórico

- 2026-09-13 — Revisão do planejamento das Fases 15-17: o cabeçalho de seção,
  que nesta decisão herdaria a cor do grupo (borda esquerda 3px), passa a
  receber a cor da seleção pela decisão do IDR 0046, entregue na Fase 16 —
  aplicar cor de grupo e trocá-la logo em seguida seria trabalho descartável.
  A cor de grupo permanece no título do super-grupo e na faixa de bandeiras.
  Explicitado também que FWC e COC entram como alias de `--gold` e
  `--notif-red`, e que a faixa é neutra na ordenação por sigla, inclusive
  FWC e COC.
