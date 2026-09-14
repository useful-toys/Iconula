<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0003]: vendorizar a Roboto Condensed

## Status
Concluída

## Objetivo
Colocar no repositório a Roboto Condensed (peso 500, subsets latin e
latin-ext), servida pelo próprio Hosting como a Poppins, para o nome das
figurinhas — sem CDN e sem abrir a CSP.

## Documentos de referência
- `docs/tdr/0013-tipografia-vendorizada.md` § Decisão e § Histórico — a
  Roboto Condensed 500, subsets e licença
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — uso da
  fonte no nome, 10px
- `src/assets/fonts/` — Poppins vendorizada, `OFL.txt` e `README.md`
- `src/index.css` — `@font-face` da Poppins com `font-display: swap` e
  `unicode-range` por subset
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` —
  `font-src 'self'`

## Padrões e convenções aplicáveis
- Nenhuma requisição a terceiros em runtime; CSP inalterada — TDR 0013,
  DDR 0001
- Arquivo novo com cabeçalho de copyright quando o formato admitir
  comentário — `AGENTS.md` § Convenções
- A licença OFL acompanha os arquivos — TDR 0013

## Escopo e instruções de implementação
1. Baixar da fonte oficial (Google Fonts / repositório do projeto Roboto)
   os `.woff2` da Roboto Condensed 500, subsets latin e latin-ext, para
   `src/assets/fonts/`, com o texto da OFL do projeto.
2. Declarar em `src/index.css` os `@font-face` da Roboto Condensed 500, no
   mesmo padrão da Poppins (`font-display: swap`, `unicode-range` por
   subset).
3. Atualizar `src/assets/fonts/README.md` com a família, o peso, os subsets e
   a licença.
4. Conferir no log que os nomes com ğ ı ş İ ø č š ž ć são cobertos pelos
   dois subsets e anotar o tamanho somado dos arquivos novos.

**Fora do escopo**: aplicar a fonte no cartão (Tarefa 0017-0005); outros pesos.

## Decisões já tomadas (não reabrir)
- Roboto Condensed 500, latin e latin-ext, vendorizada — ver
  `docs/tdr/0013-tipografia-vendorizada.md`
- Nome em Roboto Condensed 10px — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`

## Impedimentos específicos
- Se a licença obtida não for a OFL 1.1, ou se a fonte só estiver disponível
  por CDN, bloqueie.

## Arquivos impactados
- `src/assets/fonts/` — criar (`.woff2` da Roboto Condensed e a licença)
- `src/assets/fonts/README.md` — modificar
- `src/index.css` — modificar

## Critérios de aceite
- [ ] `.woff2` da Roboto Condensed 500 (latin e latin-ext) em
      `src/assets/fonts/`, com licença (busca)
- [ ] `@font-face` declarados em `src/index.css` com `font-display: swap`
- [ ] `firebase.json` inalterado; `npm run build` inclui os arquivos
- [ ] Cobertura dos caracteres e tamanho anotados no log
