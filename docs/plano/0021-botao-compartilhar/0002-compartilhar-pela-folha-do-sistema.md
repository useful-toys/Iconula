<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0021-0002]: compartilhar as listas pela folha de compartilhamento do sistema

## Status
Concluída

## Objetivo
Acrescentar ao popup de compartilhar "Compartilhar faltantes…" e
"Compartilhar repetidas…", que abrem a folha de compartilhamento do sistema
para o colecionador escolher o app. Os itens só existem onde o navegador
oferece a função; a cópia continua ao lado.

## Documentos de referência
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão (item
  "Compartilhar") — itens, condição de existência, avisos e queda para a cópia
- `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`
  § Decisão — mesmo texto e a reserva da cópia
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão —
  severidade de sucesso
- `docs/requisitos.md` § Compartilhamento — cópia ou folha do sistema
- `src/components/MenuDeCompartilhar.jsx` (gerado pela Tarefa 0021-0001)
- `src/App.jsx` — `copiarParaAreaDeTransferencia`, handlers de cópia
- `docs/interface.md` § Menu de ações › Compartilhar (gerado pela Tarefa
  0021-0001), § Avisos

## Padrões e convenções aplicáveis
- Não assumir app: só `navigator.share` com o texto, sem link para WhatsApp —
  IDR 0024
- A chamada ao compartilhamento acontece dentro do clique no item (gesto do
  usuário), antes de qualquer espera — exigência da API
- Cancelar a folha não gera aviso; outra falha nunca é "falha" vermelha: cai
  na cópia com o aviso dourado do IDR 0039 — IDR 0024, IDR 0029
- O texto é exatamente o da cópia, na ordem do álbum — IDR 0039

## Escopo e instruções de implementação
1. `MenuDeCompartilhar.jsx`: "Compartilhar faltantes…" logo abaixo de
   "Copiar lista de faltantes" e "Compartilhar repetidas…" logo abaixo de
   "Copiar lista de repetidas", só quando `navigator.share` existe.
2. `App.jsx`: função de compartilhar que gera o texto como a cópia e chama
   `navigator.share` com ele; resolvido → aviso de sucesso "Lista
   compartilhada"; rejeição por cancelamento (`AbortError`) → nada; outra
   rejeição → a cópia de `copiarParaAreaDeTransferencia` com o mesmo texto.
3. Testes: em `MenuDeCompartilhar.test.jsx`, itens presentes com
   `navigator.share` e ausentes sem; novo `App.compartilhar.test.jsx` com a
   função stubada — texto igual ao da cópia, sucesso avisa, `AbortError` não
   avisa, outra rejeição cai na cópia.
4. `docs/interface.md`, citando o IDR 0024:
   - § Menu de ações › Compartilhar: os dois itens de compartilhar, só onde o
     navegador oferece a folha;
   - § Avisos: "lista compartilhada" entre os eventos de sucesso.
5. `AGENTS.md` § Onde fica cada coisa: o novo teste de `App` e a linha de
   `MenuDeCompartilhar.jsx` com os itens de compartilhar.

**Fora do escopo**: compartilhar arquivo ou link do app; mudar o texto de
troca; itens de compartilhar no menu do avatar.

## Decisões já tomadas (não reabrir)
- Compartilhar pela folha do sistema, onde houver, com aviso e queda para a
  cópia — ver `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Texto de troca e cópia de reserva — ver
  `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`
- Severidades de aviso — ver
  `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`

## Decisões em aberto nesta tarefa
- Enviar só `text` ou também `title` na chamada (nível 2) — premissa: só
  `text`, para não duplicar cabeçalho em apps que juntam os dois; registrar
  no log.

## Arquivos impactados
- `src/components/MenuDeCompartilhar.jsx`,
  `src/components/MenuDeCompartilhar.test.jsx` — modificar
- `src/App.jsx` — modificar
- `src/App.compartilhar.test.jsx` — criar
- `docs/interface.md` — modificar (§ Menu de ações › Compartilhar, § Avisos)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] Com `navigator.share`, o popup tem os quatro itens na ordem por lista;
      sem, só as duas cópias (testes)
- [ ] O texto compartilhado é idêntico ao copiado (teste)
- [ ] Sucesso emite "Lista compartilhada"; `AbortError` não emite aviso;
      outra rejeição copia com a reserva do IDR 0039 (testes)
- [ ] Nenhuma URL ou esquema de app específico no código (busca por
      `whatsapp`, `wa.me`, `tg:`)
- [ ] `docs/interface.md` nas duas seções e `AGENTS.md` atualizados

## Validação adicional
No preview do PR, num celular Android (Chrome) e num iPhone (Safari):
compartilhar faltantes e repetidas para um app de mensagem e cancelar a folha
uma vez. Sem aparelho à mão, verificação `pendente` com este roteiro.
