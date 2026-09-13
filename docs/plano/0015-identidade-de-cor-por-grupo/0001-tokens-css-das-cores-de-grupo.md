<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0001]: tokens CSS das cores de grupo

## Status
Concluída

## Objetivo
Criar em `theme.css` os tokens de identidade dos 12 grupos (A–L), o vermelho
da Coca-Cola e os alias dos dois especiais, com os valores OKLCH já decididos
— base das Tarefas 0002 e 0003.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Cores dos super-grupos e
  § Especiais — nomes dos tokens e valores finais
- `src/theme.css` — tokens existentes em OKLCH, incluindo `--gold`
- `docs/interface.md` § Identidade visual › Paleta — tabela de tokens

## Padrões e convenções aplicáveis
- Valores copiados do IDR 0045, sem reconverter nem ajustar — IDR 0045
- FWC e COC são alias: `--group-fwc` aponta para `--gold` e `--group-coc`
  para `--coc-red` — IDR 0045
- `--notif-red` continua exclusivo dos avisos — IDR 0029

## Escopo e instruções de implementação
1. Em `src/theme.css`, sob um comentário "Cores de grupo": `--group-a` a
   `--group-l` e `--coc-red` com os valores da tabela do IDR 0045, e os alias
   `--group-fwc` e `--group-coc`.
2. Em `docs/interface.md` § Identidade visual › Paleta, acrescentar as
   linhas dos 12 tokens de grupo, de `--coc-red` e dos alias, com uso
   "identidade do grupo (título do super-grupo, faixa de bandeiras)" —
   citando o IDR 0045.

**Fora do escopo**: aplicar as cores (Tarefas 0015-0002 e 0015-0003); cores
de seleção (Fase 16).

## Decisões já tomadas (não reabrir)
- Cores, valores OKLCH, contrastes e `--coc-red` — ver
  `docs/idr/0045-cores-de-super-grupos.md`
- Tema escuro único — ver
  `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Identidade visual)

## Critérios de aceite
- [ ] 15 tokens em `theme.css` com os valores exatos do IDR 0045: 12 grupos,
      `--coc-red` e os alias `--group-fwc` e `--group-coc` (busca)
- [ ] `--notif-red` inalterado (diff)
- [ ] `docs/interface.md` § Identidade visual lista os tokens citando o
      IDR 0045
