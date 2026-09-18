<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0055: Catálogo compartilhado por link, somente leitura

## Status

Aceito.

## Contexto

- Pedido: o colecionador passa um link a outras pessoas, que veem o
  catálogo dele em somente leitura — para conferir se ele tem as
  figurinhas que elas precisam ou que poderiam oferecer.
- Objetivo declarado: quem abre vê o **estado atual** da coleção, não uma
  foto do momento do compartilhamento.
- Restrição declarada: sem casos de uso de administrar URLs.
- O que já existia:
  - `requisitos.md` § Acesso — visitante deslogado vê só a tela de login;
    § Dados e isolamento — `firestore.rules` só libera `get` do próprio
    documento
  - popup Compartilhar com as listas de troca em texto
    ([IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md))
  - catálogo com duas ordenações, duas disposições, filtro e faixa de
    bandeiras, sempre editável (`Catalogo.jsx` recebe `onAjustar`)
  - nenhum nome do usuário no Firestore — só no Firebase Auth
    ([modelo-firebase.md](../modelo-firebase.md))
  - "Match entre coleções" em `requisitos.md` § Requisitos futuros

## Decisão

- **Um link único por conta**, que o dono **liga e desliga**
  - sem lista de links, sem tela de gestão e sem validade
  - desligado, o link não mostra a coleção; religar reativa o **mesmo**
    link
- **Abre sem login**: quem recebe vê na hora, sem conta nem atestação —
  exceção à guarda de login de `requisitos.md` § Acesso
- A vista é **somente leitura** e mostra o estado atual da coleção
  - **uma leitura ao abrir**: recarregar traz o estado novo; a vista não
    se atualiza sozinha enquanto aberta
- **Formato do link**: `https://iconula.danielferber.com.br/catalogo/<uid>`
  - lê o próprio documento `users/{uid}`, liberado pelas regras enquanto o
    link estiver ligado ([MDR 0002](../model-dr/0002-schema-do-documento-da-colecao.md))
  - caminho lido por `App.jsx`, sem router
    ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md))
- **Sem identidade do dono**: nenhum nome, foto ou dado da conta aparece
  na vista nem se torna público — quem manda o link já está identificado
  na conversa
- **Textos visíveis**
  - rótulo `somente leitura` em `--muted`, no fim da linha do título
  - chave `Link do catálogo: ligado` / `Link do catálogo: desligado`
  - itens `Copiar link do catálogo` e `Compartilhar link do catálogo…`
  - avisos de sucesso `Link ligado`, `Link desligado`, `Link copiado` e
    `Link compartilhado`
  - falhas `Falha ao ligar o link — toque para detalhes`, `Falha ao
    desligar o link — toque para detalhes` e `Falha ao carregar o catálogo
    — toque para detalhes`
  - link desligado ou inexistente: `Este catálogo não está compartilhado.`
    e o link `Conhecer o Iconula`
- **Política de privacidade**
  - § Onde os dados ficam: "Nenhum outro terceiro tem acesso a esses dados
    além do Google, que já processa o login pelo próprio provedor, e, se
    você ligar o link do catálogo, de quem tiver o link."
  - seção nova "Link do catálogo": "Se você ligar o link do catálogo, a sua
    coleção (contagens e data da última gravação) fica visível, sem login, a
    qualquer pessoa que tenha o link, até você desligá-lo. O link contém um
    identificador interno da sua conta; seu nome, e-mail e foto não
    aparecem."
- **Vista = tela principal sem edição**
  - mantém: título com placar e relógio (`updatedAt` do dono,
    [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md)),
    ordenação, disposição, filtro, faixa de bandeiras com tooltip, colapso
    de seções e super-grupos e rodapé com política e termos
  - some: desfazer, botão compartilhar, avatar, toque que soma, controle de
    menos e pressão longa — os cartões não reagem a toque
  - cartões **sem papel de botão e fora da ordem de tabulação**, com o nome
    acessível preservado (código, nome e contagem) — o teclado percorre
    controles, faixa e títulos de seção, não 994 cartões inertes
  - rótulo curto "somente leitura" no título
- **Estados**
  - carregando: tela neutra
    ([IDR 0035](0035-tela-neutra-enquanto-a-sessao-resolve.md))
  - link desligado e `uid` inexistente têm a **mesma** resposta: "Este
    catálogo não está compartilhado." e um link "Conhecer o Iconula" para
    `/` — as regras negam os dois do mesmo jeito, e a vista não revela se a
    conta existe
  - falha de leitura (rede): a mesma tela, com aviso de falha
    ([IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md));
    recarregar tenta de novo
- **O caminho manda**: `/catalogo/<uid>` mostra a vista para qualquer um,
  logado ou não, **inclusive o próprio dono** — serve para conferir o que
  os outros veem; a vista não usa a sessão
  - o título `ICONULA 2026` vira link para `/`, que leva ao próprio
    catálogo (ou à tela de login)
- **Ligar e desligar**: terceiro bloco do popup Compartilhar, com uma chave
  explícita "Link do catálogo: ligado/desligado" e, ligado, "Copiar link" e
  "Compartilhar link…" ([IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md))
  - tocar na chave **não fecha** o popup — ligar e copiar em seguida
  - grava **na hora**, fora da gravação agregada; aviso de sucesso "Link
    ligado" ou "Link desligado"
  - falha: a chave volta ao estado anterior, com aviso de falha
    ([IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md)); sem
    rede, a espera do
    [TDR 0019](../tdr/0019-espera-sem-rede-via-corrida-com-timeout-e-callback.md)
  - "Compartilhar link do catálogo…" entrega à folha do sistema **só a
    `url`**; "Copiar link do catálogo" copia só a URL; cancelar a folha não
    avisa, outra falha cai na cópia com a reserva do
    [IDR 0039](0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md)
  - **ligar exige um passo informativo** (Fase 0032): a chave expande, no
    próprio popup e sem fechá-lo, um bloco curto — a coleção fica legível
    sem login para quem tiver o link, nome e e-mail não aparecem,
    desligar revoga o acesso, mas quem já abriu pode ter copiado o que
    viu — com "Ligar o link" e "Cancelar"; é o consentimento destacado
    que o art. 7º, I exige para a única operação baseada em
    consentimento ([IDR 0061](0061-conteudo-de-conformidade-da-politica-e-dos-termos.md))
  - **desligar segue imediato**, sem confirmação: desligar nunca é a ação
    arriscada ([IDR 0010](0010-desfazer-ajustes-em-vez-de-confirmacoes.md))
- **Preferências de vista na vista do link: lê, mas não grava**
  ([IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md))
  - abre com a ordenação, a disposição, o filtro e o colapso guardados no
    dispositivo, ou com o padrão por faixa de tela
    ([IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md))
  - mudanças valem só enquanto a vista está aberta — olhar o catálogo de
    outro não muda as próprias preferências
- **Fora de buscadores**: `/catalogo/**` responde com
  `X-Robots-Tag: noindex`
  ([DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md))

## Consequências

- `requisitos.md` muda: § Acesso (exceção da vista por link), §
  Compartilhamento (requisito novo), § Dados e isolamento (exceção ao
  isolamento decidida nas regras) e § Privacidade (a política declara a
  visibilidade da coleção por link)
- `firestore.rules` passa a ter uma leitura sem autenticação — primeira
  do produto; custo em cota e risco de abuso entram na conta do
  [ADR 0005](../adr/0005-persistencia-no-firestore.md)
- O texto da política de privacidade ("nenhum outro terceiro tem
  acesso…") muda junto
- Primeiro endereço próprio de tela — gatilho de revisão do
  [TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)
- Implementação: [Fase 0027](../plano/0027-catalogo-compartilhado-por-link/)
  - Tarefa 0027-0001 — regras e campo `linkAtivo`
  - Tarefa 0027-0002 — catálogo e cabeçalho em somente leitura
  - Tarefa 0027-0003 — vista do link, estados e preferências
  - Tarefa 0027-0004 — chave do link no popup Compartilhar
  - Tarefa 0027-0005 — copiar e compartilhar o link
  - Tarefa 0027-0006 — política de privacidade, `noindex` e e2e

## Alternativas consideradas

- **Coleção dentro da URL** (contagens compactadas no fragmento `#`, sem
  Firestore nem regras): descartada — é foto do momento, não mostra o
  estado atual e não pode ser revogada.
- **Link único com validade** (vence em N dias, renovado ao compartilhar
  de novo): recusada — quem guardou o link perde o acesso sem o dono
  querer; ligar/desligar basta.
- **Vários links com tela de gestão** (validade e revogação por link):
  recusada — é a administração de URLs que o pedido quer evitar, com mais
  dados, regras e uma tela nova.
- **Exigir login para ver**: recusada — obriga quem só quer olhar a criar
  conta e atestar; manteria § Acesso, mas trava o uso em grupos de troca.
- **Atualização ao vivo** (`onSnapshot`): recusada — cada gravação do dono
  vira uma leitura por visitante aberto, o mesmo custo que deixou a
  sincronização ao vivo em § Requisitos futuros.
- **Tela principal com botão "Entrar no Iconula"** no lugar do avatar:
  recusada — mais um elemento no cabeçalho (IDR 0018); o título como link
  para `/` basta.
- **Só as listas de troca em texto** no lugar do catálogo: recusada — não é
  a vista do catálogo pedida e perde a disposição álbum.
- **Mensagens distintas** para link desligado, inexistente e sem conexão:
  recusada — as regras negam desligado e inexistente com o mesmo erro;
  distinguir exigiria outra leitura ou expor a existência da conta.
- **Copiar ou compartilhar ligam o link sozinhos**, com "Desativar link"
  só quando ligado: recusada — o estado do link fica implícito; a chave
  explícita mostra sempre se o catálogo está aberto.
- **Dono que abre o próprio link vai ao catálogo editável**: recusada —
  depende de esperar o Auth antes de decidir e impede o dono de ver o que
  o visitante vê.
- **`/c/<uid>` ou `/colecao/<uid>`**: recusados — `/catalogo/` diz o que
  abre, em PT-BR, e o encurtamento não paga a clareza.
- **Chave que fecha o popup**, como os demais itens: recusada — ligar e
  depois copiar exigiria reabrir o popup.
- **Confirmação ao ligar** (`window.confirm` sobre a visibilidade):
  recusada — um passo a mais para algo reversível (IDR 0010, IDR 0018).
- **Preferências compartilhadas com a tela principal**: recusada — filtrar
  no catálogo de outro mudaria a própria tela depois.
- **Só o padrão por faixa, sem ler nem gravar**: recusada — ignora o jeito
  que o dispositivo costuma ver o catálogo.
- **Sem `noindex`**: recusada — catálogos ligados poderiam ser indexados
  se o link vazar para página pública.
- **Cartões como botões desabilitados** na vista: recusada — o leitor de
  tela anunciaria 994 botões indisponíveis e o teclado pararia em cada um.
- **URL com texto curto na folha do sistema** ("Minhas figurinhas no
  Iconula"): recusada — apps que juntam `text` e `url` duplicam o cabeçalho,
  como já se viu na Tarefa 0021-0002.
- **Primeiro nome da conta na vista**: recusada — grava dado pessoal no
  Firestore e o torna público, sem ganho para quem recebe o link na
  própria conversa.

## Histórico

- 2026-09-17 — Planejamento da Fase 0032: ligar o link passa a exigir um
  passo informativo no popup, como consentimento destacado (art. 7º, I);
  desligar segue imediato. Antes: "sem confirmação para ligar ou
  desligar — é reversível", decidido quando o link era tratado só como
  comodidade de compartilhamento, sem base legal declarada.
  Implementação na Fase 0032, Tarefa 0032-0006.
- 2026-09-16 — Planejamento da Fase 0027: textos visíveis, texto da
  política, cartões sem papel de botão e folha do sistema só com a `url`;
  implementação na Fase 0027.
- 2026-09-16 — Esmiuçamento: decisão criada; implementação a planejar.
