<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0002-0005]: remover o Iconula Button e ajustar os metadados do site

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Fora de Escopo — "o botão de seleções atual removido no PR de implementação desta especificação; o histórico permanece no git"
- `docs/requisitos.md` § Requisitos Não Funcionais — `<html lang="pt-BR">` corrigindo o `lang="en"` atual, e `title`/`description`/Open Graph em PT-BR
- `docs/requisitos.md` § Dados e isolamento — o `teamName` é removido na migração, pela primeira gravação do schema novo
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — a migração do `teamName` acontece na gravação, não aqui
- `AGENTS.md` § Onde fica cada coisa — as linhas que descrevem os arquivos removidos
- `AGENTS.md` § O que é este projeto — o texto que descreve o botão e a "mudança de rumo decidida"
- `docs/tdr/0002-headers-de-seguranca-hosting.md` § Decisão — a CSP que qualquer metadado novo precisa respeitar

## Objetivo
Apagar o produto antigo no mesmo PR que entrega o novo, deixando a `main` com um
produto inteiro e não com dois pela metade. Sai o botão, saem seus dados, estilos,
testes e a persistência do time; entram os metadados do site em português.

## Padrões e convenções aplicáveis
- Ao remover arquivo, limpar também imports, testes, estilos e assets órfãos, e
  garantir que `npm run lint` e `npm run test` passem sem referência residual —
  regra do modelo de tarefa deste plano
- `AGENTS.md` § Onde fica cada coisa e § O que é este projeto precisam refletir a
  realidade depois da remoção, no mesmo PR — `AGENTS.md` § Convenções
- Não abrir exceção de CSP por causa de metadado: imagem de Open Graph, se
  houver, é servida pelo próprio Hosting — `docs/tdr/0002-*` § Consequências
- O `teamName` **não** é apagado do Firestore aqui: isso é a Tarefa 0006-0004 —
  `docs/adr/0008-*` § Decisão
- Todo texto visível e todo metadado em PT-BR — `docs/requisitos.md` § Requisitos
  Não Funcionais

## Escopo e instruções de implementação
1. Remover os arquivos do botão: `src/components/TeamButton.jsx`,
   `src/data/teams.js`, `src/App.css` e `src/lib/userPreferences.js` com
   `src/lib/userPreferences.test.js` e `src/lib/userPreferences.unavailable.test.js`.
2. Remover de `src/App.jsx` o estado do índice, a lógica de wrap-around, o
   contador de cliques e as chamadas de carga e gravação do time.
3. Remover de `src/App.test.jsx` e `src/App.auth-unavailable.test.jsx` os testes
   do botão e da persistência do time, preservando os de login/logout que
   continuam válidos — o app segue com Firebase Auth funcionando.
4. Conferir que nenhum asset ficou órfão: as 48 bandeiras continuam em uso pelo
   catálogo (agora endereçadas pelo emoji da seção), e `src/assets/google-logo.svg`
   continua em uso pelo `LoginButton`.
5. `index.html`: trocar `lang="en"` por `lang="pt-BR"`, atualizar `title` e
   `description` para o produto novo, e acrescentar os Open Graph básicos
   (`og:title`, `og:description`, `og:type`, `og:locale`) em PT-BR.
6. Atualizar o `AGENTS.md`: a descrição do projeto em § O que é este projeto deixa
   de falar do botão e passa a descrever o controle de figurinhas; as linhas dos
   arquivos removidos saem da tabela § Onde fica cada coisa e as dos arquivos
   novos entram. A seção § Cuidado sobre Inglaterra e Escócia **permanece** — as
   bandeiras continuam em uso.
7. Renomear o pacote em `package.json` de `iconula-button` para `iconula`, já que
   o nome descreve o produto que deixou de existir.

**Fora do escopo**: apagar o campo `teamName` dos documentos do Firestore
(Tarefa 0006-0004); mudar as regras (Fase 5); tocar em workflows ou em
`firebase.json`.

## Decisões já tomadas (não reabrir)
- O botão é removido na implementação desta especificação; o histórico fica no git — ver `docs/requisitos.md` § Fora de Escopo
- O `App.css` da era do botão deixa de ser base a preservar — ver `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`
- O `teamName` é apagado pela primeira gravação do schema novo, não por migração à parte — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- Modo local sem login está permanentemente fora de escopo — ver `docs/requisitos.md` § Fora de Escopo

## Decisões em aberto nesta tarefa
- Se o `package.json` é renomeado agora ou fica como está — encaminhamento:
  renomear, porque `iconula-button` passa a descrever algo que não existe;
  registrar no log, sem registro próprio (não é decisão de arquitetura)

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
- `src/components/TeamButton.jsx` — remover
- `src/data/teams.js` — remover
- `src/App.css` — remover
- `src/lib/userPreferences.js` — remover
- `src/lib/userPreferences.test.js` — remover
- `src/lib/userPreferences.unavailable.test.js` — remover
- `src/App.jsx` — modificar
- `src/App.test.jsx` — modificar
- `src/App.auth-unavailable.test.jsx` — modificar
- `index.html` — modificar
- `AGENTS.md` — modificar
- `package.json` — modificar

## Critérios de aceite
- [ ] Nenhuma referência a `TeamButton`, `teams.js`, `App.css` ou `userPreferences` sobrou no código ou nos testes
- [ ] `npm run lint` e `npm run test` passam sem referência residual
- [ ] `index.html` tem `lang="pt-BR"`, título, descrição e Open Graph em PT-BR
- [ ] `AGENTS.md` descreve o produto novo e a tabela reflete os arquivos que existem
- [ ] O login continua funcionando: entrar e sair não quebram a tela
- [ ] Nenhuma requisição ao Firestore parte do app depois desta tarefa
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0005-log-remover-o-botao-e-ajustar-metadados.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: a tela abre no catálogo, não há vestígio do
botão, e o `lang` do documento é `pt-BR`. Conferir na aba Network que, mesmo com
usuário logado, nenhuma requisição sai para `firestore.googleapis.com`.
