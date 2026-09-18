<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0006]: explicação antes de ligar o link

## Status
Pendente

## Objetivo

Transformar o ligar do link do catálogo em consentimento informado: um
bloco curto no próprio popup explica o que acontece antes de gravar.
Desligar continua imediato.

## Documentos de referência

- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão › Ligar e desligar — atualizado no planejamento desta fase;
  e `## Histórico`, com o que mudou.
- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  § Decisão — o link é a única operação baseada em consentimento.
- `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md` — por que
  desligar não ganha confirmação.
- `docs/interface.md` § Menu de ações — o popup Compartilhar e a chave do
  link.

## Padrões e convenções aplicáveis

- O popup não fecha ao alternar a chave, e a trava de reentrância
  durante a gravação continua.
- Texto visível em PT-BR; nome acessível por extenso.
- Nenhum componente com rolagem própria.

## Escopo e instruções de implementação

1. Em `src/components/MenuDeCompartilhar.jsx`, fazer o ligar expandir um
   bloco no próprio popup, sem fechá-lo, com a explicação do IDR 0055
   atualizado — visível sem login a quem tiver o link, nome e e-mail não
   aparecem, desligar revoga o acesso mas não desfaz cópias já feitas — e
   os botões de confirmar e cancelar. Cancelar não grava nada.
2. Manter desligar num toque, sem confirmação.
3. Cobrir em `src/components/MenuDeCompartilhar.test.jsx` e
   `src/App.compartilhar.test.jsx`: ligar exige passar pela explicação;
   cancelar não grava; desligar segue imediato; falha ao gravar reverte a
   chave como hoje.
4. Atualizar `docs/interface.md` § Menu de ações com o bloco novo.

**Fora do escopo**: mudar o que o link expõe ou as regras do Firestore;
registrar o consentimento em campo próprio — o `linkAtivo` já é o
registro (IDR 0055).

## Decisões já tomadas (não reabrir)

- Ligar exige passo informativo, desligar é imediato, e nenhum campo
  novo de consentimento — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão › Ligar e desligar e `## Histórico`.

## Arquivos impactados

- `src/components/MenuDeCompartilhar.jsx` — modificar
- `src/components/MenuDeCompartilhar.css` — modificar
- `src/components/MenuDeCompartilhar.test.jsx` — modificar
- `src/App.compartilhar.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Menu de ações)

## Critérios de aceite

- [ ] Ligar sem passar pela explicação é impossível pela interface
- [ ] Cancelar não emite gravação alguma (verificável por teste)
- [ ] Desligar continua num único toque
- [ ] O popup não fecha em nenhum dos passos
- [ ] `npm run lint && npm run test && npm run build` verdes

## Validação adicional

- Roteiro visual em `npm run dev`: abrir o popup Compartilhar, ligar,
  cancelar, ligar de novo e confirmar; conferir que o popup permanece
  aberto e que o foco não se perde.
