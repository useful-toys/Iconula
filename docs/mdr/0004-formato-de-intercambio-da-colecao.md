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
- **Importação**: valida o arquivo inteiro antes de aplicar; recusa quando: não é JSON válido; não é um objeto; `versao` não é a conhecida; `contagens` está ausente ou não é um objeto; ou algum valor de `contagens` não é um inteiro entre 1 e 99.
- **Normalizações não recusam o arquivo**: valor exatamente `0` some silenciosamente (mapa esparso); código fora do catálogo atual (`codigosValidos`) some e entra na contagem de `descartadas`, avisada ao usuário.
- **Nome de arquivo previsível e ordenável**: `iconula-AAAA-MM-DD.json`, na data local de quem exporta.

## Consequências

- O formato é versionado (`versao`): uma mudança futura de formato troca a versão e o dado antigo é recusado em vez de mal interpretado.
- O catálogo pode mudar sem quebrar a importação de arquivos antigos (códigos desconhecidos são descartados, não recusam o arquivo).
- Zero requisição ao Firestore para exportar; 1 escrita para importar (substitui `contagens` + `updatedAt`).

## Alternativas consideradas

- **Sem versão**: uma mudança de formato poderia ser mal interpretada. Descartado.
- **Recusar arquivo com códigos desconhecidos**: o catálogo pode mudar entre exportação e importação, e isso não é motivo para recusar o resto de um arquivo válido. Descartado.
- **Incluir dados pessoais (uid, e-mail)**: violaria a portabilidade sem lock-in e a privacidade. Descartado.
