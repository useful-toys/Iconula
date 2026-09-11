<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0009-0003: copiar listas de faltantes e de repetidas

## Data
2026-09-11

## Resumo
Implementados os dois comandos de texto de troca (`requisitos.md` §
Compartilhamento) e ligados ao menu de ações (Tarefa 0009-0002).

- `src/lib/textoDeTroca.js` (novo): `gerarTextoFaltantes` e
  `gerarTextoRepetidas`, funções puras que recebem `contagens`, as seções
  já na ordem do álbum e o catálogo expandido (`figurinhas`) — nenhum
  import de `data/catalogo.js`, no mesmo estilo de `colecao.js` e
  `progresso.js`. Uma linha por seção (`Nome SIG: n n n`, crescente),
  seção sem nada a listar fica fora; faltantes filtra contagem `=== 0`,
  repetidas filtra `>= 2` e formata `n×k` com `k = contagem - 1`.
- `src/App.jsx`: `secoesNaOrdemDoAlbum` calculado uma vez em escopo de
  módulo (`extrairSecoes(ordenarPorPagina(secoes))`), igual a
  `codigosTodasFigurinhas`. Novos `handleCopiarFaltantes`/
  `handleCopiarRepetidas` geram o texto e chamam
  `copiarParaAreaDeTransferencia`: sucesso emite "Lista copiada"; sem
  `navigator.clipboard` ou com a promessa rejeitada, emite aviso dourado
  ("Área de transferência indisponível — copie o texto que apareceu na
  tela") e abre `window.prompt()` com o texto, para cópia manual (IDR
  0039) — nunca falha vermelha (IDR 0029).
- `src/components/Controles.jsx`: repassa `onCopiarFaltantes`/
  `onCopiarRepetidas` para o `MenuDeAcoes` — os dois itens já existiam
  desabilitados desde a Tarefa 0009-0002 (design forward-compatible: sem
  o callback, o item fica desabilitado); nenhuma mudança de comportamento
  foi necessária em `MenuDeAcoes.jsx`, só o comentário de topo (dois dos
  quatro comandos de conteúdo agora têm ação real).

## Decisões tomadas
**IDR 0039 — Texto de troca em ordem fixa, com cópia manual de reserva**
(`docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`),
fechando as duas pendências de desenho da própria tarefa:
1. O texto de troca usa sempre a ordem do álbum (FWC abre, COC fecha),
   independente da ordenação vigente na tela — para que a lista colada
   seja comparável entre pessoas.
2. Sem área de transferência (API ausente ou promessa rejeitada), além
   do aviso dourado o texto aparece num `window.prompt()` — campo nativo
   do navegador, pré-selecionado na maioria deles, pronto para
   `Ctrl+C`/`Cmd+C` — sem tela nem componente novo.

## Impedimentos
Nenhum nível 3. O nível 1 acima foi decidido e registrado no IDR 0039.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 32 arquivos de teste, 299 testes, todos passando — inclui
  `src/lib/textoDeTroca.test.js` (11 casos: formato `Nome SIG: n n n`,
  exemplo exato de `requisitos.md`, seção sem itens fora do texto, várias
  seções na ordem recebida, texto vazio sem nada a listar, `n×k` com
  `k = contagem - 1`, contagem 1 e 0 fora do texto de repetidas, ordem
  crescente dentro da seção) e o novo `src/App.copiar.test.jsx` (6 casos
  de integração: texto de faltantes a partir da coleção em memória, texto
  de repetidas com as unidades sobrando, os dois comandos geram textos
  diferentes, sem `navigator.clipboard` emite aviso dourado e abre o
  prompt com o texto, `writeText` rejeitando também é aviso — não falha
  —, e copiar não chama `carregarColecao`/`gravarAlteracoes`).
  `Controles.test.jsx` ganhou 2 casos (repassa os callbacks ao menu;
  itens ficam desabilitados sem eles).
- `vite build`: build de produção concluído com sucesso (CSS inalterado,
  13,76 kB; JS de 402,44 kB para 403,59 kB; aviso pré-existente sobre
  chunk grande, não relacionado a esta tarefa).

**Verificação visual em `npm run dev`**: como nas Tarefas 0009-0001 e
0009-0002, não concluída nesta sessão pela mesma limitação (login real
via Google, que não pode ser automatizado nem realizado em nome do
usuário). Confirmado apenas que a tela de login carrega sem erro no
console. A cobertura funcional equivalente (copiar as duas listas, colar
o formato, conferir que nada foi requisitado) está em
`App.copiar.test.jsx`. Fica pendente para o usuário repetir a checagem
manual antes de mesclar a fase.

## Arquivos alterados
- `src/lib/textoDeTroca.js` — criado
- `src/lib/textoDeTroca.test.js` — criado
- `src/components/MenuDeAcoes.jsx` — comentário de topo atualizado (nenhuma mudança de comportamento)
- `src/components/Controles.jsx` — repassa `onCopiarFaltantes`/`onCopiarRepetidas` ao `MenuDeAcoes`
- `src/components/Controles.test.jsx` — 2 casos novos (consequência direta, não listado nos arquivos impactados)
- `src/App.jsx` — `secoesNaOrdemDoAlbum`, `copiarParaAreaDeTransferencia`, os dois handlers
- `src/App.copiar.test.jsx` — criado (consequência direta do item 7 do Escopo, não listado nos arquivos impactados)
- `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md` — novo IDR
- `docs/plano/0009-desfazer-menu-e-portabilidade/0003-copiar-listas-de-troca.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0009-0003 atualizado
- `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0003-log-copiar-listas-de-troca.md` — este log
