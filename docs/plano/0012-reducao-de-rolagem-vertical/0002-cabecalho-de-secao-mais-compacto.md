<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0002]: cabeçalho de seção mais compacto

## Status
Pendente

## Objetivo
Reduzir a altura do cabeçalho de cada seção — repetido 50 vezes no catálogo —
sem comprometer a legibilidade do resumo nem a área de toque do botão de
colapso, e escolher o registro que lastreia as medidas compactadas desta fase.

## Documentos de referência
- `docs/interface.md` § Medidas — "Cabeçalho de seção: painel com borda, raio
  12px, `padding: 10px 14px`; ícone 18px, nome 14px/600"
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão — as
  medidas do protótipo, transcritas em `interface.md`
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — a área de toque
  ampliada cobre só os alvos pequenos (30×30px e o controle de menos); o
  cabeçalho de seção não está entre eles
- `src/components/Secao.jsx` — o cabeçalho de seção é um botão de largura
  total (`.secao__cabecalho`)
- `src/components/Secao.css` (`.secao__cabecalho`) — implementação

## Padrões e convenções aplicáveis
- O cabeçalho continua um único `<button>` clicável em toda a largura, com
  altura suficiente para toque sem precisar da área ampliada do IDR 0042 —
  `src/components/Secao.jsx`
- Ícone e chevron continuam presentes: carregam identidade e estado, e cor
  nunca é o único sinal — `docs/requisitos.md` § Requisitos Não Funcionais
- Ícone (18px) e tipografia (14px/600) não mudam — `docs/interface.md`
  § Medidas

## Escopo e instruções de implementação
1. Reduzir `padding` de `.secao__cabecalho` (`src/components/Secao.css`) de
   `10px 14px`, partindo de `7px 12px`; o valor final é o menor que mantém o
   botão confortável de tocar e o texto sem encostar na borda.
2. Medir a altura do cabeçalho antes e depois e registrar a economia
   (px × 50 seções) no log.
3. Registrar o lastro das medidas compactadas da fase e atualizar
   `docs/interface.md` § Medidas, citando-o (ver "Decisões em aberto").

**Fora do escopo**: mudar o tamanho do ícone, do chevron ou da tipografia;
mudar a borda ou o raio do painel; os espaçamentos entre blocos (Tarefa
0012-0003) e a margem inferior do corpo (Tarefa 0012-0004).

## Decisões já tomadas (não reabrir)
- Cabeçalho de seção como botão de largura total, painel com borda e raio
  12px, ícone 18px, nome 14px/600 — ver `docs/interface.md` § Medidas

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
  § Decisão — "as medidas são as do protótipo" → acrescenta a compactação
  vertical do catálogo como ajuste feito em uso (começando pelo padding do
  cabeçalho de seção), com entrada em `## Histórico`. Se, pelo guia
  `docs/idr/CLAUDE.md`, a compactação for decisão genuinamente nova, nasce um
  IDR sobre a compactação vertical do catálogo. **O registro escolhido é o que
  as Tarefas 0012-0003 e 0012-0004 atualizam**; o log desta tarefa diz qual é.

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` — modificar (ou
  `docs/idr/` — criar, conforme a decisão em aberto)

## Critérios de aceite
- [ ] Cabeçalho de seção mais baixo, sem cortar ícone, texto ou chevron
- [ ] Continua confortável de tocar em tela sensível
- [ ] Economia total (px × 50 seções) registrada no log
- [ ] O log diz qual registro lastreia as medidas compactadas da fase

## Validação adicional
Verificação visual em `npm run dev`, em largura de celular: rolar por vários
super-grupos e conferir que os cabeçalhos continuam legíveis e fáceis de
tocar.
