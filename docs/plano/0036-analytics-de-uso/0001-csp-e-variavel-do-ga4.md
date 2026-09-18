<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0001: CSP e variável do GA4

## Status
Pendente

## Objetivo
Abrir a CSP do `firebase.json` para as origens do Google Analytics e criar a
variável `VITE_GA_MEASUREMENT_ID` em `.env.example` e nas GitHub Actions
Variables, com `docs/setup-github.md` refletindo o estado. Sem esta etapa, o
gtag da Tarefa 0036-0002 não carrega em produção.

## Documentos de referência
- `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md` § Decisão — Measurement ID via env, entrega por gtag.
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` § CSP para Google Analytics (GA4) — origens exatas.
- `firebase.json` — bloco `hosting.headers` com a CSP atual.
- `.env.example` — padrão das variáveis `VITE_FIREBASE_*`.
- `docs/setup-github.md` § Variáveis do repositório — lista das variáveis.

## Padrões e convenções aplicáveis
- CSP fechada por padrão: concessão pontual por origem, nunca curinga nem `'unsafe-inline'` — `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`.
- Variável de build não é secret — vai para `.env.example` e GitHub Actions Variables, não Secrets — `AGENTS.md` e `docs/setup-github.md`.
- Setup de infraestrutura: cada passo registrado no log, segredos como `<REDACTED>`, estado final em `docs/setup-*.md` — `docs/plano/CLAUDE.md` § Setup de infraestrutura e ambiente.

## Escopo e instruções de implementação
1. Em `firebase.json`, no header `Content-Security-Policy`:
   - `script-src` ganha `https://www.googletagmanager.com`.
   - `connect-src` ganha `https://www.google-analytics.com` e `https://region1.google-analytics.com`.
   - Nada mais muda (sem `img-src`, sem hash novo — o gtag é script externo carregado em runtime).
2. Em `.env.example`, acrescentar `VITE_GA_MEASUREMENT_ID=` com comentário de onde tirar o valor (console do Firebase, fluxo de dados Web).
3. Criar a variável no repositório GitHub com o valor real `G-KQ72XBGSTM`:
   ```
   gh variable set VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula
   ```
   Valor lido de variável de ambiente local já fornecida pelo humano (não gravar o valor em claro no log; usar `<REDACTED>`).
4. Em `docs/setup-github.md` § Variáveis do repositório, acrescentar a linha `VITE_GA_MEASUREMENT_ID` com a mesma explicação das demais `VITE_*`.

**Fora do escopo**: o módulo que carrega o gtag (Tarefa 0036-0002); o banner (Tarefa 0036-0003); `setup-firebase.md`/`setup-gcloud.md` (Tarefa 0036-0005).

## Decisões já tomadas (não reabrir)
- GA4 por gtag, Measurement ID via env — `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md`.
- Origens exatas da CSP — `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`.

## Impedimentos específicos
- `gh variable set` é configuração pública do repositório — nível 3, exige aprovação explícita do humano com o comando exato antes de executar.

## Arquivos impactados
- `firebase.json` — modificar (bloco `hosting.headers`, CSP)
- `.env.example` — modificar
- `docs/setup-github.md` — modificar (§ Variáveis do repositório)

## Critérios de aceite
- [ ] `firebase.json` tem `https://www.googletagmanager.com` em `script-src` e `https://www.google-analytics.com` + `https://region1.google-analytics.com` em `connect-src`, e nenhuma outra origem nova.
- [ ] `.env.example` tem `VITE_GA_MEASUREMENT_ID`.
- [ ] A variável existe no repositório (`gh variable list --repo useful-toys/Iconula` lista `VITE_GA_MEASUREMENT_ID`).
- [ ] `docs/setup-github.md` cita `VITE_GA_MEASUREMENT_ID` na tabela de variáveis.

## Validação adicional
- `gh variable list --repo useful-toys/Iconula` para conferir a variável.
