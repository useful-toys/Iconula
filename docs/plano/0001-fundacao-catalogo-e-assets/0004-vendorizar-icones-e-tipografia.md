<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0001-0004]: vendorizar os ícones dos especiais e a tipografia

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/adr/0002-bandeiras-emoji-unicode.md` § Decisão e § Consequências — SVGs Twemoji vendorizados em `src/assets/flags/`, nome do arquivo = code point, resolução por `import.meta.glob`
- `docs/adr/0006-login-google-sdk-modular.md` § Consequências — "fim das requisições a terceiros em runtime" como propriedade a preservar
- `docs/tdr/0002-headers-de-seguranca-hosting.md` § Decisão — a CSP e o que ela permite
- `docs/tdr/0005-csp-firebase-auth-google-oauth.md` § Status — a política em vigor: `style-src 'self'`, `font-src 'self'`
- `docs/interface.md` § Tipografia — Poppins 600/700 no título, códigos e nomes de seção; `system-ui` no restante
- `src/assets/flags/README.md` — como os SVGs atuais foram obtidos e nomeados
- `AGENTS.md` § Cuidado — as sequências tag de Inglaterra e Escócia

## Objetivo
Colocar no repositório os dois assets que a tela nova exige e que hoje não
existem: os ícones 🏆 e 🥤 dos especiais e os arquivos da fonte Poppins. Ambos
servidos pelo próprio Hosting — a CSP em vigor proíbe fonte e folha de estilo de
terceiros, e nenhuma exceção nova será aberta para isso.

## Padrões e convenções aplicáveis
- Nenhum asset de terceiro em runtime: tudo vendorizado e servido pelo Hosting —
  `docs/adr/0002-*` § Consequências e `docs/adr/0006-*` § Consequências
- A CSP em vigor tem `style-src 'self'` e `font-src 'self'`; `fonts.googleapis.com`
  e `fonts.gstatic.com` foram **removidos** de propósito quando o FirebaseUI saiu —
  não reabrir — `docs/tdr/0005-*` § Status
- SVG de emoji é nomeado pelo code point Unicode, como os existentes —
  `docs/adr/0002-*` § Consequências
- Arquivo novo abre com o cabeçalho de copyright na sintaxe do seu tipo; para
  binários (`.woff2`), o crédito vai no `README.md` da pasta —
  `AGENTS.md` § Convenções
- Nada de `dangerouslySetInnerHTML` ao renderizar SVG: `<img>` com `src` resolvido
  pelo Vite — `docs/tdr/0003-*` § Decisão e `docs/adr/0002-*`

## Escopo e instruções de implementação
1. Baixar os SVGs Twemoji de 🏆 (`1f3c6`) e 🥤 (`1f964`) da mesma fonte e versão
   dos existentes e colocá-los em `src/assets/flags/`, nomeados pelo code point.
   Atualizar o `README.md` da pasta para dizer que ela também guarda os ícones
   temáticos dos especiais, não só bandeiras.
2. Conferir que as 48 bandeiras existentes cobrem as 48 seleções do catálogo novo
   — inclusive as sequências tag de Inglaterra e Escócia, que continuam valendo e
   não devem ser trocadas por `🇬🇧`. Se faltar alguma, baixar do mesmo jeito.
3. Vendorizar **Poppins 600 e 700**, apenas os subsets latin e latin-ext, em
   `.woff2`, sob `src/assets/fonts/`. Declarar as `@font-face` no CSS do próprio
   projeto, com `font-display: swap` e uma pilha de fallback real
   (`system-ui, sans-serif`). Nenhum `@import` e nenhum `<link>` para domínio
   externo.
4. Conferir a licença: Poppins é SIL Open Font License. Incluir o arquivo de
   licença junto dos `.woff2` e creditar no `README.md` da pasta.
5. Registrar como **TDR** a decisão de vendorizar a fonte, com o motivo (a CSP em
   vigor, e a propriedade de não entregar IP e User-Agent do visitante a
   terceiros, estabelecida no ADR 0006).
6. Conferir o peso: os quatro arquivos somados não devem mudar materialmente o
   tamanho do bundle. Registrar os números medidos no log.

**Fora do escopo**: aplicar a fonte e os ícones em algum componente (Fase 2);
mexer na CSP do `firebase.json` — nada nesta tarefa exige exceção nova; qualquer
outro peso ou família tipográfica além dos dois pesos de Poppins.

## Decisões já tomadas (não reabrir)
- Bandeiras Twemoji vendorizadas, incluindo Inglaterra e Escócia — ver `docs/adr/0002-bandeiras-emoji-unicode.md`
- Ícones temáticos 🏆 e 🥤 para os especiais — ver `docs/requisitos.md` § Catálogo e `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- Poppins 600/700 no título, códigos e nomes de seção — ver `docs/interface.md` § Tipografia
- A CSP não recebe origem nova de fonte ou estilo — ver `docs/tdr/0005-csp-firebase-auth-google-oauth.md`

## Decisões em aberto nesta tarefa
- Vendorizar a fonte × trocar Poppins por `system-ui` — encaminhamento:
  vendorizar, porque `interface.md` decide a tipografia e a CSP proíbe o CDN;
  nasce um **TDR**
- Quais subsets embarcar — encaminhamento: latin e latin-ext, suficientes para
  PT-BR e para os nomes das seções; consta no mesmo TDR

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
   **Caso concreto previsto aqui**: se a única forma de usar Poppins exigisse
   abrir `font-src`/`style-src` na CSP, PARE — isso reverte uma decisão do
   ADR 0006 e do TDR 0005.

## Arquivos impactados
- `src/assets/flags/1f3c6.svg` — criar
- `src/assets/flags/1f964.svg` — criar
- `src/assets/flags/README.md` — modificar
- `src/assets/fonts/*.woff2` — criar
- `src/assets/fonts/README.md` — criar (crédito e licença OFL)
- `docs/tdr/00NN-tipografia-vendorizada.md` — criar

## Critérios de aceite
- [ ] `src/assets/flags/` tem os SVGs de 🏆 e 🥤, nomeados pelo code point
- [ ] As 48 bandeiras cobrem as 48 seleções do catálogo, Inglaterra e Escócia inclusive
- [ ] Poppins 600 e 700 em `.woff2` dentro do repositório, com licença creditada
- [ ] Nenhuma referência a `fonts.googleapis.com`, `fonts.gstatic.com` ou a qualquer
      outro domínio externo no CSS ou no HTML
- [ ] `firebase.json` não foi alterado
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0001-fundacao-catalogo-e-assets/logs/0004-log-vendorizar-icones-e-tipografia.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: os assets ainda não aparecem na tela nesta
fase — conferir pela aba Network do navegador que nenhuma requisição sai para
domínio de terceiro, e pelo `dist/` que os `.woff2` e os dois SVGs foram
emitidos pelo build.
