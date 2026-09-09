<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0003-0004]: faixa de bandeiras e salto para seção

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` § Decisão e § Consequências — a faixa com as 50 seções, a rolagem horizontal e o nome acessível de cada ícone
- `docs/idr/0014-salto-direto-para-secao.md` § Decisão — o salto move o percurso e nunca filtra a vista
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Status — a faixa é a **única** exceção autorizada à regra do scroll
- `docs/interface.md` § Cabeçalho — a faixa é a última linha do cabeçalho, abaixo dos controles
- `docs/interface.md` § Medidas — ícones de 30×30px, raio 8px, fundo `--panel`, espaçamento 8px, glifo em 15px
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão — a ordem dos ícones acompanha o catálogo: 🏆 no início, 🥤 no fim
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão — o salto expande super-grupo e seção no caminho

## Objetivo
Entregar o atalho de percurso: uma linha de ícones no cabeçalho que salta até
qualquer uma das 50 seções, expandindo o que estiver fechado no caminho. O
catálogo permanece inteiro antes e depois do salto — salto não é filtro.

## Padrões e convenções aplicáveis
- A faixa é a única exceção ao scroll único, e só na horizontal: uma linha rasa,
  nunca rolagem vertical aninhada — `docs/idr/0008-*` § Status e `docs/idr/0016-*`
- Cada ícone é um **botão** com nome acessível (o nome da seção), não uma imagem
  clicável — `docs/idr/0016-*` § Decisão
- A ordem dos ícones acompanha a ordenação vigente, sempre com 🏆 no início e
  🥤 no fim — `docs/idr/0028-*` § Decisão
- O salto expande o super-grupo e a seção colapsados no caminho até o alvo —
  `docs/idr/0020-*` § Decisão
- A bandeira é Twemoji vendorizada renderizada como `<img>`; nada de
  `dangerouslySetInnerHTML` — `docs/adr/0002-*` e `docs/tdr/0003-*`
- Saltar custa zero requisição e não altera a coleção —
  `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Criar o componente da faixa em `src/components/`, como última linha do
   cabeçalho: 50 botões de 30×30px com a bandeira da seleção ou o ícone temático
   do especial, 8px de espaçamento, rolagem horizontal quando não couber.
2. Tocar num ícone rola a página até o cabeçalho da seção correspondente, deixando
   o cabeçalho sticky sem cobrir o título da seção alvo (compensar a altura do
   cabeçalho no cálculo do destino).
3. Antes de rolar, expandir o super-grupo e a seção alvo, se estiverem colapsados.
4. **Pendência de interface: salto para seção ocultada pelo filtro**
   (`interface.md` § Pendências de interface, aberta pelo IDR 0025) — resolver
   assim: se o filtro vigente oculta a seção alvo, o salto **volta o filtro para
   "todas"** e então rola até ela. A faixa lista sempre as 50 seções, e um toque
   que não move nada seria pior que perder o filtro. Registrar como **IDR**.
   Como o filtro só chega na Tarefa 0004-0004, deixar o ponto de extensão pronto e
   fechar o comportamento lá; registrar o IDR já nesta tarefa.
5. Nome acessível por ícone com o nome da seção por extenso ("saltar para Brasil",
   "saltar para Extras FIFA"); a imagem em si é decorativa (`aria-hidden`).
6. Operação por teclado: os botões entram na ordem de tabulação e o foco não pode
   ficar preso na faixa.

**Fora do escopo**: o filtro em si (Tarefa 0004-0004); destacar o ícone da seção
visível durante a rolagem — não é pedido por nenhum registro; a área de toque
ampliada dos ícones (Tarefa 0009-0001).

## Decisões já tomadas (não reabrir)
- O mecanismo do salto é a faixa de bandeiras, e não combobox ou busca — ver `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- O salto nunca filtra a vista; o catálogo permanece inteiro — ver `docs/idr/0014-salto-direto-para-secao.md`
- A rolagem horizontal da faixa é exceção autorizada — ver `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Status
- Ícones dos especiais: 🏆 e 🥤 — ver `docs/requisitos.md` § Catálogo

## Decisões em aberto nesta tarefa
- Salto para seção oculta pelo filtro — encaminhamento no passo 4; nasce um **IDR**
- Se a faixa rola até deixar o ícone alvo visível depois do salto —
  encaminhamento: sim, alinhar o ícone alvo na faixa, para o usuário ver onde
  está; consta no mesmo IDR

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/components/FaixaDeSecoes.jsx` — criar
- `src/components/FaixaDeSecoes.test.jsx` — criar
- `src/components/Cabecalho.jsx` — modificar
- `src/components/Catalogo.jsx` — modificar (expandir e rolar até o alvo)
- `docs/idr/00NN-salto-com-filtro-ativo.md` — criar

## Critérios de aceite
- [ ] A faixa lista as 50 seções, com 🏆 no início e 🥤 no fim, nas duas ordenações
- [ ] Tocar num ícone rola até a seção, sem que o cabeçalho sticky cubra o título dela
- [ ] Saltar para uma seção colapsada dentro de um super-grupo colapsado expande os dois
- [ ] Cada ícone é botão com nome acessível por extenso; a imagem é decorativa
- [ ] A faixa rola só horizontalmente; nenhum outro componente ganhou rolagem própria
- [ ] O catálogo continua inteiro depois do salto — nada é filtrado ou escondido
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0004-log-faixa-de-bandeiras-e-salto.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: em janela estreita a faixa rola para os
lados; saltar do topo para 🥤 leva ao fim do catálogo e o cabeçalho da Coca-Cola
aparece inteiro; navegar por teclado até um ícone e acionar com Enter tem o mesmo
efeito do toque.
