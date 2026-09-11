<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0007-0001]: área de avisos com três severidades

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão e § Consequências — flutuante na borda inferior, sucesso e aviso em 5s, falha persistente, nunca log com scroll
- `docs/idr/0017-aviso-so-na-falha-com-detalhe-tecnico.md` § Decisão — o detalhe técnico recolhido por padrão, expandido ao toque
- `docs/interface.md` § Avisos — a tabela de severidades, as cores de fundo e borda, o texto de 13px, o `×` isolado na ponta direita
- `docs/interface.md` § Medidas — `position: fixed`, `padding: 12px clamp(16px, 4vw, 40px)`, sombra `0 -6px 20px`, monospace 11px no detalhe
- `docs/interface.md` § Camadas — a área de avisos passa por cima do cabeçalho, e o menu de ações por cima de tudo
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Consequências — notificações efêmeras, empilháveis com limite, nunca roláveis

## Objetivo
Construir o canal de retorno do app antes de existir o que notificar: a faixa
flutuante com as três severidades, que a persistência (Tarefas 0007-0002 a
0007-0005) e o menu de ações (Fase 9) vão usar.

## Padrões e convenções aplicáveis
- Sucesso e aviso somem sozinhos em **5s**; falha persiste até ser dispensada ou
  até a operação seguinte do mesmo tipo ter sucesso — `docs/idr/0029-*` § Decisão
- Nunca vira log com scroll; poucas mensagens empilham no máximo —
  `docs/idr/0029-*` § Decisão e `docs/idr/0008-*`
- A mensagem inteira é a área de toque que abre o detalhe técnico; o `×` de
  dispensar fica isolado na ponta direita — `docs/interface.md` § Avisos
- As mensagens falam na voz do usuário e cabem numa linha; o jargão fica no
  detalhe — `docs/interface.md` § Avisos
- Flutuante (`position: fixed`): sobrepõe o conteúdo, não empurra o layout nem
  rola com a página — `docs/idr/0029-*` § Decisão
- Cor só pelos tokens e pelos fundos escuros nomeados em `interface.md` § Avisos —
  `docs/idr/0022-*`
- Todo texto em PT-BR — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Criar o componente da área de avisos em `src/components/`, ancorado à borda
   inferior da janela, com as faixas empilhando **para cima** a partir do rodapé
   da janela.
2. Três severidades com as cores de `interface.md`: falha (`--notif-red` sobre
   `oklch(0.3 0.15 25)`), sucesso (`--green-card` sobre `oklch(0.32 0.1 150)`) e
   aviso (`--gold` sobre `oklch(0.34 0.13 80)`), borda superior de 2px.
3. Ciclo de vida: sucesso e aviso expiram em 5s; falha fica. Expor uma forma de a
   camada de persistência dispensar a falha quando a operação seguinte do mesmo
   tipo tiver sucesso.
4. Detalhe técnico: só na falha, recolhido por padrão, expandido ao tocar na
   mensagem, em monospace 11px. O `×` de dispensar não pode ser acionado por um
   toque de curiosidade na mensagem.
5. Limite de empilhamento: poucas faixas ao mesmo tempo; ao estourar, as mais
   antigas saem. Nada de contêiner rolável.
6. Acessibilidade: sucesso e aviso anunciados de forma não intrusiva; a falha,
   que exige atenção, com `role="alert"` — a política do ADR 0007 de não usar
   `role="alert"` valia para o botão e foi revista pelos IDRs 0002 e 0029.
7. Camadas: a faixa passa por cima do cabeçalho sticky. O menu de ações, que
   chega na Fase 9, precisa ficar acima dela — deixar a ordem de empilhamento
   documentada no CSS.
8. Testes com temporizador falso: sucesso e aviso somem em 5s; a falha permanece
   depois de 5s; dispensar remove; a falha some quando a operação seguinte do
   mesmo tipo reporta sucesso.

**Fora do escopo**: qualquer evento real de persistência (Tarefas 0007-0002 em
diante); avisos das ações do menu (Fase 9).

## Decisões já tomadas (não reabrir)
- Três severidades, com sucesso e aviso efêmeros de 5s — ver `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`
- A decisão "só a falha avisa" do IDR 0017 foi **revertida** — não reabrir
- O detalhe técnico ao toque, recolhido por padrão — ver `docs/idr/0017-aviso-so-na-falha-com-detalhe-tecnico.md`
- Nunca log com scroll — ver `docs/idr/0008-uma-unica-pagina-scrollavel.md`
- Em telas curtas a faixa tapa a última linha do catálogo; aceito — ver `docs/idr/0029-*` § Consequências

## Decisões em aberto nesta tarefa
- Quantas faixas empilham no máximo — encaminhamento: três, e a mais antiga sai
  quando chega a quarta; `interface.md` diz "poucas" sem fixar número; nasce um
  **IDR** com o número escolhido
- Como anunciar cada severidade a leitores de tela — encaminhamento no passo 6;
  consta no mesmo IDR

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
- `src/components/Avisos.jsx` — criar
- `src/components/Avisos.test.jsx` — criar
- `src/lib/avisos.js` — criar (fila e ciclo de vida, sem React)
- `src/lib/avisos.test.js` — criar
- `src/App.jsx` — modificar
- `docs/idr/00NN-limite-de-empilhamento-dos-avisos.md` — criar (próximo número livre)

## Critérios de aceite
- [ ] As três severidades renderizam com as cores e medidas de `docs/interface.md` § Avisos
- [ ] Sucesso e aviso somem em 5s; a falha permanece
- [ ] A falha some quando a operação seguinte do mesmo tipo tem sucesso
- [ ] Tocar na falha expande o detalhe técnico; o `×` fica isolado e não é acionado por engano
- [ ] Nenhuma faixa tem rolagem própria e o empilhamento tem limite
- [ ] A faixa passa por cima do cabeçalho sticky e não empurra o layout
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0001-log-area-de-avisos-com-tres-severidades.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: disparar as três severidades por um gancho
temporário de desenvolvimento e conferir que sucesso e aviso somem sozinhos, que
a falha fica e expande, e que rolar a página não move a faixa.
