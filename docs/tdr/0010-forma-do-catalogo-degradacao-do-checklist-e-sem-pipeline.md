<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0010: Forma do catálogo, degradação da fonte do checklist e ausência de pipeline

## Status

Aceito

## Contexto

A Tarefa 0001-0002 (`docs/plano/0001-fundacao-catalogo-e-assets/0002-escrever-o-catalogo-do-album.md`)
pedia três decisões de implementação para `src/data/catalogo.js`, deixadas
em aberto pela própria tarefa e pelo `arquitetura.md`:

1. **Forma exata do dado**: um array de seções com expansão em tempo de
   carga, ou seções mais um índice de códigos já pré-expandido e
   versionado no arquivo.
2. **Fonte do checklist incompleta** (`requisitos.md` § Decisões
   Pendentes): faltam os nomes das figurinhas de cada seção, a página do
   FWC, a confirmação das posições fixas e a marcação de metalizadas além
   da 01 — nada disso bloqueia a implementação, mas precisa de um
   encaminhamento explícito.
3. **Pipeline de geração do catálogo** (`arquitetura.md` § Pontos em
   aberto): como o dado chega da fonte a `src/data/`.

## Decisão

**Forma do dado**: `src/data/catalogo.js` exporta `secoes` (as 50 seções,
com `sigla`, `nome`, `tipo`, `icone`, `grupo`, `paginas`, `total`
escritos à mão) e `figurinhas`, gerado a partir de `secoes` por
`expandirFigurinhas` — uma função pura, executada uma vez no carregamento
do módulo. Nenhum literal de figurinha é escrito à mão; o array de 994
nasce por expansão (`SIG01`…`SIG20`, `FWC01`…`FWC20`, `COC01`…`COC14`),
como o item 7 do escopo da tarefa pedia. As posições fixas de seleção
(`01` metalizada, `13` paisagem) são marcadas dentro da própria expansão,
por posição e por `tipo === "selecao"` — não há tabela separada de
exceções.

**Degradação da fonte do checklist ausente**: cada lacuna degrada
individualmente, sem bloquear a tarefa, como a tarefa já previa:

- **Nomes das figurinhas**: não entram no dado. A interface especificada
  não os exibe (`requisitos.md` § Conteúdo), então não há campo para
  eles — evita um dado morto que teria de ser mantido em sincronia com
  nada.
- **Página do FWC**: `paginas: null` na seção `FWC`. Quem renderizar o
  cabeçalho da seção trata `null` como "omitir o número" — comportamento
  que a Tarefa 0002 (tela) implementa, não este arquivo.
- **Metalizadas além da 01**: o campo `metalizada` existe em toda
  figurinha (`boolean`), mas só a posição `01` de cada seleção nasce
  `true`; nenhuma outra figurinha é marcada, correta ou incorretamente,
  na ausência da fonte. Quando o checklist completo aparecer, corrigir
  `expandirFigurinhas` (ou a lista de exceções que ela então precisar) é
  a única mudança necessária — o formato do dado já comporta a marcação
  por figurinha individual, não só por posição fixa.

**Ausência de pipeline de geração**: não há pipeline. `src/data/catalogo.js`
é escrito à mão a partir do Anexo de `requisitos.md` e da tabela de grupos
do IDR 0019, e a validação de que o dado bate com a fonte é papel dos
testes de invariantes da Tarefa 0001-0003 (994 códigos, 50 seções, 20 por
seleção, grupos e páginas por seleção) — não de um script de geração.

## Consequências

- Só o que varia por seção (sigla, nome, grupo, páginas, ícone) é
  literal no arquivo; o que varia por figurinha (código, posição,
  metalizada, paisagem) é sempre derivado — menos superfície para erro
  de transcrição nas 994 linhas que seriam necessárias sem a expansão.
- `figurinhas` é recalculado a cada carregamento do módulo (custo
  desprezível: 994 objetos simples, uma vez por sessão) — não há cache
  nem arquivo gerado para manter sincronizado.
- Quando a fonte do checklist completa aparecer, a mudança fica contida
  em `expandirFigurinhas` e/ou nos dados de `secoes`; nenhum consumidor
  do catálogo (Fase 2 em diante) precisa mudar, porque a forma dos campos
  (`metalizada`, `paginas` nulo) já é a definitiva.
- A ausência de pipeline significa que qualquer correção futura ao
  catálogo (ex.: sorteio de grupos mudar, checklist trazer mais dados) é
  uma edição manual revisada por PR, coberta pelos mesmos testes de
  invariantes — não uma re-geração automática.

## Alternativas consideradas

- **Seções + índice de códigos pré-expandido, versionado como literal**:
  tornaria o diff de qualquer ajuste (ex.: uma metalizada nova) enorme e
  opaco (994 linhas), contra a preferência explícita da tarefa por
  expansão programática.
- **Tabela de exceções separada para posições fixas** (em vez de
  calculá-las na expansão por `tipo` e `posicao`): mais um dado para
  manter coerente com `secoes`, sem necessidade — a regra ("01 e 13 de
  toda seleção") já é simples o bastante para expressar como condição.
- **Pipeline agora, ainda que simples** (ex.: script que lê um CSV do
  Anexo): overengineering para uma fonte que muda raramente e cujo
  conteúdo integral (as 48 seleções) já está disponível — adiado até que
  a fonte completa do checklist apareça e o volume de edições manuais
  justifique automatizar.
