<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0024-0001: Playwright e diretório `e2e/`

## Data
2026-09-16

## Resumo
Antes desta tarefa não havia nenhuma ferramenta de teste de navegador no
projeto. Instalado `@playwright/test` (^1.63.0) como devDependency, com o
browser Chromium baixado localmente; criado `playwright.config.js` na raiz
apontando `testDir: './e2e'` com um único projeto (Chromium); criado
`e2e/README.md` documentando o propósito da pasta (exceção de
co-localização já registrada nos ADR 0009/0010); `.gitignore` passa a
ignorar `playwright-report/`, `test-results/` e `blob-report/`. Nenhum
teste, script npm, emulador ou código do app foi tocado — só a
infraestrutura mínima prevista, deixando o terreno pronto para as Tarefas
0024-0002 e 0024-0003.

## Discovery
- Código: `package.json` não tem nenhuma dependência de teste de
  navegador; `devDependencies` atuais cobrem só Vitest/RTL/oxlint.
  `.gitignore` ainda não ignora artefatos do Playwright. Não existe
  `e2e/` nem `playwright.config.js`. `vite.config.js` define
  `test.exclude` para o Vitest (`.claude/**`, `**/*.rules.test.js`) —
  esta tarefa não cria nenhum arquivo `.spec.js` em `e2e/`, então não há
  risco do Vitest coletar algo de lá ainda; excluir `e2e/` do Vitest fica
  para quando a Tarefa 0024-0003 criar o primeiro teste (fora do escopo
  desta tarefa, que não lista `vite.config.js` em "Arquivos impactados").
- Documentação: ADR 0010 (decisão de ferramenta/localização/emuladores) e
  a atualização do ADR 0009 (segunda exceção à co-localização) já
  registram a decisão desta tarefa; nenhuma leitura além das referências
  foi necessária.

## Plano da alteração
1. `package.json`: `npm install --save-dev @playwright/test` (versão
   estável mais recente do momento); `npx playwright install chromium`
   para baixar só o browser usado pelo projeto padrão da config —
   registrado como setup local em `## Setup realizado`.
2. Criar `playwright.config.js` na raiz: `testDir: './e2e'`, projeto
   Chromium como padrão.
3. Criar `e2e/README.md` curto explicando o propósito da pasta (decisão
   de nível 1: README em vez de pasta vazia, para o Git rastrear o
   diretório e documentar a exceção de co-localização já no lugar).
4. `.gitignore`: acrescentar `playwright-report/`, `test-results/` e
   `blob-report/`.
5. Nenhum script novo em `package.json` (scripts ficam para a Tarefa
   0024-0003).
- Verificação prevista: `@playwright/test` em `devDependencies` → ler
  `package.json`; `playwright.config.js` com `testDir` → ler o arquivo;
  `.gitignore` cobre os três artefatos → ler o arquivo; `npm run lint &&
  npm run test && npm run build` verdes → rodar e conferir saída.
- Riscos: nenhum — infraestrutura nova, sem tocar código do app.
- Desvios: nenhum.

## Decisões tomadas
- README curto em `e2e/` em vez de pasta vazia — nível 1 (a tarefa
  oferece as duas opções); mantém o diretório rastreável pelo Git e já
  documenta a exceção de co-localização (ADR 0009) para quem abrir a
  pasta antes da Tarefa 0024-0002/0003.
- `npx playwright install chromium` (só o browser do projeto padrão da
  config) em vez de baixar todos os browsers — nível 1, evita download
  desnecessário; a tarefa não especifica quais navegadores baixar.

## Impedimentos
Nenhum.

## Setup realizado
Por passo, na ordem:

### 1. Instalar `@playwright/test` como devDependency
- Ambiente: local
- Aprovação do humano: não se aplica (setup previsto na tarefa)
- Comando executado:
  ```
  npm install --save-dev @playwright/test
  ```
- Saída relevante: `added 203 packages, and audited 204 packages in 33s` —
  instalado `@playwright/test@^1.63.0`.
- Verificação: `@playwright/test` presente em `package.json` `devDependencies`
- Como reverter: `npm uninstall @playwright/test`

### 2. Baixar o browser Chromium do Playwright
- Ambiente: local
- Aprovação do humano: não se aplica (setup previsto na tarefa)
- Comando executado:
  ```
  npx playwright install chromium
  ```
- Saída relevante: comando terminou sem saída e sem erro (exit 0) —
  browser já em cache local.
- Verificação: comando termina sem erro
- Como reverter: apagar o cache de browsers do Playwright (`npx playwright uninstall`)

## Validação
```
npm run lint
> oxlint
(sem avisos ou erros)

npm run test
> vitest run
Test Files  117 passed (117)
     Tests  1430 passed (1430)

npm run build
> vite build
✓ 136 modules transformed.
✓ built in 580ms
(!) Some chunks are larger than 500 kB after minification.
```
O aviso de chunk grande é pré-existente: `docs/arquitetura.md` § Build,
deploy e qualidade já documenta que o SDK do Firestore (~555 KB) vira
chunk sob demanda (ADR 0005) — nenhum código do app foi alterado por esta
tarefa, então o aviso não é novo.

## Critérios de aceite
- [x] `@playwright/test` em `devDependencies` de `package.json` — `package.json:25`.
- [x] `playwright.config.js` existe, com `testDir: './e2e'` — `playwright.config.js:8`.
- [x] `.gitignore` ignora os artefatos de relatório do Playwright — `.gitignore` (bloco "Playwright (testes E2E)").
- [x] `npm run lint && npm run test && npm run build` continuam verdes —
      nada no app mudou — ver `## Validação`.

## Arquivos alterados
- `package.json`, `package-lock.json` — nova devDependency `@playwright/test`.
- `playwright.config.js` — criado, `testDir: './e2e'`, projeto Chromium.
- `e2e/README.md` — criado, explica o propósito da pasta.
- `.gitignore` — ignora `playwright-report/`, `test-results/`, `blob-report/`.
- `docs/plano/0024-testes-e2e-com-emuladores-do-firebase/0001-playwright-e-diretorio-e2e.md` — status `Concluída`.
- `docs/plano/README.md` — linha da fase 24 e da Tarefa 0001 → `Em andamento`/`Concluída`.
