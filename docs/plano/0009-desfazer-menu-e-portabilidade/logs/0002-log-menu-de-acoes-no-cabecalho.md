<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0009-0002: menu de ações no cabeçalho

## Data
2026-09-11

## Resumo
Criado o popup de ações raras do cabeçalho (IDR 0024) e movido "sair da
conta" para dentro dele, aposentando a área de login provisória.

- `src/components/MenuDeAcoes.jsx` + `.css` (novos): botão `⋯` de 30×30px
  (`--gold`) na linha de controles, ao lado do desfazer; popup ancorado à
  borda direita, `--panel` sobre `--border`, sombra `0 8px 24px`, z-index 30
  (acima do cabeçalho e da área de avisos). Cinco itens em três blocos
  (copiar faltantes/repetidas — filete — exportar/importar — filete — sair
  da conta, isolado e em `--notif-red`). Fecha ao escolher um item, ao
  tocar fora ou com `Esc`. Ao abrir, o foco entra no primeiro item
  *habilitado* (um item desabilitado nunca recebe foco — só "sair da
  conta" está habilitado nesta tarefa); ao fechar por `Esc` ou por escolher
  um item, o foco volta ao botão.
  - Os quatro comandos de conteúdo (copiar faltantes/repetidas,
    exportar/importar) ficam desabilitados nesta tarefa — sem o callback
    correspondente (prop ausente), o item nunca aparenta funcionar. As
    Tarefas 0009-0003 a 0009-0005 só precisam passar o callback real; nada
    em `MenuDeAcoes.jsx` muda.
- `src/components/Controles.jsx`: renderiza `<MenuDeAcoes onSignOut={...} />`
  em `controles__direita`, ao lado do botão de desfazer (Tarefa 0009-0001);
  sem `onSignOut`, a área continua vazia e `aria-hidden`, como antes.
- `src/App.jsx`: `handleSignOut` passou a checar o resultado do `flush()` —
  se `status: 'erro'`, o `signOut` não acontece (IDR 0038, decisão em
  aberto da própria tarefa). O bloco `<div className="app__auth"><AuthStatus
  .../></div>` foi removido da tela principal; a outra ocorrência de
  `.app__auth` (mensagem de "login indisponível", sem Firebase configurado)
  é um uso não relacionado da mesma classe CSS e não foi tocada.
- `src/lib/gravacaoAgregada.js`: `gravarAgora`/`flush()` passam a devolver
  o resultado discriminado da escrita (`{status: 'sucesso'|'erro'|'nada'}`)
  em vez de `undefined` — é esse retorno que `handleSignOut` usa para
  decidir. Consequência direta e necessária da decisão do IDR 0038; o
  arquivo não estava nos "Arquivos impactados" da tarefa.
- `src/components/AuthStatus.jsx` e `AuthStatus.test.jsx`: removidos.
- `AGENTS.md`: linha da tabela "Onde fica cada coisa" trocada de
  `AuthStatus.jsx` para `MenuDeAcoes.jsx` (removida a duplicata pré-existente
  da linha de `AuthStatus.jsx`, sem tocar a duplicata equivalente de
  `LoginButton.jsx`, que continua válida e é pré-existente); descrição de
  `App.jsx` atualizada para não citar mais `AuthStatus`.

## Decisões tomadas
**IDR 0038 — Sair da conta aborta se o flush falhar**
(`docs/idr/0038-sair-da-conta-aborta-se-o-flush-falhar.md`), fechando a
pendência de desenho da própria tarefa: se o flush final falhar, o
`signOut` não acontece — a conta permanece logada, com o ajuste pendente
intacto na fila da gravação agregada, e o mesmo aviso de falha de gravação
de sempre já informa o ocorrido (sem mensagem dedicada — IDR 0003, sem
caso especial).

Decisão de nível 2 (implementação conservadora, sinalizada aqui — não
contradiz nenhum documento, mas o Escopo/Critérios de aceite não
distinguem "fechar" por causa diferente): ao tocar fora do popup, o foco
**não** é forçado de volta ao botão — só ao fechar por `Esc` ou por
escolher um item. Roubar o foco de volta ao botão depois de um toque fora
(que já tem um destino próprio, o elemento tocado) seria uma experiência
pior e não é o padrão de menus acessíveis comuns (WAI-ARIA APG, Radix,
Reach UI). Sinalizo ao humano por ser uma leitura, não a única possível,
do critério "o foco (…) volta ao botão ao fechar".

## Impedimentos
Nenhum nível 3. O nível 2 acima está registrado e resolvido pela leitura
mais alinhada às convenções de acessibilidade já usadas por menus
equivalentes, sem contradizer nenhum documento de referência.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 30 arquivos de teste, 280 testes, todos passando — inclui
  `src/components/MenuDeAcoes.test.jsx` (13 casos novos: abre/fecha pelos
  três caminhos, cinco itens em três blocos com dois filetes, os quatro
  comandos de conteúdo desabilitados sem callback e habilitados com ele,
  "sair da conta" isolado e vermelho, escolher chama o callback e fecha,
  foco entra no primeiro item habilitado ao abrir e volta ao botão ao
  fechar por `Esc`/escolha, painel sem `overflow`) e 3 casos novos em
  `gravacaoAgregada.test.js` para o retorno de `flush()`. `App.test.jsx` e
  `App.gravacao.test.jsx` atualizados: "sair da conta" agora abre o menu
  antes de escolher o item (`role="menuitem"`, não mais um botão "Sair"
  direto), e `possuiTelaPrincipal()` passou a usar o botão do menu de
  ações como marcador da tela principal em vez de `.app__auth` (removido
  da tela). `AuthStatus.test.jsx` removido junto do componente.
- `vite build`: build de produção concluído com sucesso (CSS de 12,63 kB
  para 13,76 kB; aviso pré-existente sobre chunk grande, não relacionado a
  esta tarefa).

**Verificação visual em `npm run dev`**: como na Tarefa 0009-0001, não
concluída nesta sessão — a guarda de login exige um login real via popup
do Google, que não pode ser automatizado nem realizado em nome do usuário.
Confirmado apenas que a tela de login carrega sem erro no console. A
cobertura funcional equivalente (abrir o menu, os três blocos, o item
vermelho, e a ordem flush-antes-do-signOut) está em `MenuDeAcoes.test.jsx`
e `App.gravacao.test.jsx`. Fica pendente para o usuário repetir a checagem
manual (abrir o menu, ajustar uma figurinha e sair, conferindo a aba
Network) antes de mesclar a fase.

## Arquivos alterados
- `src/components/MenuDeAcoes.jsx` — criado
- `src/components/MenuDeAcoes.css` — criado (consequência direta, não listado nos arquivos impactados)
- `src/components/MenuDeAcoes.test.jsx` — criado
- `src/components/Controles.jsx` — renderiza o `MenuDeAcoes` em `controles__direita`
- `src/components/AuthStatus.jsx` — removido
- `src/components/AuthStatus.test.jsx` — removido
- `src/App.jsx` — remove a área de login provisória; `handleSignOut` checa o resultado do flush
- `src/App.test.jsx` — "sair da conta" pelo menu; `possuiTelaPrincipal()` sem `.app__auth`
- `src/App.gravacao.test.jsx` — "sair da conta" pelo menu na ordem flush→signOut
- `src/lib/gravacaoAgregada.js` — `flush()`/`gravarAgora()` devolvem o resultado discriminado (consequência direta do IDR 0038, não listado nos arquivos impactados)
- `src/lib/gravacaoAgregada.test.js` — casos novos para o retorno de `flush()`
- `AGENTS.md` — tabela "Onde fica cada coisa" atualizada
- `docs/idr/0038-sair-da-conta-aborta-se-o-flush-falhar.md` — novo IDR
- `docs/plano/0009-desfazer-menu-e-portabilidade/0002-menu-de-acoes-no-cabecalho.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0009-0002 atualizado
- `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0002-log-menu-de-acoes-no-cabecalho.md` — este log
