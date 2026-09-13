<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0010: Scripts de shell com LF

## Status

Aceito

## Contexto

- O repositório é editado no Windows e não tinha `.gitattributes`: o fim
  de linha gravado depende do `core.autocrlf` de quem commita.
- No repositório os arquivos estão com LF porque quem commitou usava
  `core.autocrlf=true`; nenhuma regra garante isso.
- Workflows e Markdown toleram CRLF (o YAML normaliza as quebras de linha).
- O primeiro script de shell executado no runner Linux
  ([DDR 0008](0008-autorizacao-do-dominio-de-preview-no-firebase-auth.md))
  não tolera: com CRLF, o `bash` falha já na primeira linha.

## Decisão

- `.gitattributes` com uma única regra: `*.sh text eol=lf` — scripts de
  shell gravados e extraídos sempre com LF, independente do
  `core.autocrlf`.
- Os demais tipos de arquivo continuam como estão.

## Consequências

- Um `.sh` commitado de qualquer máquina chega ao runner com LF.
- No Windows, o checkout de `.sh` passa a ter LF também em disco.
- Outra extensão de script executada no runner precisa da mesma regra.

## Alternativas consideradas

- **`* text=auto` para o repositório inteiro**: rejeitado — renormalizaria
  todos os arquivos num commit grande, sem problema concreto além dos
  scripts.
- **Confiar no `core.autocrlf`**: rejeitado — depende da configuração de
  cada máquina.
- **Remover `\r` no workflow antes de executar**: rejeitado — esconde o
  problema a cada chamada em vez de corrigir o arquivo.

## Histórico

- 2026-09-13 — criação.
