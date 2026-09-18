<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0034-0004: Aplica gradiente de cor ao selo `×N`

## Data
2026-09-18

## Resumo
O selo `×N` do cartão (unidades sobrando) deixa de usar a cor fixa
`--orange-card` e passa a interpolar de laranja `#D86000` (sobrando = 1) a
vermelho `#D80000` (sobrando ≥ 10), saturando no vermelho a partir de 10.
`Figurinha.jsx` calcula a cor a partir de `sobrando` (`Math.min(sobrando, 10)`
sobre a escala 1–10) e a entrega ao selo via variável CSS custom `--selo-cor`
no `style` inline; `Figurinha.css` passa a consumir `var(--selo-cor)` na cor do
texto e da borda (o fundo continua `--bg-deep`). O token `--orange-card`
permanece intacto para o estado "repetida" do cartão. Os `×` agregados dos
títulos não mudam. `docs/interface.md` § Medidas (selo) e a tabela de paleta
descrevem a cor variável, citando o IDR 0066.

## Discovery
- Código: `Figurinha.jsx:167` calcula `sobrando = Math.max(0, contagem - 1)` e
  `Figurinha.jsx:234-238` renderiza o selo (`aria-hidden`) só a partir de
  `contagem >= 2`; `Figurinha.css:190-204` fixa `.figurinha__selo` com
  `color`/`border` em `var(--orange-card)` e fundo `var(--bg-deep)`.
  `Figurinha` é memoizado por `propsEquivalentes` (`Figurinha.jsx:28-41`), que
  já compara `contagem` — a cor deriva dela, sem prop nova (TDR 0021). O token
  `--orange-card` vem de `theme.css:17` e também alimenta
  `.figurinha--repetida .figurinha__visual` (`Figurinha.css:171-176`).
  Testes existentes em `Figurinha.test.jsx` já cobrem o selo (`×1`, `×2`,
  largura fixa) e os três estados; não há teste de cor.
  Comportamento atual confere com a tarefa: selo em `--orange-card` fixo.
- Documentação: lido o IDR 0066 inteiro (faixa 1→10, cores `#D86000`/
  `#D80000` do IDR 0054, saturação em 10, só o selo do cartão), o IDR 0021
  (semântica `N` = contagem − 1, inalterada) e os trechos de `interface.md`
  § Estados do cartão (382-391), § Paleta (945-959) e § Medidas (1022-1127).
  As referências bastaram.

## Plano da alteração
1. `src/components/Figurinha.jsx`: função `corDoSelo(sobrando)` que interpola
   `#D86000`→`#D80000` em `Math.min(Math.max(sobrando, 1), 10)` e devolve hex
   maiúsculo; aplicar no `style` do `span.figurinha__selo` como `--selo-cor`.
2. `src/components/Figurinha.css`: `.figurinha__selo` troca `var(--orange-card)`
   por `var(--selo-cor)` na cor do texto e da borda; fundo segue `--bg-deep`.
3. `src/components/Figurinha.test.jsx`: testes da cor em sobrando 1 (`#D86000`),
   5 (intermediária, diferente das pontas) e 10/15 (`#D80000` iguais).
4. `docs/interface.md` § Medidas (selo) e tabela de paleta: descrever a cor
   variável e citar o IDR 0066.
- Verificação prevista: critérios por teste em `Figurinha.test.jsx` (valor de
  `--selo-cor` no `style` do selo) e por trecho/busca do IDR 0066 em
  `docs/interface.md`; `npm run lint && npm run test && npm run build`.
- Riscos: baixo — mudança local ao selo; a memoização é preservada porque
  `contagem` já entra em `propsEquivalentes`.
- Desvios: atualizar também a linha `--orange-card` da tabela de paleta (o
  selo deixa de usá-lo), além do § Medidas citado na tarefa — mesma
  consequência do IDR 0066, correção de exatidão documental; nível 1.

## Decisões tomadas
- Mecanismo: interpolar a cor em `Figurinha.jsx` e entregá-la por variável CSS
  custom `--selo-cor` no `style` inline — nível 1, já apontado como sugestão na
  tarefa, sem registro (o IDR 0066 delegou o mecanismo à tarefa).
- Interpolação linear canal a canal entre `#D86000` e `#D80000` (só o canal
  verde varia), saturando em `sobrando = 10` — nível 1, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — sem avisos (`oxlint`, saída vazia).
- `npm run test` — `Test Files 50 passed (50)`, `Tests 671 passed (671)`
  (668 antes; +3 do gradiente de cor do selo).
- `npm run build` — `vite build`, `✓ built in 952ms`. Único aviso,
  pré-existente (registrado nas Tarefas 0017-0001, 0023-0001, 0029-0001,
  0034-0001, 0034-0002 e 0034-0003):
  `(!) Some chunks are larger than 500 kB after minification.`
- Verificação visual: pendente — sem navegador nesta execução. Roteiro em
  `npm run dev`: incrementar uma figurinha até contagem 2 (selo `×1`, laranja),
  contagem 6 (`×5`, laranja-avermelhado intermediário) e contagem 11 (`×10`,
  vermelho), conferindo a progressão e a saturação ao passar de 10.

## Critérios de aceite
- [x] Selo com sobrando = 1 usa `#D86000` — teste "usa o laranja de referência
      com 1 sobrando" (`Figurinha.test.jsx`), `contagem=2` →
      `--selo-cor: #D86000`.
- [x] Selo com sobrando ≥ 10 usa `#D80000`, igual para 10 e valores maiores —
      teste "satura no vermelho máximo a partir de 10 sobrando, igual para 10 e
      valores maiores", `contagem=11` e `contagem=16` → `#D80000`.
- [x] Sobrando intermediário (5) usa cor entre as pontas, diferente de ambas —
      teste "interpola numa cor intermediária com 5 sobrando, diferente das
      pontas", `contagem=6` → `#D83500`, com asserções de diferença em relação
      a `#D86000` e `#D80000`.
- [x] Os `×` agregados dos títulos continuam sem gradiente — testes existentes
      de `Cabecalho`/`Secao`/`SuperGrupo` seguem passando (671 passed); nenhum
      toca `.figurinha__selo`.
- [x] `docs/interface.md` § Medidas (selo `×N`) descreve a cor variável e cita o
      IDR 0066 — item do § Medidas; linha do token `--orange-card` na tabela de
      paleta perde a menção ao selo.

## Arquivos alterados
- `src/components/Figurinha.jsx` — `corDoSelo` e `--selo-cor` inline no selo
- `src/components/Figurinha.css` — `.figurinha__selo` usa `var(--selo-cor)`
- `src/components/Figurinha.test.jsx` — testes do gradiente de cor do selo
- `docs/interface.md` — § Medidas e tabela de paleta descrevem a cor variável
- `docs/plano/0034-refinamentos-visuais-do-catalogo/0004-aplica-gradiente-de-cor-ao-selo.md` — status
- `docs/plano/README.md` — status da tarefa
