<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0001-0002: escrever o catálogo do álbum em `src/data/`

## Data
2026-09-09

## Resumo
Criado `src/data/catalogo.js`, exportando `secoes` (as 50 seções: as 48
seleções transcritas do Anexo de `docs/requisitos.md`, mais os especiais
`FWC` e `COC`) e `figurinhas` (as 994 figurinhas, geradas por expansão
programática das seções via a função pura `expandirFigurinhas`, em vez de
escritas como literais).

As 48 seleções foram transcritas na mesma ordem do Anexo (alfabética por
código), sem reordenar e sem inventar linha. O grupo de cada seleção foi
conferido, linha a linha, contra a tabela "A composição dos grupos" do
IDR 0019 — as duas fontes concordam para as 48 seleções, sem exceção;
não houve necessidade de parar por divergência.

`FWC` (Extras FIFA, 20 figurinhas, `paginas: null` — pendência do
checklist) abre o array e `COC` (Coca-Cola, 14 figurinhas, páginas
112–113) o fecha, refletindo o IDR 0028. As posições fixas de seleção
(`01` metalizada, `13` paisagem) nascem marcadas na expansão, condicionadas
a `tipo === "selecao"` — os especiais não recebem essas marcas.

Conferência manual das amostras pedidas na tarefa, via script descartável
que importou o módulo (`node` sobre um arquivo temporário na raiz do
projeto, removido depois):
- `BRA`: grupo `C`, páginas `[24, 25]` — confere
- `MEX`: grupo `A`, páginas `[8, 9]` — confere
- `PAN`: grupo `L`, páginas `[104, 105]` — confere
- `COC`: 14 figurinhas — confere
- 50 seções, 994 códigos únicos, 48 metalizadas (uma por seleção), 48
  paisagens (uma por seleção), 12 grupos de 4 seleções cada — todos
  conferem

## Decisões tomadas
Três decisões de nível 1 (mudam a forma do dado que as fases seguintes
consomem), registradas em
[TDR 0010](../../../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)
no momento em que foram tomadas:
1. Forma do dado: `secoes` escrita à mão + `figurinhas` derivada por
   função pura de expansão, com as posições fixas marcadas na própria
   expansão (sem tabela de exceções separada).
2. Degradação da fonte do checklist ausente: nomes de figurinha não
   entram no dado; `paginas: null` no FWC; `metalizada` só verdadeiro na
   posição 01 de cada seleção, com o campo já pronto para receber o
   restante quando a fonte aparecer.
3. Sem pipeline de geração: o arquivo é escrito à mão a partir do Anexo
   de `requisitos.md` e do IDR 0019; a validação de conteúdo é papel dos
   testes de invariantes da Tarefa 0001-0003.

Um quarto achado, fora do escopo do catálogo mas necessário para fechar
esta tarefa, também virou TDR:

4. **Bug pré-existente descoberto ao tentar commitar o log**: a regra
   `logs` (sem `/`) em `.gitignore` casa em qualquer profundidade e
   ignorava `docs/plano/*/logs/`, incluindo o log da Tarefa 0001-0001,
   que por isso nunca chegou a ser commitado apesar de citado como
   critério de aceite cumprido. Corrigido para `/logs` (só a raiz) em
   [TDR 0011](../../../tdr/0011-gitignore-nao-pode-ignorar-logs-do-plano.md);
   o log órfão da Tarefa 0001-0001 entra no controle de versão nesta
   mesma alteração.

## Impedimentos
Nenhum. O caso concreto previsto pela tarefa (divergência entre o Anexo
de `requisitos.md` e a tabela de grupos do IDR 0019) foi conferido e não
ocorreu — os grupos batem seleção por seleção nas duas fontes.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros nem avisos.
- `vitest run`: 6 arquivos de teste, 29 testes, todos passando (suíte
  existente — esta tarefa não adicionou testes; os de invariantes do
  catálogo são a Tarefa 0001-0003).
- `vite build`: build de produção concluído com sucesso em 620ms (mesmo
  aviso pré-existente sobre chunk grande do SDK do Firestore, não
  relacionado a esta tarefa). `catalogo.js` ainda não tem consumidor em
  tela, então não aparece nos assets gerados — esperado, é fora do
  escopo desta tarefa (Fase 2 consome).

Conferência manual de conteúdo (fora do escopo de `npm run test`, que
ainda não cobre o catálogo — ver Tarefa 0001-0003): amostras `BRA`, `MEX`,
`PAN`, `COC` e as contagens agregadas, listadas no Resumo acima.

## Arquivos alterados
- `src/data/catalogo.js` — criado
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md` — criado
- `docs/tdr/0011-gitignore-nao-pode-ignorar-logs-do-plano.md` — criado
- `.gitignore` — regra `logs` restrita à raiz (`/logs`), para não ignorar `docs/plano/*/logs/`
- `docs/plano/0001-fundacao-catalogo-e-assets/logs/0001-log-registrar-o-plano-no-agents.md` — entra no controle de versão (órfão desde a Tarefa 0001-0001 por causa do bug do `.gitignore`)
- `docs/plano/0001-fundacao-catalogo-e-assets/0002-escrever-o-catalogo-do-album.md` — status e critérios de aceite atualizados
- `docs/plano/README.md` — status da tarefa 0002 atualizado
- `docs/plano/0001-fundacao-catalogo-e-assets/logs/0002-log-escrever-o-catalogo-do-album.md` — este log
