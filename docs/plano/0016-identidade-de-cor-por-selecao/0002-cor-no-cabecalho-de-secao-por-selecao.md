<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0016-0002]: cor no cabeçalho de seção por seleção

## Status
Concluída

## Objetivo
Aplicar a cor da seleção no cabeçalho de cada seção — borda completa de 1px e
fundo com 15% da cor sobre `--panel` —, nas duas ordenações e disposições;
FWC e COC com as suas cores.

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § Decisão — borda 1px no lugar de
  `--border`, fundo 15% sobre `--panel`, duas disposições, alias dos
  especiais
- `src/theme.css` — `--selection-*` (gerados pela Tarefa 0016-0001)
- `src/components/Secao.jsx` — `button.secao__cabecalho`; recebe a seção
  com `sigla`
- `src/components/Secao.css` — `.secao__cabecalho` com borda `--border` e
  fundo `--panel`
- `docs/tdr/0021-desempenho-do-catalogo.md` — comparador de `memo` da `Secao`
- `docs/adr/0008-css-modular-por-componente.md` — nomenclatura
- `docs/interface.md` § Medidas — linha "Cabeçalho de seção"

## Padrões e convenções aplicáveis
- Raio, padding, texto `--cream` e números `--muted` não mudam — IDR 0046
- Cor nunca é o único sinal: bandeira, nome e sigla seguem — `docs/requisitos.md`
  § Requisitos Não Funcionais
- CSS modular por componente — ADR 0008

## Escopo e instruções de implementação
1. Em `Secao.jsx`, uma classe modificadora pela sigla da seção (48 seleções,
   FWC e COC).
2. Em `Secao.css`, cada classe troca a borda do cabeçalho por 1px na cor da
   seleção e pinta o fundo com 15% dela misturada a `--panel`.
3. Testes em `Secao.test.jsx`: seleções, FWC e COC recebem as suas classes,
   nas duas disposições.
4. Em `docs/interface.md` § Medidas, a linha do cabeçalho de seção passa a:
   painel com borda de 1px e fundo 15% na cor da seleção — citando o IDR 0046.

**Fora do escopo**: faixa de bandeiras e título do super-grupo (Fase 15);
ícone, chevron, tipografia e padding do cabeçalho.

## Decisões já tomadas (não reabrir)
- Borda, fundo, duas disposições e repetições aceitas — ver
  `docs/idr/0046-cores-de-selecoes.md`
- Padding do cabeçalho `7px 12px` — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`

## Arquivos impactados
- `src/components/Secao.jsx`, `src/components/Secao.css`,
  `src/components/Secao.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Cada cabeçalho com borda 1px e fundo 15% da cor da sua seleção; FWC e
      COC com as suas (teste da classe e CSS)
- [ ] Vale nas disposições lista e álbum (teste)
- [ ] Texto `--cream`, números `--muted`, raio e padding inalterados (diff)
- [ ] `docs/interface.md` § Medidas descreve o cabeçalho citando o IDR 0046

## Validação adicional
Verificação visual em `npm run dev`, nas duas ordenações e disposições:
cabeçalhos das 48 seleções legíveis, FWC dourado e COC vermelho-marca.
