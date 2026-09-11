<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0008-0001: login como guarda do app

## Data
2026-09-11

## Resumo
`App.jsx` decide entre três telas exclusivas pelo estado de autenticação,
sem router e sem Context (`useState` continua o único mecanismo):

- **Sem `VITE_FIREBASE_*`** (`auth === null`): tela de login sem botão
  funcional, com o texto "Login indisponível — configure as variáveis
  `VITE_FIREBASE_*` para usar o app", e nenhum caminho para o catálogo —
  checado antes de qualquer outro estado.
- **Sessão ainda não resolvida** (`authResolvido === false`): tela neutra —
  `<div className="app" />` vazio — enquanto o Firebase Auth confirma se há
  sessão restaurada. Evita piscar a tela de login para quem já está
  autenticado (ver IDR 0035, novo).
- **Sessão resolvida**: tela de login (`AuthStatus` sem usuário) quando
  `user` é `null`, ou a tela principal completa (cabeçalho, controles,
  catálogo, avisos) quando há usuário.

`authResolvido` nasce `false` e vira `true` na primeira emissão de
`onAuthStateChanged` (chamada uma vez só, junto com `setUser`); quando
`auth` é `null` esse estado nunca é lido, porque o primeiro `if` já
retornou.

Todos os hooks continuam sendo chamados incondicionalmente no topo do
componente — só o `return` final varia — preservando as regras dos Hooks.

## Decisões tomadas
- **IDR 0035 — Tela neutra enquanto a sessão resolve, sem piscar o login**
  (`docs/idr/0035-tela-neutra-enquanto-a-sessao-resolve.md`): decide a
  "Decisão em aberto" da própria tarefa. Nível 1 (muda o que o usuário vê),
  registrada no momento em que foi tomada. Optou por um contêiner vazio,
  sem spinner nem esqueleto de layout — coerente com o minimalismo de
  `requisitos.md` § UX (IDR 0018) para um intervalo tipicamente
  imperceptível.

## Impedimentos
Nenhum nível 2 ou 3. A ambiguidade sobre o estado intermediário já vinha
sinalizada na própria tarefa como "Decisão em aberto" — resolvida com o
IDR 0035 acima, sem contrariar `requisitos.md` nem exigir configuração
pública.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 22 arquivos de teste, 224 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`, via Browser pane:
- Com `.env.local` configurado, deslogado: só o botão "Entrar com Google"
  aparece; nenhum vestígio de `.app__auth` além dele, catálogo ausente do
  DOM.
- Sem `.env.local` (renomeado temporariamente para `.env.local.bak` e
  restaurado ao final): o texto "Login indisponível — configure as
  variáveis VITE_FIREBASE_* para usar o app (ver docs/firebase.md)."
  aparece sozinho na página — sem botão, sem catálogo.
- O fluxo completo de login via popup do Google (que exige interação real
  com a conta) não foi exercitado neste ambiente headless; a troca de tela
  ao autenticar/sair já é coberta pelos testes automatizados
  (`src/App.test.jsx`, que simula as emissões de `onAuthStateChanged`).

## Arquivos alterados
- `src/App.jsx` — guarda de login com três telas exclusivas e o estado
  `authResolvido`
- `src/App.test.jsx` — reescrito: cobre a tela neutra, a tela de login sem
  catálogo, a tela principal e a troca ao sair; testes de preferências e
  filtro passam a autenticar antes de interagir
- `src/App.auth-unavailable.test.jsx` — reescrito: cobre a tela de login
  indisponível, sem botão funcional e sem catálogo
- `AGENTS.md` — § Como rodar atualizado: `npm run dev` passa a exigir
  `.env.local`
- `docs/idr/0035-tela-neutra-enquanto-a-sessao-resolve.md` — novo IDR
- `docs/plano/0008-acesso-atestacao-e-privacidade/0001-login-como-guarda-do-app.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0008-0001 atualizado
- `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0001-log-login-como-guarda-do-app.md` — este log
