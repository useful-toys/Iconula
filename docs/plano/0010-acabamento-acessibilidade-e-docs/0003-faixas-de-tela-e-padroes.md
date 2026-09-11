<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0010-0003]: faixas de tela e padrões de primeira abertura

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Apresentação por faixa de tela — o que já está decidido e o que ficou pendente
- `docs/interface.md` § Pendências de interface — "qual ordenação e disposição são pré-selecionadas na primeira abertura em cada faixa de tela"
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Consequências — "padrões de primeira abertura continuam pendentes por faixa de tela"
- `docs/requisitos.md` § Catálogo — em qualquer tamanho, os fluxos essenciais permanecem completos
- `docs/requisitos.md` § Requisitos Não Funcionais — responsividade em navegador, celular e tablet
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` § Contexto — o celular é o aparelho mais usado na feira de troca

## Objetivo
Fechar a última pendência de interface que atravessa as fases: com que ordenação
e disposição o app abre na primeira vez em cada faixa de tela — sabendo que, a
partir da segunda, vale o que o usuário escolheu.

## Padrões e convenções aplicáveis
- Da segunda abertura em diante, a preferência guardada vence o padrão —
  `docs/idr/0026-*` § Decisão
- Em qualquer faixa, cadastrar e consultar permanecem completos: nenhuma faixa
  perde funcionalidade — `docs/requisitos.md` § Catálogo
- A disposição álbum nunca cai para a lista por causa de largura —
  `docs/idr/0015-*` § Decisão
- Sem interface de configuração: o padrão é ponto de partida, não preferência
  editável à parte — `docs/idr/0026-*` § Decisão
- Escolha de padrão de apresentação é decisão de interface e vira **IDR** —
  `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. **Pendência de interface: padrões por faixa de tela** — decidir, para celular,
   tablet e navegador, qual ordenação e qual disposição vêm pré-selecionadas na
   primeira abertura. Registrar como **IDR**, com o raciocínio: o celular é o
   aparelho da feira de troca, onde comparar com o álbum físico é o valor; a
   janela larga favorece a visão geral.
2. Implementar a detecção da faixa apenas para escolher o padrão inicial — e
   apenas quando não houver preferência guardada. Trocar de dispositivo não
   pode sobrescrever a escolha do usuário naquele dispositivo.
3. Substituir o padrão provisório adotado na Tarefa 0003-0001 pelo decidido aqui,
   e remover a nota de provisoriedade do log daquela tarefa por meio deste
   registro.
4. Conferir que redimensionar a janela **não** troca a ordenação nem a disposição
   de uma sessão em andamento: a faixa decide o ponto de partida, não o estado
   corrente.
5. Atualizar `docs/interface.md` § Apresentação por faixa de tela com a decisão,
   e apagar o item correspondente de § Pendências de interface.
6. Testes: sem preferência guardada, cada faixa abre com o par decidido; com
   preferência guardada, a faixa é ignorada; redimensionar não altera a escolha
   corrente.

**Fora do escopo**: criar uma tela de configuração; mudar layouts por faixa além
do que os IDRs 0015 e 0009 já decidiram.

## Decisões já tomadas (não reabrir)
- A preferência guardada vence a partir da segunda abertura — ver `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Álbum empilha em tela estreita e nunca vira lista — ver `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- Lista flui com wrap em qualquer largura — ver `docs/interface.md` § Apresentação por faixa de tela
- Sem interface de configuração — ver `docs/idr/0026-*` § Decisão

## Decisões em aberto nesta tarefa
- Qual par (ordenação, disposição) por faixa — encaminhamento no passo 1; nasce
  um **IDR**
- Onde ficam os limites entre celular, tablet e navegador — encaminhamento: os
  mesmos pontos de quebra que a disposição álbum já usa, para não haver duas
  noções de "estreito" no app; consta no mesmo IDR

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
- `src/lib/preferenciasDeVista.js` — modificar (padrões por faixa)
- `src/lib/preferenciasDeVista.test.js` — modificar
- `src/App.jsx` — modificar
- `docs/interface.md` — modificar
- `docs/idr/00NN-padroes-de-primeira-abertura-por-faixa.md` — criar (próximo número livre)

## Critérios de aceite
- [ ] Sem preferência guardada, cada faixa abre com o par decidido no IDR
- [ ] Com preferência guardada, a faixa de tela é ignorada
- [ ] Redimensionar a janela não altera ordenação nem disposição da sessão corrente
- [ ] Os limites de faixa são os mesmos que o spread já usa, sem segunda noção de "estreito"
- [ ] `docs/interface.md` deixa de listar essa pendência
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0003-log-faixas-de-tela-e-padroes.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: limpar o `localStorage` e abrir em largura de
celular, de tablet e de desktop, conferindo o par inicial em cada uma; depois
escolher outro par, recarregar e conferir que a escolha venceu.
