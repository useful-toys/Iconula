<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0030-0002: ícones Material Symbols vendorizados como SVG inline

## Data
2026-09-17

## Resumo
Vendorizados quatro ícones Material Symbols (`numbers`, `sort_by_alpha`,
`view_list`, `view_module`) como SVG inline em `src/assets/`, no mesmo
padrão do `google-logo.svg` já existente (arquivo próprio, servido pelo
Hosting, com um comentário de cabeçalho citando origem e licença). Nenhum
componente foi alterado — o uso nos controles é da Tarefa 0030-0003. Os
arquivos: `material-numbers.svg`, `material-sort-by-alpha.svg`,
`material-view-list.svg`, `material-view-module.svg`.

## Discovery
- Código: `src/assets/google-logo.svg` é o único precedente de SVG inline
  vendorizado fora de `src/assets/flags/` (bandeiras Twemoji, sem cabeçalho
  de comentário) — usei o padrão do `google-logo.svg` (comentário de
  cabeçalho com a política de vendorização e a licença) por ser o SVG
  "avulso" mais próximo do caso (ícone único, não gerado em lote como as
  bandeiras). Nenhum módulo importa esses arquivos ainda; não há teste a
  ajustar nesta tarefa (fora do escopo o uso nos controles).
- Documentação: `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md`
  (decisão vigente: SVG inline, os quatro ícones, sem fonte) e
  `docs/idr/0059-rotulos-compactos-dos-controles.md` (contexto do uso
  futuro) bastaram; nenhuma leitura adicional.

## Plano da alteração
1. Baixar os quatro SVGs do Material Symbols (fonte oficial Google Fonts,
   `fonts.gstatic.com/s/i/.../materialsymbolsoutlined/<ícone>/default/24px.svg`,
   licença Apache 2.0) e salvá-los em `src/assets/` com nomes claros
   (`material-<ícone>.svg`), cada um com um comentário de cabeçalho no
   padrão do `google-logo.svg`.
   - Verificação prevista: os quatro arquivos existem, são XML válido e
     contêm o `<path>` do ícone certo.
2. Sem testes novos (nenhum componente consome os arquivos ainda) e sem
   registro novo — a decisão já está no TDR 0026, criado no planejamento.
   Sem mudança em `docs/*.md` (o único trecho relevante, `docs/interface.md`
   § Controles, muda na Tarefa 0030-0003, que usa os ícones).
- Verificação prevista: `npm run lint && npm run test && npm run build`
  verdes; abrir cada SVG e conferir o `<path>` contra a fonte oficial.
- Riscos: URL da fonte oficial mudar de formato — mitigado testando o
  download antes de escrever os arquivos finais.
- Desvios: nenhum.

## Decisões tomadas
- Nome de arquivo `material-<ícone-em-kebab-case>.svg` (ex.:
  `material-sort-by-alpha.svg`) — nível 1, segue a sugestão da própria
  tarefa e o padrão descritivo dos demais assets.
- Comentário de cabeçalho citando a política de vendorização e a licença
  Apache 2.0, no padrão do `google-logo.svg` (em vez de nenhum comentário,
  como as bandeiras Twemoji) — nível 1: escolha entre dois precedentes
  existentes no próprio projeto, sem mudar comportamento; o comentário deixa
  a origem e a licença rastreáveis num arquivo que, ao contrário das 27
  bandeiras geradas em lote, é editado/consultado individualmente.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída — sem avisos ou erros)

$ npm run test -- --run
 Test Files  43 passed (43)
      Tests  584 passed (584)
   Duration  26.29s

$ npm run build
✓ 138 modules transformed.
✓ built in 313ms
(aviso de chunk >500kB pré-existente, não relacionado a este SVG — nenhum
dos quatro arquivos novos é importado por código ainda)
```

## Critérios de aceite
- [x] Os quatro SVGs existem em `src/assets/` e renderizam os ícones
      `numbers`, `sort_by_alpha`, `view_list`, `view_module` — conferido
      abrindo cada arquivo e validando o XML (`xml.dom.minidom`); o `<path>`
      de cada um bate com o baixado da fonte oficial do Material Symbols.
- [x] `npm run lint && npm run test && npm run build` verdes — saída acima.

## Arquivos alterados
- `src/assets/material-numbers.svg` — criado (ícone `numbers`)
- `src/assets/material-sort-by-alpha.svg` — criado (ícone `sort_by_alpha`)
- `src/assets/material-view-list.svg` — criado (ícone `view_list`)
- `src/assets/material-view-module.svg` — criado (ícone `view_module`)
- `docs/plano/0030-faixa-sem-barra-e-controles-compactos/0002-icones-material-symbols-como-svg-inline.md` — status `Concluída`, critérios marcados
- `docs/plano/README.md` — linha da Tarefa 0030-0002 → `Concluída`
