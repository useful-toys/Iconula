<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0008-0003]: atestação de menores e `atestadoEm`

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Acesso — "um clique atestando ter 12 anos ou mais ou estar autorizado pelos responsáveis, antes de liberar o app — uma única vez por conta, gravada em `atestadoEm`"
- `docs/requisitos.md` § Decisões Pendentes — "Falha ao gravar a atestação de menores": liberar assim mesmo ou reter o usuário
- `docs/requisitos.md` § Privacidade — LGPD art. 14, consentimento dos responsáveis capturado pela atestação
- `docs/interface.md` § Pendências de interface — "se a atestação é o próprio clique de entrar ou um passo explícito só na primeira vez"
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — `atestadoEm` gravado uma única vez, **sem** `updatedAt` junto
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` § Decisão — a `atestadoEm` não mexe no relógio
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — a guarda de campo ausente existe justamente para o documento só com `atestadoEm`

## Objetivo
Implementar a exigência de LGPD art. 14: antes de liberar o app na primeira vez,
o usuário atesta ter 12 anos ou mais ou estar autorizado, e isso fica gravado uma
única vez na conta.

## Padrões e convenções aplicáveis
- **Uma única vez por conta**: quem já tem `atestadoEm` não vê o passo de novo —
  `docs/requisitos.md` § Acesso
- `atestadoEm` é gravado **sem** `updatedAt` junto, e não move o relógio do
  título — `docs/adr/0008-*` § Decisão e `docs/idr/0027-*` § Consequências
- Custa **1 escrita na vida da conta**; não pode virar escrita por login —
  `docs/persistencia.md` § Custos e cotas
- Texto exato da atestação, o de `docs/interface.md` § Tela de login: "Ao
  continuar, você confirma ter 12 anos ou mais, ou estar autorizado pelos
  responsáveis."
- Todo texto visível em PT-BR — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. **Pendência de interface: atestação como clique de entrar × passo explícito** —
   resolver por **passo explícito, uma única vez por conta**. `requisitos.md` pede
   "um clique atestando… uma única vez por conta", e o protótipo, que a exibe a
   cada login, é referência visual e não vence o requisito. Registrar como
   **IDR**.
2. Fluxo: autenticado e sem `atestadoEm` no documento → tela de atestação com o
   texto exato e um botão de confirmação → grava `atestadoEm` → libera o app.
   Autenticado e com `atestadoEm` → vai direto para o catálogo.
3. Descobrir se há `atestadoEm` **sem leitura adicional**: a carga da
   Tarefa 0007-0002 já traz o documento inteiro. Ordenar o fluxo de modo que a
   carga aconteça antes da decisão, ou que a decisão use o que ela trouxe.
4. A gravação é `atestadoEm: serverTimestamp()` sozinho, com `updateDoc`/`setDoc`
   conforme o documento exista ou não — e é o caso que as regras aceitam pela
   guarda de campo ausente.
5. **Pendência de requisitos: falha ao gravar `atestadoEm`** — resolver por
   **liberar o app e reagendar a gravação**: a atestação é ato do usuário, já
   praticado, e retê-lo puniria uma falha de rede. A falha emite aviso, e a
   gravação é tentada de novo na oportunidade seguinte. Registrar como **IDR**,
   com a alternativa recusada (reter o usuário) e o porquê.
6. A tela de atestação segue o desenho da tela de login (mesmo cartão, mesmos
   tokens), sem inventar layout novo.
7. Testes: conta sem `atestadoEm` vê o passo; conta com `atestadoEm` não vê;
   confirmar grava uma vez e libera; falha ao gravar libera assim mesmo, com
   aviso, e a marca fica pendente para regravar; a gravação não inclui
   `updatedAt` e o relógio do título não se move.

**Fora do escopo**: mudar a política de privacidade (Tarefa 0008-0004); qualquer
verificação de idade de verdade — é atestação, não verificação; guardar data de
nascimento ou qualquer outro dado pessoal.

## Decisões já tomadas (não reabrir)
- Atestação uma única vez por conta, gravada em `atestadoEm` — ver `docs/requisitos.md` § Acesso
- `atestadoEm` não acompanha `updatedAt` — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- Nenhum dado além da identidade Google e da coleção é tratado — ver `docs/requisitos.md` § Dados e isolamento
- As regras já aceitam o documento só com `atestadoEm` — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`

## Decisões em aberto nesta tarefa
- Atestação como passo explícito × clique de entrar — encaminhamento no passo 1;
  nasce um **IDR**
- Falha ao gravar `atestadoEm` — encaminhamento no passo 5; nasce um **IDR**
  (pode ser o mesmo registro, se ficar coerente)

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
   **Caso concreto previsto aqui**: qualquer desenho que colete mais dado do que
   o carimbo de tempo contraria `requisitos.md` § Dados e isolamento — PARE.

## Arquivos impactados
- `src/components/Atestacao.jsx` — criar
- `src/components/Atestacao.test.jsx` — criar
- `src/lib/colecaoRemota.js` — modificar (gravar `atestadoEm`)
- `src/lib/colecaoRemota.test.js` — modificar
- `src/App.jsx` — modificar
- `docs/idr/00NN-atestacao-passo-explicito-e-falha-de-gravacao.md` — criar (próximo número livre)

## Critérios de aceite
- [ ] Conta sem `atestadoEm` vê o passo antes de acessar o catálogo
- [ ] Conta com `atestadoEm` vai direto ao catálogo, sem passo e sem leitura extra
- [ ] Confirmar grava `atestadoEm` uma vez, sem `updatedAt`, e o relógio não se move
- [ ] Falha ao gravar libera o app, emite aviso e deixa a gravação pendente
- [ ] O texto exibido é o exato de `docs/interface.md` § Tela de login
- [ ] Nenhum dado pessoal além do carimbo é gravado
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0003-log-atestacao-de-menores.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real com uma conta nova: o passo aparece uma vez,
some nos logins seguintes, e o documento no console do Firebase tem `atestadoEm`
e nenhum `updatedAt` criado por ele.
