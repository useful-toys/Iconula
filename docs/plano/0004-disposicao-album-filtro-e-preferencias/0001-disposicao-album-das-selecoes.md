<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0004-0001]: disposição álbum das 48 seleções

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md` § Decisão — posições explícitas num grid de 4 trilhas fixas, nunca grade uniforme responsiva
- `docs/interface.md` § Disposição "Como no álbum" → "Seleções — 4 trilhas por página" — as três linhas de cada página e a figurinha 13 em paisagem
- `docs/interface.md` § Grupo na disposição álbum — seleção — o wireframe com as posições
- `docs/interface.md` § Medidas — trilhas de 52px, linhas de 52px, 6px de espaçamento, 20px entre as duas páginas, tipografia menor do cartão no álbum
- `docs/idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md` § Decisão — o alternador de disposição é global, uma escolha para todo o catálogo
- `docs/interface.md` § Controles — o grupo segmentado `Lista | Álbum`

## Objetivo
Entregar a segunda disposição: o spread de duas páginas que reproduz a página
impressa da seleção, com cada figurinha na posição exata que ocupa no álbum
físico. É o que sustenta o fluxo de conferir "qual eu já tenho" com o álbum na
mão.

## Padrões e convenções aplicáveis
- Posição explícita de linha/coluna no grid de trilhas fixas — **não** um
  "empurrar para a direita" com alinhamento — `docs/idr/0009-*` § Decisão
- Trilhas de largura fixa (52px): a disposição álbum não se ajusta à largura da
  tela encolhendo cartões — `docs/interface.md` § Medidas
- O alternador de disposição é global; nenhuma seção escolhe a sua —
  `docs/idr/0023-*` § Consequências
- No álbum o cartão usa a tipografia um ponto menor (sigla 9px sobre número 12px)
  e o selo acompanha (9px/700, raio 7px) — `docs/interface.md` § Medidas
- Nenhum contêiner com rolagem própria: o spread se abre na página —
  `docs/idr/0008-*` § Decisão
- Cor só pelos tokens de `docs/interface.md` § Paleta — `docs/idr/0022-*`

## Escopo e instruções de implementação
1. Acrescentar o segundo grupo segmentado à linha de controles: `Lista` | `Álbum`,
   com nome acessível por extenso ("disposição em lista contínua", "disposição
   como no álbum").
2. Criar o componente de página do álbum, consumindo o layout já derivado na
   Tarefa 0001-0003 — o componente **não** recalcula posições, só as aplica ao
   grid.
3. Grid por página: 4 trilhas de 52px, linhas de 52px, 6px de espaçamento,
   posicionamento explícito por `grid-column` / `grid-row`.
4. Figurinha 13 em paisagem: ocupa duas trilhas, mesma altura das demais. Reusar o
   cartão da Tarefa 0002-0003 com a variante de álbum e a largura dobrada, sem
   criar um segundo componente de cartão.
5. As duas páginas do spread lado a lado, com 20px entre elas. O empilhamento em
   tela estreita é a Tarefa 0004-0003 — aqui basta não impedir que ele aconteça.
6. Testes: cada uma das 20 figurinhas cai na linha e na coluna previstas — em
   especial 01 e 02 nas trilhas 3–4, a 13 nas trilhas 3–4 da linha 1 da página 2,
   e 18–20 nas trilhas 2–4.

**Fora do escopo**: Coca-Cola e FWC (Tarefa 0004-0002); empilhamento responsivo
(Tarefa 0004-0003); filtro, que nem aparece nesta disposição (Tarefa 0004-0004);
persistir a escolha (Tarefa 0004-0005).

## Decisões já tomadas (não reabrir)
- A disposição álbum reproduz a página física com posições explícitas — ver `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md`
- A disposição álbum nunca cai para a lista, em nenhuma largura — ver `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- O alternador é global, com o FWC como exceção declarada — ver `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- 01 é o escudo e 13 é a foto da seleção — ver `docs/requisitos.md` § Conceitos (Glossário)

## Decisões em aberto nesta tarefa
- Se o cartão paisagem mantém o mesmo raio e a mesma espessura de borda do
  retrato — encaminhamento: sim, é o mesmo cartão em outra proporção; sem
  registro se seguir isso

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
- `src/components/PaginaDoAlbum.jsx` — criar
- `src/components/PaginaDoAlbum.test.jsx` — criar
- `src/components/Secao.jsx` — modificar (escolher lista × álbum)
- `src/components/Controles.jsx` — modificar
- `src/components/Figurinha.jsx` — modificar (variante paisagem)

## Critérios de aceite
- [ ] O grupo segmentado `Lista | Álbum` existe, com nome acessível por extenso
- [ ] Na disposição álbum, cada seleção mostra duas páginas de 4 trilhas
- [ ] 01 e 02 ficam nas trilhas 3–4; a 13 é paisagem nas trilhas 3–4; 18–20 nas trilhas 2–4
- [ ] A figurinha 1 fica exatamente sobre a terceira posição das linhas cheias abaixo dela
- [ ] As trilhas continuam com 52px em qualquer largura de tela
- [ ] Nenhum contêiner com rolagem própria foi introduzido
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0001-log-disposicao-album-das-selecoes.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: alternar para `Álbum` e comparar o spread do
Brasil com o wireframe de `docs/interface.md` § Grupo na disposição álbum —
seleção; conferir que os cartões não encolhem ao estreitar a janela.
