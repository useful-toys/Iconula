<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0005]: copiar e compartilhar o link do catálogo

## Status
Concluída

## Objetivo
Com o link ligado, o terceiro bloco do popup Compartilhar oferece `Copiar
link do catálogo` e, onde o navegador tem a folha do sistema, `Compartilhar
link do catálogo…`, entregando só a URL `…/catalogo/<uid>`.

## Documentos de referência
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — formato do link, itens, só a `url` na folha, avisos
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — itens de
  compartilhar só onde há `navigator.share`
- `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`
  § Decisão — reserva da cópia
- `docs/plano/0021-botao-compartilhar/0002-compartilhar-pela-folha-do-sistema.md`
  e `docs/plano/0021-botao-compartilhar/logs/0002-log-compartilhar-pela-folha-do-sistema.md`
  — precedente do tratamento de `AbortError` e da queda para a
  cópia
- `src/App.jsx` — `copiarParaAreaDeTransferencia` e os handlers de
  compartilhar
- `src/components/MenuDeCompartilhar.jsx` (chave gerada pela Tarefa
  0027-0004)
- `docs/interface.md` § Menu de ações › Compartilhar, § Avisos

## Padrões e convenções aplicáveis
- Só a `url` em `navigator.share` — sem `text` nem `title` — IDR 0055
- A URL usa a origem em que o app está (`location.origin`), para funcionar
  em produção, preview e local — IDR 0055 (formato do link)
- A chamada à folha acontece dentro do gesto do usuário — exigência da API,
  precedente da Tarefa 0021-0002
- Cancelar a folha não avisa; outra falha cai na cópia com a reserva do
  IDR 0039 — IDR 0024, IDR 0055

## Escopo e instruções de implementação
1. `src/components/MenuDeCompartilhar.jsx`: com o link ligado, logo abaixo
   da chave, `Copiar link do catálogo` e, só com `navigator.share`,
   `Compartilhar link do catálogo…`; desligado, os dois itens não existem.
   Estes itens fecham o popup como os demais.
2. `src/App.jsx`: URL `<origem>/catalogo/<uid>`; copiar → aviso `Link
   copiado` (reserva e aviso de área de transferência indisponível como na
   cópia das listas); compartilhar → `navigator.share({ url })`; sucesso →
   `Link compartilhado`; `AbortError` → nada; outra rejeição → cópia com a
   reserva.
3. Testes: `MenuDeCompartilhar.test.jsx` — itens só com o link ligado e o
   de compartilhar só com `navigator.share`; `App.linkDoCatalogo.test.jsx`
   (gerado pela Tarefa 0027-0004) — URL com a origem e o `uid`, payload
   só com `url`, avisos, `AbortError`, queda para a cópia.
4. `docs/interface.md`, citando IDR 0055: § Menu de ações › Compartilhar —
   os dois itens, condição de existência e o que entregam; § Avisos — `link
   copiado` e `link compartilhado` entre os sucessos.
5. `AGENTS.md` § Onde fica cada coisa: linha de `MenuDeCompartilhar.jsx`.

**Fora do escopo**: encurtador de URL, QR code e texto junto do link;
mudar a chave (Tarefa 0027-0004).

## Decisões já tomadas (não reabrir)
- Itens, textos, só a `url` na folha, reserva da cópia — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- Folha do sistema onde houver — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Cópia de reserva — ver
  `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`

## Arquivos impactados
- `src/components/MenuDeCompartilhar.jsx`,
  `src/components/MenuDeCompartilhar.test.jsx` — modificar
- `src/App.jsx`, `src/App.linkDoCatalogo.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Menu de ações › Compartilhar,
  § Avisos)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] Link ligado: `Copiar link do catálogo` presente e, com
      `navigator.share`, `Compartilhar link do catálogo…`; desligado:
      nenhum dos dois (testes)
- [ ] A URL copiada e compartilhada é `<origem>/catalogo/<uid>` (testes)
- [ ] `navigator.share` recebe só `url` (teste)
- [ ] Avisos `Link copiado` e `Link compartilhado`; `AbortError` sem aviso;
      outra rejeição cai na cópia (testes)
- [ ] `docs/interface.md` e `AGENTS.md` atualizados

## Validação adicional
No preview do PR, num celular: ligar o link, compartilhar para um app de
mensagem e abrir o link recebido numa janela anônima; sem aparelho à mão,
verificação `pendente` com este roteiro.
