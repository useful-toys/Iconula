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
- `.github/dependabot.yml` existe, com `github-actions` (propõe o bump do
  comentário `# vX.Y.Z` junto do SHA — DDR 0003) e `npm` (dependências de
  desenvolvimento e produção), ambos semanais

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

### Divulgação responsável

- **Status**: `SECURITY.md` na raiz do repositório
- Canal privado para relatar vulnerabilidade (GitHub Security Advisories
  ou e-mail), escopo do projeto e expectativa de resposta — sem isso, um
  achado só tinha issue pública ou nenhum canal indicado

### Visibilidade

- Repositório **público** — secret scanning e push protection são
  gratuitos para repos públicos

### Triagem do alerta "Cross-window communication with unrestricted target origin" (js/cross-window-communication)

- **Status**: descartado no GitHub como falso positivo / risco aceito
- Local: `docs/prototype/Iconula - Álbum de Figurinhas.html`, chamadas
  `postMessage(..., OWN_TARGET)` (linhas ~118-120, 160, 187, 201, 340)
- Motivo: arquivo é protótipo standalone fora do build de produção
  (Vite usa `src/` e `index.html` da raiz; `firebase.json` só publica
  `dist/`; nada em `src/` referencia o arquivo)
- `OWN_TARGET` só cai para `'*'` em contexto de origem opaca (`file://`,
  iframe sandboxed sem `allow-same-origin`), onde a API `postMessage`
  não oferece alternativa; em `https://` usa a origem real
  (`window.origin`)
- O recebimento já é validado por `trustedOrigin()` e checagens
  estruturais (só aceita de iframes filhos próprios ou do `parent`
  direto, só uuids solicitados) — o `'*'` no envio não abre brecha de
  integridade, só reduz a garantia de confidencialidade num cenário que
  já exigiria comprometimento prévio da árvore de frames
- Ação: alerta descartado em *Security → Code scanning* com a razão
  "Used in tests"/"Won't fix", citando este registro

## Consequências

- Push com secret conhecido é bloqueado automaticamente
- Secrets que passem pelo push protection são detectados no scan
  periódico
- Dependabot cria PRs de atualização de segurança automaticamente
- CodeQL aponta vulnerabilidades de forma contínua (PR, push na `main` e
  varredura semanal) — os achados ficam no painel *Security → Code
  scanning*
- `dependabot.yml` automatiza atualização dos SHAs das actions (DDR 0003)
  e das dependências npm, em PRs semanais separados por ecossistema

## Alternativas consideradas

- **CodeQL advanced setup** (workflow em `.github/workflows/`): rejeitado
  — o default setup cobre as mesmas linguagens sem um workflow próprio a
  manter e fixar por SHA ([DDR 0003](0003-pinning-de-actions-por-sha.md))
- **`paths-ignore` de `docs/prototype/` no default setup**: rejeitado
  para o alerta de `postMessage` — desligaria a varredura de qualquer
  código futuro nessa pasta para ganhar só o silêncio de um alerta já
  descartado individualmente; reconsiderar se a pasta acumular mais
  protótipos gerando ruído repetido

## Histórico

- **2026-09-17**: criado `SECURITY.md` com canal de divulgação
  responsável — não havia nenhum indicado no repositório.
- **2026-09-17**: criado `.github/dependabot.yml` (`github-actions` e
  `npm`, semanal) — fechava a lacuna registrada acima e em DDR 0003.
- **2026-09-17**: descartado o alerta CodeQL
  `js/cross-window-communication` em `docs/prototype/Iconula - Álbum de
  Figurinhas.html` como falso positivo/risco aceito, com a justificativa
  registrada acima.
- **2026-09-12**: incluídos **CodeQL (code scanning)** e **Dependabot
  alerts** — já estavam habilitados no repositório, mas não constavam
  neste registro; o Dependabot alerts é a base dos security updates.
