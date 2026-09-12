<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Índice de TDRs

Todo Technical Decision Record do projeto. Ver [CLAUDE.md](CLAUDE.md)
para o escopo, a estrutura obrigatória e o guia de estilo. Ao criar um
TDR ou mudar seu `## Status`, atualize a linha correspondente **no mesmo
commit**.

| Nº | Título | Status | Tags | Resumo |
|---|---|---|---|---|
| [TDR 0001](0001-estrutura-inicial-do-projeto.md) | Estrutura inicial do projeto | Aceito | estrutura, dados | Dados dos times em `src/data/teams.js`, botão apresentacional em `TeamButton.jsx`, estado e avanço em `App.jsx`. |
| [TDR 0002](0002-headers-de-seguranca-hosting.md) | Headers de segurança no Firebase Hosting | Aceito | seguranca, csp, deploy | CSP restrita a `'self'` e demais headers de segurança/cache adicionados a `hosting.headers` no `firebase.json`. |
| [TDR 0003](0003-lint-proibe-dangerously-set-inner-html.md) | Lint proíbe `dangerouslySetInnerHTML` | Aceito | seguranca, lint | Regra `react/no-danger` como erro no oxlint, para barrar automaticamente a reintrodução do vetor de XSS já corrigido. |
| [TDR 0004](0004-ci-roda-lint-e-testes.md) | Workflow de CI separado para lint e testes | Aceito | ci, seguranca | Workflow `ci.yml` próprio, sem secrets, roda lint/teste/build em todo PR (inclusive fork) como status check independente. |
| [TDR 0005](0005-csp-firebase-auth-google-oauth.md) | CSP para Firebase Auth + login com Google | Aceito — atualizado | seguranca, csp, auth | CSP aberta ponto a ponto para o Firebase Auth; exceção ao gapi (`apis.google.com`) é custo estrutural do SDK, inevitável em popup ou redirect. |
| [TDR 0006](0006-pinning-actions-por-sha.md) | Actions de GitHub referenciadas por SHA de commit | Aceito | ci, seguranca | Actions dos workflows de deploy pinadas por SHA de commit, com `sha_pinning_required` obrigatório no repositório. |
| [TDR 0007](0007-csp-para-o-firestore.md) | CSP para o Cloud Firestore | Aceito | seguranca, csp, firestore | `connect-src` ganha só `https://firestore.googleapis.com`; `wss:` não é necessário, confirmado no bundle do SDK. |
| [TDR 0008](0008-deploy-e-teste-das-regras-do-firestore.md) | Deploy e teste das regras de segurança do Firestore | Aceito | firestore, seguranca, ci | Regras restringem `get`/`create`/`update` ao dono do documento e validam o schema; testadas no emulador e publicadas em step próprio no merge. |
| [TDR 0009](0009-validacao-do-mapa-nas-regras.md) | O que as regras conseguem validar no mapa de contagens | Aceito | firestore, seguranca, estado | Teto de 99 por chave valida todos os valores numa cláusula; validar as 994 chaves por allow-list fica condicionado a caber no limite de expressões. |
| [TDR 0010](0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md) | Forma do catálogo, degradação da fonte do checklist e ausência de pipeline | Aceito | catalogo, dados | Catálogo nasce de `secoes` escritas à mão e `figurinhas` expandida por função pura; sem pipeline de geração, lacunas da fonte degradam campo a campo. |
| [TDR 0011](0011-gitignore-nao-pode-ignorar-logs-do-plano.md) | `.gitignore` não pode ignorar os logs de execução do plano | Aceito | plano, git | Regra `logs` restrita a `/logs` no `.gitignore`, que sem a barra ignorava também `docs/plano/*/logs/`. |
| [TDR 0012](0012-derivacoes-do-catalogo-em-src-data.md) | Derivações do catálogo em `src/data/` | Aceito | catalogo, dados, estrutura | Ordenações e layout de álbum ficam em `src/data/`, junto do catálogo, por serem propriedades do dado sem efeito colateral. |
| [TDR 0013](0013-tipografia-vendorizada.md) | Tipografia vendorizada (Poppins via Hosting) | Aceito | tipografia, seguranca, assets | Poppins 600/700 vendorizada em `src/assets/fonts/`, sem CDN externo — preserva a CSP fechada e a ausência de requisições de terceiro em runtime. |
| [TDR 0014](0014-estado-da-colecao-sem-context.md) | Estado da coleção sem Context por enquanto | Aceito | estado, estrutura | Coleção de contagens continua em estado local de `App.jsx` com prop-drilling, enquanto a árvore tiver até três níveis. |
| [TDR 0015](0015-ordenacao-padrao-provisoria-ordem-do-album.md) | Ordenação padrão provisória — ordem do álbum | Provisório (até a Tarefa 0010-0003) | interface, estado | Ordenação `'pagina'` (ordem do álbum) como valor padrão provisório até a Fase 10 decidir por faixa de tela. |
| [TDR 0016](0016-carga-no-login-corrida-e-formato-do-carimbo.md) | Carga no login — proteção de corrida e formato do carimbo | Aceito | firestore, estado, interface | Contador de ajustes descarta a resposta do servidor se houver ajuste local mais novo; carimbo em `HH:mm` (hoje) ou `dd/mm/aa HH:mm` (outro dia). |
| [TDR 0017](0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md) | Escrita por `setDoc` com merge e carimbo local pós-gravação | Aceito | firestore, estado | `setDoc` com `merge: true` cria ou atualiza o documento numa única chamada; carimbo exibido é o instante local de confirmação, não uma leitura extra. |
| [TDR 0018](0018-marca-de-apagar-teamname-via-chave-reservada.md) | Marca de apagar o `teamName` via chave reservada em `alteracoes` | Aceito | estado, firestore | Chave reservada `'__apagarTeamName'` no mapa de alterações evita mudar a assinatura de `gravar` e reabrir testes já existentes. |
| [TDR 0019](0019-espera-sem-rede-via-corrida-com-timeout-e-callback.md) | Espera sem rede via corrida com tempo-limite e callback | Aceito | estado, firestore | Callback `aoEsperar`, chamado ao vencer um tempo-limite de 5s, avisa "sem conexão" sem inventar um terceiro estado de retorno nem mudar assinaturas existentes. |
| [TDR 0020](0020-privacidade-como-vista-interna.md) | Política de privacidade como vista interna, não rota | Aceito | interface, estrutura | Tela de privacidade é um estado booleano em `App.jsx`, no mesmo padrão dos ramos de retorno já existentes — sem introduzir router. |
