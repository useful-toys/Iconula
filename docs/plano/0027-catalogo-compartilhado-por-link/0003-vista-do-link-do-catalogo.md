<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0003]: vista do link do catálogo

## Status
Pendente

## Objetivo
Abrir `/catalogo/<uid>` como a vista somente leitura do catálogo do dono,
sem login e antes da guarda de login, com uma leitura do documento, os
estados de carregando, não compartilhado e falha, e as preferências lidas
sem gravação. Depois desta tarefa, um link ligado à mão (emulador ou
console) já mostra o catálogo alheio.

## Documentos de referência
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — vista, estados, textos, "o caminho manda", uma leitura ao
  abrir, sem identidade do dono
- `docs/tdr/0020-privacidade-como-vista-interna.md` § Decisão — caminho
  lido em `App.jsx`, sem router; vistas internas continuam valendo
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
  § Decisão — leitura sem gravação na vista do link
- `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
  § Decisão — padrão por faixa quando não há preferência
- `docs/idr/0035-tela-neutra-enquanto-a-sessao-resolve.md` § Decisão
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`
  § Decisão
- `docs/model-dr/0002-schema-do-documento-da-colecao.md` § Decisão
- `src/App.jsx` — ramos de retorno, carga, preferências
- `src/lib/colecaoRemota.js` — `carregarColecao`, `mensagemDeErro`,
  `formatarCarimbo`
- `src/lib/preferenciasDeVista.js`; componentes da Tarefa 0027-0002
- `docs/interface.md` § Tela principal, § Avisos, § Demais telas;
  `docs/arquitetura.md` § Visão geral, § Camadas no cliente, § Dados e
  fluxo

## Padrões e convenções aplicáveis
- `colecaoRemota.js` continua o único módulo que toca o SDK do Firestore —
  ADR 0005, `AGENTS.md`
- Uma leitura por abertura; nada de `onSnapshot` — IDR 0055, requisitos.md
  § Economia de requisições
- A vista não usa a sessão: não lê `user`, não carrega a coleção do
  visitante, não pede atestação — IDR 0055
- Link desligado e `uid` inexistente com a mesma resposta; nada revela se
  a conta existe — IDR 0055
- Sem router nem estado global — TDR 0020, `AGENTS.md`
- `onAuthStateChanged` e a carga da coleção do usuário logado não disparam
  leitura extra por causa da vista — requisitos.md § Economia de
  requisições

## Escopo e instruções de implementação
1. `src/lib/colecaoRemota.js`: função que lê `users/{uid}` para a vista do
   link, sem exigir sessão, com o mesmo contrato de resultado discriminado
   e aviso de espera de `carregarColecao`; distingue `compartilhado`
   (contagens e `updatedAt`), `nao-compartilhado` (permissão negada ou
   documento inexistente) e `erro`. Não expõe `atestadoEm` ao chamador.
2. `src/App.jsx` (ou um componente novo em `src/components/`, decisão de
   nível 1): na abertura, `location.pathname` no formato `/catalogo/<uid>`
   leva à vista do link, checada depois das vistas internas (política e
   termos) e antes de `!authResolvido`, `!user` e atestação. Caminho em
   outro formato segue o fluxo atual.
3. A vista:
   - carregando: tela neutra (IDR 0035);
   - `compartilhado`: cabeçalho com placar e relógio do dono, rótulo
     `somente leitura` e título como link para `/`, sem compartilhar nem
     avatar; controles sem desfazer; catálogo sem `onAjustar`, com colapso
     lido e não gravado; faixa de bandeiras e tooltip; avisos; rodapé com
     política e termos;
   - `nao-compartilhado`: `Este catálogo não está compartilhado.` e o link
     `Conhecer o Iconula` para `/`, com o rodapé;
   - `erro`: a mesma tela de não compartilhado, com o aviso de falha
     `Falha ao carregar o catálogo — toque para detalhes` e o detalhe
     técnico; recarregar tenta de novo;
   - ordenação, disposição e filtro lidos de `lerPreferenciasDeVista`; as
     trocas valem só em memória e **não** chamam
     `gravarPreferenciasDeVista`.
4. Testes: novo `src/App.catalogoCompartilhado.test.jsx` com o módulo
   remoto e o Auth stubados — caminho `/catalogo/<uid>` sem sessão mostra o
   catálogo sem login; com sessão do próprio dono mostra a mesma vista; não
   compartilhado e inexistente mostram a mesma mensagem; erro mostra a
   mensagem e o aviso de falha; trocar ordenação na vista não grava
   preferência; cartões não ajustam; nenhum nome, foto ou e-mail aparece;
   caminho `/` segue a guarda de login. Teste da nova função em
   `src/lib/colecaoRemota.test.js`.
5. `docs/interface.md`, citando IDR 0055 e TDR 0020:
   - seção nova "Catálogo compartilhado" em § Demais telas: o que a vista
     mantém e tira, rótulo, título como link, estados e textos, "o caminho
     manda", preferências lidas e não gravadas, cartões inertes;
   - § Avisos: falha de carga do catálogo compartilhado entre as falhas.
6. `docs/arquitetura.md`, citando IDR 0055, MDR 0002 e TDR 0020: § Visão
   geral (leitura pública por link nas regras), § Camadas no cliente
   (`App.jsx` decide também a vista do link), § Dados e fluxo (fluxo "Link
   do catálogo": caminho → uma leitura sem login → vista somente leitura).
7. `AGENTS.md` § Onde fica cada coisa: o novo teste de `App`, a função nova
   de `colecaoRemota.js` e o componente novo, se houver.

**Fora do escopo**: ligar e desligar o link pela interface (Tarefa
0027-0004); copiar e compartilhar o link (Tarefa 0027-0005); texto da
política, `noindex` e e2e (Tarefa 0027-0006).

## Decisões já tomadas (não reabrir)
- Vista, estados, textos, leitura única, sem identidade, "o caminho manda"
  — ver `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- Caminho `/catalogo/<uid>` lido em `App.jsx`, sem router — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`
- Preferências lidas e não gravadas na vista — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Leitura pública condicionada a `linkAtivo` — ver
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`

## Decisões em aberto nesta tarefa
- Vista num componente novo ou como ramo de `App.jsx` — nível 1;
  registrar no log.
- Comportamento com `uid` vazio ou barra final (`/catalogo/`,
  `/catalogo/<uid>/`) — nível 2: premissa conservadora, tratar como não
  compartilhado; registrar no log.

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/App.catalogoCompartilhado.test.jsx` — criar
- `src/lib/colecaoRemota.js`, `src/lib/colecaoRemota.test.js` — modificar
- `src/components/` — criar (componente da vista, se a execução optar)
- `docs/interface.md` — modificar (§ Demais telas, § Avisos)
- `docs/arquitetura.md` — modificar (§ Visão geral, § Camadas no cliente,
  § Dados e fluxo)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] `/catalogo/<uid>` sem sessão mostra o catálogo do dono em somente
      leitura, sem tela de login nem atestação (teste)
- [ ] O dono logado abrindo o próprio link vê a mesma vista (teste)
- [ ] Desligado e inexistente mostram `Este catálogo não está
      compartilhado.` com `Conhecer o Iconula`; erro soma o aviso de falha
      (testes)
- [ ] Uma única chamada de leitura por abertura, sem carga da coleção do
      visitante (teste com contagem de chamadas)
- [ ] Trocar ordenação, disposição, filtro ou colapso na vista não grava
      no `localStorage` (teste)
- [ ] Nenhum nome, foto ou e-mail na vista (teste)
- [ ] `/` segue a guarda de login como antes (testes existentes verdes)
- [ ] `docs/interface.md`, `docs/arquitetura.md` e `AGENTS.md` atualizados
      nas seções indicadas, citando os registros

## Validação adicional
`npm run dev` com o emulador (`test:e2e:dev` ou `VITE_USE_FIREBASE_EMULATOR`)
e um documento com `linkAtivo: true` gravado pela fixture: abrir
`/catalogo/<uid>` numa janela anônima e conferir cabeçalho, controles,
disposição álbum, faixa e cartões inertes; sem ambiente, verificação
`pendente` com este roteiro.
