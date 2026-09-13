<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0051: Pressão longa no cartão decrementa em tela sensível

## Status

Aceito — implementação na Fase 0013 (Tarefa 0013-0001).

## Contexto

- Tocar no cartão soma; tirar uma unidade exige mirar no controle de menos,
  de 18px no canto inferior esquerdo
  ([IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md)),
  alvo pequeno durante o cadastro em rajada.
- No toque, soltar logo e segurar são gestos distintos pelo tempo — um não
  atrasa o outro.
- No desktop, os candidatos equivalentes foram avaliados antes do
  planejamento e descartados (ver Alternativas).
- Segurar o dedo num elemento abre, por padrão, o menu do navegador
  (copiar, compartilhar) no Android e o callout no iOS.

## Decisão

- **Só em toque**: segurar o cartão, em qualquer ponto, por **500ms**
  decrementa uma unidade; mouse e caneta não acionam o gesto
- **Cancelamento**: mover o dedo mais de **10px** antes do limiar cancela —
  é rolagem, nada muda; soltar antes do limiar é o toque normal e soma
- **Retorno durante a espera**: o cartão escurece progressivamente até o
  limiar — sinal distinto do encolhimento instantâneo do toque rápido
  ([IDR 0042](0042-foco-visivel-e-area-de-toque.md))
- **Ao reconhecer**: exatamente um decremento, uma entrada no histórico de
  desfazer ([IDR 0012](0012-desfazer-no-cabecalho-historico-de-10.md)); o
  clique que o navegador gera ao soltar não soma
- **Contagem 0**: sem retorno de espera e sem efeito — o piso de 0 vale
  também para o gesto
- **Menu do navegador suprimido** no cartão em toque, no Android e no iOS
- Teclado (Enter/Espaço) segue somando direto; o controle de menos continua
  existindo — a pressão longa é um segundo caminho

## Consequências

- Remover uma unidade no celular dispensa mirar no canto do cartão
- O gesto não tem dica visível: é atalho para o especialista
  ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)); o controle de
  menos continua sendo o caminho descobrível
- Seleção de texto e menu do navegador deixam de existir no cartão em toque
  — o cartão nunca teve texto a copiar

## Alternativas consideradas

- **Duplo clique no desktop**: atrasaria todo clique simples para
  desambiguar
- **Clique direito no desktop**: conflita com o menu de contexto esperado e
  não existe em trackpad sem configuração
- **Clique do botão do meio**: botão ausente ou inacessível em muitos
  mouses e trackpads
- **Limiar de 400ms**: mais rápido, com mais decremento acidental ao
  começar a rolar sobre um cartão
- **Anel dourado se preenchendo como retorno**: mais visível, mas é um
  elemento novo sobre um cartão já denso
- **Vibração ao reconhecer**: descartada no planejamento; o retorno visual
  basta
- **Dica de descoberta** (menu ou aviso único): contraria o minimalismo do
  IDR 0018

## Histórico

- 2026-09-13 — Criado no planejamento revisado das Fases 11–17; as
  alternativas de desktop, antes descritas só no README do plano, passam a
  morar aqui.
