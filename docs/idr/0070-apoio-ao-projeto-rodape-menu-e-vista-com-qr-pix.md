<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0070: Apoio ao projeto — rodapé, menu de ações e vista dedicada com QR Pix

## Status

Aceito.

## Contexto

- Pedido do humano: mostrar um QR code Pix para doação (chave do próprio
  mantenedor).
- Busca em `requisitos.md`, `interface.md`, `arquitetura.md` e nos índices
  de decisão (ADR/TDR/IDR/MDR/DDR): nenhuma menção prévia a Pix, doação ou
  QR code — funcionalidade nova, sem requisito (mudança de requisito
  confirmada no esmiuçamento, `requisitos.md` § Apoio ao projeto).
- Padrões reaproveitados:
  - [TDR 0020](../tdr/0020-privacidade-como-vista-interna.md) — vista
    interna sem router, molde da política e dos termos.
  - [IDR 0053](0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md) —
    rodapé com links institucionais nas duas telas (login e principal).
  - [IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md) — popup "Menu de
    ações" em blocos separados por filete, com "Sair" isolado em
    `--notif-red`.
  - [IDR 0055](0055-catalogo-compartilhado-por-link-somente-leitura.md) —
    copiar e, quando o navegador oferecer, compartilhar uma chave/URL pela
    folha do sistema, com aviso de sucesso.
  - [IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md) — avisos
    flutuantes de sucesso/aviso/falha.
- Nenhuma requisição ao Firestore: conteúdo estático, chave e valor fixos
  no código — alinhado à NFR de economia de requisições.

## Decisão

- **Dois pontos de entrada**, ambos abrindo a mesma vista interna "Apoie o
  projeto":
  1. Link no rodapé das duas telas (`TelaDeLogin.jsx` e `Rodape.jsx` da
     tela principal), no mesmo estilo dos links de política/termos —
     visível mesmo sem login.
  2. Item novo no popup "Menu de ações" (avatar), em **bloco próprio**
     depois do bloco "Sobre" ([Fase 33](../plano/0033-sobre-tooltip-do-desfazer-e-indicador-de-pendencia/),
     [IDR 0063](0063-tela-sobre-com-link-ao-repositorio-e-issues.md)) e
     antes do item "Sair": quatro blocos separados por filete no total —
     Exportar/Importar, Sobre, Apoiar o projeto, Sair. Mantém "Sair"
     isolado como única ação vermelha/destrutiva e não mistura o pedido de
     apoio financeiro com as ações de portabilidade de dados nem com o
     conteúdo informativo do "Sobre".
- **Vista interna "Apoie o projeto"**, no molde de TDR 0020 (substitui o
  conteúdo da tela, com "← Voltar" para a tela de origem):
  - Frase de contexto ligando a doação ao produto (ex.: referência ao
    preço de um pacotinho de figurinhas) — texto final redigido a partir
    deste roteiro e aprovado pelo humano no PR da fase, como em IDR 0053.
  - Imagem do QR code Pix, com nome acessível que descreve a ação (não só
    "QR code").
  - Chave Pix em texto, sempre visível ao lado da imagem — texto nunca é
    só um reforço da imagem, é caminho equivalente (`requisitos.md` §
    Requisitos Não Funcionais: cor nunca é único sinal).
  - Botão "Copiar chave Pix", com aviso de sucesso "chave copiada" (IDR
    0029), no mesmo padrão do link do catálogo (IDR 0055).
  - Botão "Compartilhar chave Pix…" pela folha do sistema, só quando
    `navigator.share` existir (mesmo padrão de IDR 0055) — entrega só a
    chave Pix, sem texto acoplado.
- **Sem rastreamento**: a vista não sabe se ou quanto foi doado — decisão
  consciente, sem backend novo.

## Consequências

- `Rodape.jsx` e `TelaDeLogin.jsx` ganham o link "Apoie o projeto".
- `App.jsx` ganha a nova vista interna (mais um valor no estado
  `vistaInterna`, no mesmo padrão da política e dos termos).
- `MenuDeAcoes.jsx` ganha o bloco/item novo, depois do bloco "Sobre" e
  antes de "Sair".
- `interface.md` § Menu de ações, § Tela de login, § Corpo (rodapé) e §
  Demais telas mudam.
- `docs/requisitos.md` § Apoio ao projeto (nova) — mudança de requisito
  aplicada nesta decisão.
- Sem custo em leituras ou escritas no Firestore: conteúdo estático.
- Depende de [TDR 0029](../tdr/0029-geracao-local-do-qr-code-pix.md) para
  como o QR e a chave são construídos.
- Depende da [Fase 33](../plano/0033-sobre-tooltip-do-desfazer-e-indicador-de-pendencia/)
  (bloco "Sobre") entregue: mesma área do menu de ações, mesmos arquivos
  (`MenuDeAcoes.jsx`, `Rodape.jsx`, `TelaDeLogin.jsx`, `App.jsx`).
- Implementação: Fase 0035, Tarefas 0035-0002 (vista), 0035-0003 (rodapé)
  e 0035-0004 (menu de ações).

## Alternativas consideradas

- **Só no rodapé, sem item no menu**: descartada pelo humano — quer
  alcance também para quem já está no app, sem precisar rolar até o
  rodapé.
- **Só no menu de ações, sem rodapé**: descartada — perde o alcance de
  quem nunca chega a logar.
- **Popup em vez de vista interna**: menos espaço para o QR grande e a
  chave legível; a vista dedicada segue o molde já aceito para conteúdo
  institucional (política, termos).
- **Bloco junto de Exportar/Importar no menu**: descartada pelo humano —
  mistura ação financeira com portabilidade de dados.

## Histórico

- 2026-09-18 — Planejamento: a Fase 33 (Pendente), decidida depois deste
  esmiuçamento, já reserva "bloco próprio entre Exportar/Importar e Sair"
  para o item "Sobre". O bloco de "Apoiar o projeto" passa para depois de
  "Sobre" e antes de "Sair"; a fase ganha dependência da Fase 33.
  Implementação: Fase 0035. Antes: bloco logo após Exportar/Importar,
  sem dependência de outra fase.
- 2026-09-18 — Criado no esmiuçamento de QR code Pix para doações;
  implementação a planejar.
