<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Plano de implementação do Iconula

Roteiro executável para transformar o "Iconula Button" no controle de figurinhas
do álbum da Copa 2026 especificado em [requisitos.md](../requisitos.md).

Cada **fase** é um PR mesclável na `main`. Como o preview deploy por PR é
required check e o merge publica em produção (ADR 0003, DDR 0005), ao fim de
toda fase `npm run lint`, `npm run test` e `npm run build` passam e o app
continua utilizável — nenhuma fase deixa a `main` meio-migrada. Cada **tarefa**
é um commit de estado válido: poucos arquivos, um assunto.

Os arquivos de tarefa ficam em `docs/plano/[NNNN-nome-da-fase]/[XXXX-nome-da-tarefa].md`
e os logs de execução em `docs/plano/[NNNN-nome-da-fase]/logs/[XXXX-log-nome].md`
(a pasta `logs/` nasce com o primeiro log).

## Como o plano é produzido e executado

| Comando | Faz |
|---|---|
| `/planejar` (`.opencode/commands/planejar.md`) | Propõe fases e tarefas novas; grava os arquivos de tarefa e este README só depois da aprovação humana |
| `/executar-plano NNNN` (`.opencode/commands/executar-plano.md`) | Executa uma fase numa branch e worktree próprias, tarefa a tarefa em subagentes, e entrega num PR |
| `/executar-tarefa NNNN-XXXX` (`.opencode/commands/executar-tarefa.md`) | Executa uma tarefa e termina num commit válido, com testes, critérios de aceite verificados, decisões registradas, `docs/*.md` atualizados, setup registrado, log e status |

Os comandos têm duas versões sincronizadas, uma por ferramenta:
`.opencode/commands/` (OpenCode) e `.claude/commands/` (Claude Code).

Estrutura, status e ciclo de vida, regras que valem em toda tarefa,
comportamento padrão, formato da tarefa e formato do log estão no guia
**[CLAUDE.md](CLAUDE.md)** — a fonte única dessas regras. Este README é só o
índice: fases e tarefas.

## Fases

Status da fase:

| Status | Significado |
|---|---|
| `Pendente` | Planejada; nenhuma tarefa iniciada |
| `Em andamento` | Tarefas sendo executadas na branch da fase; ainda não entregue |
| `Entregue` | **Fechada**: entregue por PR mesclado na `main`; não recebe tarefas novas |

Detalhes e status das tarefas no guia [CLAUDE.md](CLAUDE.md) § Status e ciclo de vida.

| # | Fase | Objetivo | Depende de | PR previsto | Status |
|---|---|---|---|---|---|
| 1 | [Fundação: plano, catálogo e assets](0001-fundacao-catalogo-e-assets/) | Colocar no repositório o catálogo das 994 figurinhas e os assets que faltam, sem mudar nada na tela | — | `docs+data: plano de implementação e catálogo do álbum` | Entregue |
| 2 | [Fatia vertical: catálogo em tela](0002-fatia-vertical-catalogo-em-tela/) | Substituir o botão pela tela do catálogo com contagem ajustável em memória | 1 | `feat: tela do catálogo substitui o Iconula Button` | Entregue |
| 3 | [Percurso: ordenações, agrupamento e salto](0003-percurso-ordenacoes-e-salto/) | Duas ordenações, super-grupos A–L, colapso e salto pela faixa de bandeiras | 2 | `feat: ordenações, super-grupos colapsáveis e salto para seção` | Entregue |
| 4 | [Disposição álbum, filtro e preferências](0004-disposicao-album-filtro-e-preferencias/) | Reproduzir a página física, filtrar por status e lembrar a vista entre sessões | 3 | `feat: disposição álbum, filtro de status e preferências de vista` | Entregue |
| 5 | [Regras do Firestore para o schema novo](0005-regras-do-firestore/) | Publicar as regras do mapa esparso antes de qualquer código que o escreva | 1 | `feat(rules): schema da coleção no Firestore` | Entregue |
| 6 | [Ajuste de rota: correções de interface](0006-ajuste-de-rota/) | Corrigir o controle de menos do cartão, acrescentar o filtro de coladas e apertar a faixa de bandeiras, tudo observado com o app já em uso | 2, 3, 4 | `fix: correções de interface observadas em uso` | Entregue |
| 7 | [Persistência da coleção e avisos](0007-persistencia-da-colecao-e-avisos/) | Carregar no login, gravar agregado e informar sucesso, aviso e falha | 5, 2 | `feat: persistência da coleção e área de avisos` | Entregue |
| 8 | [Acesso, atestação e privacidade](0008-acesso-atestacao-e-privacidade/) | Login como guarda do app, atestação de menores e política de privacidade | 7 | `feat: guarda de login, atestação de menores e política de privacidade` | Entregue |
| 9 | [Desfazer, menu de ações e portabilidade](0009-desfazer-menu-e-portabilidade/) | Desfazer, popup de comandos raros, listas de troca e export/import JSON | 7, 8 | `feat: desfazer, menu de ações, listas de troca e export/import` | Entregue |
| 10 | [Acabamento: acessibilidade, desempenho e docs](0010-acabamento-acessibilidade-e-docs/) | Fechar acessibilidade, desempenho das 994, faixas de tela e a documentação | 9 | `chore: acessibilidade, desempenho e fechamento da documentação` | Entregue |
| 11 | [Refinamento do cabeçalho](0011-refinamento-do-cabecalho/) | Agrupar visualmente os controles, tooltip nas opções, bandeiras mais compactas, e avaliar fundir título/controles numa linha e mostrar a identidade do usuário | 10 | `feat: refinamento do cabeçalho e dos controles` | Pendente |
| 12 | [Redução de rolagem vertical](0012-reducao-de-rolagem-vertical/) | Colapsar por padrão o que já está completo, com colapso manual persistido, e apertar os espaçamentos repetidos do catálogo | 10 | `feat: colapso inteligente e catálogo mais compacto` | Pendente |
| 13 | [Interação por pressão longa](0013-interacao-por-pressao-longa/) | Segurar o cartão decrementa uma unidade no mobile, sem precisar mirar no botão de menos | 10 | `feat: pressão longa decrementa no mobile` | Pendente |
| 14 | [Correção urgente: renumeração do FWC](0014-numeracao-dos-extras-fifa/) | Extras FIFA de `FWC00` a `FWC19` (hoje `FWC01`–`FWC20`, deslocado em um); total do catálogo continua 994 | 10 | `fix: renumera os Extras FIFA para FWC00–FWC19` | Entregue |
| 15 | [Identidade de cor por grupo](0015-identidade-de-cor-por-grupo/) | Cor distinta por grupo de seleções (A–L) e especiais (FWC, COC), aplicada no título do super-grupo e na faixa de bandeiras — o cabeçalho de seção fica para a cor da seleção (Fase 16) | 10 | `feat: identidade de cor por grupo de seções` | Pendente |
| 16 | [Identidade de cor por seleção](0016-identidade-de-cor-por-selecao/) | Cor individual para cada uma das 48 seleções, aplicada no cabeçalho de seção | 15 | `feat: identidade de cor por seleção` | Pendente |
| 17 | [Nomes de jogadores nas figurinhas](0017-nomes-de-jogadores/) | Nome do jogador/elemento abaixo do código em cada figurinha, a partir do fornecimento do humano (fonte original) | — | `feat: nomes de jogadores nas figurinhas` | Pendente |

---

## Fase 1 — Fundação: plano, catálogo e assets

Nada muda para o usuário: a `main` continua servindo o botão. Entram dados e
assets que a Fase 2 consome. Dado sem consumidor por uma fase é aceito
deliberadamente — é o que mantém o PR da tela pequeno e revisável.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Registrar o plano no AGENTS.md](0001-fundacao-catalogo-e-assets/0001-registrar-o-plano-no-agents.md) | Acrescentar a linha de `docs/plano/` à tabela "Onde fica cada coisa" do `AGENTS.md`. | Concluída |
| 0002 | [Escrever o catálogo do álbum](0001-fundacao-catalogo-e-assets/0002-escrever-o-catalogo-do-album.md) | 50 seções e 994 códigos com sigla, nome PT-BR, ícone, grupo da Copa e páginas do álbum, transcritos do Anexo de `requisitos.md` e do IDR 0019. | Concluída |
| 0003 | [Derivações e invariantes do catálogo](0001-fundacao-catalogo-e-assets/0003-derivacoes-e-invariantes-do-catalogo.md) | Funções puras de ordenação, agrupamento A–L e layout de página, com testes que travam 994 códigos, 50 seções e 20 por seleção. | Concluída |
| 0004 | [Vendorizar ícones e tipografia](0001-fundacao-catalogo-e-assets/0004-vendorizar-icones-e-tipografia.md) | SVGs Twemoji de 🏆 e 🥤 e os arquivos da fonte Poppins, servidos pelo próprio Hosting, sem CDN em runtime. | Concluída |

## Fase 2 — Fatia vertical: catálogo em tela

A fase que troca o produto. **É aqui que o "Iconula Button" sai**: `TeamButton.jsx`,
`src/data/teams.js`, `src/App.css`, `src/lib/userPreferences.js` (e seus testes) e
os testes do botão em `App.test.jsx` são removidos no mesmo PR que entrega a tela
nova — a `main` passa de um produto inteiro para o outro num único merge, nunca
com os dois pela metade. O campo `teamName` no Firestore continua existindo nos
documentos e nas regras até as Fases 5 e 6; como nada mais escreve nele a partir
daqui, não há gravação em conflito no intervalo.

Consequência aceita e declarada: entre a Fase 2 e a Fase 7 as contagens vivem só
em memória e se perdem ao recarregar. A área de login continua na tela e funciona,
mas não guarda nada — estado transitório, não regressão silenciosa.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Tema escuro único e tokens da paleta](0002-fatia-vertical-catalogo-em-tela/0001-tema-escuro-unico-e-tokens.md) | CSS global com os tokens OKLCH, a tipografia e as medidas de `interface.md`, sem `prefers-color-scheme` e sem tema claro. | Concluída |
| 0002 | [Cabeçalho e placar em linha única](0002-fatia-vertical-catalogo-em-tela/0002-cabecalho-e-placar-em-linha-unica.md) | Placar em notação compacta com nome acessível por extenso. | Concluída |
| 0003 | [Cartão da figurinha](0002-fatia-vertical-catalogo-em-tela/0003-cartao-da-figurinha.md) | Três estados com reforço não-cromático, selo `×N` de unidades sobrando, marca de metalizada, tocar soma e ícone de menos remove. | Concluída |
| 0004 | [Seção em lista e contagem em memória](0002-fatia-vertical-catalogo-em-tela/0004-secao-em-lista-e-contagem-em-memoria.md) | Cabeçalho de seção com progresso compacto, grade que flui e quebra, incremento parando em 99 e decremento em 0. | Concluída |
| 0005 | [Remover o botão e ajustar metadados](0002-fatia-vertical-catalogo-em-tela/0005-remover-o-botao-e-ajustar-metadados.md) | Apagar botão, dados, estilos, testes e a persistência do time; `<html lang="pt-BR">`, `title`, `description` e Open Graph em PT-BR. | Concluída |

## Fase 3 — Percurso: ordenações, agrupamento e salto

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Alternador de ordenação e moldura](0003-percurso-ordenacoes-e-salto/0001-alternador-de-ordenacao-e-moldura.md) | Página do álbum × sigla da seção, com FWC abrindo e Coca-Cola fechando nas duas ordenações. | Concluída |
| 0002 | [Super-grupos A–L colapsáveis](0003-percurso-ordenacoes-e-salto/0002-super-grupos-a-l-colapsaveis.md) | Os 12 grupos da Copa com progresso agregado, abertos por padrão, FWC e COC fora deles. | Concluída |
| 0003 | [Colapso de seções](0003-percurso-ordenacoes-e-salto/0003-colapso-de-secoes.md) | Título abre/fecha o corpo da seção mantendo o resumo; estado volátil, sem persistir. | Concluída |
| 0004 | [Faixa de bandeiras e salto](0003-percurso-ordenacoes-e-salto/0004-faixa-de-bandeiras-e-salto.md) | Linha rolável com as 50 seções; tocar salta e expande super-grupo e seção no caminho. | Concluída |

## Fase 4 — Disposição álbum, filtro e preferências

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Disposição álbum das seleções](0004-disposicao-album-filtro-e-preferencias/0001-disposicao-album-das-selecoes.md) | Grid de 4 trilhas fixas por página com posições explícitas, incluindo a 13 em paisagem. | Concluída |
| 0002 | [Coca-Cola no álbum e FWC em lista](0004-disposicao-album-filtro-e-preferencias/0002-coca-cola-no-album-e-fwc-em-lista.md) | Duas páginas de 3 trilhas para a COC; FWC em lista contínua também na disposição álbum, e sem filtro. | Concluída |
| 0003 | [Empilhamento das páginas](0004-disposicao-album-filtro-e-preferencias/0003-empilhamento-das-paginas.md) | Páginas lado a lado quando cabem, empilhadas quando não cabem, sem cair para a lista. | Concluída |
| 0004 | [Filtro de status e seções vazias](0004-disposicao-album-filtro-e-preferencias/0004-filtro-de-status-e-secoes-vazias.md) | Todas/faltantes/repetidas só na disposição lista; seção e super-grupo sem resultado somem inteiros. | Concluída |
| 0005 | [Preferências de vista no localStorage](0004-disposicao-album-filtro-e-preferencias/0005-preferencias-de-vista-no-localstorage.md) | Ordenação, disposição e filtro restaurados na abertura seguinte, com degradação segura. | Concluída |

## Fase 5 — Regras do Firestore para o schema novo

Vem **antes** de qualquer código que escreva o schema novo, porque regras só
sobem no merge e não têm canal de preview (DDR 0004): um preview de PR roda o
cliente novo contra as regras antigas. Ao fim desta fase as regras de produção
já aceitam `contagens`/`updatedAt`/`atestadoEm` e recusam `teamName` — e nada
no cliente escreve no Firestore ainda, então a troca é inócua.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Regras do mapa esparso](0005-regras-do-firestore/0001-regras-do-mapa-esparso.md) | `hasOnly` dos três campos, tamanho, valores 1–99, `updatedAt == request.time` e guarda de campo ausente. | Concluída |
| 0002 | [Medir a allow-list dos códigos](0005-regras-do-firestore/0002-medir-a-allow-list-dos-codigos.md) | Gerar, medir e exercitar; se não couber no ruleset, ficar sem ela e registrar a medição. | Concluída |
| 0003 | [Testes das regras no emulador](0005-regras-do-firestore/0003-testes-das-regras-no-emulador.md) | Cobrir os casos do TDR 0009 mais o update que apaga `teamName` e o acesso cruzado entre usuários. | Concluída |
| 0004 | [Atualizar a documentação de persistência](0005-regras-do-firestore/0004-atualizar-documentacao-de-persistencia.md) | Refletir regras novas e medição em `modelo-firebase.md` e `setup-firebase.md` (à época, `firebase.md`), no mesmo PR. | Concluída |

## Fase 6 — Ajuste de rota: correções de interface

Fase curta, fora da progressão original: recolhe três correções observadas com
o app já em uso, que corrigem o que as Fases 2, 3 e 4 entregaram. Vem antes da
persistência para que o comportamento gravado a partir da Fase 7 já seja o
corrigido, e para que as três correções cheguem à `main` sem esperar o
acabamento.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Controle de menos condicionado](0006-ajuste-de-rota/0001-controle-de-menos-condicionado.md) | O menos só existe a partir da contagem 1 e vai para dentro do cartão, no canto inferior esquerdo. | Concluída |
| 0002 | [Filtro de coladas](0006-ajuste-de-rota/0002-filtro-de-coladas.md) | Quarto valor do filtro de status — contagem ≥ 1 —, entre faltantes e repetidas. | Concluída |
| 0003 | [Faixa de bandeiras mais compacta](0006-ajuste-de-rota/0003-faixa-de-bandeiras-mais-compacta.md) | Espaçamento entre bandeiras de 8px para 4px, para caber mais seções sem rolar. | Concluída |

## Fase 7 — Persistência da coleção e avisos

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Área de avisos com três severidades](0007-persistencia-da-colecao-e-avisos/0001-area-de-avisos-com-tres-severidades.md) | Faixa flutuante na borda inferior; sucesso e aviso somem em 5s, falha persiste e revela o detalhe técnico. | Concluída |
| 0002 | [Carga no login e relógio do título](0007-persistencia-da-colecao-e-avisos/0002-carga-no-login-e-relogio-do-titulo.md) | Uma leitura por login; o `updatedAt` do documento vai para o título, exibindo `—` quando não existe. | Concluída |
| 0003 | [Gravação agregada com flush](0007-persistencia-da-colecao-e-avisos/0003-gravacao-agregada-com-flush.md) | Debounce, teto de espera, escrita por chaves alteradas, cache IndexedDB e flush ao fechar a página. | Concluída |
| 0004 | [Migração do teamName](0007-persistencia-da-colecao-e-avisos/0004-migracao-do-teamname.md) | A primeira gravação do schema novo apaga o campo com `deleteField`, sem tela nem aviso próprios. | Concluída |
| 0005 | [Política de erro visível](0007-persistencia-da-colecao-e-avisos/0005-politica-de-erro-visivel.md) | Falha não trava a interface; sem rede, aviso "será gravado depois" após ~5s. | Concluída |

## Fase 8 — Acesso, atestação e privacidade

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Login como guarda do app](0008-acesso-atestacao-e-privacidade/0001-login-como-guarda-do-app.md) | Deslogado vê apenas a tela de login; `AGENTS.md` § Como rodar passa a exigir `.env.local`. | Concluída |
| 0002 | [Tela de login](0008-acesso-atestacao-e-privacidade/0002-tela-de-login.md) | Cartão centrado, botão do Google, textos exatos e link da política acessível antes de autenticar. | Concluída |
| 0003 | [Atestação de menores](0008-acesso-atestacao-e-privacidade/0003-atestacao-de-menores.md) | Um clique por conta, gravado uma única vez e sem mexer no `updatedAt`. | Concluída |
| 0004 | [Política de privacidade e rodapé](0008-acesso-atestacao-e-privacidade/0004-politica-de-privacidade-e-rodape.md) | Conteúdo LGPD como vista interna, sem router, e o aviso de independência no rodapé das duas telas. | Concluída |
| 0005 | [Corrige regras de atestação sobre documento existente](0008-acesso-atestacao-e-privacidade/0005-corrige-regras-de-atestacao-sobre-documento-existente.md) | Achado em uso no preview do PR #24: `allow update` validava o documento resultante inteiro, não a operação — corrigido com `diff().affectedKeys()`. | Concluída |

## Fase 9 — Desfazer, menu de ações e portabilidade

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Desfazer com histórico de 10](0009-desfazer-menu-e-portabilidade/0001-desfazer-com-historico-de-10.md) | Botão na linha de controles revertendo incrementos e decrementos em ordem inversa. | Concluída |
| 0002 | [Menu de ações no cabeçalho](0009-desfazer-menu-e-portabilidade/0002-menu-de-acoes-no-cabecalho.md) | Popup com cinco comandos; "sair da conta" dá flush antes do `signOut` e aposenta a área de login provisória. | Concluída |
| 0003 | [Copiar listas de troca](0009-desfazer-menu-e-portabilidade/0003-copiar-listas-de-troca.md) | Texto pronto para WhatsApp, uma linha por seção, com `5×2` para as unidades sobrando. | Concluída |
| 0004 | [Exportar coleção em JSON](0009-desfazer-menu-e-portabilidade/0004-exportar-colecao-em-json.md) | Arquivo versionado, lossless e sem dados pessoais. | Concluída |
| 0005 | [Importar coleção de JSON](0009-desfazer-menu-e-portabilidade/0005-importar-colecao-de-json.md) | Substituição da coleção inteira após confirmação, com validação e descarte do histórico de desfazer. | Concluída |

## Fase 10 — Acabamento: acessibilidade, desempenho e docs

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Acessibilidade e foco visível](0010-acabamento-acessibilidade-e-docs/0001-acessibilidade-e-foco-visivel.md) | Operação por teclado, realce de foco, contraste e nomes acessíveis por extenso. | Concluída |
| 0002 | [Desempenho das 994 figurinhas](0010-acabamento-acessibilidade-e-docs/0002-desempenho-das-994-figurinhas.md) | Medir e, se necessário, adotar a técnica mais barata que não crie rolagem própria. | Concluída |
| 0003 | [Faixas de tela e padrões](0010-acabamento-acessibilidade-e-docs/0003-faixas-de-tela-e-padroes.md) | Definir ordenação e disposição pré-selecionadas em celular, tablet e navegador. | Concluída |
| 0004 | [Fechamento da documentação](0010-acabamento-acessibilidade-e-docs/0004-fechamento-da-documentacao.md) | Zerar pendências de `interface.md` e pontos em aberto de `arquitetura.md`; ajustar `requisitos.md`. | Concluída |

---

## Fase 14 — Correção urgente: renumeração do FWC

Fase fora da progressão, aberta por correção de dado. A seção "Extras FIFA"
entrou no catálogo com os códigos `FWC01`–`FWC20`; a numeração oficial dos 20
especiais do álbum 2026 vai de **`FWC00` a `FWC19`** (indexada a partir de
zero) — logo da Panini (00), emblema oficial em duas partes (1–2), mascotes
(3), slogan (4), bola oficial Trionda (5), três cartões de países-sede (6–8),
a Taça Jules Rimet do FIFA Museum (9) e dez pôsteres históricos de campeãs
(10–19), de Uruguai 1950 a Argentina 2022 — conforme a fonte do checklist
confirmada na Fase 17 ([MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md);
a primeira descrição destes itens, "onze campeãs históricas, de Itália 1934
a 2022", era imprecisa). Confirmado por múltiplas fontes independentes depois
que a primeira leitura desta pendência citou por engano dados do álbum do
Catar 2022.

O número da fase é ordem de registro, não de execução: esta entra **antes**
das Fases 11, 12 e 13, que são refinamentos de interface e podem esperar.

**Ao contrário de uma expansão, é um deslocamento**: a quantidade de
figurinhas do FWC não muda (continuam 20), e o catálogo inteiro continua com
**994** — não há mudança no teto das regras do Firestore nem nos documentos
que citam esse total. O que muda é só o código: `FWC01` de hoje passa a
significar o que hoje é `FWC02`, e assim sucessivamente; `FWC00` passa a
existir; `FWC20` deixa de existir. **Confirmado com o humano que não há uso
real em produção ainda**, então esta fase segue sem tarefa de migração de
dado — decisão registrada na Tarefa 0014-0001.

Fica **fora** desta fase, à espera da fonte do checklist: os nomes das
figurinhas do FWC (a interface não os exibe) e a página do FWC no cabeçalho da
seção.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [FWC renumerado de FWC00 a FWC19](0014-numeracao-dos-extras-fifa/0001-fwc-renumerado-de-00-a-19.md) | `expandirFigurinhas` aceita seção que começa em zero; FWC com `inicio: 0`, `total: 20` inalterado; invariantes ajustadas. | Concluída |
| 0002 | [O número zero nos textos de troca](0014-numeracao-dos-extras-fifa/0002-o-numero-zero-nos-textos-de-troca.md) | Um `0` solto numa lista de WhatsApp lê como erro: o número passa a sair com dois dígitos, como no cartão. | Concluída |

## Fase 11 — Refinamento do cabeçalho

Proposta feita após o primeiro uso real do app (achados de UX, não de bug):
os três grupos de controles não se leem como grupos, as opções não explicam a
si mesmas ao passar o mouse, a faixa de bandeiras ainda pode ficar mais
compacta, e há espaço para economizar altura de tela e mostrar a identidade de
quem está logado. As duas primeiras tarefas e a de bandeiras são refinamentos
de baixo risco sobre decisões já tomadas; a Tarefa 0004 revisa o IDR 0018,
atualizando o próprio registro, e a Tarefa 0005 abre um IDR para o avatar e
atualiza o IDR 0024 se mudar o gatilho do menu. Toda medida alterada em
`docs/interface.md` é lastreada por registro (IDR 0022, IDR 0042 ou IDR
próprio).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Grupos de controles como toggle visível](0011-refinamento-do-cabecalho/0001-grupos-de-controles-como-toggle-visivel.md) | Contorno nos três grupos segmentados, para que se leiam como grupos de alternância. | Pendente |
| 0002 | [Tooltip nas opções de controle](0011-refinamento-do-cabecalho/0002-tooltip-nas-opcoes-de-controle.md) | Explicação da opção ao passar o mouse ou focar por teclado, reaproveitando o `nomeAcessivel` já existente. | Pendente |
| 0003 | [Bandeiras mais compactas](0011-refinamento-do-cabecalho/0003-bandeiras-mais-compactas.md) | Reduzir ainda mais o espaçamento entre bandeiras, ajustando a área de toque ampliada do IDR 0042 na mesma proporção. | Pendente |
| 0004 | [Título e controles em uma única linha](0011-refinamento-do-cabecalho/0004-titulo-e-controles-em-uma-linha.md) | Avaliar e, se aprovado, fundir as duas linhas com quebra condicional pela largura — revisa o IDR 0018. | Pendente |
| 0005 | [Avatar do usuário no título](0011-refinamento-do-cabecalho/0005-avatar-do-usuario-no-titulo.md) | Foto de perfil do Google no cabeçalho, decidindo a relação com o menu de ações e o fallback sem foto — revisa o IDR 0018/0024. | Pendente |

## Fase 12 — Redução de rolagem vertical

Proposta feita depois de mapear para onde vai a altura da tela: o cabeçalho
sticky reduz a área útil o tempo todo, e cada seção/super-grupo carrega
respiro fixo que se repete até 50 vezes. A maior alavanca, porém, não é
nenhuma medida isolada — é que seções já 100% completas continuam abertas por
padrão, ocupando tela mesmo quando não sobra nada a fazer nelas. A Tarefa
0001 ataca isso e revisa os IDRs 0020, 0019 e 0026, atualizando os próprios
registros; as Tarefas 0002-0004 são ajustes finos de medida já registrada em
`docs/interface.md`, lastreados num único registro escolhido na Tarefa 0002
(IDR 0022 atualizado ou IDR próprio da compactação vertical).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Colapso automático de completas e persistência manual](0012-reducao-de-rolagem-vertical/0001-colapso-automatico-de-completas-e-persistencia-manual.md) | Seção/super-grupo 100% completos abrem colapsados; o toque manual do usuário passa a ser lembrado entre sessões — revisa o IDR 0026. | Pendente |
| 0002 | [Cabeçalho de seção mais compacto](0012-reducao-de-rolagem-vertical/0002-cabecalho-de-secao-mais-compacto.md) | Reduzir o padding do cabeçalho de seção, repetido 50 vezes no catálogo. | Pendente |
| 0003 | [Gaps entre seções e super-grupos reduzidos](0012-reducao-de-rolagem-vertical/0003-gaps-entre-secoes-e-super-grupos-reduzidos.md) | Apertar os tokens de espaçamento entre blocos do catálogo, sem tocar no espaçamento dentro do conteúdo. | Pendente |
| 0004 | [Margem inferior do corpo sob medida](0012-reducao-de-rolagem-vertical/0004-margem-inferior-do-corpo-sob-medida.md) | Calibrar a margem reservada à faixa de avisos pela altura real dela, em vez de um valor fixo maior que o necessário. | Pendente |

## Fase 13 — Interação por pressão longa

Proposta avaliada antes do planejamento: duplo clique, clique direito e clique
do botão do meio no desktop foram todos descartados — ou atrasam o clique
simples (o gesto mais comum) para desambiguar de um duplo clique, ou dependem
de um botão de mouse nem sempre acessível. Pressão longa no mobile não tem
esse problema (toque curto e pressão longa já são gestos distintos por
tempo) e segue sozinha.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Pressão longa decrementa no mobile](0013-interacao-por-pressao-longa/0001-pressao-longa-decrementa-no-mobile.md) | Segurar o cartão além de um limiar decrementa uma unidade, com retorno visual durante a espera e uma única entrada no histórico de desfazer. | Pendente |

## Fase 15 — Identidade de cor por grupo

Decisão já registrada no [IDR 0045](../idr/0045-cores-de-super-grupos.md): uma
cor distinta por grupo de seleções (A–L) e para os especiais — FWC dourado
(`--gold`), COC vermelho (`--notif-red`) — aplicada no título do super-grupo
(borda esquerda 3px + fundo com 15% de opacidade) e na faixa de bandeiras
(fundo com 20% de opacidade, somente na ordenação por página). O cabeçalho de
seção não entra nesta fase: ganha a cor da seleção na Fase 16
([IDR 0046](../idr/0046-cores-de-selecoes.md)) — aplicar as duas em sequência
seria trabalho descartável (ver o Histórico do IDR 0045).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Tokens CSS das cores de grupo](0015-identidade-de-cor-por-grupo/0001-tokens-css-das-cores-de-grupo.md) | 14 tokens em `theme.css`: 12 grupos convertidos do hex do IDR 0045 para OKLCH, FWC e COC como alias de `--gold` e `--notif-red`; contraste ≥ 3:1. | Pendente |
| 0002 | [Cor no título do super-grupo](0015-identidade-de-cor-por-grupo/0002-cor-no-titulo-do-super-grupo.md) | Borda esquerda 3px + fundo com 15% de opacidade da cor do grupo no título do `SuperGrupo.jsx`; texto continua em `--gold`. | Pendente |
| 0003 | [Cor na faixa de bandeiras](0015-identidade-de-cor-por-grupo/0003-cor-na-faixa-de-bandeiras.md) | Fundo com 20% de opacidade da cor do grupo em cada bandeira, somente na ordenação por página (FWC e COC incluídos); na ordenação por sigla, fundo neutro. | Pendente |

## Fase 16 — Identidade de cor por seleção

Decisão já registrada no [IDR 0046](../idr/0046-cores-de-selecoes.md): cor
individual para cada uma das 48 seleções, aplicada no cabeçalho de seção com
borda completa de 1px + fundo com 15% de opacidade. Hierarquia: cor do grupo
no título do super-grupo e na faixa de bandeiras (Fase 15, IDR 0045), cor da
seleção no cabeçalho de seção (esta fase). FWC dourado (`--gold`), COC
vermelho (`--notif-red`).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Tokens CSS das cores de seleção](0016-identidade-de-cor-por-selecao/0001-tokens-css-das-cores-de-selecao.md) | 50 tokens em `theme.css`: 48 seleções convertidas do hex do IDR 0046 para OKLCH, FWC e COC como alias; contraste ≥ 3:1. | Pendente |
| 0002 | [Cor no cabeçalho de seção por seleção](0016-identidade-de-cor-por-selecao/0002-cor-no-cabecalho-de-secao-por-selecao.md) | Borda completa 1px + fundo com 15% de opacidade da cor da seleção no cabeçalho de cada seção; FWC e COC com suas cores. | Pendente |

## Fase 17 — Nomes de jogadores nas figurinhas

Decisão de exibição já registrada no
[IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md) e decisões de
dado no [MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md):
nome do jogador/elemento abaixo do código em cada cartão, nas duas
disposições, com truncamento e nome no aria-label. A fonte é o fornecimento
do humano (fonte original): as 48 seleções, os Extras FIFA e a Coca-Cola
foram provistos e conferidos contra os defeitos da primeira listagem
(48/48, grupos idênticos ao catálogo, buracos e duplicatas resolvidos), o
Paraguai foi completado por posição — coincidindo com o mapeamento — e a
divergência FWC10–19 se resolveu em favor da fonte (ver Fase 14 e MDR
0008); todas as 994 figurinhas terão nome, e a fase está pronta para
executar depois da Fase 13.

Executar depois da Fase 13: as duas tocam `Figurinha.jsx`, `Figurinha.css` e
`Figurinha.test.jsx`.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Dados dos jogadores](0017-nomes-de-jogadores/0001-dados-dos-jogadores.md) | `src/data/jogadores.js` com os nomes das listas confirmadas do MDR 0008 (48×18, 20 FWC, 14 COC), com testes de invariantes. | Pendente |
| 0002 | [Campo nome no catálogo](0017-nomes-de-jogadores/0002-modificar-catalogo.md) | `expandirFigurinhas` emite `nome` via `obterNomeFigurinha`; MDR 0006, `modelo-memoria.md`, TDR 0010 e `AGENTS.md` atualizados no mesmo commit. | Pendente |
| 0003 | [Nome no cartão](0017-nomes-de-jogadores/0003-atualizar-figurinha.md) | `Figurinha` exibe o nome abaixo do código e no aria-label, `propsEquivalentes` compara; `Secao` e `PaginaDoAlbum` passam a prop. | Pendente |
| 0004 | [Estilo do nome](0017-nomes-de-jogadores/0004-estilizar-nome.md) | `.figurinha__nome` em `system-ui` menor que o código, truncado com ellipsis, calibrado nas duas disposições. | Pendente |

## Regras que valem em toda tarefa

Ver o guia [CLAUDE.md](CLAUDE.md) § Regras que valem em toda tarefa e
§ Comportamento padrão da execução.
