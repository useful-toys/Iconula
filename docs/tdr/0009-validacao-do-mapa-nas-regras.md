<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0009: O que as regras conseguem validar no mapa de contagens

## Status

Aceito — corrige o que o
[ADR 0008](../adr/0008-schema-da-colecao-mapa-esparso.md) e
[persistencia.md](../persistencia.md) prometiam ("map com int ≥ 1",
"chaves = códigos do catálogo (regex × allow-list)"), impossível como
estava escrito.

## Contexto

O ADR 0008 decidiu o mapa esparso em `users/{uid}` e delegou a este TDR
a validação nas regras: tipo dos valores e padrão das chaves, "regex ×
allow-list". Ao desenhar as regras, a promessa não se sustentou.

**A linguagem de regras do Firestore não tem laço nem quantificador.**
Não existe "para cada entrada do mapa, verifique". Um campo de nome
conhecido se valida direto — é assim que a regra da era do botão trata
`teamName`. Um mapa cujas chaves só se conhecem em tempo de execução,
não: `Map` oferece `keys()`, `values()`, `size()` e `diff()`, e as listas
que os dois primeiros devolvem só sabem responder `hasAll`, `hasAny` e
`hasOnly` — comparação de conjunto contra uma lista escrita à mão.

Daí a assimetria que decide este registro:

- **Valores**: `values()` devolve `[1, 3, 1, 2, 1]`. Uma única cláusula,
  `values().hasOnly([1, …, 99])`, valida **todos** os valores do mapa —
  99 literais, barato. Só existe se houver um teto: sem ele não há
  segunda lista para comparar, e os valores ficam sem validação alguma
- **Chaves**: o mesmo mecanismo exigiria enumerar os **994** códigos, e
  o Firestore limita 1.000 expressões avaliadas por requisição — perto
  demais do teto para confiar

A decisão anterior de não ter teto por contagem ("tantas quantas a
arquitetura suportar") custava, portanto, a única validação barata e
total que o formato permite.

## Decisão

- **Teto de 99 nas regras**, validado por
  `contagens.values().hasOnly([1, …, 99])`. A interface **para o
  incremento em 99**, do mesmo jeito que o decremento para em 0 — sem
  isso a tela mostraria 100 e a gravação seguinte seria recusada pelo
  servidor
- **`contagens.size() <= 994`**, `hasOnly` dos três campos,
  `updatedAt == request.time`, `atestadoEm` timestamp, `delete` e `list`
  negados (como já hoje)
- **Guarda de campo ausente**: a gravação da atestação cria o documento
  só com `atestadoEm`, sem `contagens`. Toda cláusula sobre `contagens`
  fica sob `!("contagens" in request.resource.data) || (…)`, senão a
  regra erra em vez de negar
- **A allow-list dos 994 códigos entra se couber**: gerar a lista a
  partir do catálogo, medir o tamanho do ruleset e exercitar no
  emulador. Se o deploy ou a avaliação esbarrar no limite, ela fica de
  fora e as chaves seguem só limitadas em quantidade
- **Limitação conhecida, registrada de propósito**: mesmo com tudo
  acima, uma requisição forjada com o token do próprio usuário pode
  gastar espaço em **nomes de chave** (o Firestore aceita nome de campo
  de até 1.500 bytes). O teto real de abuso é **1 MiB por conta** — o
  limite do documento. Fechar isso por completo exigiria a subcoleção,
  descartada pelo ADR 0008 por custo de cota. O App Check, já registrado
  no ADR 0007 como gatilho de revisão, é a resposta se houver abuso

## Consequências

- Os valores voltam a ser validados, por uma cláusula só
- O produto ganha um limite real de 99 unidades por figurinha. Ninguém
  chega perto — o recorde plausível numa coleção é uma dezena —, e a
  interface já reserva dois dígitos no selo
  ([IDR 0021](../idr/0021-selo-conta-unidades-sobrando.md)), então o
  limite é invisível
- `requisitos.md` deixa de dizer "sem teto de contagem"
- Os testes das regras cobrem: valor 0, negativo, 100, não-inteiro,
  string; chave fora do catálogo; campo extra; `updatedAt` forjado;
  documento só com `atestadoEm`; acesso cruzado entre usuários
- A medição da allow-list é tarefa do PR das regras, não pendência de
  desenho: os dois desfechos já estão decididos aqui

## Alternativas consideradas

- **Sem teto e sem validação de valores**: mantinha "tantas quantas a
  arquitetura suportar" ao pé da letra, mas abria a porta larga do
  armazenamento livre — o mesmo mal que a regra do `teamName` fecha
- **Mapa aninhado por sigla** (`contagens.BRA.05`): baratearia as chaves
  de nível 1 (50 siglas em vez de 994 códigos), mas `values()` passaria
  a devolver mapas, e a validação dos números exigiria repetir a
  cláusula para cada uma das 50 seções — ~6.000 expressões, seis vezes o
  teto. Também partiria o código da figurinha em dois níveis, contra a
  regra transversal de que contagens são endereçadas por código
- **Subcoleção `users/{uid}/contagens/{código}`**: cada documento com
  campos de nome conhecido, validação completa e sem enumerar nada — o
  único desenho que fecha o abuso de verdade. Descartado pelo ADR 0008:
  uma escrita por figurinha em vez de uma por agregação
