<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0034-0004]: Aplica gradiente de cor ao selo `×N`

## Status
Pendente

## Objetivo
O selo `×N` do cartão (unidades sobrando) passa a variar de cor entre
laranja e vermelho conforme o valor sobrando cresce de 1 a 10, saturando
no vermelho a partir de 10 — no lugar da cor fixa atual.

## Documentos de referência
- `docs/idr/0066-gradiente-de-cor-do-selo-conforme-sobrando.md` —
  decisão completa (cores, faixa, escopo)
- `docs/idr/0021-selo-conta-unidades-sobrando.md` — semântica do `N`
  (sobrando = contagem − 1), inalterada
- `src/components/Figurinha.jsx` — `sobrando`, span `figurinha__selo`
  (`aria-hidden`, só a partir de `contagem >= 2`)
- `src/components/Figurinha.css` — `.figurinha__selo` (cor/borda em
  `--orange-card` fixo)

## Padrões e convenções aplicáveis
- Cor nunca é o único sinal de estado (`docs/requisitos.md` § Requisitos
  Não Funcionais): já atendido — o nome acessível
  (`estadoLabel`/`nomeAcessivel`) lê o número por extenso, independente
  do selo.
- `Figurinha` é memoizado por `propsEquivalentes` (`contagem` já entra na
  comparação — TDR 0021); a cor deriva de `contagem`/`sobrando`, sem
  precisar de prop nova.

## Escopo e instruções de implementação
1. Definir a interpolação entre `#D86000` (sobrando = 1) e `#D80000`
   (sobrando ≥ 10), saturando no vermelho para valores maiores. Sugestão
   de mecanismo: calcular a cor em `Figurinha.jsx` a partir de `sobrando`
   (ex.: `Math.min(sobrando, 10)` sobre uma escala 1–10) e aplicá-la via
   `style` inline numa variável CSS custom (ex.: `--selo-cor`), consumida
   por `.figurinha__selo` no lugar de `--orange-card`.
2. `.figurinha__selo` passa a usar essa variável para cor do texto e da
   borda (fundo continua `--bg-deep`).
3. `--orange-card` permanece como está, usado em outros lugares (estado
   "repetida" do cartão) — não remover nem redefinir esse token.
4. Os `×` agregados dos títulos (placar, super-grupo, seção) não mudam —
   continuam na cor de texto atual.
5. `docs/interface.md` § Medidas (selo `×N`): troca `--orange-card` fixo
   pela descrição da cor variável, citando o IDR 0066.

**Fora do escopo**: gradiente nos `×` agregados dos títulos; reforçar o
nome acessível a partir de sobrando ≥ 10 (recusado no esmiuçamento).

## Decisões já tomadas (não reabrir)
- Faixa (sobrando 1→10, saturando em 10) e cores (`#D86000`→`#D80000`) —
  ver `docs/idr/0066-gradiente-de-cor-do-selo-conforme-sobrando.md`
- Semântica de `N` = sobrando — ver
  `docs/idr/0021-selo-conta-unidades-sobrando.md` (inalterado)

## Arquivos impactados
- `src/components/Figurinha.jsx` — modificar (cálculo/entrega da cor do
  selo)
- `src/components/Figurinha.css` — modificar (`.figurinha__selo` usa a
  variável em vez de `--orange-card`)
- `src/components/Figurinha.test.jsx` — modificar: testes cobrindo a cor
  (ou a variável/estilo computado) em sobrando = 1, num valor
  intermediário (ex.: 5) e em sobrando ≥ 10 (ex.: 10 e 15, mesma cor
  máxima)
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Selo com sobrando = 1 usa a cor laranja de referência (`#D86000`) —
      coberto por teste
- [ ] Selo com sobrando ≥ 10 usa a cor vermelha máxima (`#D80000`),
      igual para 10 e para valores maiores — coberto por teste
- [ ] Selo com sobrando intermediário (ex.: 5) usa uma cor entre as duas
      pontas, diferente de ambas — coberto por teste
- [ ] Os `×` agregados dos títulos continuam sem gradiente — coberto por
      teste existente que continua passando
- [ ] `docs/interface.md` § Medidas descreve a cor variável e cita o
      IDR 0066

## Validação adicional
- Roteiro visual em `npm run dev`: incrementar uma figurinha até sobrando
  1, 5 e 10+ e conferir a progressão de cor do selo.
