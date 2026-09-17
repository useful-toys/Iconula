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

| Skill | Faz |
|---|---|
| `/planejar` (`.claude/skills/planejar/`) | Propõe fases e tarefas novas; grava os arquivos de tarefa e este README só depois da aprovação humana |
| `/executar-plano NNNN` (`.claude/skills/executar-plano/`) | Executa uma fase numa branch e worktree próprias, tarefa a tarefa em subagentes, e entrega num PR |
| `/executar-tarefa NNNN-XXXX` (`.claude/skills/executar-tarefa/`) | Executa uma tarefa e termina num commit válido, com testes, critérios de aceite verificados, decisões registradas, `docs/*.md` atualizados, setup registrado, log e status |

As skills têm duas versões sincronizadas, uma por ferramenta:
`.claude/skills/<nome>/` (Claude Code) e `.opencode/skills/opencode-<nome>/`
(OpenCode, chamadas pelos comandos finos de `.opencode/commands/`).

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
| 11 | [Refinamento do cabeçalho](0011-refinamento-do-cabecalho/) | Contorno e tooltip nos controles, bandeiras mais compactas, título e controles numa linha a partir de 768px e avatar do usuário como botão do menu | 10 | `feat: refinamento do cabeçalho e dos controles` | Entregue |
| 12 | [Redução de rolagem vertical](0012-reducao-de-rolagem-vertical/) | Lembrar o colapso manual entre sessões e apertar os espaçamentos repetidos do catálogo | 11 | `feat: colapso lembrado e catálogo mais compacto` | Entregue |
| 13 | [Interação por pressão longa](0013-interacao-por-pressao-longa/) | Segurar o cartão decrementa uma unidade no mobile, sem precisar mirar no botão de menos | 12 | `feat: pressão longa decrementa no mobile` | Entregue |
| 14 | [Correção urgente: renumeração do FWC](0014-numeracao-dos-extras-fifa/) | Extras FIFA de `FWC00` a `FWC19` (hoje `FWC01`–`FWC20`, deslocado em um); total do catálogo continua 994 | 10 | `fix: renumera os Extras FIFA para FWC00–FWC19` | Entregue |
| 15 | [Identidade de cor por grupo](0015-identidade-de-cor-por-grupo/) | Cor distinta por grupo de seleções (A–L) e especiais (FWC, COC), aplicada no título do super-grupo e na faixa de bandeiras — o cabeçalho de seção fica para a cor da seleção (Fase 16) | 13 | `feat: identidade de cor por grupo de seções` | Entregue |
| 16 | [Identidade de cor por seleção](0016-identidade-de-cor-por-selecao/) | Cor individual para cada uma das 48 seleções, aplicada no cabeçalho de seção | 15 | `feat: identidade de cor por seleção` | Entregue |
| 17 | [Nomes de jogadores nas figurinhas](0017-nomes-de-jogadores/) | Nome do jogador/elemento em cada figurinha, num cartão de 60×84px igual em todas as vistas | 14, 16, 19 | `feat: nomes de jogadores nas figurinhas` | Entregue |
| 18 | [Ajustes da identidade de cor por grupo](0018-ajustes-da-identidade-de-cor-por-grupo/) | Deixar a cor do grupo mais reconhecível na faixa de bandeiras e dar moldura ao título do super-grupo | 15 | `feat: cor de grupo mais reconhecível` | Entregue |
| 19 | [Ajustes do cabeçalho e do cartão](0019-ajustes-do-cabecalho-e-do-cartao/) | Cabeçalho todo sticky, tooltip nas bandeiras, aviso mais baixo e as correções do controle de menos, do clique perto da borda e do selo cortado | 18 | `feat: ajustes do cabeçalho, tooltip nas bandeiras e correções do cartão` | Entregue |
| 20 | [Contrair seções, rodapé e termos de uso](0020-contrair-secoes-rodape-e-termos/) | Contrair as seções de um super-grupo num toque; copyright, isenção e termos de uso nas duas telas | 19 | `feat: contrair seções do grupo, rodapé com copyright e termos de uso` | Entregue |
| 21 | [Botão compartilhar](0021-botao-compartilhar/) | Listas de troca num botão próprio, com cópia e compartilhamento pela folha do sistema | 19, 20 | `feat: botão compartilhar com cópia e folha do sistema` | Entregue |
| 22 | [Proporção e nome das figurinhas paisagem](0022-proporcao-e-nome-das-figurinhas-paisagem/) | Cartão de 60×70px, paisagem de 70×60px na 13 e em 15 figurinhas do FWC, nome no escudo e na foto do time e nome curto nas paisagens do FWC | 19 | `feat: figurinhas paisagem na proporção do cromo, com nome` | Entregue |
| 23 | [Extras FIFA na disposição álbum](0023-extras-fifa-na-disposicao-album/) | Extras FIFA nas posições reais das páginas 0–3 e 106–109, com a dimensão de cada página vinda do dado | 22 | `feat: extras FIFA na disposição álbum com as posições reais` | Entregue |
| 24 | [Testes E2E com emuladores do Firebase](0024-testes-e2e-com-emuladores-do-firebase/) | Playwright rodando contra os emuladores de Auth e Firestore, com login duplo e fixture de coleção, provado por um teste de fumaça | — | `test: adiciona testes e2e com playwright e emuladores do firebase` | Entregue |
| 25 | [Paleta de grupo e fundo neutro do tema](0025-paleta-de-grupo-e-fundo-neutro-do-tema/) | Repaletizar os grupos A–L com a tabela oficial de sorteio, neutralizar o fundo fora do cabeçalho (que mantém o verde-gramado) e registrar a paleta de referência da capa do álbum físico | 2, 15, 18 | `feat: paleta de grupo oficial e fundo neutro fora do cabeçalho` | Entregue |
| 26 | [Moldura em degradê da bandeira na seção do time](0026-moldura-em-degrade-da-bandeira-na-secao/) | Substituir a cor única por seleção por moldura e fundo em degradê com as cores da bandeira, abraçando a seção inteira (título + grade) | 16, 25 | `feat: moldura em degradê com as cores da bandeira na seção` | Entregue |
| 27 | [Catálogo compartilhado por link](0027-catalogo-compartilhado-por-link/) | Link único por conta, ligado e desligado no popup Compartilhar, que abre sem login o catálogo do dono em somente leitura | 24, 26 | `feat: catálogo compartilhado por link somente leitura` | Entregue |
| 28 | [Notação compacta e título de seção em linha única](0028-notacao-compacta-e-titulo-de-secao/) | Aplicar `▯`/`×` sem `·` nos títulos e deixar o título da seção numa linha no celular | — | `feat: notação compacta e título de seção em linha única` | Entregue |
| 29 | [Compactação vertical](0029-compactacao-vertical/) | Apertar os respiros verticais do catálogo e do cabeçalho, e o relógio em Roboto Condensed | 28 | `feat: compactação vertical do catálogo e do cabeçalho` | Em andamento |
| 30 | [Faixa sem barra e controles compactos](0030-faixa-sem-barra-e-controles-compactos/) | Faixa sem barra (fade + arrasto) e controles com ícones, espaçamento e feedback | 29 | `feat: faixa sem barra e controles compactos` | Pendente |

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
quem está logado. As decisões estão registradas: contorno e tooltip no
[IDR 0048](../idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md),
espaçamento da faixa no [IDR 0042](../idr/0042-foco-visivel-e-area-de-toque.md),
título e controles numa linha no
[IDR 0018](../idr/0018-usuario-especialista-e-minimalismo.md) e o avatar como
botão do menu no [IDR 0049](../idr/0049-avatar-como-gatilho-do-menu-de-acoes.md)
e no [IDR 0024](../idr/0024-acoes-raras-em-menu-do-cabecalho.md).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Grupos de controles como toggle visível](0011-refinamento-do-cabecalho/0001-grupos-de-controles-como-toggle-visivel.md) | Contorno de 1px em `--border` nos três grupos segmentados, para que se leiam como grupos de alternância. | Concluída |
| 0002 | [Tooltip nas opções de controle](0011-refinamento-do-cabecalho/0002-tooltip-nas-opcoes-de-controle.md) | Nome por extenso abaixo da opção no hover (~400ms) e no foco por teclado, a partir do `nomeAcessivel`; sem toque. | Concluída |
| 0003 | [Bandeiras mais compactas](0011-refinamento-do-cabecalho/0003-bandeiras-mais-compactas.md) | 2px entre bandeiras e 4px entre grupos na ordenação por página; área de toque ampliada de 1px. | Concluída |
| 0004 | [Título e controles em uma única linha](0011-refinamento-do-cabecalho/0004-titulo-e-controles-em-uma-linha.md) | A partir de 768px, título e controles na mesma linha sticky; abaixo disso, como hoje. | Concluída |
| 0005 | [Avatar do usuário como botão do menu](0011-refinamento-do-cabecalho/0005-avatar-do-usuario-no-titulo.md) | Foto do Google (ou inicial do nome) de 30×30px substitui o botão do menu de ações e abre o mesmo popup. | Concluída |

## Fase 12 — Redução de rolagem vertical

Proposta feita depois de mapear para onde vai a altura da tela: o cabeçalho
sticky reduz a área útil o tempo todo, e cada seção/super-grupo carrega
respiro fixo que se repete até 50 vezes. O colapso manual passa a ser
lembrado ([IDR 0020](../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md),
[IDR 0026](../idr/0026-preferencias-de-vista-persistidas-no-navegador.md)) e as
medidas repetidas encolhem
([IDR 0050](../idr/0050-compactacao-vertical-do-catalogo.md)). O auto-colapso
de seções completas foi descartado no planejamento.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Persistência do colapso manual](0012-reducao-de-rolagem-vertical/0001-persistencia-do-colapso-manual.md) | Seções e super-grupos fechados à mão voltam fechados na próxima abertura; o salto grava a abertura. | Concluída |
| 0002 | [Cabeçalho de seção mais compacto](0012-reducao-de-rolagem-vertical/0002-cabecalho-de-secao-mais-compacto.md) | `padding` do cabeçalho de seção de `10px 14px` para `7px 12px`. | Concluída |
| 0003 | [Gaps entre seções e super-grupos reduzidos](0012-reducao-de-rolagem-vertical/0003-gaps-entre-secoes-e-super-grupos-reduzidos.md) | Espaços entre blocos: super-grupos 16→12px, seções 14→10px, cabeçalho→grade 10→8px. | Concluída |
| 0004 | [Margem inferior do corpo sob medida](0012-reducao-de-rolagem-vertical/0004-margem-inferior-do-corpo-sob-medida.md) | Margem inferior = altura medida da falha expandida + 8px, em vez de 60px fixos. | Concluída |

## Fase 13 — Interação por pressão longa

Decisão registrada no
[IDR 0051](../idr/0051-pressao-longa-decrementa-no-toque.md): segurar o
cartão por 500ms em tela sensível tira uma unidade; os gestos de desktop
avaliados ficaram como alternativas descartadas no registro.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Pressão longa decrementa no mobile](0013-interacao-por-pressao-longa/0001-pressao-longa-decrementa-no-mobile.md) | Toque de 500ms decrementa uma unidade; mover 10px cancela; cartão escurece na espera; menu do navegador suprimido. | Concluída |

## Fase 15 — Identidade de cor por grupo

Decisão registrada no [IDR 0045](../idr/0045-cores-de-super-grupos.md), com
os valores OKLCH finais: uma cor por grupo (A–L), FWC em `--gold` e COC num
vermelho próprio (`--coc-red`), no título do super-grupo (borda esquerda 3px +
fundo 15%) e na faixa de bandeiras (fundo 20%, só na ordenação por página). O
cabeçalho de seção ganha a cor da seleção na Fase 16
([IDR 0046](../idr/0046-cores-de-selecoes.md)).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Tokens CSS das cores de grupo](0015-identidade-de-cor-por-grupo/0001-tokens-css-das-cores-de-grupo.md) | 15 tokens em `theme.css` com os valores do IDR 0045: 12 grupos, `--coc-red` e os alias de FWC e COC. | Concluída |
| 0002 | [Cor no título do super-grupo](0015-identidade-de-cor-por-grupo/0002-cor-no-titulo-do-super-grupo.md) | Borda esquerda 3px + fundo com 15% de opacidade da cor do grupo no título do `SuperGrupo.jsx`; texto continua em `--gold`. | Concluída |
| 0003 | [Cor na faixa de bandeiras](0015-identidade-de-cor-por-grupo/0003-cor-na-faixa-de-bandeiras.md) | Fundo com 20% de opacidade da cor do grupo em cada bandeira, somente na ordenação por página (FWC e COC incluídos); na ordenação por sigla, fundo neutro. | Concluída |

## Fase 16 — Identidade de cor por seleção

Decisão registrada no [IDR 0046](../idr/0046-cores-de-selecoes.md), com os
valores OKLCH finais: cor individual para cada uma das 48 seleções no
cabeçalho de seção (borda completa 1px + fundo 15%), nas duas ordenações e
disposições; FWC e COC com as cores de grupo; cores repetidas entre seleções
aceitas.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Tokens CSS das cores de seleção](0016-identidade-de-cor-por-selecao/0001-tokens-css-das-cores-de-selecao.md) | 50 tokens em `theme.css` com os valores do IDR 0046: 48 seleções e os alias de FWC e COC. | Concluída |
| 0002 | [Cor no cabeçalho de seção por seleção](0016-identidade-de-cor-por-selecao/0002-cor-no-cabecalho-de-secao-por-selecao.md) | Borda completa 1px + fundo 15% da cor da seleção no cabeçalho de cada seção, nas duas disposições; FWC e COC com suas cores. | Concluída |

## Fase 17 — Nomes de jogadores nas figurinhas

Exibição no [IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md):
cartão de 60×84px igual na lista e no álbum, código em cima, nome em duas
linhas de Roboto Condensed 10px (prenomes; sobrenome em caixa alta) e faixa
inferior para o menos e o selo. Na revisão do PR, o layout foi ajustado para
um cartão de 60×68px em duas metades (código em cima, nome embaixo, com o
menos e o selo sobre o nome) e escudo e foto do time só com o código. Dado no
[MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md), com os campos
`nome` e `nomeLinhas` e as listas confirmadas das 994 figurinhas. Seguem da
mudança de medida o [IDR 0015](../idr/0015-paginas-do-album-empilham-em-tela-estreita.md)
(trilhas de 60px), o [IDR 0043](../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)
(celular até 582px), o [IDR 0042](../idr/0042-foco-visivel-e-area-de-toque.md)
(área de toque do menos) e o [TDR 0013](../tdr/0013-tipografia-vendorizada.md)
(fonte vendorizada).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Dados dos jogadores](0017-nomes-de-jogadores/0001-dados-dos-jogadores.md) | `src/data/jogadores.js` com os nomes das listas confirmadas do MDR 0008 (48×18, 20 FWC, 14 COC), com testes de invariantes. | Concluída |
| 0002 | [Campos de nome no catálogo](0017-nomes-de-jogadores/0002-modificar-catalogo.md) | `expandirFigurinhas` emite `nome` e `nomeLinhas`; `modelo-memoria.md` e `AGENTS.md` atualizados. | Concluída |
| 0003 | [Vendorizar a Roboto Condensed](0017-nomes-de-jogadores/0003-vendorizar-roboto-condensed.md) | Roboto Condensed 500, latin e latin-ext, servida pelo Hosting, sem abrir a CSP. | Concluída |
| 0004 | [Cartão de 60×84px em todas as vistas](0017-nomes-de-jogadores/0004-cartao-60x84-em-todas-as-vistas.md) | Cartão único na lista e no álbum, trilhas de 60px, limite de celular em 582px e faixa inferior para menos e selo. | Concluída |
| 0005 | [Nome no cartão](0017-nomes-de-jogadores/0005-nome-no-cartao.md) | Duas linhas de nome em Roboto Condensed 10px e nome acessível com o nome, nas duas disposições. | Concluída |

## Fase 18 — Ajustes da identidade de cor por grupo

Fase curta, fora da progressão: após a entrega da Fase 15, a cor de grupo
ficou sutil demais para ser reconhecida. A faixa de bandeiras passa de fundo
20% para 60% da cor + barra inferior de 2px a 80% (hover intensificando), e o
título do super-grupo ganha a moldura arredondada do cabeçalho de seção,
mantendo a barra esquerda de 3px. Decisão revisada no
[IDR 0045](../idr/0045-cores-de-super-grupos.md).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Faixa de bandeiras com cor mais reconhecível](0018-ajustes-da-identidade-de-cor-por-grupo/0001-faixa-de-bandeiras-com-cor-mais-reconhecivel.md) | Fundo 60% + barra inferior de 2px a 80% e hover a 80% em cada bandeira, só na ordenação por página. | Concluída |
| 0002 | [Título do super-grupo com moldura da seção](0018-ajustes-da-identidade-de-cor-por-grupo/0002-titulo-do-super-grupo-com-moldura-da-secao.md) | Moldura arredondada (`--panel` + raio 12px + padding 7px 12px) com barra esquerda de 3px e fundo a 30%; texto em `--gold`. | Concluída |

## Fase 19 — Ajustes do cabeçalho e do cartão

Pequenos ajustes e correções observados em uso. Decisões do esmiuçamento:
cabeçalho todo sticky com o avatar na primeira linha
([IDR 0018](../idr/0018-usuario-especialista-e-minimalismo.md)), tooltip com
sigla, nome e progresso nas bandeiras
([IDR 0052](../idr/0052-tooltip-nas-bandeiras-da-faixa.md)), faixa de aviso
com respiro de 6px ([IDR 0050](../idr/0050-compactacao-vertical-do-catalogo.md))
e controle de menos encostado no canto, revelado só por hover e teclado
([IDR 0032](../idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md)).
As duas correções do cartão — clique perto da borda e selo cortado na última
linha — mantêm o [IDR 0042](../idr/0042-foco-visivel-e-area-de-toque.md) e o
[TDR 0021](../tdr/0021-desempenho-do-catalogo.md). Vem antes da Fase 17, que
redesenha o mesmo cartão.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Cabeçalho todo sticky](0019-ajustes-do-cabecalho-e-do-cartao/0001-cabecalho-todo-sticky.md) | Título → grupos → bandeiras no sticky em qualquer largura; avatar à direita da primeira linha, desfazer à direita dos grupos. | Concluída |
| 0002 | [Tooltip nas bandeiras](0019-ajustes-do-cabecalho-e-do-cartao/0002-tooltip-nas-bandeiras.md) | `BRA · Brasil · 12/20 · 60% · ▢8 · ×3` abaixo da bandeira, num tooltip único posicionado fora da faixa. | Concluída |
| 0003 | [Aviso com respiro de 6px](0019-ajustes-do-cabecalho-e-do-cartao/0003-aviso-com-respiro-de-6px.md) | Faixa de aviso com 6px em cima e embaixo e margem inferior do corpo remedida. | Concluída |
| 0004 | [Menos no canto, revelado por hover e teclado](0019-ajustes-do-cabecalho-e-do-cartao/0004-menos-no-canto-revelado-por-teclado.md) | Controle de menos com recuo 0 no canto e sem acender pelo foco de clique de mouse. | Concluída |
| 0005 | [Clique perto da borda soma](0019-ajustes-do-cabecalho-e-do-cartao/0005-clique-perto-da-borda-soma.md) | O encolhimento do toque deixa de reduzir a área que recebe o clique. | Concluída |
| 0006 | [Selo inteiro na última linha](0019-ajustes-do-cabecalho-e-do-cartao/0006-selo-inteiro-na-ultima-linha.md) | Selo `×N` sem corte pela contenção de pintura da seção, sem mudar espaçamentos. | Concluída |

## Fase 20 — Contrair seções, rodapé e termos de uso

Decisões do esmiuçamento: alternador `⊟`/`⊞` no título do super-grupo aberto,
sobre as 4 seções ([IDR 0020](../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md)),
e termos de uso com copyright e isenção nas duas telas e aceite pela frase do
login ([IDR 0053](../idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md)).
Os termos são a quarta tela: seguem sem router, com estado único de vista
interna ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)). Depende
da Fase 19, que também altera `App.jsx` e `SuperGrupo.css`. O texto dos termos
é aprovado pelo humano no PR.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Alternador de seções no super-grupo](0020-contrair-secoes-rodape-e-termos/0001-alternador-de-secoes-no-super-grupo.md) | `⊟`/`⊞` à direita do título do grupo aberto contrai ou expande as 4 seções, gravado como colapso manual. | Concluída |
| 0002 | [Copyright e isenção nos rodapés](0020-contrair-secoes-rodape-e-termos/0002-copyright-e-isencao-nos-rodapes.md) | `© 2026 Daniel Felix Ferber` e "Uso por sua conta e risco, sem garantias." nos rodapés das duas telas. | Concluída |
| 0003 | [Termos de uso e aceite no login](0020-contrair-secoes-rodape-e-termos/0003-termos-de-uso-e-aceite-no-login.md) | Vista interna de termos, links no login e no rodapé e frase de aceite na tela de login. | Concluída |

## Fase 21 — Botão compartilhar

Decisões do esmiuçamento: as cópias saem do menu do avatar para um botão
compartilhar à esquerda dele, com popup por lista, e compartilhar pela folha
do sistema onde o navegador a oferece
([IDR 0024](../idr/0024-acoes-raras-em-menu-do-cabecalho.md),
[IDR 0018](../idr/0018-usuario-especialista-e-minimalismo.md)). O
`requisitos.md` § Compartilhamento foi ajustado, a pedido do humano, no PR
deste plano.
Depende da Fase 19 (posição do avatar) e da Fase 20 (`App.jsx`).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Botão compartilhar com as cópias](0021-botao-compartilhar/0001-botao-compartilhar-com-as-copias.md) | Ícone à esquerda do avatar abre as duas cópias por lista; o menu do avatar fica com exportar, importar e sair. | Concluída |
| 0002 | [Compartilhar pela folha do sistema](0021-botao-compartilhar/0002-compartilhar-pela-folha-do-sistema.md) | "Compartilhar faltantes…" e "Compartilhar repetidas…" onde `navigator.share` existe; cancelar não avisa, falha cai na cópia. | Concluída |

## Fase 22 — Proporção e nome das figurinhas paisagem

Decisões do esmiuçamento: cartão de 60×70px e paisagem de 70×60px — as
medidas do retrato trocadas —, centralizada no espaço das trilhas 3–4 no
álbum e na altura da linha na lista; escudo e foto do time com o nome
genérico; paisagens do FWC com um nome curto numa linha
([IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md)). As 15
paisagens do FWC e o campo `nomeCurto` são dado
([MDR 0006](../model-dr/0006-catalogo-estatico-embutido.md),
[MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md)); trilhas,
spread e o limite de 582px não mudam
([IDR 0043](../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)).
As medidas vêm antes do dado para que as paisagens do FWC já nasçam em
70×60px. Não altera os arquivos de código da Fase 21.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Cartão de 60×70px e paisagem de 70×60px](0022-proporcao-e-nome-das-figurinhas-paisagem/0001-cartao-60x70-e-paisagem-70x60.md) | Medidas novas, linhas do álbum de 70px, paisagem centralizada no álbum e na lista e estimativa de altura da seção recalculada. | Concluída |
| 0002 | [Paisagens do FWC e `nomeCurto` no catálogo](0022-proporcao-e-nome-das-figurinhas-paisagem/0002-paisagens-do-fwc-e-nome-curto-no-catalogo.md) | `FWC00`–`FWC03` e `FWC09`–`FWC19` em paisagem e os 15 nomes curtos do MDR 0008, com invariantes. | Concluída |
| 0003 | [Nome no escudo, na foto e nome curto](0022-proporcao-e-nome-das-figurinhas-paisagem/0003-nome-no-escudo-na-foto-e-nome-curto.md) | Escudo com o nome em até duas linhas; toda paisagem numa linha, com o `nomeCurto` quando existe. | Concluída |

## Fase 23 — Extras FIFA na disposição álbum

Decisões do esmiuçamento: os Extras FIFA ganham disposição álbum com as
posições reais das oito páginas (0–3 e 106–109), casa de 70×70px, quatro
pares de páginas, linhas vazias preservadas, moldura só no FWC e cabeçalho
`Extras FIFA FWC 0`
([IDR 0023](../idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md),
[TDR 0010](../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md));
o layout de álbum ganha a dimensão de cada página
([MDR 0006](../model-dr/0006-catalogo-estatico-embutido.md)). O formato do
layout vem antes do dado do FWC, para que a Coca-Cola e as seleções já usem a
grade vinda do dado; depende da Fase 22, que dá às paisagens do FWC os
70×60px que cabem na casa.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Dimensão de cada página no layout de álbum](0023-extras-fifa-na-disposicao-album/0001-dimensao-de-cada-pagina-no-layout-de-album.md) | Páginas com linhas e colunas, posição pelo campo `posicao`, pares de páginas e página 1 da Coca-Cola com 2 linhas. | Concluída |
| 0002 | [Páginas do FWC e página 0 no cabeçalho](0023-extras-fifa-na-disposicao-album/0002-paginas-do-fwc-e-pagina-zero-no-cabecalho.md) | `paginas` do FWC com as oito páginas físicas e `Extras FIFA FWC 0` no cabeçalho, sem seção sem páginas. | Concluída |
| 0003 | [FWC na disposição álbum](0023-extras-fifa-na-disposicao-album/0003-fwc-na-disposicao-album.md) | Layout das oito páginas, casa de 70×70px, moldura e quatro pares, com `interface.md` atualizado. | Concluída |

## Fase 24 — Testes E2E com emuladores do Firebase

Fase fora da progressão de produto — infraestrutura de teste, motivada pela
guarda de login do app (`docs/requisitos.md` § Acesso): sem conta Google
real, valida visualmente qualquer tela exige um humano no preview, o que já
deixou verificações pendentes na Fase 23 e uma regressão (faixa de
bandeiras) passar despercebida até revisão manual. Decisões do
esmiuçamento: Playwright contra os emuladores de Auth (novo) e Firestore
(já usado por `test:rules`), projeto fake `demo-iconula`; login duplo —
popup fake do Google só para telas de login/atestação, e-mail/senha
instantâneo para o resto —; fixture de coleção no Firestore Emulator;
scripts `test:e2e` (padrão, contra o build) e `test:e2e:dev` (contra o dev
server) — ver [ADR 0010](../adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)
e a atualização do [ADR 0009](../adr/0009-testes-co-localizados.md) (`e2e/`
como segunda exceção à co-localização). Sem CI e sem testes de regressão
específicos por ora — ficam para pedidos futuros.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Playwright e diretório `e2e/`](0024-testes-e2e-com-emuladores-do-firebase/0001-playwright-e-diretorio-e2e.md) | `@playwright/test` como devDependency, config e `.gitignore` — infraestrutura de ferramenta, sem comportamento novo. | Concluída |
| 0002 | [Emuladores condicionados por env var](0024-testes-e2e-com-emuladores-do-firebase/0002-emuladores-condicionados-por-env-var.md) | `firebase.json` ganha `emulators.auth`; `firebase.js` e `colecaoRemota.js` conectam aos emuladores só com `VITE_USE_FIREBASE_EMULATOR`. | Concluída |
| 0003 | [Login duplo, fixture, scripts e fumaça](0024-testes-e2e-com-emuladores-do-firebase/0003-login-duplo-fixture-scripts-e-fumaca.md) | Helpers de login e fixture, scripts `test:e2e`/`test:e2e:dev`, teste de fumaça e `docs/teste-e2e.md`. | Concluída |

## Fase 25 — Paleta de grupo e fundo neutro do tema

Decisões do planejamento: os grupos A–L passam a usar a tabela oficial de
sorteio da Copa 2026 em vez de um hex de origem sem procedência, com
variante original (borda) e ajustada (fundo) —
[IDR 0045](../idr/0045-cores-de-super-grupos.md). O fundo geral da
aplicação fica neutro (sem matiz); só o `.cabecalho` (barra fixa do topo)
mantém a identidade verde-gramado com dourado —
[IDR 0022](../idr/0022-tema-escuro-unico-paleta-do-prototipo.md). A capa do
álbum físico oficial vira referência de identidade visual, registrada à
parte — [IDR 0054](../idr/0054-paleta-da-capa-do-album-fifa-2026.md).
`docs/requisitos.md` § Aparência ajustado para refletir o cabeçalho como
único lugar com a identidade verde-gramado.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Cores de grupo com a tabela oficial de sorteio](0025-paleta-de-grupo-e-fundo-neutro-do-tema/0001-cores-de-grupo-com-a-tabela-oficial-de-sorteio.md) | 12 cores de grupo com RGB oficial, variante original (borda) e ajustada (fundo) em OKLCH. | Concluída |
| 0002 | [Fundo neutro fora do cabeçalho](0025-paleta-de-grupo-e-fundo-neutro-do-tema/0002-fundo-neutro-fora-do-cabecalho.md) | `--bg`/`--bg-deep`/`--panel`/`--border` sem matiz; `--turf` mantém o verde-gramado, restrito ao `.cabecalho`. | Concluída |
| 0003 | [IDR de referência da paleta do álbum](0025-paleta-de-grupo-e-fundo-neutro-do-tema/0003-idr-de-referencia-da-paleta-do-album.md) | Conferir o registro do IDR 0054 (já escrito no planejamento), sem tocar em código. | Concluída |

## Fase 26 — Moldura em degradê da bandeira na seção do time

Decisão do planejamento: a cor única por seleção
([IDR 0046](../idr/0046-cores-de-selecoes.md), Fase 16) gerava ruído visual
e foi abandonada. Cada seção passa a ter uma moldura e um fundo em degradê
com 2-3 cores da bandeira do país — cor 1 no topo, cor 2 no canto inferior
esquerdo, cor 3 no direito —, abraçando o título e a grade de figurinhas,
não só o cabeçalho. Cor muito escura (preto etc.) é clareada em OKLCH,
nunca evitada. Depende da Fase 25 (fundo neutro usado como referência de
contraste).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Cores de bandeira por seleção em OKLCH](0026-moldura-em-degrade-da-bandeira-na-secao/0001-cores-de-bandeira-por-selecao-em-oklch.md) | Até 3 tokens de cor por seleção (original e, onde precisar, ajustada), com base na bandeira do país. | Concluída |
| 0002 | [Moldura e fundo em degradê na seção](0026-moldura-em-degrade-da-bandeira-na-secao/0002-moldura-e-fundo-em-degrade-na-secao.md) | Técnica de anel-gradiente em `Secao.css`, movendo a identidade de cor do cabeçalho para a seção inteira. | Concluída |

## Fase 27 — Catálogo compartilhado por link

Decisões do esmiuçamento e do planejamento: um link único por conta,
`/catalogo/<uid>`, ligado e desligado por uma chave no popup Compartilhar,
abre sem login o catálogo do dono em somente leitura, com uma leitura ao
abrir e sem identificar o dono — ver
[IDR 0055](../idr/0055-catalogo-compartilhado-por-link-somente-leitura.md),
[MDR 0002](../model-dr/0002-schema-do-documento-da-colecao.md) e
[TDR 0020](../tdr/0020-privacidade-como-vista-interna.md). As regras sobem
primeiro; nada fica público antes do merge. Depende da Fase 26 porque as duas
tocam `MenuDeCompartilhar`, `Figurinha` e `Secao`, e da Fase 24 pela fixture
do e2e.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Regras do link do catálogo](0027-catalogo-compartilhado-por-link/0001-regras-do-link-do-catalogo.md) | `linkAtivo` no schema e `get` público com o link ligado, com testes no emulador. | Concluída |
| 0002 | [Catálogo e cabeçalho em somente leitura](0027-catalogo-compartilhado-por-link/0002-catalogo-e-cabecalho-somente-leitura.md) | Cartões inertes sem callback, colapso lido sem gravar, rótulo e título como link no cabeçalho — sem mudar a tela atual. | Concluída |
| 0003 | [Vista do link do catálogo](0027-catalogo-compartilhado-por-link/0003-vista-do-link-do-catalogo.md) | `/catalogo/<uid>` antes da guarda de login, uma leitura, estados e preferências sem gravação. | Concluída |
| 0004 | [Chave do link no popup](0027-catalogo-compartilhado-por-link/0004-chave-do-link-no-popup.md) | Carga traz `linkAtivo`; chave no terceiro bloco grava na hora, não fecha o popup e reverte em falha. | Concluída |
| 0005 | [Copiar e compartilhar o link](0027-catalogo-compartilhado-por-link/0005-copiar-e-compartilhar-o-link.md) | Com o link ligado, copiar e compartilhar só a URL, com reserva da cópia. | Concluída |
| 0006 | [Política, noindex e e2e do link](0027-catalogo-compartilhado-por-link/0006-politica-noindex-e-e2e-do-link.md) | Texto novo da política, `X-Robots-Tag: noindex` em `/catalogo/**` e e2e da vista sem login. | Concluída |

## Fase 28 — Notação compacta e título de seção em linha única

Decisões do esmiuçamento: a notação de progresso troca `▢` por `▯` e perde os
`·` entre campos, mantendo os `·` estruturais ([IDR 0018](../idr/0018-usuario-especialista-e-minimalismo.md),
[`requisitos.md` § UX](../requisitos.md)); o título da seção passa a caber numa
linha no celular, sem chevron nas seções e com fonte condensada até 582px
([IDR 0056](../idr/0056-titulo-de-secao-em-linha-unica-no-celular.md)).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Notação no placar e no super-grupo](0028-notacao-compacta-e-titulo-de-secao/0001-notacao-no-placar-e-no-super-grupo.md) | `▯`/`×` sem `·` no placar e no super-grupo, mantendo os `·` estruturais. | Concluída |
| 0002 | [Notação na seção e no tooltip da faixa](0028-notacao-compacta-e-titulo-de-secao/0002-notacao-na-secao-e-no-tooltip-da-faixa.md) | `▯`/`×` sem `·` na seção e no tooltip da faixa. | Concluída |
| 0003 | [Título de seção sem chevron e identificação em spans](0028-notacao-compacta-e-titulo-de-secao/0003-titulo-de-secao-sem-chevron-e-identificacao-em-spans.md) | Remover o chevron das seções e separar nome/sigla/página em spans. | Concluída |
| 0004 | [Título de seção com gaps, glifos e fonte condensada](0028-notacao-compacta-e-titulo-de-secao/0004-titulo-de-secao-gaps-glifos-e-fonte-condensada.md) | Gaps 6px/0.22em, glifos 0.85em/400, Roboto Condensed ≤582px. | Concluída |

## Fase 29 — Compactação vertical

Decisões do esmiuçamento: compactação vertical do catálogo
([IDR 0050](../idr/0050-compactacao-vertical-do-catalogo.md)) e do cabeçalho
([IDR 0057](../idr/0057-compactacao-vertical-do-cabecalho.md)), e a data/hora de
persistência em Roboto Condensed.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Compactação vertical do catálogo](0029-compactacao-vertical/0001-compactacao-vertical-do-catalogo.md) | Moldura 8→4px, cabeçalho 2px 8px, vão 4→2px, seções 10→8px. | Concluída |
| 0002 | [Compactação vertical do cabeçalho](0029-compactacao-vertical/0002-compactacao-vertical-do-cabecalho.md) | Padding 12/10→8/2, gap 8→4, faixa 8→4, corpo topo 20→4. | Pendente |
| 0003 | [Data/hora de persistência em Roboto Condensed](0029-compactacao-vertical/0003-data-hora-de-persistencia-em-roboto-condensed.md) | Relógio em Roboto Condensed 500, 13px/muted/tabular. | Pendente |

## Fase 30 — Faixa sem barra e controles compactos

Decisões do esmiuçamento: a faixa de bandeiras perde a barra visível, com fade
e arrasto ([IDR 0058](../idr/0058-rolagem-da-faixa-de-bandeiras-sem-barra.md));
os controles ganham ícones Material como SVG inline
([TDR 0026](../tdr/0026-icones-material-symbols-vendorizados-como-svg.md)) e
rótulos compactos, espaçamento e feedback de confirmação
([IDR 0059](../idr/0059-rotulos-compactos-dos-controles.md),
[IDR 0029](../idr/0029-avisos-flutuantes-com-tres-severidades.md)).

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Faixa de bandeiras sem barra](0030-faixa-sem-barra-e-controles-compactos/0001-faixa-de-bandeiras-sem-barra.md) | Fade condicional + arrasto grab/grabbing + overscroll; rodinha não interceptada. | Pendente |
| 0002 | [Ícones Material Symbols como SVG inline](0030-faixa-sem-barra-e-controles-compactos/0002-icones-material-symbols-como-svg-inline.md) | Vendorizar `numbers`, `sort_by_alpha`, `view_list`, `view_module`. | Pendente |
| 0003 | [Rótulos compactos dos controles](0030-faixa-sem-barra-e-controles-compactos/0003-rotulos-compactos-dos-controles.md) | Material no layout; `Todas ▯ ▮ ×` no filtro; nome por extenso no aria/tooltip. | Pendente |
| 0004 | [Espaçamento dos controles](0030-faixa-sem-barra-e-controles-compactos/0004-espacamento-dos-controles.md) | Padding 4px 10px, gap 6px, `::before` de toque. | Pendente |
| 0005 | [Feedback de confirmação na troca de controle](0030-faixa-sem-barra-e-controles-compactos/0005-feedback-de-confirmacao-na-troca-de-controle.md) | Aviso de sucesso na troca de ordenação/disposição/filtro. | Pendente |

## Regras que valem em toda tarefa

Ver o guia [CLAUDE.md](CLAUDE.md) § Regras que valem em toda tarefa e
§ Comportamento padrão da execução.
