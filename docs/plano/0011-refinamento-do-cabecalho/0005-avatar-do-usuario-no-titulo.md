<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0005]: avatar do usuário como botão do menu

## Status
Pendente

## Objetivo
Mostrar qual conta Google está autenticada: a foto de perfil substitui o botão
do menu de ações e abre o mesmo popup; sem foto, a inicial do nome.

## Documentos de referência
- `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md` § Decisão — forma,
  posição, fallback e nome acessível
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão e
  § Histórico — o avatar como gatilho; o popup não muda
- `src/App.jsx` — estado `user` do `onAuthStateChanged`, com `photoURL` e
  `displayName`
- `src/components/MenuDeAcoes.jsx`, `MenuDeAcoes.css`,
  `MenuDeAcoes.test.jsx` — botão atual que abre o popup
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` — `img-src`
  já libera `lh3.googleusercontent.com`
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — área de toque
  ampliada do botão de 30×30px
- `docs/interface.md` § Cabeçalho, § Menu de ações e § Medidas

## Padrões e convenções aplicáveis
- Um único alvo abre o popup — IDR 0049
- A imagem vai sem referrer e é decorativa; o nome acessível está no botão
  — IDR 0049
- `photoURL` não vai ao Firestore nem ao export JSON —
  `docs/modelo-intercambio.md`
- `firebase.json` não muda — DDR 0001

## Escopo e instruções de implementação
1. Passar `photoURL` e `displayName` do `user` de `App.jsx` até o botão do
   menu de ações.
2. O botão do menu mostra a foto circular de 30×30px; se não houver foto ou a
   imagem falhar ao carregar, mostra a inicial maiúscula do `displayName` em
   `--gold` sobre `--panel` com borda `--gold`; sem `displayName`, o glifo
   atual.
3. O nome acessível do botão acrescenta o nome da conta ao nome atual.
4. Testes em `MenuDeAcoes.test.jsx`: com foto, a imagem aparece; sem foto, a
   inicial; sem nome, o glifo; falha de carregamento cai na inicial; um único
   botão abre o popup; o nome acessível inclui o nome da conta.
5. Em `docs/interface.md` § Cabeçalho e § Menu de ações, "botão de ações"
   passa a "avatar do usuário (foto ou inicial) que abre o popup"; § Medidas,
   linha "Desfazer e menu de ações", descreve o avatar de 30×30px circular —
   citando os IDRs 0049 e 0024.

**Fora do escopo**: editar a CSP; outro provedor de login; exibir e-mail ou
outro dado da conta; conteúdo do popup.

## Decisões já tomadas (não reabrir)
- Avatar como gatilho, forma, fallback e nome acessível — ver
  `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md`
- Conteúdo e fechamento do popup — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Login Google pelo SDK modular — ver
  `docs/adr/0004-login-google-sdk-modular.md`

## Impedimentos específicos
- Se a foto do Google exigir mudar a CSP (`firebase.json`), bloqueie — é
  configuração pública, fora do escopo.

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/components/MenuDeAcoes.jsx`, `src/components/MenuDeAcoes.css`,
  `src/components/MenuDeAcoes.test.jsx` — modificar
- `src/components/Controles.jsx` — modificar, se for o caminho das props
- `docs/interface.md` — modificar (§ Cabeçalho, § Menu de ações, § Medidas)

## Critérios de aceite
- [ ] Com `photoURL`, o botão do menu mostra a foto (teste)
- [ ] Sem foto ou com falha de carregamento, mostra a inicial; sem nome, o
      glifo (teste)
- [ ] Um único alvo abre o popup e o nome acessível inclui o nome da conta
      (teste)
- [ ] `firebase.json` não foi alterado
- [ ] `docs/interface.md` descreve o avatar citando os IDRs 0049 e 0024

## Validação adicional
Verificação visual em `npm run dev`: logar com conta Google real e conferir a
foto; simular `photoURL` nulo para conferir a inicial; abrir e fechar o popup
pelo avatar com mouse, toque e teclado.
