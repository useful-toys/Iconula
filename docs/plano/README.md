<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Plano de implementação do Iconula

Roteiro executável para transformar o "Iconula Button" no controle de figurinhas
do álbum da Copa 2026 especificado em [requisitos.md](../requisitos.md).

Cada **fase** é um PR mesclável na `main`. Como o preview deploy por PR é
required check e o merge publica em produção (ADR 0003/0004), ao fim de toda
fase `npm run lint`, `npm run test` e `npm run build` passam e o app continua
utilizável — nenhuma fase deixa a `main` meio-migrada. Cada **tarefa** é um
commit coerente: poucos arquivos, um assunto.

Os arquivos de tarefa ficam em `docs/plano/[000N-nome-da-fase]/[000X-nome-da-tarefa].md`
e os logs de execução em `docs/plano/[000N-nome-da-fase]/logs/[000X-log-nome].md`.

## Legenda de status e como atualizá-lo

| Status | Significado |
|---|---|
| Pendente | Ainda não iniciada |
| Em andamento | Trabalho começado, não mesclado |
| Concluída | Mesclada na `main` com lint, test e build verdes |
| Bloqueada | Parada à espera de decisão humana (ver "Impedimentos" da tarefa) |

O agente executor atualiza a seção `## Status` do arquivo da tarefa **e** a
coluna de status das tabelas deste README **no mesmo commit** do trabalho —
nunca depois. Ao concluir, grava o log em `logs/` e marca `Concluída` só quando
a fase inteira estiver mesclada. Ao bloquear, escreve `Bloqueada` e a pergunta
objetiva na própria tarefa; não avança para a tarefa seguinte da mesma fase se
ela depender da resposta.

Decisão tomada durante a execução vira ADR/TDR/IDR **no momento em que é
tomada** (AGENTS.md § Convenções), com numeração sequencial a partir da última
existente: **ADR 0009**, **TDR 0016**, **IDR 0034**. O log aponta para o
registro; não o substitui.

## Fases

| # | Fase | Objetivo | Depende de | PR previsto | Status |
|---|---|---|---|---|---|
| 1 | [Fundação: plano, catálogo e assets](0001-fundacao-catalogo-e-assets/) | Colocar no repositório o catálogo das 994 figurinhas e os assets que faltam, sem mudar nada na tela | — | `docs+data: plano de implementação e catálogo do álbum` | Pendente |
| 2 | [Fatia vertical: catálogo em tela](0002-fatia-vertical-catalogo-em-tela/) | Substituir o botão pela tela do catálogo com contagem ajustável em memória | 1 | `feat: tela do catálogo substitui o Iconula Button` | Pendente |
| 3 | [Percurso: ordenações, agrupamento e salto](0003-percurso-ordenacoes-e-salto/) | Duas ordenações, super-grupos A–L, colapso e salto pela faixa de bandeiras | 2 | `feat: ordenações, super-grupos colapsáveis e salto para seção` | Pendente |
| 4 | [Disposição álbum, filtro e preferências](0004-disposicao-album-filtro-e-preferencias/) | Reproduzir a página física, filtrar por status e lembrar a vista entre sessões | 3 | `feat: disposição álbum, filtro de status e preferências de vista` | Pendente |
| 5 | [Regras do Firestore para o schema novo](0005-regras-do-firestore/) | Publicar as regras do mapa esparso antes de qualquer código que o escreva | 1 | `feat(rules): schema da coleção no Firestore` | Pendente |
| 6 | [Ajuste de rota: correções de interface](0006-ajuste-de-rota/) | Corrigir o controle de menos do cartão, acrescentar o filtro de coladas e apertar a faixa de bandeiras, tudo observado com o app já em uso | 2, 3, 4 | `fix: correções de interface observadas em uso` | Pendente |
| 7 | [Persistência da coleção e avisos](0007-persistencia-da-colecao-e-avisos/) | Carregar no login, gravar agregado e informar sucesso, aviso e falha | 5, 2 | `feat: persistência da coleção e área de avisos` | Pendente |
| 8 | [Acesso, atestação e privacidade](0008-acesso-atestacao-e-privacidade/) | Login como guarda do app, atestação de menores e política de privacidade | 7 | `feat: guarda de login, atestação de menores e política de privacidade` | Pendente |
| 9 | [Desfazer, menu de ações e portabilidade](0009-desfazer-menu-e-portabilidade/) | Desfazer, popup de comandos raros, listas de troca e export/import JSON | 7, 8 | `feat: desfazer, menu de ações, listas de troca e export/import` | Pendente |
| 10 | [Acabamento: acessibilidade, desempenho e docs](0010-acabamento-acessibilidade-e-docs/) | Fechar acessibilidade, desempenho das 994, faixas de tela e a documentação | 9 | `chore: acessibilidade, desempenho e fechamento da documentação` | Pendente |
| 14 | [Correção urgente: renumeração do FWC](0014-numeracao-dos-extras-fifa/) | Extras FIFA de `FWC00` a `FWC19` (hoje `FWC01`–`FWC20`, deslocado em um); total do catálogo continua 994 | 10 | `fix: renumera os Extras FIFA para FWC00–FWC19` | Pendente |

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
sobem no merge e não têm canal de preview (TDR 0008): um preview de PR roda o
cliente novo contra as regras antigas. Ao fim desta fase as regras de produção
já aceitam `contagens`/`updatedAt`/`atestadoEm` e recusam `teamName` — e nada
no cliente escreve no Firestore ainda, então a troca é inócua.

| # | Tarefa | Objetivo | Status |
|---|---|---|---|
| 0001 | [Regras do mapa esparso](0005-regras-do-firestore/0001-regras-do-mapa-esparso.md) | `hasOnly` dos três campos, tamanho, valores 1–99, `updatedAt == request.time` e guarda de campo ausente. | Concluída |
| 0002 | [Medir a allow-list dos códigos](0005-regras-do-firestore/0002-medir-a-allow-list-dos-codigos.md) | Gerar, medir e exercitar; se não couber no ruleset, ficar sem ela e registrar a medição. | Concluída |
| 0003 | [Testes das regras no emulador](0005-regras-do-firestore/0003-testes-das-regras-no-emulador.md) | Cobrir os casos do TDR 0009 mais o update que apaga `teamName` e o acesso cruzado entre usuários. | Concluída |
| 0004 | [Atualizar a documentação de persistência](0005-regras-do-firestore/0004-atualizar-documentacao-de-persistencia.md) | Refletir regras novas e medição em `persistencia.md` e `firebase.md`, no mesmo PR. | Concluída |

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
(3), slogan (4), bola oficial Trionda (5), três cartões de países-sede (6–8) e
onze campeãs históricas do FIFA Museum (9–19), de Itália 1934 a Argentina
2022. Confirmado por múltiplas fontes independentes depois que a primeira
leitura desta pendência citou por engano dados do álbum do Catar 2022.

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

---

## Onde cada pendência conhecida foi alocada

| Pendência | Origem | Fase.Tarefa | Resolução proposta | Registro que nasce |
|---|---|---|---|---|
| Fonte do checklist (nomes das figurinhas, página do FWC, metalizadas além da 01) | `requisitos.md` § Decisões Pendentes | 1.2 | Não bloquear: nomes não são exibidos pela interface especificada, o número da página do FWC é omitido no cabeçalho daquela seção e `metalizada` fica só na posição 01; o dado nasce com o campo previsto para receber a fonte depois | TDR |
| Política de privacidade depois de autenticado | `requisitos.md` § Decisões Pendentes; `interface.md` § Pendências de interface | 8.4 | Link no rodapé da tela principal — o rodapé já existe em ambas as telas e não gasta item do menu de ações; se preferir o menu, entra como sexto comando na 9.2 | IDR |
| Falha ao gravar `atestadoEm` | `requisitos.md` § Decisões Pendentes | 8.3 | Liberar o app e reagendar a gravação: a atestação é ato do usuário, já praticado, e retê-lo puniria falha de rede; a falha avisa e a gravação seguinte a regrava | IDR |
| Aceite dos números do ADR 0008 (debounce, teto de espera) | `arquitetura.md` § Pontos em aberto | 7.3 | Aceitar ~2s de debounce, ~10s de teto e ~5s de timeout sem rede como estão; medir em uso real e registrar o ajuste no log — o próprio ADR 0008 permite mudá-los sem novo ADR | log (TDR só se mudar a forma, não o número) |
| Router ou vista interna para a privacidade | `arquitetura.md` § Pontos em aberto | 8.4 | Vista interna com estado no `App.jsx`, sem router — a árvore ainda não exige, e a convenção do `AGENTS.md` proíbe antecipar | TDR |
| Context vs. prop-drilling | `arquitetura.md` § Pontos em aberto | 2.4, revisto em 7.3 | Prop-drilling enquanto couber; Context só para a coleção e o ajuste, e só quando a passagem atravessar mais de três níveis | TDR |
| Virtualização das listas | `arquitetura.md` § Pontos em aberto | 10.2 | Medir antes de escolher: preferir `content-visibility` por seção, que não cria contêiner rolável; biblioteca só se a medição exigir, e nunca uma que introduza rolagem própria | TDR |
| Pipeline de geração do catálogo | `arquitetura.md` § Pontos em aberto | 1.2 | Sem pipeline: arquivo escrito à mão a partir do Anexo de `requisitos.md` e do IDR 0019, com teste de invariantes fazendo o papel de validação | TDR |
| Salto para seção ocultada pelo filtro | `interface.md` § Pendências de interface | 4.4 | O salto limpa o filtro para "todas" antes de rolar até a seção — a faixa lista as 50 sempre, e um toque que não move nada seria pior | IDR |
| Atestação: clique de entrar ou passo explícito | `interface.md` § Pendências de interface | 8.3 | Passo explícito uma única vez por conta, como `requisitos.md` exige; o protótipo, que a exibe a cada login, é referência visual e não vence o requisito | IDR |
| Foco, hover e pressionado | `interface.md` § Pendências de interface | 10.1 | Realce de foco visível em dourado e retorno imediato de toque no cartão, além da mudança de cor de estado | IDR |
| Área de toque ampliada nos alvos de 30×30px | `interface.md` § Pendências de interface | 10.1 | Ampliar a área de toque sem mudar o desenho, mantendo as medidas de `interface.md` | IDR |
| Ordenação e disposição pré-selecionadas por faixa de tela | `interface.md` § Pendências de interface | 10.3 | Definir na fase de acabamento, com a preferência guardada vencendo a partir da segunda abertura | IDR |
| Diálogos de exportação e importação | `interface.md` § Demais telas | 9.4, 9.5 | Exportação sem diálogo (baixa direto e avisa); importação com confirmação explícita mínima, sem tela própria | IDR |
| Poppins por webfont colide com `style-src 'self'` e `font-src 'self'` | Achado da leitura: `interface.md` § Tipografia × TDR 0002/0005 e ADR 0006 | 1.4 | Vendorizar os arquivos da fonte e servi-los pelo próprio Hosting, como os SVGs de bandeira e o logo do Google — a CSP não se abre | TDR |
| Controle de menos na figurinha faltante e transbordando o canto superior esquerdo | Achado de uso: app com as 994 em tela × `interface.md` § Figurinha | 6.1 | Renderizar o controle só a partir da contagem 1 e movê-lo para dentro do cartão, no canto inferior esquerdo | IDR 0032 (já registrado) |
| Falta a vista das coladas (contagem ≥ 1), que não são as repetidas (≥ 2) | Achado de uso: filtro de status × `requisitos.md` § Progresso e listas | 6.2 | Acrescentar `coladas` como quarto valor do filtro, sem tocar em nenhuma outra regra do filtro | IDR 0033 (já registrado) |
| Faixa de bandeiras larga demais: poucas seções cabem sem rolar | Achado de uso: faixa de salto × `interface.md` § Medidas | 6.3 | Baixar o espaçamento entre ícones de 8px para 4px, mantendo o ícone de 30×30px e a rolagem horizontal | — (medida em `interface.md`) |
| `npm run dev` deixa de funcionar sem credenciais quando o login vira guarda | Achado da leitura: `requisitos.md` § Dados e isolamento × `AGENTS.md` § Como rodar | 8.1 | `requisitos.md` vence (modo não suportado); `AGENTS.md` passa a dizer que o desenvolvimento exige `.env.local` | — (correção de doc no mesmo PR) |
| Extras FIFA numerados de `FWC01` a `FWC20`, quando a numeração oficial do álbum 2026 vai de `FWC00` a `FWC19` | Achado de uso: catálogo × numeração real do FWC (confirmada por múltiplas fontes após uma primeira leitura errada, com dados do Catar 2022) | 14.1 | Deslocar a seção para começar em zero (`inicio: 0`, `total: 20` inalterado), sem migração de dado por não haver uso real em produção ainda | TDR |

## Regras que valem em toda tarefa

- Arquivo novo abre com `Copyright (c) 2026 Daniel Felix Ferber`, na sintaxe de
  comentário do tipo do arquivo (`AGENTS.md` § Convenções)
- Componentes novos em `src/components/`, dados em `src/data/`; sem router e sem
  estado global antes de a árvore exigir (`AGENTS.md` § Convenções)
- Decisão tomada vira ADR/TDR/IDR na hora, com a numeração a partir de ADR 0009,
  TDR 0016 e IDR 0034 (`AGENTS.md` § Convenções)
- Mudança de build, deploy, Firebase, Google Cloud, GitHub ou DNS é refletida em
  `docs/firebase.md`, `docs/gcloud.md`, `docs/github.md` ou `docs/registrobr.md`
  no mesmo PR (`AGENTS.md` § Convenções)
- Nenhuma requisição por figurinha, uma leitura por login, escrita agregada e
  mapa esparso (`requisitos.md` § Requisitos Não Funcionais)
- Nenhum componente com rolagem própria, salvo a faixa de bandeiras
  (IDR 0008 / IDR 0016)
- Todo texto visível em PT-BR; cor nunca é o único sinal de estado; o nome
  acessível escreve por extenso a notação compacta (`requisitos.md` § Requisitos
  Não Funcionais, IDR 0018)
- `npm run lint && npm run test && npm run build` verdes ao fim de toda tarefa;
  `npm run test:rules` (JDK 21+) quando a tarefa tocar `firestore.rules`
