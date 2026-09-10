<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0007-0002]: tela de login conforme `interface.md`

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Tela de login — o wireframe, os textos exatos e as medidas (cartão ~360px, raio 20px, `padding: 36px 28px`, título Poppins 700 de 26px)
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão — o botão do Google é o único elemento claro do produto, e é assim de propósito
- `docs/adr/0006-login-google-sdk-modular.md` § Decisão — botão próprio seguindo as diretrizes do Google, popup, erro visível em `role="alert"`, ignorando popup fechado pelo usuário
- `docs/requisitos.md` § Acesso — falha de login exibe erro, exceto quando o usuário fecha o popup; a tela expõe o link da política antes de qualquer autenticação
- `docs/requisitos.md` § Privacidade — o aviso de independência e marcas no rodapé
- `src/components/LoginButton.jsx` — o botão atual, que já implementa boa parte disso

## Objetivo
Trocar a tela de login herdada do botão pela desenhada em `interface.md`: cartão
centrado sobre o fundo gramado, botão do Google, a frase de atestação e o link da
política acessível sem autenticar.

## Padrões e convenções aplicáveis
- Textos **exatos** de `docs/interface.md` § Tela de login — subtítulo, botão,
  atestação e link não são reescritos ao gosto do implementador
- O botão do Google é o único elemento claro do produto: fundo branco, texto
  `#3c4043`, disco de 18px com as quatro cores — `docs/interface.md` § Tela de
  login e `docs/idr/0022-*`
- Erro de login visível em `role="alert"`, ignorando `auth/popup-closed-by-user` e
  `auth/cancelled-popup-request` — `docs/adr/0006-*` § Decisão
- O link da política fica acessível **antes** de autenticar —
  `docs/requisitos.md` § Acesso
- O rodapé de marcas repete-se aqui, sem filete superior —
  `docs/interface.md` § Tela de login
- Cor só pelos tokens, salvo o botão do Google, que é exceção declarada —
  `docs/idr/0022-*`

## Escopo e instruções de implementação
1. Criar o componente da tela de login em `src/components/`, com o cartão centrado
   num bloco de altura mínima ~70vh, largura máxima ~360px, `--panel` sobre o
   fundo gramado, borda `--border`, raio 20px.
2. Conteúdo, na ordem do wireframe: título dourado "ICONULA 2026", subtítulo,
   botão "Entrar com Google", frase da atestação, link "Política de privacidade".
   Usar os textos exatos de `interface.md`.
3. Reusar o `LoginButton.jsx` existente, reestilizado para as medidas de
   `interface.md`; preservar o tratamento de erro e as exceções de cancelamento
   que o ADR 0006 estabeleceu.
4. Rodapé com o aviso de independência e marcas, sem filete superior.
5. O link da política aponta para a vista da Tarefa 0007-0004 e funciona sem
   sessão — é requisito, não conveniência.
6. Nesta tarefa a frase da atestação é **texto informativo** junto ao botão, como
   no protótipo; o passo explícito de atestação é a Tarefa 0007-0003, que decide o
   fluxo. Não implementar o clique de atestação aqui.
7. Testes: os textos exatos estão na tela; o link da política é acionável sem
   sessão; falha de login mostra alerta; popup fechado pelo usuário não mostra
   nada.

**Fora do escopo**: o passo de atestação e a gravação de `atestadoEm`
(Tarefa 0007-0003); o conteúdo da política (Tarefa 0007-0004); qualquer provedor
de login além do Google.

## Decisões já tomadas (não reabrir)
- Único provedor Google, popup, botão próprio, sem FirebaseUI — ver `docs/adr/0006-login-google-sdk-modular.md`
- O texto do botão é "Entrar com Google" — ver `docs/adr/0006-*` § Consequências e `docs/interface.md`
- Fechar o popup é desistência, não erro — ver `docs/requisitos.md` § Acesso
- O botão do Google é o único elemento claro — ver `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` é custo do fluxo de popup — ver `docs/tdr/0005-csp-firebase-auth-google-oauth.md`

## Decisões em aberto nesta tarefa
- Nenhuma de desenho: `interface.md` fecha textos e medidas. Se algum texto de lá
  não couber na largura em telas pequenas, implemente com quebra e registre no log.

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
   **Caso concreto previsto aqui**: qualquer mudança em authorized domains ou em
   provedores de login exige confirmação explícita do usuário.

## Arquivos impactados
- `src/components/TelaDeLogin.jsx` — criar
- `src/components/TelaDeLogin.test.jsx` — criar
- `src/components/LoginButton.jsx` — modificar (estilo)
- `src/components/LoginButton.test.jsx` — modificar
- `src/components/AuthStatus.jsx` — modificar (o que sobra dele na tela principal)
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] Os quatro textos exatos de `docs/interface.md` § Tela de login estão na tela
- [ ] O cartão tem as medidas especificadas e o botão do Google é o único elemento claro
- [ ] O link "Política de privacidade" é acionável sem autenticar
- [ ] Falha de login mostra mensagem em `role="alert"`; fechar o popup não mostra nada
- [ ] O rodapé de marcas aparece na tela de login, sem filete superior
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0007-acesso-atestacao-e-privacidade/logs/0002-log-tela-de-login.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real, completando o login até o fim: o TDR 0005
documenta que testar só até a tela do Google não prova nada. Conferir console e
aba Network por violações de CSP e pela requisição a
`identitytoolkit.googleapis.com` que deve existir.
