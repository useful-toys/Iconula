<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0035: Tela neutra enquanto a sessão resolve, sem piscar o login

## Status

Aceito — decide o item em aberto da Tarefa 0008-0001 ("como se comporta a
tela enquanto o estado de autenticação ainda não resolveu").

## Contexto

A Tarefa 0008-0001 fecha o app atrás do login: deslogado, só a tela de login
existe (`requisitos.md` § Acesso). Isso cria um intervalo novo — entre o
primeiro render de `App.jsx` e a primeira emissão de `onAuthStateChanged` —
em que o Firebase Auth ainda não informou se há sessão restaurada (ex.:
usuário já autenticado numa visita anterior, cujo token o SDK confirma de
forma assíncrona).

Sem tratamento, esse intervalo herdaria o valor inicial de `user`
(`null`) e mostraria a tela de login por um instante, mesmo para quem já
está autenticado — um "pisca" que o critério de aceite da tarefa proíbe
explicitamente.

## Decisão

- Um estado `authResolvido` (`false` até a primeira emissão de
  `onAuthStateChanged`, `true` depois, para sempre) decide se a tela de
  login pode aparecer.
- Enquanto `authResolvido` é `false`, a tela fica **neutra**: nem login, nem
  catálogo — apenas o contêiner `.app` vazio, sem spinner, sem texto, sem
  esqueleto de layout.
- Esse estado só existe quando `auth` está configurado (há Firebase Auth
  para resolver); sem `VITE_FIREBASE_*` não há nada a esperar — a tela de
  login indisponível aparece direto (Tarefa 0008-0001).

## Consequências

- Nenhum flash de tela errada para quem já tem sessão: o React troca
  diretamente do vazio para a tela principal.
- Quem não tem sessão vê a tela em branco por um instante (tipicamente
  alguns milissegundos, a confirmação local do SDK) antes do login
  aparecer — aceito: mais curto e menos ruidoso do que um spinner para um
  intervalo que normalmente nem é perceptível.
- O desenho definitivo da tela de login (Tarefa 0008-0002) não precisa
  tratar esse intervalo — ele já fica resolvido antes de qualquer decisão
  visual daquela tarefa.

## Alternativas consideradas

- **Mostrar um spinner/skeleton**: mais explícito, mas acrescenta um
  terceiro visual para um intervalo tipicamente muito curto — contraria o
  minimalismo de `requisitos.md` § UX (IDR 0018) sem ganho perceptível.
- **Assumir deslogado até resolver (comportamento anterior)**: é exatamente
  o "pisca" que o critério de aceite da tarefa proíbe.
- **Assumir logado até resolver**: esconderia a tela de login de quem
  realmente está deslogado, e arriscaria expor o catálogo por um instante
  sem autenticação confirmada — inaceitável frente a `requisitos.md` §
  Acesso.
