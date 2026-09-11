<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0008-0001]: login como guarda do app

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Acesso — "visitante deslogado vê apenas a tela de login — catálogo e coleção não são acessíveis sem autenticar"
- `docs/requisitos.md` § Dados e isolamento — sem as `VITE_FIREBASE_*` o login fica indisponível e o app não oferece funcionalidade; modo não suportado
- `docs/requisitos.md` § Fora de Escopo — modo local sem login está excluído permanentemente
- `docs/adr/0006-login-google-sdk-modular.md` § Decisão — detecção explícita de config ausente; estado do usuário em `App.jsx` com `useState` + `onAuthStateChanged`, sem Context
- `docs/arquitetura.md` § Camadas no cliente — "tela de login como guarda"
- `AGENTS.md` § Como rodar — o texto que hoje diz que `npm run dev` funciona sem credencial

## Objetivo
Fechar o app atrás do login, como `requisitos.md` exige: sem sessão, só a tela de
login existe. A consequência prática — desenvolver passa a exigir `.env.local` —
é aceita e precisa estar escrita no `AGENTS.md` no mesmo PR.

## Padrões e convenções aplicáveis
- Deslogado vê **apenas** a tela de login; catálogo e coleção não são acessíveis —
  `docs/requisitos.md` § Acesso
- Sem as `VITE_FIREBASE_*`, o app não oferece funcionalidade: é modo não
  suportado, não um modo degradado a ser projetado — `docs/requisitos.md` § Dados
  e isolamento
- Estado do usuário continua em `App.jsx` com `useState` + `onAuthStateChanged`,
  **sem Context** — `docs/adr/0006-*` § Decisão
- Sem router: a troca entre tela de login e tela principal é uma vista interna —
  `AGENTS.md` § Convenções
- Mudança no jeito de rodar o projeto é refletida no `AGENTS.md` no mesmo PR —
  `AGENTS.md` § Convenções
- Modo local sem login está permanentemente fora de escopo: nada de "ver o
  catálogo sem entrar" — `docs/requisitos.md` § Fora de Escopo

## Escopo e instruções de implementação
1. No `App.jsx`, decidir entre tela de login e tela principal pelo estado de
   autenticação, sem router e sem Context.
2. Tratar o estado intermediário: a primeira emissão de `onAuthStateChanged` vem
   com `null` antes de o usuário resolver. Não piscar a tela de login para quem
   já tem sessão.
3. Config ausente: o app mostra a tela de login sem botão funcional, com a
   indicação de que o login está indisponível — é o modo não suportado, e não
   deve virar um caminho alternativo para o catálogo.
4. Atualizar `AGENTS.md` § Como rodar: `npm run dev` passa a exigir um
   `.env.local` com as `VITE_FIREBASE_*`, com o ponteiro para `docs/firebase.md`.
   O texto atual afirma o contrário e passaria a mentir.
5. Ajustar os testes que hoje renderizam o `App` sem usuário e esperam ver o
   conteúdo principal.
6. Testes: sem usuário, o catálogo não está no documento; com usuário, está; sem
   config, a tela de login aparece sem caminho para o catálogo.

**Fora do escopo**: o desenho definitivo da tela de login (Tarefa 0008-0002); a
atestação (Tarefa 0008-0003); a política de privacidade (Tarefa 0008-0004); o
comando de sair, que continua onde está até a Fase 9.

## Decisões já tomadas (não reabrir)
- Login obrigatório; sem ele não há contador — ver `docs/requisitos.md` § Fora de Escopo
- Único provedor Google, por popup — ver `docs/adr/0006-login-google-sdk-modular.md`
- Sem router e sem estado global até a árvore exigir — ver `AGENTS.md` § Convenções
- A coleção permanece gravada no Firestore e é recarregada no próximo login — ver `docs/requisitos.md` § Acesso

## Decisões em aberto nesta tarefa
- Como se comporta a tela enquanto o estado de autenticação ainda não resolveu —
  encaminhamento: um estado neutro breve, sem piscar a tela de login nem mostrar
  o catálogo vazio; nasce um **IDR** com o que aparece nesse intervalo

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/App.test.jsx` — modificar
- `src/App.auth-unavailable.test.jsx` — modificar
- `AGENTS.md` — modificar (§ Como rodar)

## Critérios de aceite
- [x] Sem sessão, o catálogo não é renderizado nem acessível por nenhum caminho
- [x] Com sessão, a tela principal aparece
- [x] Não há piscar da tela de login para quem já está autenticado
- [x] Sem `VITE_FIREBASE_*`, o app mostra a tela de login sem oferecer o catálogo
- [x] `AGENTS.md` § Como rodar diz que o desenvolvimento exige `.env.local`
- [x] Nenhum router e nenhum Context foram introduzidos
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas
- [x] `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0001-log-login-como-guarda-do-app.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev` com `.env.local` configurado: abrir deslogado
mostra só o login; entrar leva ao catálogo; sair volta ao login. Repetir sem
`.env.local` e conferir que não há atalho para o catálogo.
