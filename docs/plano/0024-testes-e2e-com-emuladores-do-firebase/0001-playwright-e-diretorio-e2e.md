<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0024-0001]: Playwright e diretório `e2e/`

## Status
Pendente

## Objetivo
Instalar o Playwright como ferramenta de teste E2E e criar a estrutura
mínima (`e2e/`, config, ignore de artefatos), sem nenhum teste ainda —
prepara o terreno para as tarefas seguintes desta fase.

## Documentos de referência
- `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`
  § Decisão — ferramenta Playwright, diretório `e2e/`.
- `docs/adr/0009-testes-co-localizados.md` § Exceções — segunda exceção
  à co-localização, para `e2e/`.

## Padrões e convenções aplicáveis
- Testes co-localizados (ADR 0009) — esta tarefa cria a exceção já
  documentada; não é violação sem registro.
- Arquivo novo abre com o cabeçalho de copyright (`AGENTS.md` §
  Convenções) — vale para `playwright.config.js` e qualquer arquivo
  novo em `e2e/`.

## Escopo e instruções de implementação
1. `package.json`: acrescentar `@playwright/test` em `devDependencies`
   (versão estável mais recente); rodar `npx playwright install` para
   baixar os browsers localmente (setup local, sem configuração
   pública — registrar no log).
2. Criar `playwright.config.js` na raiz do repositório: `testDir:
   './e2e'`; Chromium como projeto/browser padrão (suficiente para os
   testes previstos nesta fase).
3. Criar o diretório `e2e/` (pode ficar vazio ou com um `README.md`
   curto explicando o propósito da pasta — decisão de nível 1).
4. `.gitignore`: ignorar os artefatos que o Playwright gera
   (`playwright-report/`, `test-results/`, `blob-report/`).
5. Não criar scripts npm (`test:e2e`) ainda — não há teste para rodar;
   isso é da Tarefa 0024-0003.

**Fora do escopo**: emuladores do Firebase, helpers de login/fixture,
scripts npm, teste de fumaça — Tarefas 0024-0002 e 0024-0003.

## Decisões já tomadas (não reabrir)
- Playwright como ferramenta de E2E — ver
  `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`.
- `e2e/` como segunda exceção à co-localização — ver
  `docs/adr/0009-testes-co-localizados.md`.

## Arquivos impactados
- `package.json`, `package-lock.json` — modificar (nova devDependency).
- `playwright.config.js` — criar.
- `.gitignore` — modificar.
- `e2e/` — criar (estrutura mínima).

## Critérios de aceite
- [ ] `@playwright/test` em `devDependencies` de `package.json`.
- [ ] `playwright.config.js` existe, com `testDir: './e2e'`.
- [ ] `.gitignore` ignora os artefatos de relatório do Playwright.
- [ ] `npm run lint && npm run test && npm run build` continuam
      verdes — nada no app mudou.
