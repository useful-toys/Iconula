<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0009-0005: importar coleção de arquivo JSON

## Data
2026-09-11

## Resumo
Implementado o comando "importar" do menu de ações: substitui a coleção
inteira a partir de um arquivo JSON, com validação antes de qualquer
efeito e confirmação explícita.

- `src/lib/portabilidade.js`: nova `validarImportacao(texto, codigosValidos)`
  — pura, nunca lança. Recusa o arquivo inteiro (JSON malformado; não é
  objeto; `versao` diferente da conhecida; `contagens` ausente ou não é
  objeto; qualquer valor não inteiro ou fora de 0–99) sem aplicar nada.
  Duas normalizações não recusam, só descartam a chave: valor `0`
  (silenciosamente — mapa esparso) e código fora do catálogo atual
  (contado em `descartadas`, avisado por quem chama).
- `src/lib/colecaoRemota.js`: nova `gravarImportacao(uid, contagens,
  opcoes)` — a única função do módulo que substitui `contagens` por
  inteiro em vez de mesclar por chave: `setDoc(ref, {contagens,
  updatedAt}, { mergeFields: ['contagens', 'updatedAt'] })`. Ao contrário
  de `merge: true` com um objeto aninhado (que `gravarAlteracoes` usa e
  que o SDK expande em caminhos por chave, tocando só o que está no
  objeto), `mergeFields` com o nome do campo por extenso troca o mapa
  inteiro, sem reaproveitar o algoritmo de diff por chave. Usa
  `comAvisoDeEspera`, como `carregarColecao`, para a mesma política de
  espera sem rede.
- `src/lib/gravacaoAgregada.js`: nova `descartarPendencias()` — esvazia a
  fila de ajustes e cancela os temporizadores, sem gravar nada. Chamada
  antes da escrita da importação, para uma gravação agregada pendente de
  antes não reintroduzir, depois, o que a importação já substituiu.
- `src/App.jsx`: `handleImportar` abre o seletor nativo de arquivo (um
  `<input type="file" hidden>`); `handleArquivoEscolhido` lê o texto,
  valida, e só then pergunta (`window.confirm`) — nunca antes de validar.
  Confirmado: descarta pendências, substitui `contagens`, zera o
  histórico (`setHistorico([])`), avisa as chaves descartadas (se houver)
  e chama `gravarImportacao`. Falha na escrita emite faixa vermelha com
  detalhe, mas a coleção em memória permanece a importada — como
  qualquer falha de gravação, a próxima escrita a regrava.
- `src/components/Controles.jsx`: repassa `onImportar` ao `MenuDeAcoes` —
  o item já existia desabilitado desde a Tarefa 0009-0002.

## Decisões tomadas
**IDR 0041 — Importar com confirmação mínima e descarte de chave
desconhecida** (`docs/idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md`),
fechando as duas pendências de desenho da própria tarefa:
1. Confirmação via `window.confirm()`, nativa, sem tela própria — mas
   *depois* da validação: um arquivo inválido nunca chega a perguntar.
2. Chave de código desconhecido do catálogo é descartada e avisada à
   parte, sem recusar o resto de um arquivo por tudo o mais válido.

## Impedimentos
Nenhum nível 3. O nível 1 acima foi decidido e registrado no IDR 0041.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 35 arquivos de teste, 357 testes, todos passando — inclui:
  - `src/lib/portabilidade.test.js`: 15 casos novos de `validarImportacao`
    (arquivo válido, coleção vazia válida, JSON malformado, não-objeto,
    versão desconhecida/ausente, `contagens` ausente/tipo errado, valor
    100/negativo/não-inteiro recusam o arquivo inteiro, valor 0
    descartado em silêncio, código fora do catálogo descartado e
    contado, e o teste de ida e volta que fecha o item 6 do Escopo da
    Tarefa 0009-0004: exportar e reimportar reproduz a coleção idêntica).
  - `src/lib/colecaoRemota.test.js`: 8 casos novos de `gravarImportacao`
    (substitui via `mergeFields`, mapa vazio, nunca usa `deleteField`,
    erro, indisponível, espera sem rede — 2 casos).
  - `src/lib/gravacaoAgregada.test.js`: 5 casos novos de
    `descartarPendencias` (esvazia a fila, cancela debounce e teto,
    descarta a marca de `teamName`, idempotente sem pendência, uma
    rajada depois do descarte volta a agendar normalmente).
  - `src/App.importar.test.jsx` (novo, 11 casos de integração): arquivo
    válido confirmado substitui por inteiro (não faz merge), descarta o
    histórico, uma única escrita via `gravarImportacao` (nunca
    `gravarAlteracoes`), cancelar a confirmação não altera nem grava
    nada, versão desconhecida/JSON malformado/valor 100/valor negativo
    rejeitados sem alterar nada e sem chegar a confirmar, chave fora do
    catálogo descartada e avisada sem impedir o resto, falha na escrita
    emite alerta vermelho mantendo a coleção importada em memória, e o
    caso completo de exportar-alterar-reimportar restaura o estado
    exportado.
  - `Controles.test.jsx`: 2 casos novos (repassa `onImportar`; item
    desabilitado sem ele).
- `vite build`: build de produção concluído com sucesso (CSS inalterado,
  13,76 kB; JS de 404,34 kB para 406,72 kB; aviso pré-existente sobre
  chunk grande, não relacionado a esta tarefa).

**Verificação em preview deploy real** (pedida explicitamente na
Validação desta tarefa, além do `npm run dev`): não realizada nesta
sessão — não há PR aberto ainda (a Fase 9 está com as cinco tarefas
completas, mas o PR único da fase só é aberto quando o usuário pedir, e
ele pediu para adiar até agora). A cobertura funcional equivalente —
exportar, ajustar, reimportar e conferir a coleção idêntica; uma única
escrita; versão desconhecida rejeitada com aviso — está em
`App.importar.test.jsx`. Fica pendente para o usuário repetir no preview
deploy do PR: exportar, ajustar algumas figurinhas, reimportar e conferir
na aba Network que houve **uma** escrita, e tentar importar um arquivo
com `versao: 2`.

**Sobre as regras do Firestore**: não alteradas nem testadas com
`test:rules` — a leitura de `firestore.rules` (`docs/persistencia.md` §
Regras de segurança) mostra que `hasOnly(["contagens","updatedAt","atestadoEm"])`
e as validações de `contagens` (`size() <= 994`, `values().hasOnly([1…99])`)
já se aplicam a qualquer escrita que toque esses dois campos, e
`affectedKeys()` (usado pela regra de `update`) reporta os mesmos nomes
de campo de alto nível tanto para o `mergeFields` desta tarefa quanto
para o `merge: true` por chave de `gravarAlteracoes` — a regra não
distingue os dois. Nenhuma mudança nas regras foi necessária.

## Arquivos alterados
- `src/lib/portabilidade.js` — `validarImportacao`
- `src/lib/portabilidade.test.js` — 15 casos novos
- `src/lib/colecaoRemota.js` — `gravarImportacao`
- `src/lib/colecaoRemota.test.js` — 8 casos novos
- `src/lib/gravacaoAgregada.js` — `descartarPendencias` (consequência direta, não listado nos arquivos impactados)
- `src/lib/gravacaoAgregada.test.js` — 5 casos novos (consequência direta, não listado nos arquivos impactados)
- `src/components/MenuDeAcoes.jsx` — comentário de topo atualizado (nenhuma mudança de comportamento)
- `src/components/Controles.jsx` — repassa `onImportar` ao `MenuDeAcoes` (consequência direta, não listado nos arquivos impactados)
- `src/components/Controles.test.jsx` — 2 casos novos (consequência direta, não listado nos arquivos impactados)
- `src/App.jsx` — `handleImportar`, `handleArquivoEscolhido`, input de arquivo oculto
- `src/App.importar.test.jsx` — criado (consequência direta do item 6 do Escopo, não listado nos arquivos impactados)
- `docs/idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md` — novo IDR
- `docs/plano/0009-desfazer-menu-e-portabilidade/0005-importar-colecao-de-json.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0009-0005 atualizado
- `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0005-log-importar-colecao-de-json.md` — este log
