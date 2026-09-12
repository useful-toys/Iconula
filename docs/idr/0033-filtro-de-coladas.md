<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0033: Filtro de coladas ao lado de faltantes e repetidas

## Status

Aceito — estende o conjunto de valores do filtro criado pelo
[IDR 0001](0001-filtro-de-status-so-na-disposicao-lista.md), sem tocar
em nenhuma outra regra do filtro. Nasce do uso do app com o catálogo
inteiro em tela.

## Contexto

- O modelo de domínio (`requisitos.md`) tem três estados derivados da
  contagem: faltante (0), colada (≥ 1) e repetida (≥ 2). O placar já
  usa os três — `12/20 · 60% · ▢8 · ×3` —, mas o filtro nasceu com
  apenas `todas | faltantes | repetidas`.
- Falta, portanto, a vista do estado do meio. **Colada não é o
  complemento de repetida**: repetida é contagem ≥ 2, colada é
  contagem ≥ 1 — toda repetida é colada, e o inverso não vale. Quem
  quer conferir o álbum físico contra o app ("o que eu já colei nesta
  seção") não tem filtro que responda: hoje só dá para inferir por
  exclusão do filtro de faltantes, negação que a tela não oferece.
- O termo já existe na interface, no placar e em `requisitos.md`, então
  o filtro novo não introduz vocabulário — só realiza em tela uma
  leitura que o produto já declara.

## Decisão

- O filtro de status passa a ter **quatro valores**: todas, faltantes
  (contagem 0), **coladas (contagem ≥ 1)** e repetidas (contagem ≥ 2)
- Os segmentos seguem a progressão da contagem:
  `Todas | Falt. | Col. | Rep.`; a forma por extenso vive só no nome
  acessível, como manda o
  [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
- Coladas e repetidas se sobrepõem de propósito, e a interface não
  sinaliza a sobreposição: o usuário especialista do IDR 0018 lê os
  rótulos pelo modelo de domínio já declarado
- Tudo o que vale para os outros valores vale para coladas: só na
  disposição lista (IDR 0001 e
  [IDR 0023](0023-coca-cola-no-modo-album-fwc-sempre-lista.md)), oculta
  seções e super-grupos sem resultado
  ([IDR 0025](0025-filtro-oculta-secoes-vazias.md)), o salto pela faixa
  devolve o filtro para "todas"
  ([IDR 0031](0031-salto-com-filtro-ativo.md)) e a escolha é lembrada
  entre sessões ([IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md))

## Consequências

- A linha de controles ganha um quarto segmento no terceiro grupo; em
  tela estreita ele conta para a quebra de linha já prevista em
  `interface.md` § Controles — os dois comandos da direita continuam
  colados à direita
- O placar não muda: o filtro muda a vista, não os números (IDR 0025)
- **Não nasce um comando de cópia novo**: as listas de troca continuam
  sendo faltantes e repetidas (`requisitos.md` § Compartilhamento e
  [IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md)) — a lista das
  coladas não serve a troca nenhuma
- Coleção zerada com filtro em "coladas" resulta em tela vazia, mesma
  leitura correta que "faltantes" dá na coleção completa: sem mensagem
  nem estado especial
- `coladas` é um valor novo do enum guardado no `localStorage`; a
  leitura que não reconhece um valor cai para `todas` (IDR 0026), então
  um navegador com `coladas` gravado degrada sem erro num bundle antigo

## Alternativas consideradas

- **Coladas = exatamente 1** (colada e não repetida): daria conjuntos
  disjuntos, formalmente mais limpos, mas responde à pergunta errada —
  quem confere o álbum quer ver tudo o que está colado, repetidas
  inclusive
- **Manter três valores e inferir por exclusão**: obriga o usuário a
  ler a negação do filtro de faltantes, que a tela não mostra
- **Trocar "repetidas" por "coladas"**: perderia a consulta que
  alimenta as trocas, que é o diferencial do produto
