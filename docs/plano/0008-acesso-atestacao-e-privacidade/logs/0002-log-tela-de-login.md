<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0008-0002: tela de login conforme `interface.md`

## Data
2026-09-11

## Resumo
Criado `TelaDeLogin.jsx`, o componente que `App.jsx` agora renderiza no lugar
de `AuthStatus` para o caso deslogado (Tarefa 0008-0001). Estrutura, na ordem
do wireframe de `interface.md` § Tela de login:

- Cartão centrado (`--panel`, borda `--border`, raio 20px,
  `padding: 36px 28px`, largura máxima 360px) dentro de um bloco de altura
  mínima 70vh — nem colado ao topo, nem exatamente no meio da janela inteira,
  porque o bloco de 70vh é só uma fração da página.
- Título "ICONULA 2026" em Poppins 700/26px dourado,
  `letter-spacing: .02em`.
- Subtítulo exato: "Controle suas figurinhas do álbum da Copa do Mundo FIFA
  2026" — 14px `--muted`, 28px de respiro até o botão.
- `LoginButton` reestilizado (novo `LoginButton.css`): barra branca de raio
  10px, `padding: 12px`, texto `#3c4043` 14px/600, disco do Google de 18px —
  o único elemento claro do produto, como o IDR 0022 declara de propósito.
  Lógica preservada (popup, `role="alert"`, ignora
  `auth/popup-closed-by-user` e `auth/cancelled-popup-request`).
- Atestação (texto informativo, sem clique — a Tarefa 0008-0003 decide o
  fluxo) 20px abaixo do botão, e o link "Política de privacidade" mais 16px
  adiante — ambos 12px `--muted`, como `interface.md` pede especificamente
  para este par (a regra geral da paleta usa `--gold` para links, mas o texto
  da Tela de login sobrepõe essa regra para os dois).
- Rodapé com o texto exato de `requisitos.md` § Privacidade ("Projeto
  independente, sem vínculo com Panini ou FIFA; marcas pertencem aos seus
  titulares (Lei 9.279/96, art. 132)."), 11px `--muted`, sem filete superior.

`AuthStatus.jsx` perdeu o ramo `!user → <LoginButton />`: desde que
`TelaDeLogin` assumiu a tela de login, `AuthStatus` só é usado na barra da
tela principal, sempre com um usuário autenticado — simplificado para isso
(e `AuthStatus.test.jsx`, não listado nos arquivos impactados mas
consequência direta e necessária da mudança, atualizado para não testar mais
o ramo removido).

## Decisões tomadas
Nenhuma decisão de nível 1 (arquitetura/técnica/interface duradoura) nesta
tarefa — `interface.md` já fechava textos e medidas, como a própria tarefa
antecipava em "Decisões em aberto".

Uma escolha de nível 2 (ambiguidade que muda o comportamento visível,
resolvida pela premissa mais conservadora e sinalizada aqui, não uma decisão
de arquitetura): o link "Política de privacidade" não tem destino ainda — a
vista da política é a Tarefa 0008-0004, que também decide (via TDR próprio)
como ela se integra ao `App.jsx` sem router. `TelaDeLogin` recebe um prop
`onAbrirPolitica` (no-op por padrão) só para o botão já existir, ser
focável e acionável (critério de aceite desta tarefa), sem inventar
nenhuma vista ou navegação — a Tarefa 0008-0004 conecta o prop sem precisar
tocar em `TelaDeLogin.jsx`.

Nenhum texto do wireframe precisou de tratamento especial de quebra em tela
estreita — verificado em 375px de largura (ver Validação): os quatro textos
quebram naturalmente em duas linhas sem cortar palavras nem estourar o
cartão.

## Impedimentos
Nenhum nível 3. O nível 2 acima (link sem destino) está registrado e não
contradiz `requisitos.md` nem exige configuração pública.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 23 arquivos de teste, 228 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (CSS de 9,70 kB para
  11,10 kB, refletindo os três arquivos CSS novos/editados; aviso
  pré-existente sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`, via Browser pane:
- Desktop (1280×720): cartão centrado horizontalmente (`cartaoRect.left =
  460`, `right = 820` sobre uma janela de 1280 — centro exato), título
  dourado, botão branco do Google, atestação, link sublinhado e rodapé sem
  filete abaixo do cartão — conferido por captura de tela.
- Mobile (375×812): mesmo conteúdo, sem overflow horizontal, textos
  quebrando em duas linhas sem cortar palavras — conferido por captura de
  tela.
- **Não realizado**: a verificação com o login completo até o fim (TDR
  0005: só até a tela do Google não prova nada sobre CSP) exige um preview
  deploy real, que só existe quando o PR da fase for aberto — combinado com
  o usuário adiar o PR para o fim da Fase 8. Repetir essa checagem
  (console/Network sem violação de CSP, requisição a
  `identitytoolkit.googleapis.com`) no preview deploy do PR antes de
  mesclar.

## Arquivos alterados
- `src/components/TelaDeLogin.jsx` — criado
- `src/components/TelaDeLogin.css` — criado
- `src/components/TelaDeLogin.test.jsx` — criado
- `src/components/LoginButton.jsx` — importa o CSS novo
- `src/components/LoginButton.css` — criado (estilo do botão, medidas de `interface.md`)
- `src/components/AuthStatus.jsx` — remove o ramo `!user`, simplificado para a tela principal
- `src/components/AuthStatus.test.jsx` — atualizado (consequência direta da simplificação acima)
- `src/App.jsx` — renderiza `TelaDeLogin` no lugar do `AuthStatus` genérico quando `!user`
- `docs/plano/0008-acesso-atestacao-e-privacidade/0002-tela-de-login.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0008-0002 atualizado
- `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0002-log-tela-de-login.md` — este log
