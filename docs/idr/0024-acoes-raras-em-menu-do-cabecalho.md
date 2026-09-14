<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0024: Ações raras num menu do cabeçalho

## Status

Aceito — preenche a lacuna de interface das ações de compartilhamento e
portabilidade, exigidas por requisitos.md e sem lugar na tela até aqui.

O varrimento de teclado da Tarefa 0010-0001 achou uma lacuna: "fecha ao
tocar fora" só ouvia `mousedown`, então tabular para fora do último item do
popup (`Tab` sem escolher nada) deixava o popup visivelmente aberto com o
foco já em outro elemento da tela. Corrigido com um `onBlur` no container
que fecha o popup quando o foco sai dele — mesmo comportamento do clique
fora, só que disparado por perda de foco em vez de clique (ver
[IDR 0042](0042-foco-visivel-e-area-de-toque.md)).

## Contexto

- requisitos.md exige quatro saídas para a coleção — texto de
  faltantes para o WhatsApp, texto de repetidas, exportar JSON e
  importar JSON — e diz que a exportação está "disponível sempre, sem
  etapas adicionais". A tela principal especificada em interface.md
  não tinha porta de entrada para nenhuma delas: o cabeçalho tem
  título, a linha de controles tem os alternadores e o desfazer, e o
  corpo é o catálogo.
- Pôr quatro comandos na linha de controles disputaria o espaço mais
  caro da tela, que o [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
  reservou ao catálogo — e são ações raras: exporta-se de vez em
  quando, importa-se quase nunca, e a lista de troca sai antes da
  feira.

## Decisão

- O **avatar do usuário** ([IDR 0049](0049-avatar-como-gatilho-do-menu-de-acoes.md)),
  no cabeçalho, abre um **popup** com três comandos, em dois blocos:
  - **exportar** a coleção em JSON
  - **importar** coleção de um arquivo JSON
  - **sair da conta** — volta à tela de login (requisitos.md, Acesso)
- Um **botão compartilhar** dedicado, na primeira linha do cabeçalho, à
  esquerda do avatar ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)),
  abre um segundo popup, organizado **por lista**, em dois blocos separados
  por filete
  - ícone SVG de compartilhar (três nós ligados), inline, sem asset externo;
    nome acessível "compartilhar listas de troca"
  - itens do popup:
    - copiar lista de **faltantes** · compartilhar **faltantes**…
    - copiar lista de **repetidas** · compartilhar **repetidas**…
- **Compartilhar** usa a folha de compartilhamento do sistema
  (`navigator.share`): o usuário escolhe o app (Signal, WhatsApp, Telegram,
  e-mail…) — o Iconula não assume nenhum
  - os itens de compartilhar só existem onde o navegador oferece a função;
    sem ela, o popup fica só com as duas cópias
  - o texto é o mesmo da cópia
    ([IDR 0039](0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md))
  - fechar a folha sem escolher não gera aviso; compartilhado, aviso de
    sucesso "Lista compartilhada"; outra falha cai na cópia, com o aviso e
    a reserva do IDR 0039
- Os dois popups fecham ao escolher um comando, ao tocar fora ou com `Esc`;
  a importação segue pedindo a confirmação explícita exigida por
  requisitos.md
- Nenhum popup tem rolagem própria — respeita o
  [IDR 0008](0008-uma-unica-pagina-scrollavel.md)

## Consequências

- Os fluxos essenciais — cadastrar e consultar — continuam a um toque;
  as ações raras custam dois, o que é proporcional à frequência
- A linha de controles permanece com os alternadores e o desfazer
- Sair da conta ganha lugar sem gastar espaço no cabeçalho, e fica
  longe do toque acidental durante o cadastro em rajada
- O popup é o lugar natural para a política de privacidade depois de
  autenticado — decisão à parte, ver Pendências de interface
- Copiar para a área de transferência precisa de retorno visível ("lista
  copiada"), que não é evento de persistência — foi um dos motivos de o
  [IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md) trazer de
  volta o aviso de sucesso
- Compartilhar ganha um alvo próprio no cabeçalho: um toque a menos para
  achar as listas, ao custo de ~38px da largura do título no celular
- `requisitos.md` § Compartilhamento passa a dizer entrega por cópia ou pela
  folha do sistema, com os comandos no botão compartilhar — ajustado a
  pedido do humano no PR do plano das Fases 0020 e 0021
- `MenuDeAcoes.jsx` perde as cópias; nasce o popup de compartilhar;
  `App.jsx` ganha o compartilhar das duas listas; `interface.md`
  § Cabeçalho, § Menu de ações, § Avisos, § Camadas e § Medidas mudam
- Sem custo em leituras ou escritas
- Implementação: Fase 0021 — Tarefa 0021-0001 (botão compartilhar com as
  cópias) e Tarefa 0021-0002 (folha do sistema); depois da Fase 0019
  (cabeçalho todo sticky)

## Alternativas consideradas

- **Quatro botões na linha de controles**: um toque para tudo, mas gasta
  a linha mais cara da tela com o que se usa raramente
- **Seção de ações no fim do catálogo**: sem custo no cabeçalho, mas
  exige rolar ~994 figurinhas para exportar
- **Tela separada de ferramentas**: navegação a mais, contra a tela
  única
- **Cópias no menu do avatar** (decisão anterior): mistura troca com
  portabilidade e conta, e esconde o compartilhar atrás da identidade
- **Botão compartilhar ao lado do desfazer**: o título não perde largura,
  mas os grupos quebram antes e o comando raro fica junto do frequente
- **Glifo `⇪`**: sem asset, mas lido como tecla Caps Lock fora do iOS
- **Glifo `⇄`**: fala de troca, não de compartilhar
- **Dois botões diretos (copiar faltantes, copiar repetidas)**: um toque
  cada, dois alvos a mais contra o IDR 0018
- **Itens de compartilhar só em tela sensível ao toque**: adivinha o
  aparelho; desktops com folha do sistema ficariam sem a opção
- **Popup organizado por ação** (cópias num bloco, compartilhamentos no
  outro): obriga a escolher o jeito antes da lista
- **Compartilhar no lugar de copiar, no celular**: perde a cópia para colar
  onde a folha não chega
- **Abrir o WhatsApp direto**: assume um app que o colecionador pode não usar

## Histórico

- 2026-09-14 — Esmiuçamento de contrair seções, rodapé e compartilhar: as
  duas cópias saem do menu do avatar para um botão compartilhar à esquerda
  do avatar, com um popup por lista que acrescenta compartilhar pela folha
  do sistema onde o navegador a oferece; implementação a planejar. Antes:
  o avatar abria cinco comandos, com as cópias como único jeito de entregar
  a lista.

- 2026-09-13 — Planejamento revisado das Fases 11–17 (implementação na
  Fase 0011, Tarefa 0011-0005): o gatilho do popup passa a ser o avatar do
  usuário, que substitui o botão de ações. Antes: um botão de ações com
  glifo próprio. O conteúdo e o comportamento do popup não mudam.
