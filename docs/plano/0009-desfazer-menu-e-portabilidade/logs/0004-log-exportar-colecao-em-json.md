<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0009-0004: exportar a coleção em JSON

## Data
2026-09-11

## Resumo
Implementado o comando "exportar" do menu de ações: baixa a coleção em
memória num arquivo JSON versionado, sem dados pessoais.

- `src/lib/portabilidade.js` (novo): `gerarExportacao(contagens, agora)`
  devolve exatamente `{ versao: 1, geradoEm: <ISO 8601>, contagens }` —
  contagens ≤ 0 filtradas por defesa extra (o mapa em memória já nunca
  guarda zeros); `nomeDoArquivoExportado(agora)` devolve
  `iconula-AAAA-MM-DD.json` na data local. Os dois recebem `agora`
  injetável para testabilidade (mesmo padrão de `formatarCarimbo` em
  `colecaoRemota.js`). Função pura, sem tocar o DOM.
- `src/App.jsx`: `handleExportar` gera o objeto, monta um `Blob`, cria um
  link temporário com `download` e clica nele — sem diálogo (IDR 0040).
  Sucesso emite "Coleção exportada"; qualquer falha (gerar o Blob, criar
  a URL, etc.) emite falha vermelha com o detalhe técnico via
  `mensagemDeErro` (reaproveitada de `colecaoRemota.js`, já genérica).
- `src/components/Controles.jsx`: repassa `onExportar` ao `MenuDeAcoes` —
  o item já existia desabilitado desde a Tarefa 0009-0002 (design
  forward-compatible); nenhuma mudança de comportamento em
  `MenuDeAcoes.jsx`, só o comentário de topo.

## Decisões tomadas
**IDR 0040 — Exportar sem diálogo, com nome de arquivo datado**
(`docs/idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md`),
fechando as duas pendências de desenho da própria tarefa:
1. Sem diálogo de exportação — escolher o comando já baixa o arquivo
   direto; um diálogo seria a etapa extra que `requisitos.md` proíbe.
2. Nome do arquivo `iconula-AAAA-MM-DD.json`, na data local — previsível
   e ordenável.

## Impedimentos
Nenhum nível 3. O nível 1 acima foi decidido e registrado no IDR 0040.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 34 arquivos de teste, 317 testes, todos passando — inclui
  `src/lib/portabilidade.test.js` (11 casos: exatamente três campos,
  `versao` 1, `geradoEm` no instante recebido, contagens lossless,
  zeradas/negativas filtradas, coleção vazia gera `contagens: {}`, sem
  dado pessoal, sem mutar o mapa recebido, sobrevive a
  `JSON.stringify`/`JSON.parse`, formato do nome de arquivo com zero à
  esquerda) e o novo `src/App.exportar.test.jsx` (5 casos de integração:
  arquivo com os três campos e as contagens certas sem diálogo, sem dado
  pessoal, nome de arquivo datado, falha ao exportar emite alerta
  vermelho com detalhe, e nenhuma leitura/escrita no Firestore).
  `Controles.test.jsx` ganhou 2 casos (repassa `onExportar`; item
  desabilitado sem ele).
- `vite build`: build de produção concluído com sucesso (CSS inalterado,
  13,76 kB; JS de 403,59 kB para 404,34 kB; aviso pré-existente sobre
  chunk grande, não relacionado a esta tarefa).

**Sobre o item 6 do Escopo** ("o arquivo de uma coleção conhecida
reimportado pela Tarefa 0009-0005 reproduz a coleção idêntica — teste de
ida e volta"): o passo de ida e volta *completo*, usando a função de
importação de fato, só pode ser escrito quando ela existir — nasce na
Tarefa 0009-0005, que reaproveitará `gerarExportacao` para montar o
arquivo de entrada do teste. O que esta tarefa já garante e testa é a
metade que lhe cabe: a serialização é sem perdas por
`JSON.stringify`/`JSON.parse` (o par que a importação vai usar para ler
o arquivo) — ver o teste "sobrevive a JSON.stringify/JSON.parse sem
perder nenhuma contagem" em `portabilidade.test.js`.

**Verificação visual em `npm run dev`**: como nas tarefas anteriores da
fase, não concluída nesta sessão pela mesma limitação (login real via
Google). Confirmado apenas que a tela de login carrega sem erro no
console. A cobertura funcional equivalente (exportar, conferir os três
campos e a ausência de dados pessoais) está em `App.exportar.test.jsx`.
Fica pendente para o usuário repetir a checagem manual antes de mesclar
a fase.

## Arquivos alterados
- `src/lib/portabilidade.js` — criado
- `src/lib/portabilidade.test.js` — criado
- `src/components/MenuDeAcoes.jsx` — comentário de topo atualizado (nenhuma mudança de comportamento)
- `src/components/Controles.jsx` — repassa `onExportar` ao `MenuDeAcoes`
- `src/components/Controles.test.jsx` — 2 casos novos (consequência direta, não listado nos arquivos impactados)
- `src/App.jsx` — `handleExportar`
- `src/App.exportar.test.jsx` — criado (consequência direta do item 6 do Escopo, não listado nos arquivos impactados)
- `docs/idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md` — novo IDR
- `docs/plano/0009-desfazer-menu-e-portabilidade/0004-exportar-colecao-em-json.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0009-0004 atualizado
- `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0004-log-exportar-colecao-em-json.md` — este log
