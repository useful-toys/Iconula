<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0005]: avatar do usuário no título

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `src/App.jsx` — `user` já vem de `onAuthStateChanged` (linha ~143), com
  `user.photoURL` disponível sem chamada extra
- `firebase.json` — `Content-Security-Policy` já libera
  `https://lh3.googleusercontent.com` em `img-src`
- `docs/tdr/0005-csp-firebase-auth-google-oauth.md` § Decisão — a liberação de
  `lh3.googleusercontent.com` foi feita "para a foto de perfil do usuário
  autenticado"; sobrou do FirebaseUI removido (ADR 0006), mas continua válida
  e cobre este caso — **não deve ser preciso reabrir este TDR**
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão —
  minimalismo como regra de ouro; esta tarefa introduz um elemento novo no
  título e precisa se posicionar frente a essa regra
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` — "sair da conta" foi
  deliberadamente escondido no menu de ações para não ocupar a linha de
  comando; o avatar reabre a pergunta de quanto espaço/atenção a identidade
  do usuário merece no cabeçalho
- `src/components/MenuDeAcoes.jsx` — botão atual que abre o popup de ações

## Objetivo
Mostrar no cabeçalho uma evidência visual de qual conta Google está
autenticada — a foto de perfil, reduzida à altura da linha de título —
decidindo explicitamente a relação com o botão do menu de ações já existente
e o comportamento para contas sem foto.

## Padrões e convenções aplicáveis
- Minimalismo é regra de ouro (`docs/idr/0018-*`) — o avatar precisa se
  justificar como identidade funcional (confirmar qual conta está logada),
  não como decoração
- CSP já cobre a origem da imagem — não editar `firebase.json` nesta tarefa;
  se o Google mudar de origem no futuro, é um TDR à parte
- `referrerPolicy="no-referrer"` na tag `<img>` — evita bloqueio de hotlink
  pelo servidor de imagens do Google
- Sem dado pessoal em lugar que persista fora da sessão do navegador — a URL
  da foto já é pública ao usuário logado e não é gravada em lugar novo
  (`user.photoURL` não vai para o Firestore; a coleção já é isenta de dados
  pessoais — ver export/import da Fase 9)
- Nenhum componente ganha rolagem própria (IDR 0008)

## Escopo e instruções de implementação
1. Registrar **IDR** decidindo:
   a. **Relação com o menu de ações**: o avatar substitui o botão que abre o
      `MenuDeAcoes` (um único alvo, com identidade e ação juntas) ou é um
      elemento à parte, sem clique, com o botão do menu continuando como está
      hoje?
   b. **Fallback sem foto**: contas Google sem `photoURL` (existe esse caso)
      mostram o quê — iniciais do nome, ícone genérico, ou nada (mantém o
      layout atual para essas contas)?
   c. **Tamanho e posição**: diâmetro do avatar (ex.: mesma altura de
      30×30px já usada por desfazer/menu/faixa, para reaproveitar a mesma
      área de toque ampliada do IDR 0042 se for clicável) e onde entra na
      linha do título (extremo direito, ao lado dos botões de comando).
2. Implementar consumindo `user.photoURL`/`user.displayName` já disponíveis
   em `App.jsx`, passando como prop para `Cabecalho` (ou para `Controles`,
   conforme decidido em 1a).
3. `<img>` circular (`border-radius: 50%`), `referrerPolicy="no-referrer"`,
   `alt=""` se decorativo ou `alt` com o nome se for alvo clicável do menu.
4. Se o avatar assumir o clique do menu de ações (decisão 1a), mover o
   `aria-label`/comportamento de abrir popup do botão atual para o avatar,
   sem duplicar o alvo.
5. Atualizar `docs/interface.md` § Cabeçalho com o novo elemento.

**Fora do escopo**: editar a CSP; adicionar outro provedor de login; mostrar
o e-mail ou qualquer outro dado da conta além da foto.

## Decisões já tomadas (não reabrir)
- Login via Google/Firebase Auth, sem FirebaseUI — ver `docs/adr/0006-*`
- CSP já libera a origem da foto — ver `docs/tdr/0005-*`
- "Sair da conta" vive no menu de ações, não na linha de comando — ver
  `docs/idr/0024-*` (revisitada apenas quanto ao *gatilho* do menu, não quanto
  a onde "sair da conta" mora dentro dele)

## Decisões em aberto nesta tarefa
- Avatar substitui ou coexiste com o botão do menu de ações — encaminhamento
  no passo 1a; nasce **IDR 0045** (próximo número livre)
- Fallback sem foto — mesmo IDR, passo 1b
- Tamanho e posição — mesmo IDR, passo 1c

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
   **Caso concreto previsto aqui**: se a origem da imagem do Google mudar e
   exigir editar a CSP (configuração pública), pare e sinalize — não é uma
   mudança interna ao código.

## Arquivos impactados
- `src/App.jsx` — modificar (passar `user`/`photoURL` adiante)
- `src/components/Cabecalho.jsx` — modificar
- `src/components/Cabecalho.css` — modificar
- `src/components/Controles.jsx`, `MenuDeAcoes.jsx` — modificar, se o avatar
  assumir o gatilho do menu (decisão 1a)
- `src/components/Cabecalho.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho)
- `docs/idr/0045-avatar-do-usuario-no-titulo.md` — criar

## Critérios de aceite
- [ ] IDR 0045 registrado com as três decisões (gatilho do menu, fallback,
      tamanho/posição)
- [ ] Avatar aparece no cabeçalho para contas com `photoURL`
- [ ] Fallback definido funciona para contas sem `photoURL`
- [ ] Nenhuma mudança na CSP foi necessária
- [ ] Se o avatar assumiu o clique do menu, não há dois alvos fazendo a mesma
      coisa

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: logar com uma conta Google real e
conferir a foto no cabeçalho; simular `photoURL: null` para conferir o
fallback.
