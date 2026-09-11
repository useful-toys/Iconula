<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0040: Exportar sem diálogo, com nome de arquivo datado

## Status

Aceito.

## Contexto

`docs/interface.md` § Demais telas deixa em aberto o desenho do diálogo de
exportação ("a preencher quando desenhados: os diálogos de exportação e
importação — o menu de ações define a porta de entrada, não o diálogo").
`docs/requisitos.md` § Portabilidade exige o comando "disponível sempre,
sem etapas adicionais", a dois toques de qualquer ponto da tela.

A Tarefa 0009-0004 precisa fechar essa lacuna para exportar de fato, e
também decidir o nome do arquivo baixado — `requisitos.md` não especifica
um.

## Decisão

- **Sem diálogo de exportação**: escolher o comando no menu já baixa o
  arquivo direto e emite o aviso de sucesso "Coleção exportada" — a
  segunda etapa que um diálogo de confirmação criaria é exatamente o que
  "sem etapas adicionais" proíbe. Não existe pergunta a fazer antes de
  exportar (não é destrutivo, não tem custo, não perde dado).
- **Nome do arquivo**: `iconula-AAAA-MM-DD.json`, com a data local de
  quem exporta — previsível (mesmo prefixo sempre) e ordenável
  lexicograficamente por data, útil para quem guarda várias exportações
  ao longo do tempo.

## Consequências

- Exportar continua sendo dois toques (abrir o menu, escolher "Exportar")
  — nenhuma etapa a mais
- Duas exportações no mesmo dia local produzem o mesmo nome de arquivo; o
  navegador resolve a colisão como resolve qualquer download repetido
  (acrescenta um sufixo numérico) — comportamento do navegador, não do
  app, e não vale a pena complicar o nome para evitá-lo
- A data do nome do arquivo é local; o `geradoEm` **dentro** do arquivo é
  UTC (`Date#toISOString()`), como todo carimbo ISO 8601 do app — as duas
  datas podem diferir perto da meia-noite, o que é aceito: uma é rótulo
  de arquivo, a outra é o dado versionado de fato

## Alternativas consideradas

- **Diálogo de confirmação antes de exportar**: contraria "sem etapas
  adicionais" de `requisitos.md`, e não há nada a confirmar (a operação
  não é destrutiva)
- **Nome de arquivo com hora além da data** (`iconula-2026-09-11T14-05.json`):
  mais preciso para exportações repetidas no mesmo dia, mas menos legível
  e sem necessidade prática — a colisão já é tratada pelo navegador
- **Nome de arquivo fixo, sem data** (`iconula.json`): mais simples, mas
  cada exportação nova sobrescreveria a anterior na pasta de downloads
  sem aviso — pior para quem exporta mais de uma vez
