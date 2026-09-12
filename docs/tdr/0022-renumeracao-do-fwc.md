<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0022: Renumeração da seção FWC para começar em zero

## Status

Aceito — implementa a Tarefa 0014-0001.

## Contexto

O catálogo nasceu, por decisão do
[TDR 0010](0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md),
com a seção `FWC` expandida de `FWC01` a `FWC20`. A numeração oficial dos 20
especiais do álbum Panini da Copa 2026, porém, vai de **`FWC00` a `FWC19`**:
é indexada a partir de zero e o primeiro cartão é o logo da Panini (00),
seguido do emblema oficial em duas partes (1–2), mascotes (3), slogan (4),
bola oficial Trionda (5), três cartões de países-sede (6–8) e onze campeãs
históricas do FIFA Museum (9–19). A numeração correta foi confirmada por
múltiplas fontes independentes, depois que uma primeira leitura desta
pendência citou por engano dados do álbum do Catar 2022.

Não é uma expansão: é um **deslocamento de um**. A quantidade de figurinhas
do `FWC` não muda (continuam 20) e o catálogo inteiro continua com **994**;
não há mudança no teto das regras do Firestore nem nos documentos que citam
esse total. O que muda é só o código: o `FWC01` de hoje passa a significar o
que hoje é `FWC02`, e assim por diante; `FWC00` passa a existir; `FWC20`
deixa de existir. A decisão de implementação em aberto na tarefa era **como
o dado expressa uma numeração que não começa em 1**.

**Confirmado com o humano** que não há uso real em produção sob os códigos
antigos. Sem essa confirmação, a troca do gerador reinterpretaria
contagens já gravadas — impedimento que a própria tarefa manda parar e
reabrir.

## Decisão

1. **Campo `inicio` na seção** (`src/data/catalogo.js`): opcional, com
   padrão `1`, é o número da primeira figurinha da seção. `total` continua
   significando a **quantidade** de figurinhas, nunca o último número.
   `expandirFigurinhas` gera `posicao` de `inicio` a `inicio + total − 1` e
   o código segue sendo a sigla mais o número com dois dígitos
   (`padStart(2, "0")`) — o que produz `FWC00` no mesmo formato dos demais
   códigos (`BRA01`, `COC14`).
2. **A seção `fwc` ganha `inicio: 0`**, mantendo `total: 20` e `paginas:
   null` (TDR 0010); nenhum outro campo muda. `metalizada` e `paisagem`
   continuam presos a `tipo === "selecao"`, e o `FWC` nunca teve nenhum dos
   dois.
3. **Sem migração de dado**: não há contagem real gravada sob os códigos
   antigos, então a troca do gerador é inócua para os documentos existentes.
   A decisão fica explícita aqui e no log da tarefa para não ficar
   implícita; se surgir indício de uso real antes da execução, a tarefa
   para e reabre a pergunta (impedimento nível 3 — irreversível).

## Consequências

- O `FWC` passa a listar `FWC00`…`FWC19`, sem buraco; o catálogo continua
  com 994 figurinhas e as seleções (20 cada) e o COC (14) ficam intactos.
- O campo `inicio` é genérico: qualquer seção futura cuja numeração oficial
  comece fora de 1 se expressa só com `inicio`, sem escrever os códigos como
  literais (o que contraria o TDR 0010) nem abrir uma exceção por seção.
- A interface não muda: o cabeçalho do placar continua somando 994, e a
  leitura do `FWC` no cartão passa a exibir `FWC 00`…`FWC 19`. Os textos de
  troca que imprimem o número cru são corrigidos à parte, na Tarefa
  0014-0002.
- Gatilho de revisão: se algum dado real aparecer gravado sob `FWC20` (o
  código que deixa de existir), é preciso uma migração — hoje descartada por
  ausência de uso.

## Alternativas consideradas

- **Escrever os 20 códigos do `FWC` como literais** (`FWC00`…`FWC19`): abriria
  exceção à expansão programática decidida no TDR 0010 para uma seção só, e
  reintroduziria a superfície de erro de transcrição que a expansão evita.
- **Campo booleano `comecaEmZero`**: resolveria só o caso do zero, sem
  expressar qualquer outro início de faixa; `inicio` cobre o mesmo caso com
  a mesma simplicidade e é mais geral.
- **Campo `ultimo` (último número) em vez de `total` + `inicio`**: exigiria
  reinterpretar `total`, que hoje já significa quantidade em todas as 50
  seções, e tornaria a checagem de "20 figurinhas" uma conta de subtração em
  vez de um campo direto.
- **Manter `FWC20` e só acrescentar `FWC00`** (21 figurinhas): contraria a
  numeração real — não existe cartão `FWC20` — e mudaria o total do catálogo
  para 995, tocando regras e documentos que a tarefa põe fora de escopo.
