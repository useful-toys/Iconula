<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0026-0001]: cores de bandeira por seleção em OKLCH

## Status
Concluída

## Objetivo
Substituir os 48 tokens de cor única por seleção por até 3 tokens de cor da
bandeira cada (cor 1, cor 2, cor 3), na versão original e, onde precisar,
ajustada por contraste.

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § "Cores das seleções" — RGB, OKLCH
  original/ajustada e contraste já calculados para as 48 seleções; usar
  exatamente esses valores
- `docs/idr/0046-cores-de-selecoes.md` § Decisão — onde a cor original e a
  ajustada entram (moldura × fundo tingido) e a regra de clareamento
- `docs/idr/0045-cores-de-super-grupos.md` § "Especiais" — FWC e COC
  continuam alias de cor única de grupo, sem degradê

## Padrões e convenções aplicáveis
- Cor só pelos tokens OKLCH de `docs/interface.md` § Paleta

## Escopo e instruções de implementação
1. Em `src/theme.css`, para cada uma das 48 seleções, criar até 3 tokens
   com a cor 1 (topo), cor 2 (esquerda inferior) e cor 3 (direita
   inferior) da tabela do IDR 0046 — nome sugerido
   `--selection-<sigla>-1/-2/-3`. Onde a 2ª e a 3ª cor forem iguais (bandeira
   de duas cores), um único token cobre as duas posições — não duplicar.
2. Para cada cor que a tabela do IDR 0046 marca com "→ aj.", criar também o
   token da versão ajustada (nome sugerido `--selection-<sigla>-N-bg`, só
   para a posição que tem ajuste) — usada no fundo tingido a 25%; a cor
   original correspondente continua servindo à moldura. Onde não há "→
   aj." na tabela, o mesmo token serve às duas finalidades (moldura e
   fundo), sem duplicar.
3. `--selection-fwc` e `--selection-coc` continuam como estão, alias de
   `--group-fwc`/`--group-coc` — não entram no esquema de 3 cores.
4. Atualizar `docs/interface.md` § Paleta com os tokens novos, citando o
   IDR 0046.

**Fora do escopo**: qualquer mudança em `Secao.css` (aplicação visual —
Tarefa 0026-0002); mudança na 2ª/3ª cor de qualquer bandeira além do que a
tabela do IDR 0046 já define — divergência encontrada na execução (ex.: uma
cor que pareça errada ao olhar o resultado) é nível 1/2: ajuste e registre
no log, sem reabrir o IDR.

## Decisões já tomadas (não reabrir)
- RGB, valores OKLCH e contraste de cada uma das 3 cores das 48 seleções —
  ver `docs/idr/0046-cores-de-selecoes.md` § "Cores das seleções"
- Cor original na moldura, cor ajustada no fundo tingido a 25% — ver
  `docs/idr/0046-cores-de-selecoes.md` § Decisão
- Cor muito escura é clareada (nunca evitada/substituída) — já aplicado
  nos valores da tabela (marcados "→ aj.")

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Paleta)

## Critérios de aceite
- [ ] As 48 seleções têm até 3 tokens de cor original, conforme a tabela
      do IDR 0046, sem token duplicado onde a 2ª e a 3ª cor coincidem
- [ ] Toda cor marcada "→ aj." na tabela tem também o token da versão
      ajustada
- [ ] `--selection-fwc` e `--selection-coc` não foram alterados
- [ ] `docs/interface.md` § Paleta reflete os tokens novos

## Validação
`npm run lint && npm run test && npm run build`.
Sem verificação visual própria — os tokens só ficam visíveis depois da
Tarefa 0026-0002, que os aplica em `Secao.css`.
