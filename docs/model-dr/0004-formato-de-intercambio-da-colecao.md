<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0004: Formato de intercâmbio da coleção

## Status

Aceito.

## Contexto

- A coleção precisa ser exportável e importável em JSON, para portabilidade (sem lock-in).
- O formato deve ser lossless, sem dados pessoais (nada de uid, e-mail, nome ou foto).
- O catálogo pode mudar entre a exportação e a importação (figurinhas adicionadas ou removidas).

## Decisão

- **JSON com três campos**: `versao` (inteiro, começando em 1), `geradoEm` (ISO 8601), `contagens` (mapa esparso, mesmo formato do Firestore — chave ausente = contagem 0, zeros nunca aparecem).
- **Exportação**: lê o estado em memória, zero requisição ao Firestore.
- **Importação**: valida o arquivo inteiro antes de aplicar; recusa quando: não é JSON válido; a raiz não é um objeto JSON (array é recusado); `versao` não é a conhecida; `contagens` está ausente, não é um objeto JSON ou é um array; ou algum valor de `contagens` não é um inteiro entre 1 e 99.
- **Normalizações não recusam o arquivo**: valor exatamente `0` some silenciosamente (mapa esparso); código fora do catálogo atual (`codigosValidos`) some e entra na contagem de `descartadas`, avisada ao usuário.
- **Nome de arquivo previsível e ordenável**: `iconula-AAAA-MM-DD.json`, na data local de quem exporta.

### Fronteira de validação

- **`validarImportacao`** (em `portabilidade.js`) é a única função que valida o conteúdo do arquivo — recusa ou normaliza antes de qualquer gravação.
- **`gravarImportacao`** (em `colecaoRemota.js`) não valida nada — confia que o mapa já chega normalizado (sem zeros, sem códigos desconhecidos, valores 1–99). Se alguém chamar `gravarImportacao` diretamente sem passar por `validarImportacao`, dado inválido chega ao Firestore.
- **`App.jsx`** é o ponto que conecta as duas: chama `validarImportacao` primeiro e, só se o resultado for `'valido'`, passa o mapa normalizado para `gravarImportacao`.

## Consequências

- O formato é versionado (`versao`): uma mudança futura de formato troca a versão e o dado antigo é recusado em vez de mal interpretado.
- O catálogo pode mudar sem quebrar a importação de arquivos antigos (códigos desconhecidos são descartados, não recusam o arquivo).
- Zero requisição ao Firestore para exportar; 1 escrita para importar (substitui `contagens` + `updatedAt` via `mergeFields`, ver [MDR 0003](0003-gravacao-agregada-da-colecao.md)).
- A validação é responsabilidade do chamador — `gravarImportacao` grava o que recebe.

## Alternativas consideradas

- **Sem versão**: uma mudança de formato poderia ser mal interpretada. Descartado.
- **Recusar arquivo com códigos desconhecidos**: o catálogo pode mudar entre exportação e importação, e isso não é motivo para recusar o resto de um arquivo válido. Descartado.
- **Incluir dados pessoais (uid, e-mail)**: violaria a portabilidade sem lock-in e a privacidade. Descartado.
