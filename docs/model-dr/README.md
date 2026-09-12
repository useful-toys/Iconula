<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Índice de MDRs

Todo Model Decision Record do projeto. Ver [CLAUDE.md](CLAUDE.md)
para o escopo, a estrutura obrigatória e o guia de estilo. Ao criar um
MDR ou mudar seu `## Status`, atualize a linha correspondente **no mesmo
commit**.

| Nº | Título | Status | Tags | Resumo |
|---|---|---|---|---|
| [MDR 0001](0001-localizacao-do-documento-no-firestore.md) | Localização do documento no Firestore | Aceito | firestore, schema | Um documento por usuário em `users/{uid}`, uid no caminho, documento raiz, sem queries. |
| [MDR 0002](0002-schema-do-documento-da-colecao.md) | Schema do documento da coleção | Aceito | firestore, schema | Mapa esparso `contagens`, `updatedAt`, `atestadoEm`; chave ausente = 0; teto 99; evolução de schema (migração `teamName`), regras `create` vs `update`. |
| [MDR 0003](0003-gravacao-agregada-da-colecao.md) | Gravação agregada da coleção | Aceito | firestore, persistencia | Três funções de escrita (`merge: true`, `mergeFields`, atestação); debounce ~2s, teto ~10s, flush em `pagehide`, cache IndexedDB; proteção de corrida, descartar pendências. |
| [MDR 0004](0004-formato-de-intercambio-da-colecao.md) | Formato de intercâmbio da coleção | Aceito | portabilidade, schema | JSON versionado com `versao`, `geradoEm`, `contagens`; sem dados pessoais; fronteira de validação (`validarImportacao` valida, `gravarImportacao` confia). |
| [MDR 0005](0005-representacao-em-memoria-na-spa.md) | Representação em memória na SPA | Aceito | estado, estrutura | Mapa esparso em `App.jsx`, preferências no `localStorage`, catálogo embutido, progresso calculado. |
| [MDR 0006](0006-catalogo-estatico-embutido.md) | Catálogo estático embutido | Aceito | catalogo, dados | 50 seções, 994 figurinhas expandidas por função pura; FWC `inicio: 0`, seleções `inicio: 1`. |
| [MDR 0007](0007-persistencia-no-armazenamento-local.md) | Persistência no armazenamento local | Aceito | persistencia, localStorage, IndexedDB | Preferências de vista no `localStorage` (versionado, por dispositivo); cache do Firestore no IndexedDB (multi-aba, flush garantido). |
