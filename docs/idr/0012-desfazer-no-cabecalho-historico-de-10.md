<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0012: Desfazer no cabeçalho, histórico das últimas 10

## Status

Aceito.

## Contexto

O [IDR 0010](0010-desfazer-ajustes-em-vez-de-confirmacoes.md) definiu o
comando desfazer — reverter a última alteração, repetível para as N
últimas — mas deixou como pendência o lugar na tela e a profundidade do
histórico. Candidatos de lugar: botão fixo no cabeçalho, barra flutuante
estilo toast após cada ajuste, ou botão junto ao último cartão ajustado.
O registro em rajada (abrir envelope e lançar 7 números) é o caso de uso
dominante e descarta designs que reajam a cada toque.

## Decisão

- O comando desfazer é um botão no cabeçalho (que pode ser sticky),
  sempre visível quando há histórico — desabilitado quando não há
- Repetido, desfaz as alterações em ordem inversa
- O histórico guarda as **últimas 10** alterações, em memória;
  recarregar a página o descarta

## Consequências

- Sem ruído em rajada: o botão é fixo, não surge a cada ajuste
- Limite finito simplifica memória e testes; 10 cobre sequências de
  erro típicas (um envelope lançado na seção errada, por exemplo)
- Perder o histórico ao recarregar é aceito: a gravação agregada
  ([IDR 0003](0003-gravacao-agrega-ajustes.md)) já persistiu os ajustes
- Resolve a pendência de desenho do comando em interface.md

## Alternativas consideradas

- **Rodapé flutuante estilo toast** (padrão Gmail): reage a cada ajuste
  — ruído no registro em rajada
- **Botão junto ao último cartão ajustado**: exige rastrear visualmente
  onde foi o último toque
- **Histórico ilimitado na sessão**: mais poder sem caso de uso claro
- **Histórico persistido**: estado além de contagens/updatedAt, contra o
  formato esparso e a economia de escritas
