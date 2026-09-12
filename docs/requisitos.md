<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Iconula — Controle de Figurinhas do Álbum da Copa 2026

## O que é

Iconula é um aplicativo web para colecionadores do álbum de figurinhas
oficial Panini da Copa do Mundo FIFA 2026 registrarem quantas unidades
têm de cada figurinha, acompanharem o progresso do álbum e organizarem
trocas de repetidas. O público é brasileiro e toda a interface é em
português. Substitui o antigo "Iconula Button", removido na
implementação desta especificação.

## Diferenciais

- UX minimalista e direta: os casos de uso essenciais — cadastrar e
  consultar figurinhas — acontecem em segundos, sem modos e sem
  configuração
- Sem lock-in: a coleção pertence ao usuário, que a exporta e importa
  sem impedimentos
- Troca pelo WhatsApp: listas de faltantes e repetidas em texto pronto
  para copiar e colar em grupos de troca

## Conceitos fundamentais

O catálogo espelha o álbum físico: cada figurinha tem um código e
pertence a uma seção — uma seleção ou um especial. A coleção de um
usuário é um contador de unidades por figurinha. Os estados "colada no
álbum" e "sobra para troca" derivam da contagem — nunca são registrados
à parte.

## Conceitos (Glossário)

- **Catálogo**: lista fixa de todas as figurinhas do álbum, embutida no
  código (códigos, nomes, seções e bandeiras — sem imagens dos cromos)
- **Figurinha**: item do catálogo, identificada pelo seu código — três
  letras da seção + dois dígitos da posição dentro da seção (ex.:
  `BRA05`, `FWC12`, `COC03`)
- **Seção**: agrupamento de figurinhas no álbum, identificada pelas três
  letras do código de suas figurinhas; toda seção é uma seleção ou um
  especial
  - **Seleção**: seção das figurinhas de um mesmo time — as 48 seleções
    classificadas, código FIFA de três letras (BRA, ARG, RSA…), com 20
    figurinhas cada
    - **Posições fixas**: 01 é o escudo (cromo brilhante) e 13 é a foto
      da seleção (cromo horizontal); as demais são os 18 jogadores
  - **Especiais**: seções que não são de seleção — "Extras FIFA"
    (código `FWC`; 20 figurinhas, parte da numeração oficial: troféu,
    mascotes, campeãs do passado) e "Coca-Cola" (código `COC`; 14,
    página especial), exibidas como grupos nomeados, iguais a uma
    seleção
- **Coleção**: os contadores de unidades de um usuário, um por figurinha
  do catálogo
- **Contagem**: unidades registradas de uma figurinha (0, 1, 2, …)
- **Faltante**: figurinha com contagem 0
- **Colada**: figurinha com contagem ≥ 1 — presunção de que a primeira
  unidade está no álbum
- **Repetida**: unidade além da primeira de uma figurinha com contagem
  ≥ 2; sobra disponível para troca — é esse número (contagem − 1) que o
  selo `×N` do cartão e o texto de troca mostram (ver
  [IDR 0021](idr/0021-selo-conta-unidades-sobrando.md))

## Requisitos Funcionais

*Nota sobre o formato: para manter a descrição compacta, cada item
principal (`-`) é um requisito funcional, enquanto os sub-itens
(`  -`) representam as regras e condições específicas daquele requisito.
Questões recorrentes são marcadas como "Nota".*

### Acesso
- Entrar com conta Google
  - Único provedor: Google, via popup (ver ADR 0006)
  - Visitante deslogado vê apenas a tela de login — catálogo e coleção
    não são acessíveis sem autenticar
  - Falha de login exibe mensagem de erro, exceto quando o usuário fecha
    o popup (desistência, não erro)
  - Atestação de menores no primeiro login (LGPD art. 14): um clique
    atestando ter 12 anos ou mais ou estar autorizado pelos
    responsáveis, antes de liberar o app — uma única vez por conta,
    gravada em `atestadoEm` em `users/{uid}` (ver ADR 0008)
  - Nota: a tela de login expõe o link para a política de privacidade
    antes de qualquer autenticação
- Sair da conta
  - Comando no menu de ações do cabeçalho (ver
    [IDR 0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md))
  - Grava o que estiver pendente antes de sair: depois do logout as
    regras negam a escrita, e ajustes recentes se perderiam
  - Volta à tela de login; a coleção permanece gravada no Firestore e é
    recarregada no próximo login
### Catálogo
- Exibir o catálogo completo: 994 figurinhas
  - 980 da numeração oficial: 48 seleções × 20 figurinhas (960) + 20
    extras FIFA
  - 14 da página especial Coca-Cola
- Navegar o catálogo por seção
  - 48 seleções e os especiais "Extras FIFA" e "Coca-Cola", exibidos
    como grupos nomeados, iguais a uma seleção
  - Nomes em português ("Alemanha", "Estados Unidos")
  - Bandeiras via Twemoji, incluindo Inglaterra e Escócia (ver ADR 0002)
  - Os especiais têm ícone temático no lugar da bandeira: 🏆 (Extras
    FIFA) e 🥤 (Coca-Cola)
- Pular direto para uma seção
  - Salta a tela até a seção pedida — o catálogo permanece inteiro,
    antes e depois do salto; nunca filtra a vista (ver
    [IDR 0014](idr/0014-salto-direto-para-secao.md))
  - Mecanismo: faixa de bandeiras no cabeçalho, rolável para os lados —
    tocar na bandeira salta (ver
    [IDR 0016](idr/0016-salto-pela-faixa-de-bandeiras.md))
  - O salto expande super-grupo e seção colapsados no caminho até o
    alvo (ver IDRs 0019 e 0020)
- Apresentar o catálogo em duas ordenações de seções
  - Em ambas, os Extras FIFA (FWC) são a primeira seção e a Coca-Cola
    (COC) é a última — a moldura do catálogo não muda com a ordenação
    (ver [IDR 0028](idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md))
  - Ordem alfabética pela sigla da seção (ARG, AUS, AUT, …) entre os
    dois especiais; sem super-grupos
  - Ordem igual à do álbum físico, com as 48 seleções agrupadas em 12
    super-grupos colapsáveis — os grupos da Copa A–L —, cada um com nome
    e progresso agregado no título; abertos por padrão (ver
    [IDR 0019](idr/0019-ordem-do-album-agrupada-e-colapsavel.md)); FWC e
    Coca-Cola ficam fora dos super-grupos, nas pontas (IDR 0028)
- Apresentar cada seção em duas disposições
  - Lista: figurinhas em sequência (01 a N) — vale para toda seção
  - Álbum: reproduz a página física — as 48 seleções (spread de duas
    páginas, 20 espaços) e a Coca-Cola (duas páginas, 6 + 8); facilita
    comparar com o álbum real ("qual eu já tenho?") (ver
    [IDR 0009](idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)
    e [IDR 0023](idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md))
  - Os Extras FIFA (FWC) aparecem em lista contínua também na disposição
    álbum — e sem filtro, porque a disposição escolhida é álbum
    (IDR 0023)
  - Álbum responsivo: as duas páginas do spread lado a lado quando cabem
    na largura da tela, empilhadas (uma abaixo da outra) quando não
    cabem — nunca cai para a lista (ver
    [IDR 0015](idr/0015-paginas-do-album-empilham-em-tela-estreita.md))
  - Seções colapsáveis em qualquer ordenação e disposição: tocar no
    título abre/fecha o corpo da seção; abertas por padrão (ver
    [IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))
- Apresentar o catálogo conforme o tamanho da tela (celular, tablet,
  navegador)
  - Em qualquer tamanho, os fluxos essenciais — cadastrar e consultar —
    permanecem completos
  - Nota: qual ordenação e disposição são usadas ou oferecidas em cada
    faixa de tela é decisão de interface — ver [interface.md](interface.md)

### Contagem
- Ajustar a contagem de uma figurinha: incrementar e decrementar
  - Sem ação dedicada de zerar: chegar a 0 é decrementar até 0
  - A contagem nunca fica negativa (decremento para em 0)
  - A contagem vai até 99: o incremento para em 99, como o decremento
    para em 0. O teto não é preferência de produto — é o que permite às
    regras do Firestore validarem os valores gravados (ver
    [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md)); na prática
    ninguém passa de dezenas, e o selo do cartão já reserva dois dígitos
    (ver [IDR 0021](idr/0021-selo-conta-unidades-sobrando.md))
  - O ajuste é aplicado na hora na tela e entra na gravação seguinte —
    sem ação do usuário (ver Estado da sincronização)
  - Falha de persistência não bloqueia o ajuste: a tela reflete a
    mudança, a falha é notificada e a gravação seguinte regrava o valor completo
- Desfazer ajustes
  - Desfaz a última alteração — incremento ou decremento — e
    pode ser repetido para desfazer as últimas 10, na ordem inversa
    (ver [IDR 0010](idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md)
    e [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Nota: o estado vazio (0/994) não tem tela, dica ou mensagem especial —
  o app mostra a coleção normal, ainda vazia

### Estado da sincronização
- A persistência é automática e transparente: sem botões de ler ou
  salvar; a gravação é relativamente rápida, sem precisar acontecer a
  cada ajuste — agregar mudanças é aceitável (debounce de ~2s com teto
  de espera e flush ao fechar a página — ver ADR 0008)
- Notificar o usuário em caixa flutuante colada à borda inferior, com
  três severidades (ver
  [IDR 0029](idr/0029-avisos-flutuantes-com-tres-severidades.md))
  - Sucesso (gravado, carregado, lista copiada, exportado, importado):
    some sozinho após 5 segundos
  - Aviso (recusa esperada, nada quebrado — arquivo de importação
    inválido, área de transferência indisponível, gravação sem rede que
    ficou enfileirada): some após 5 segundos
  - Falha (gravação ou carga que deveria ter funcionado): fica até
    dispensada ou até a operação seguinte do mesmo tipo ter sucesso, e
    revela a mensagem técnica ao ser tocada (ver
    [IDR 0017](idr/0017-aviso-so-na-falha-com-detalhe-tecnico.md))
- Exibir a data/hora da última gravação bem-sucedida — o `updatedAt` do
  documento, carimbado pelo servidor; a carga apenas o traz, não o move
  (ver [IDR 0027](idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md))
- Nota: sessões simultâneas do mesmo usuário não são tratadas no MVP —
  vence a última gravação e ajustes da outra sessão podem ser perdidos
  (decisão consciente; ver Requisitos futuros)

### Progresso e listas
- Exibir progresso da coleção: total, coladas, faltantes e repetidas
  - Repetidas conta códigos distintos com contagem ≥ 2; as unidades
    sobrando (contagem − 1) aparecem por figurinha na lista de repetidas
  - Nota: o `×` tem duas leituras, ambas declaradas — nos títulos
    (placar, super-grupo, seção) conta **códigos distintos** com
    contagem ≥ 2; no selo do cartão e no texto de troca conta
    **unidades sobrando** (IDR 0021)
  - Geral: sobre as 994 do catálogo — todas as figurinhas contam,
    inclusive especiais e Coca-Cola
  - Por seção: os mesmos números sobre o total da seção
- Exibir lista de faltantes: figurinhas com contagem 0
- Exibir lista de coladas: figurinhas com contagem ≥ 1 — a conferência
  contra o álbum físico; é vista em tela (filtro), sem texto de troca
  correspondente
- Exibir lista de repetidas: figurinhas com contagem ≥ 2, com as
  unidades sobrando (contagem − 1)

### Compartilhamento
- Gerar texto pronto para WhatsApp com faltantes e/ou repetidas
  - Uma linha por seção: nome e sigla no início, números em sequência,
    sempre com dois dígitos como no cartão (ex.: `Brasil BRA: 05 08 12 19`)
  - Repetidas indicam as unidades sobrando por número (ex.: `05×2`)
  - Faltantes e repetidas geram textos separados
  - Entrega por copiar para a área de transferência — sem abrir o
    WhatsApp; os dois comandos ficam no menu de ações do cabeçalho (ver
    [IDR 0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md))
  - Nota: a lista de troca é apenas saída; portabilidade usa JSON

### Portabilidade (sem lock-in)
- Exportar a coleção completa em arquivo JSON
  - Lossless: todas as contagens, suficiente para restaurar a coleção
    exatamente como está
  - Formato: `{ "versao": 1, "geradoEm": <ISO 8601>, "contagens": {
    "BRA05": 3 } }` — versionado, sem dados pessoais; a importação
    valida a versão
  - Disponível sempre, sem etapas adicionais: o comando fica no menu de
    ações do cabeçalho, a dois toques de qualquer ponto da tela
    (IDR 0024)
- Importar coleção a partir de arquivo JSON
  - A importação substitui a coleção inteira, após confirmação explícita
  - Comando no mesmo menu de ações do cabeçalho (IDR 0024)
  - A importação descarta o histórico de desfazer: o estado anterior
    deixou de existir, e reverter para ele seria incoerente
  - Arquivo inválido ou incompleto é rejeitado sem alterar a coleção atual
  - Formato garantido: o exportado pelo próprio app

### Privacidade
- Exibir política de privacidade (LGPD)
  - Acessível a partir da tela de login, antes de autenticar
  - Declara os dados tratados — identidade da conta Google (nome,
    e-mail, foto) e a coleção —, finalidade, retenção e direitos do titular
  - Direitos do titular (acesso, correção, exclusão) exercidos por canal
    de contato declarado na própria política — exclusão dentro do app é
    requisito futuro
  - Trata dados de menores (LGPD art. 14): consentimento dos
    responsáveis capturado pela atestação do primeiro login (ver Acesso)
- Exibir aviso de independência e marcas (rodapé)
  - Projeto independente, sem vínculo com Panini ou FIFA; marcas
    pertencem aos seus titulares (Lei 9.279/96, art. 132)

## Regras Transversais

### Semântica da contagem
- Contagem 0 = faltante; contagem 1 = colada; contagem n ≥ 2 = colada +
  (n−1) repetidas
- "Colada" é presunção da contagem, não estado registrado à parte — não
  existe "tenho mas ainda não colei"
- A identidade de uma figurinha é o seu código — letras da seção +
  dígitos da posição —, imutável no catálogo; contagens são sempre
  endereçadas por código

### Dados e isolamento
- A coleção vive no Firestore em `users/{uid}`; o isolamento entre
  usuários é garantido pelas `firestore.rules` avaliadas no servidor
  (ADR 0007) — nunca pelo cliente
- Falha de persistência não trava a interface, mas é informada
  claramente ao usuário — revisa a política de erro do ADR 0007
  (falha invisível, só log), que valia para o botão
- Sem as variáveis `VITE_FIREBASE_*`, o login fica indisponível e o app
  não oferece funcionalidade — coerente com o login obrigatório; modo
  não suportado
- Nota: o campo `teamName` da era do botão é removido na migração —
  apagado pela primeira gravação do schema novo (ver ADR 0008)
- Nenhum dado além da identidade Google e da coleção é tratado; sem
  analytics no MVP

### Conteúdo
- O app não exibe imagens dos cromos (direitos autorais Panini): só
  códigos, nomes, seções e bandeiras Twemoji
- O catálogo é embutido no código (`src/data/`), não carregado de
  serviço externo

### UX
- Os fluxos essenciais — cadastrar contagens e consultar a coleção —
  são os mais curtos e rápidos da interface; nenhuma feature pode
  atravessá-los
- Minimalismo funcional: sem modos, sem configurações e sem passos
  opcionais nos fluxos essenciais
- Minimalismo é regra de ouro: título, busca e comandos minimalistas,
  espaço otimizado para o catálogo — o app assume usuário especialista,
  sem rótulos explicativos nem reforço redundante; notação compacta de
  progresso nos títulos (`12/20 · 60% · ▢8 · ×3`) e título em linha única
  (`ICONULA 2026 · 412/994 · 41% · ▢582 · ×37 · 12:34`), sem barra de
  progresso (ver
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- Navegação por rolagem da tela inteira: as seções fluem uma abaixo da
  outra, sem interrupções; um salto direto à seção desejada complementa
  a rolagem (ver [IDR 0014](idr/0014-salto-direto-para-secao.md), que
  retoma o [IDR 0004](idr/0004-rejeitado-ir-para-secao-e-salto-de-navegacao.md))
- Filtro de status (todas/faltantes/coladas/repetidas) existe apenas na
  disposição lista; a disposição álbum nunca é filtrada — nem a lista do
  FWC exibida dentro dela (IDR 0023). Coladas (contagem ≥ 1) e repetidas
  (contagem ≥ 2) se sobrepõem de propósito (ver
  [IDR 0033](idr/0033-filtro-de-coladas.md))
- Ao filtrar, seções (e super-grupos) sem nenhuma figurinha no estado
  filtrado somem da vista — o filtro não deixa cabeçalhos vazios para
  trás (ver [IDR 0025](idr/0025-filtro-oculta-secoes-vazias.md))
- Ordenação, disposição e filtro persistem no navegador e são
  restaurados na abertura seguinte; o colapso de seções, não (ver
  [IDR 0026](idr/0026-preferencias-de-vista-persistidas-no-navegador.md))
- Jamais scroll dentro de scroll: cada tela é uma única página
  scrollável; nenhum componente tem rolagem própria (ver
  [IDR 0008](idr/0008-uma-unica-pagina-scrollavel.md))

## Requisitos Não Funcionais

- **Idioma**: interface 100% em português do Brasil; `<html lang="pt-BR">`
  (corrige o `lang="en"` atual)
- **Acessibilidade**: operável por teclado, contraste adequado, semântica
  legível por leitores de tela — preservar a base atual (bandeira
  `aria-hidden`, botões com texto); a cor nunca é o único sinal de
  estado, e os nomes acessíveis escrevem por extenso o que a notação
  compacta abrevia (IDR 0018)
- **Navegadores**: evergreen — últimas duas versões de Chrome, Edge,
  Firefox e Safari, desktop e mobile
- **Performance**: catálogo com ~1000 figurinhas renderiza e filtra sem
  travar; virtualizar listas longas se necessário
- **Responsividade**: o app funciona bem em navegador, celular e tablet;
  a apresentação do catálogo se adapta ao tamanho da tela
- **Aparência**: tema escuro único (verde-gramado com dourado), sem
  seguir `prefers-color-scheme` e sem tema claro — paleta, tipografia e
  medidas em [interface.md](interface.md) (ver
  [IDR 0022](idr/0022-tema-escuro-unico-paleta-do-prototipo.md))
- **Compartilhamento do site**: `title`, `description` e Open Graph
  básicos em PT-BR
- **Deploy**: Firebase Hosting — produção em merge na `main`, preview por
  PR (já vigentes)
- **Economia de requisições**: operar dentro da cota gratuita do plano
  Spark exige ser econômico nas requisições ao Firestore — uma leitura
  por login, escritas agregadas (IDR 0003), mapa esparso (zeros nunca
  gravados — ver [persistencia.md](persistencia.md)); nenhuma
  requisição por figurinha; cada feature nova contabiliza seu custo em
  leituras/escritas antes de entrar (o sync ao vivo, em futuros, é o
  primeiro candidato a pesar)
- **Custo**: plano Spark (gratuito); Firestore em `southamerica-east1`
  com faixa gratuita (ADR 0007)

## Requisitos futuros

*Ideias registradas para evolução — nenhuma comprometida; cada uma exige
especificação própria antes de implementar.*

- Modo pacotinho: lançar de uma vez os 7 números de um envelope
- Entrada em massa por texto: colar códigos (com repetições) e
  transformá-los em contagens de uma vez — carga inicial de quem já tem
  centenas coladas
- Sincronização ao vivo entre dispositivos: dispositivos abertos se
  atualizam sem recarregar (hoje a carga acontece só no login)
- Merge de sessões simultâneas: ajustes de figurinhas distintas feitos
  em dispositivos abertos ao mesmo tempo se combinam, em vez de a
  última gravação vencer (hoje: a última vence — decisão conscienta)
- Apagar meus dados do app: excluir a coleção e a conta de login e
  voltar à tela de login — a conta Google permanece (é do Google, não
  do app); exige re-autenticação via popup quando o login não for
  recente
- Match entre coleções: comparar com a coleção de outro usuário ("o que
  eu tenho que tu falta")
- Importar lista colada do WhatsApp (se "receber por mensagem" virar
  caso de uso real — hoje coberto por JSON)
- Pacote de atualização: as 120 figurinhas de convocados lançadas em
  junho/2026
- Variantes Extra: figurinhas paralelas roxa/bronze/prata/ouro
- PWA: instalável como app
- Consulta sem rede: cache local do Firestore para abrir o app offline
  e consultar a coleção carregada (feiras de troca)
- Analytics anônimo de uso

### Decisões Pendentes
Nenhuma — as três pendências registradas durante o plano foram todas
resolvidas, com registro próprio:

- **Fonte do checklist**: degradação decidida sem bloquear a
  implementação — nomes de figurinha não entram no dado (a interface
  especificada não os exibe), a página do FWC fica `null` (omitida) e
  `metalizada` só nasce `true` na posição 01 de cada seleção; corrigir
  quando a fonte completa aparecer é mudança contida em
  `expandirFigurinhas` — [TDR 0010](tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)
- **Política de privacidade depois de autenticado**: reaparece no
  rodapé da tela principal, ao lado do link já existente na tela de
  login — [IDR 0037](idr/0037-politica-no-rodape-depois-de-autenticado.md)
- **Falha ao gravar a atestação de menores**: o app libera o catálogo
  mesmo em falha (o clique em "Confirmar" já é o ato de atestar); a
  falha avisa e a próxima carga sem `atestadoEm` repete o passo —
  [IDR 0036](idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md)

## Fora de Escopo

- **Modo local sem login** (dados primários no navegador): excluído
  permanentemente — o produto é centrado na conta Google; sem login não
  há contador
- **Imagens dos cromos**: excluído permanentemente — direitos autorais
  da Panini
- **Outros álbuns**: fora desta versão — o catálogo é o álbum da Copa
  2026
- **O botão de seleções atual** ("Iconula Button"): removido no PR de
  implementação desta especificação; o histórico permanece no git

## Anexo: seções do catálogo

As 48 seleções — código, nome como impresso no álbum (PT-BR), grupo da
Copa e as duas páginas que a seção ocupa no álbum físico, que definem a
ordem do álbum (ver
[IDR 0005](idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md)).

Cada seleção ocupa um **spread**: a página par traz as figurinhas 01–10
e a ímpar seguinte, as 11–20 — México em 8 e 9, Brasil em 24 e 25, e
assim por diante. O bloco 56–57 não pertence a nenhuma seleção. As
páginas 1–7 e 106–111 cobrem capa e extras FIFA (a página exata do FWC
segue pendente do checklist, e só afeta o número exibido no cabeçalho
daquela seção).

O **grupo da Copa** sai da própria ordem do álbum — cada quatro páginas
pares consecutivas são um grupo, do A ao L —, verificado contra o
sorteio de dezembro de 2025; a tabela por grupo e o raciocínio estão no
[IDR 0019](idr/0019-ordem-do-album-agrupada-e-colapsavel.md).

A Coca-Cola é a última seção do álbum, nas páginas 112–113: 6 figurinhas
na página 112 (2 linhas × 3 colunas) e 8 na página 113 (3 figurinhas nas
linhas 1 e 2, 2 na linha 3).

| Código | Seção | Grupo | Páginas |
|---|---|---|---|
| ALG | Argélia | J | 84–85 |
| ARG | Argentina | J | 82–83 |
| AUS | Austrália | D | 36–37 |
| AUT | Áustria | J | 86–87 |
| BEL | Bélgica | G | 58–59 |
| BIH | Bósnia-Herzegovina | B | 18–19 |
| BRA | Brasil | C | 24–25 |
| CAN | Canadá | B | 16–17 |
| CIV | Costa do Marfim | E | 44–45 |
| COD | Congo DR | K | 92–93 |
| COL | Colômbia | K | 96–97 |
| CPV | Cabo Verde | H | 68–69 |
| CRO | Croácia | L | 100–101 |
| CUW | Curaçao | E | 42–43 |
| CZE | Chéquia | A | 14–15 |
| ECU | Equador | E | 46–47 |
| EGY | Egito | G | 60–61 |
| ENG | Inglaterra | L | 98–99 |
| ESP | Espanha | H | 66–67 |
| FRA | França | I | 74–75 |
| GER | Alemanha | E | 40–41 |
| GHA | Gana | L | 102–103 |
| HAI | Haiti | C | 28–29 |
| IRN | Irã | G | 62–63 |
| IRQ | Iraque | I | 78–79 |
| JOR | Jordânia | J | 88–89 |
| JPN | Japão | F | 50–51 |
| KOR | Coreia do Sul | A | 12–13 |
| KSA | Arábia Saudita | H | 70–71 |
| MAR | Marrocos | C | 26–27 |
| MEX | México | A | 8–9 |
| NED | Países Baixos | F | 48–49 |
| NOR | Noruega | I | 80–81 |
| NZL | Nova Zelândia | G | 64–65 |
| PAN | Panamá | L | 104–105 |
| PAR | Paraguai | D | 34–35 |
| POR | Portugal | K | 90–91 |
| QAT | Catar | B | 20–21 |
| RSA | África do Sul | A | 10–11 |
| SCO | Escócia | C | 30–31 |
| SEN | Senegal | I | 76–77 |
| SUI | Suíça | B | 22–23 |
| SWE | Suécia | F | 52–53 |
| TUN | Tunísia | F | 54–55 |
| TUR | Turquia | D | 38–39 |
| URU | Uruguai | H | 72–73 |
| USA | Estados Unidos | D | 32–33 |
| UZB | Uzbequistão | K | 94–95 |
