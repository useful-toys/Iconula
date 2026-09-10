<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0004-0003]: empilhamento das páginas em tela estreita

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` § Decisão e § Consequências — lado a lado quando cabem, empilhadas quando não cabem, e nunca cair para a lista
- `docs/interface.md` § Disposição "Como no álbum" — as páginas ficam lado a lado quando cabem na largura da tela
- `docs/interface.md` § Medidas — trilhas de 52px preservadas, 20px entre as páginas, margem lateral `clamp(16px, 4vw, 40px)`
- `docs/requisitos.md` § Requisitos Não Funcionais — responsividade: o app funciona bem em navegador, celular e tablet
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Decisão — a acomodação é na página, nunca por rolagem interna

## Objetivo
Fazer o spread caber em qualquer largura sem trair a página física: as duas
páginas ficam lado a lado quando cabem e empilham quando não cabem, com as
trilhas de 52px intactas nos dois casos.

## Padrões e convenções aplicáveis
- Em nenhuma largura a disposição álbum cai para a lista —
  `docs/idr/0015-*` § Decisão
- As trilhas continuam com 52px empilhadas: o cartão não encolhe para caber —
  `docs/idr/0015-*` § Decisão e `docs/interface.md` § Medidas
- Empilhado, a página 1 (01–10) fica **acima** da página 2 (11–20) —
  `docs/idr/0015-*` § Decisão
- A acomodação é feita pelo fluxo da página; nada de `overflow` para resolver
  largura — `docs/idr/0008-*` § Decisão
- A margem lateral do corpo é a mesma do cabeçalho, para tudo alinhar na mesma
  vertical — `docs/interface.md` § Medidas

## Escopo e instruções de implementação
1. Fazer o contêiner do spread alternar entre lado a lado e empilhado conforme a
   largura disponível — preferir uma solução puramente CSS (quebra por
   `flex-wrap` ou consulta de contêiner) a medir largura em JavaScript.
2. Empilhado, manter a ordem: página 1 acima, página 2 abaixo, com o mesmo
   espaçamento de 20px entre elas.
3. Conferir a largura crítica: 4 trilhas de 52px mais espaçamentos, duas páginas
   mais 20px entre elas, mais a margem lateral — o ponto de quebra sai daí, não de
   um valor arbitrário de breakpoint.
4. A Coca-Cola (3 trilhas) empilha pela mesma regra, com o seu próprio ponto de
   quebra.
5. Garantir que a lista contínua não muda: ela já flui com wrap em qualquer
   largura.
6. Testes: com largura de contêiner estreita, as duas páginas aparecem
   empilhadas e na ordem certa; com largura folgada, lado a lado; em nenhum caso
   a seção passa a renderizar a lista.

**Fora do escopo**: definir qual disposição é a padrão em cada faixa de tela
(Tarefa 0009-0003); mudar o tamanho do cartão.

## Decisões já tomadas (não reabrir)
- Empilhar em vez de cair para a lista — ver `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- Trilhas de largura fixa não se ajustam à tela — ver `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md`
- Em tela estreita o percurso vertical dentro da seção dobra; aceito — ver `docs/idr/0015-*` § Consequências

## Decisões em aberto nesta tarefa
- Consulta de contêiner × quebra por flex — encaminhamento: o que resolver sem
  JavaScript e sem breakpoint fixo; se a escolha impuser suporte de navegador
  além do exigido pelos evergreen, nasce um **TDR**

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

## Arquivos impactados
- `src/components/PaginaDoAlbum.jsx` — modificar
- `src/components/PaginaDoAlbum.test.jsx` — modificar
- `src/theme.css` — modificar (regras do spread)

## Critérios de aceite
- [ ] Em largura folgada, as duas páginas ficam lado a lado com 20px entre elas
- [ ] Em largura estreita, empilham com a página 1 acima da página 2
- [ ] As trilhas continuam com 52px nos dois casos
- [ ] Em nenhuma largura a disposição álbum vira lista
- [ ] O ponto de quebra decorre da largura real do spread, não de um breakpoint arbitrário
- [ ] Nenhuma rolagem horizontal na página e nenhum contêiner com rolagem própria
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0003-log-empilhamento-das-paginas.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: estreitar a janela até ~360px e conferir que
o spread empilha sem cortar cartões, sem barra de rolagem horizontal na página e
sem virar lista.
