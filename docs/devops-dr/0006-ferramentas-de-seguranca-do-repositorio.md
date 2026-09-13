<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0006: Ferramentas de segurança do repositório

## Status

Aceito

## Contexto

- Repositório público no GitHub (organização `useful-toys`).
- Código com secrets acidentais é o vetor de ataque mais barato —
  ferramentas automatizadas de detecção reduzem esse risco.

## Decisão

Ferramentas de segurança ativadas no repositório (verificado via
`gh api`):

### Secret scanning

- **Status**: `enabled`
- Detecta secrets conhecidos (chaves de API, tokens, certificados)
  commitados no repositório
- Alerta o mantenedor quando um secret é encontrado no histórico

### Secret scanning — push protection

- **Status**: `enabled`
- Bloqueia push que contenha secrets conhecidos **antes** de chegarem
  ao repositório
- Mais eficaz que scanning pós-commit: o secret nunca entra

### Secret scanning — non-provider patterns

- **Status**: `disabled`
- Detecta strings com formato de secret mesmo sem correspondência a um
  provedor conhecido (ex.: senhas genéricas, chaves customizadas)
- Desabilitado — o projeto não gera nem armazena secrets customizados
  que se beneficiariam dessa detecção

### Secret scanning — validity checks

- **Status**: `disabled`
- Verifica se o secret detectado é realmente válido (fazendo uma
  chamada à API do provedor)
- Desabilitado — reduz falsos positivos, mas o volume de secrets do
  projeto não justifica a complexidade

### Dependabot alerts

- **Status**: `enabled`
- Notifica o mantenedor quando uma dependência usa uma versão com
  vulnerabilidade conhecida (CVE)
- Base dos security updates abaixo; habilitado via
  `PUT /repos/.../vulnerability-alerts`

### Dependabot security updates

- **Status**: `enabled`
- Cria PRs automáticos para atualizar dependências com
  vulnerabilidades conhecidas (CVEs)
- `dependabot.yml` não existe no repositório — o Dependabot usa a
  configuração default do repositório (sem ecossistema
  `github-actions` explícito; os SHAs das actions são atualizados
  manualmente)

### CodeQL (code scanning)

- **Status**: `configured` (default setup)
- Análise estática de segurança gerenciada pelo GitHub — não é um arquivo
  em `.github/workflows/`; aparece na aba Actions como o workflow
  dinâmico `CodeQL`
- Linguagens analisadas: **Actions** + **JavaScript/TypeScript**
- Query suite `default`, threat model `remote`, varredura **semanal** e a
  cada PR/push na `main`
- Gratuito em repositório público; alertas no painel
  *Security → Code scanning*

### Visibilidade

- Repositório **público** — secret scanning e push protection são
  gratuitos para repos públicos

## Consequências

- Push com secret conhecido é bloqueado automaticamente
- Secrets que passem pelo push protection são detectados no scan
  periódico
- Dependabot cria PRs de atualização de segurança automaticamente
- CodeQL aponta vulnerabilidades de forma contínua (PR, push na `main` e
  varredura semanal) — os achados ficam no painel *Security → Code
  scanning*
- `dependabot.yml` não existe — adicionar com `ecosystems: [github-actions]`
  para automatizar atualização dos SHAs das actions (DDR 0003)

## Alternativas consideradas

- **CodeQL advanced setup** (workflow em `.github/workflows/`): rejeitado
  — o default setup cobre as mesmas linguagens sem um workflow próprio a
  manter e fixar por SHA ([DDR 0003](0003-pinning-de-actions-por-sha.md))

## Histórico

- **2026-09-12**: incluídos **CodeQL (code scanning)** e **Dependabot
  alerts** — já estavam habilitados no repositório, mas não constavam
  neste registro; o Dependabot alerts é a base dos security updates.
