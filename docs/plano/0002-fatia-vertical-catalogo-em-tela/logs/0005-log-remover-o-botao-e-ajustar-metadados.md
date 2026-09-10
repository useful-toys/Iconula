<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0002-0005: remover o Iconula Button e ajustar os metadados do site

## Data
2026-09-10

## Resumo
Removidos o produto antigo e seus artefatos no mesmo PR que fecha a
Fase 2, deixando a `main` com o controle de figurinhas inteiro.

Arquivos removidos:
- `src/components/TeamButton.jsx`
- `src/data/teams.js`
- `src/lib/userPreferences.js` (e seus testes)
- `src/lib/userPreferences.test.js`
- `src/lib/userPreferences.unavailable.test.js`

O `src/App.css` foi recriado do zero com os estilos mínimos do produto
novo (tema escuro único), já que o arquivo anterior pertencia à era do
botão.

`src/App.jsx` foi simplificado: saíram o estado do índice de time, a
lógica de wrap-around, o contador de cliques e as chamadas de carga e
gravação do time. Entraram o estado da coleção, o cabeçalho e o catálogo.

Testes:
- `src/App.test.jsx` reescrito para cobrir cabeçalho, login/logout e
  renderização do catálogo (com `Catalogo` mockado para manter rapidez).
- `src/App.auth-unavailable.test.jsx` atualizado para verificar o
  cabeçalho e a ausência da área de login quando o Firebase Auth não
  está configurado.

Metadados:
- `index.html`: `lang="pt-BR"`, título "Iconula 2026", descrição e
  Open Graph básicos em português.
- `package.json`: nome do pacote alterado de `iconula-button` para
  `iconula`.
- `AGENTS.md`: descrição do projeto em § O que é este projeto atualizada
  para o controle de figurinhas; tabela § Onde fica cada coisa refeita
  para refletir os arquivos que existem agora; Stack ajustada para
  mencionar o catálogo em vez do botão.

Conferido que nenhuma requisição ao Firestore parte do app após esta
remoção: o único módulo que carregava `firebase/firestore`
(`userPreferences.js`) saiu. O login continua funcionando via Firebase
Auth.

## Decisões tomadas
Nenhuma nova decisão de arquitetura, técnica ou de interface. A
renomeação do pacote em `package.json` segue o encaminhamento da própria
tarefa; é organizacional e está registrada no log.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 11 arquivos de teste, 71 testes passando.
- `vite build`: build de produção concluído com sucesso.

Verificação visual em `npm run dev`: a tela abre no catálogo, sem
vestígio do botão; o `lang` do documento é `pt-BR`. Na aba Network, sem
usuário logado (e portanto sem persistência), não há requisições para
`firestore.googleapis.com`.

## Arquivos alterados
- `src/components/TeamButton.jsx` — removido
- `src/data/teams.js` — removido
- `src/lib/userPreferences.js` — removido
- `src/lib/userPreferences.test.js` — removido
- `src/lib/userPreferences.unavailable.test.js` — removido
- `src/App.jsx` — modificado
- `src/App.css` — recriado
- `src/App.test.jsx` — reescrito
- `src/App.auth-unavailable.test.jsx` — atualizado
- `index.html` — modificado
- `package.json` — modificado
- `AGENTS.md` — modificado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/0005-remover-o-botao-e-ajustar-metadados.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002-0005 atualizado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0005-log-remover-o-botao-e-ajustar-metadados.md` — este log
