<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0001-0003]: derivações e invariantes do catálogo

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão — FWC primeiro e COC última nas duas ordenações
- `docs/idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md` § Decisão — as duas ordenações de seções
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § Decisão e § A composição dos grupos — os 12 super-grupos e sua ordem
- `docs/interface.md` § Disposição "Como no álbum" — as posições de linha/coluna das seleções e da Coca-Cola
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão — o FWC não tem layout de álbum
- `docs/requisitos.md` § Anexo: seções do catálogo — os totais que os testes travam

## Objetivo
Transformar o catálogo em estruturas prontas para a tela: a sequência de seções
em cada ordenação, o agrupamento em super-grupos A–L e o layout de página física.
Tudo como função pura, testada, para que as fases de UI só consumam — e para que
um erro de transcrição no dado apareça como teste vermelho, não como tela torta.

## Padrões e convenções aplicáveis
- Arquivo novo abre com `// Copyright (c) 2026 Daniel Felix Ferber` —
  `AGENTS.md` § Convenções
- Derivação de dado é módulo puro em `src/data/` ou `src/lib/`, sem React e sem
  acesso a rede — `AGENTS.md` § Convenções e `docs/arquitetura.md` § Camadas no cliente
- O layout do álbum é **posição explícita de linha/coluna** num grid de trilhas
  fixas, nunca grade uniforme responsiva — `docs/idr/0009-*` § Decisão
- FWC abre e COC fecha o catálogo nas **duas** ordenações; sem super-grupo
  "Especiais" — `docs/idr/0028-*`
- Nada de estado nem de componente nesta tarefa: só funções e testes —
  `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. Ordenação **por sigla**: FWC, depois as 48 seleções em ordem alfabética de
   sigla (ARG, AUS, AUT, …), depois COC. Sem super-grupos.
2. Ordenação **por página do álbum**: FWC, depois os 12 super-grupos A–L na ordem
   das páginas (A começa em 8–15, L termina em 98–105), cada um com suas 4
   seleções na ordem das páginas, depois COC — FWC e COC fora dos super-grupos.
3. Layout de página das **seleções** (4 trilhas por página, duas páginas):
   - página 1: linha 1 → 01 e 02 nas trilhas 3 e 4; linha 2 → 03–06; linha 3 → 07–10
   - página 2: linha 1 → 11 e 12 nas trilhas 1 e 2, e 13 em paisagem ocupando as
     trilhas 3 e 4; linha 2 → 14–17; linha 3 → 18, 19 e 20 nas trilhas 2, 3 e 4
   Expressar como posição explícita (linha, coluna inicial, quantas trilhas
   ocupa), não como "alinhar à direita".
4. Layout de página da **Coca-Cola** (3 trilhas por página): página 1 com 01–06
   em 2 linhas cheias; página 2 com 07–09, 10–12 e depois 13 e 14 nas duas
   primeiras posições da linha 3. Todas em retrato.
5. O **FWC não tem layout de álbum**: a função devolve explicitamente "sem
   layout", e quem consome cai na lista contínua (Fase 4).
6. Testes de invariantes (fazem o papel do pipeline que não existe):
   994 códigos no total; 50 seções; 20 figurinhas por seleção; 20 no FWC e 14 na
   COC; nenhum código duplicado; todo código no formato três letras + dois
   dígitos; toda seleção com grupo A–L e FWC/COC sem grupo; páginas das seleções
   distintas entre si e nenhuma usando o bloco 56–57; as duas ordenações contendo
   exatamente as mesmas 50 seções, ambas começando em FWC e terminando em COC;
   cada layout de álbum cobrindo todas as posições da seção uma única vez.

**Fora do escopo**: renderização (Fases 2 a 4); filtro e colapso; qualquer
decisão sobre qual ordenação é a padrão na primeira abertura (Tarefa 0009-0003).

## Decisões já tomadas (não reabrir)
- Duas ordenações e duas disposições — ver `docs/idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md`
- Layout físico com posições explícitas — ver `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md`
- Coca-Cola tem álbum; FWC nunca tem — ver `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- 12 super-grupos, não 13 — ver `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Decisões em aberto nesta tarefa
- Onde as derivações moram (`src/data/` junto do catálogo ou `src/lib/`) —
  encaminhamento: `src/data/`, porque são propriedades do dado e não têm efeito
  colateral; se a escolha for outra, nasce um **TDR**

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
- `src/data/catalogo.js` — modificar (exportar as derivações) ou
  `src/data/catalogoOrdenacoes.js` e `src/data/catalogoLayout.js` — criar
- `src/data/catalogo.test.js` — criar

## Critérios de aceite
- [x] As duas ordenações devolvem as 50 seções, com FWC na primeira posição e COC na última
- [x] A ordenação por página agrupa as 48 seleções nos 12 grupos A–L, na ordem das páginas
- [x] O layout de seleção coloca 01–02 nas trilhas 3–4, a 13 em paisagem nas trilhas 3–4 e 18–20 nas trilhas 2–4
- [x] O layout da Coca-Cola tem 6 na primeira página e 8 na segunda, com 13 e 14 nas duas primeiras posições da linha 3
- [x] O FWC devolve "sem layout de álbum"
- [x] Os testes de invariantes cobrem os oito itens do passo 6 e passam
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas
- [x] `docs/plano/0001-fundacao-catalogo-e-assets/logs/0003-log-derivacoes-e-invariantes-do-catalogo.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Sem verificação visual: nada disso chega à tela nesta fase.
