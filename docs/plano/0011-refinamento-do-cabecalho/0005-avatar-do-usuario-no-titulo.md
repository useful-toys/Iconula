<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0005]: avatar do usuário no título

## Status
Pendente

## Objetivo
Mostrar no cabeçalho qual conta Google está autenticada — a foto de perfil,
reduzida à altura da linha de título — decidindo a relação com o botão do menu
de ações e o comportamento para contas sem foto.

## Documentos de referência
- `src/App.jsx` — estado `user`, preenchido por `onAuthStateChanged`; o objeto
  do Firebase Auth já traz `photoURL` e `displayName`, ainda não usados no
  código
- `firebase.json` — `Content-Security-Policy` já libera
  `https://lh3.googleusercontent.com` em `img-src`
- `docs/tdr/0005-csp-firebase-auth-google-oauth.md` § Decisão — a liberação de
  `lh3.googleusercontent.com` foi feita para a foto de perfil do usuário
  autenticado
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão —
  minimalismo como regra de ouro
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — "sair da
  conta" fica no menu de ações, aberto por um botão do cabeçalho
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — área de toque
  ampliada dos alvos de 30×30px
- `docs/modelo-intercambio.md` — o export JSON não leva dados pessoais
- `src/components/MenuDeAcoes.jsx` — botão atual que abre o popup
- `docs/interface.md` § Cabeçalho — onde o avatar passa a ser descrito
- `src/components/Cabecalho.jsx`, `Controles.jsx` — composição do cabeçalho
  depois da Tarefa 0011-0004

## Padrões e convenções aplicáveis
- O avatar se justifica como identidade funcional (qual conta está logada),
  não como decoração — IDR 0018
- CSP já cobre a origem da imagem; `firebase.json` não muda — TDR 0005
- `referrerPolicy="no-referrer"` na `<img>`, para evitar bloqueio de hotlink —
  TDR 0005
- `user.photoURL` não vai para o Firestore nem para o export JSON —
  `docs/modelo-intercambio.md`
- Nenhum componente ganha rolagem própria — IDR 0008

## Escopo e instruções de implementação
1. Registrar as decisões do avatar num IDR (ver "Decisões em aberto").
2. Passar `user.photoURL`/`user.displayName` de `App.jsx` para o componente
   decidido (`Cabecalho` ou `Controles`).
3. `<img>` circular (`border-radius: 50%`), `referrerPolicy="no-referrer"`,
   `alt=""` se decorativo ou `alt` com o nome se for alvo clicável.
4. Se o avatar assumir o clique do menu de ações, mover o `aria-label` e o
   comportamento de abrir o popup do botão atual para o avatar, sem duplicar o
   alvo, e atualizar o IDR 0024.
5. Implementar o fallback decidido para `photoURL` ausente.
6. Testes em `Cabecalho.test.jsx` (e `MenuDeAcoes.test.jsx`, se o gatilho
   mudar): avatar com foto, fallback sem foto, um único alvo de abertura do
   menu.
7. Descrever o avatar em `docs/interface.md` § Cabeçalho, citando o IDR.

**Fora do escopo**: editar a CSP; adicionar outro provedor de login; mostrar o
e-mail ou qualquer outro dado da conta além da foto e do nome acessível.

## Decisões já tomadas (não reabrir)
- Login Google pelo SDK modular, sem FirebaseUI — ver
  `docs/adr/0004-login-google-sdk-modular.md`
- CSP já libera a origem da foto — ver
  `docs/tdr/0005-csp-firebase-auth-google-oauth.md`
- "Sair da conta" mora dentro do menu de ações — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` (só o gatilho pode
  mudar)

## Decisões em aberto nesta tarefa
- Relação com o menu de ações, fallback sem foto, tamanho e posição —
  encaminhamento: mesmo diâmetro de 30×30px dos botões de comando, no extremo
  direito da linha; fallback com a inicial do nome; avatar substitui o botão
  do menu se couber como alvo único acessível. Registro: nasce um IDR sobre o
  avatar do usuário no cabeçalho.
- **Muda decisão documentada** (só se o avatar assumir o gatilho do menu):
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — "um botão de
  ações no cabeçalho abre o popup" → o avatar do usuário abre o popup; o
  conteúdo do menu não muda; entrada em `## Histórico`.

## Impedimentos específicos
- Se a origem da imagem do Google exigir editar a CSP (`firebase.json`),
  bloqueie — é configuração pública, fora do escopo.

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.css` — modificar
- `src/components/Controles.jsx`, `src/components/MenuDeAcoes.jsx` —
  modificar, se o avatar assumir o gatilho do menu
- `src/components/Cabecalho.test.jsx` — modificar;
  `src/components/MenuDeAcoes.test.jsx` — modificar, se o gatilho mudar
- `docs/interface.md` — modificar (§ Cabeçalho)
- `docs/idr/` — criar (avatar do usuário no cabeçalho)
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` — modificar, se o
  gatilho mudar

## Critérios de aceite
- [ ] O IDR registra as três decisões (gatilho do menu, fallback,
      tamanho/posição)
- [ ] Avatar aparece no cabeçalho para contas com `photoURL` (teste)
- [ ] Fallback funciona para contas sem `photoURL` (teste)
- [ ] `firebase.json` não foi alterado
- [ ] Se o avatar assumiu o clique do menu, há um único alvo que abre o popup
      (teste)

## Validação adicional
Verificação visual em `npm run dev`: logar com uma conta Google real e
conferir a foto no cabeçalho; simular `photoURL: null` para conferir o
fallback.
