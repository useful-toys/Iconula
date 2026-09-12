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

### Dependabot security updates

- **Status**: `enabled`
- Cria PRs automáticos para atualizar dependências com
  vulnerabilidades conhecidas (CVEs)
- `dependabot.yml` não existe no repositório — o Dependabot usa a
  configuração default do repositório (sem ecossistema
  `github-actions` explícito; os SHAs das actions são atualizados
  manualmente)

### Visibilidade

- Repositório **público** — secret scanning e push protection são
  gratuitos para repos públicos

## Consequências

- Push com secret conhecido é bloqueado automaticamente
- Secrets que passem pelo push protection são detectados no scan
  periódico
- Dependabot cria PRs de atualização de segurança automaticamente
- `dependabot.yml` não existe — adicionar com `ecosystems: [github-actions]`
  para automatizar atualização dos SHAs das actions (DDR 0003)
