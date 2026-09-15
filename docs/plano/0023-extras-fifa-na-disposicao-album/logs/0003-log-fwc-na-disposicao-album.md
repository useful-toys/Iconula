<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0023-0003: FWC na disposição álbum

## Data
2026-09-15

## Resumo
Antes, `layoutDeSecao` devolvia `null` para o FWC e `Secao.jsx` sempre
caía na grade de lista para ele, mesmo com `disposicao="album"` — a
única das 50 seções sem espelho da página física. Depois, o FWC tem
layout de álbum próprio: oito páginas físicas (0–3 e 106–109, com as
dimensões e as posições da tabela do IDR 0023), em quatro pares
(0|1, 2|3, 106|107, 108|109), com linhas e colunas vazias preservadas.
`PaginaDoAlbum` ganhou a prop `comMoldura`, que dá ao FWC uma casa de
70×70px (em vez da trilha de 60px das demais seções) e uma moldura de
1px em `--border` (recuo 6px, raio 8px) em volta de cada página; a
mesma mudança corrigiu `isPaisagem` para vir de `figurinha.paisagem`
(não mais de `pos.trilhas === 2`), como os "Padrões e convenções
aplicáveis" da tarefa já exigiam. `Secao.jsx` › `CorpoAlbum` passou a
receber `secao` para decidir a moldura. `docs/interface.md` ganhou a
tabela e o wireframe das oito páginas do FWC e perdeu a frase "exibem-se
em lista contínua mesmo nesta disposição".

Um desvio do plano: `src/components/Figurinha.test.jsx` (fora de
"Arquivos impactados") tinha um teste que renderizava `PaginaDoAlbum`
com uma figurinha na posição 13 sem o campo `paisagem` — com
`isPaisagem` agora vindo da figurinha, o teste passou a não achar o
nome-paisagem. Corrigido acrescentando `paisagem: i === 12` à fixture
(ver "Plano da alteração › Desvios").

Verificação visual em `npm run dev` fica pendente: sem `.env.local`
(`VITE_FIREBASE_*`) neste ambiente, a tela do catálogo exige login e não
é alcançável — mesma limitação da Tarefa 0023-0001, com o roteiro
descrito em "Critérios de aceite" abaixo.

## Discovery
- Código: `layoutDeSecao` (`src/data/catalogoLayout.js`) devolvia `null`
  para o FWC — `Secao.jsx` cai então em `usaAlbum = false` e a seção
  renderiza a grade de lista mesmo com `disposicao="album"`. `catalogo.js`
  já traz `paginas: [0, 1, 2, 3, 106, 107, 108, 109]` no FWC (Tarefa
  0023-0002) e `figurinha.posicao` do FWC vai de 0 a 19 (`inicio: 0`).
  `PaginaDoAlbum.jsx` decide `isPaisagem` por `pos.trilhas === 2`, não por
  `figurinha.paisagem` — funciona hoje porque só a seleção 13 é paisagem e
  ocupa 2 trilhas; o padrão da tarefa exige trocar para `figurinha.paisagem`,
  já que no FWC a paisagem ocupa 1 trilha de 70px. `PaginaDoAlbum` usa
  `60px` fixo para a largura de cada trilha — precisa variar por seção (FWC:
  70px). `Secao.jsx` › `CorpoAlbum` não recebe `secao`, só `figurinhas`,
  `layout`, `contagens` e `onAjustar` — precisa passar a seção adiante para
  `PaginaDoAlbum` saber se é o FWC (casa de 70px e moldura).
  `catalogo.test.js` › "cada seção com layout" confere
  `totalPosicoes === Array.from({length: secao.total}, (_, i) => i + 1)`,
  presumindo posição 1-based — quebra para o FWC (`inicio: 0`, posições
  0–19) assim que `layoutDeSecao(FWC)` deixar de ser `null`; precisa usar
  `secao.inicio ?? 1` no comparativo. Teste "FWC devolve null" e "FWC
  sempre usa lista contínua" (`Secao.test.jsx`) ficam obsoletos e são
  substituídos pelo teste do layout descrito na tarefa. Fixture
  `figurinhasFwc` de `Secao.test.jsx` (describe "disposição álbum") não
  tem `posicao` — com layout real, a busca por posição na `PaginaDoAlbum`
  quebraria (mapa com uma entrada só, chave `undefined`); precisa ganhar
  `posicao` e `paisagem`. Fixture `figurinhasBrasil`
  (`PaginaDoAlbum.test.jsx`) não tem `paisagem` — ao trocar `isPaisagem`
  para vir da figurinha, os testes que hoje conferem a classe
  `pagina-album__celula--paisagem` na 13 quebrariam sem o campo.
- Documentação: IDR 0023 (tabela completa das 8 páginas, moldura, recuo,
  raio, 20px entre pares, larguras com moldura), MDR 0006 (formato do
  layout, `trilhas: 1` no FWC), IDR 0047 (medidas do cartão), IDR 0043
  (limite 582px), `interface.md` §§ citadas na tarefa.

## Plano da alteração
1. `src/data/catalogoLayout.js`: acrescenta `layoutFWC()` com as 8
   páginas (dimensões da tabela do IDR 0023) e as 20 posições, todas
   `trilhas: 1`; `layoutDeSecao` passa a devolver `layoutFWC()` para o
   FWC; atualiza o comentário de cabeçalho do arquivo.
2. `src/components/PaginaDoAlbum.jsx`: nova prop `comMoldura` (padrão
   `false`); largura da trilha 70px quando `comMoldura`, 60px quando não;
   classe `pagina-album--fwc` quando `comMoldura`; `isPaisagem` passa a
   vir de `figurinha.paisagem` em vez de `pos.trilhas === 2`.
3. `src/components/PaginaDoAlbum.css`: nova classe `.pagina-album--fwc`
   com borda 1px `--border`, padding 6px (recuo) e raio 8px — sem novo
   token (valores literais, como as demais medidas pontuais do arquivo).
4. `src/components/Secao.jsx`: `CorpoAlbum` recebe `secao` e calcula
   `comMoldura = secao.sigla === 'FWC'`, repassado a `PaginaDoAlbum`;
   remove o comentário "FWC sempre em lista".
5. Testes:
   - `src/data/catalogo.test.js`: troca "FWC devolve null" pelos testes
     do layout do FWC (8 páginas, 20 posições únicas, ao menos FWC00,
     FWC04, FWC05, FWC06, FWC13, FWC14, FWC17 contra a tabela do IDR
     0023); corrige "cada seção com layout" para usar `secao.inicio ?? 1`
     no comparativo de posições.
   - `src/components/Secao.test.jsx`: troca "FWC sempre usa lista
     contínua…" por "FWC usa disposição álbum" (4 pares, 8 páginas, 20
     cartões, página física 0 com grid 4×3 e FWC00 na linha 1/coluna 2,
     sem `.secao__grade`; disposição lista continua em lista); ajusta a
     fixture `figurinhasFwc` (posicao 0–19, paisagem nos códigos certos).
   - `src/components/PaginaDoAlbum.test.jsx`: acrescenta `paisagem` à
     fixture `figurinhasBrasil`; novos testes — página do FWC com classe
     de moldura e trilhas de 70px, FWC01 paisagem numa casa de 1 trilha,
     seleção sem moldura.
6. `docs/interface.md`: § Disposição "Como no álbum" (bullet + nova
   subseção "Extras FIFA — oito páginas em quatro pares"); § Wireframe
   (nova subseção "Grupo na disposição álbum — Extras FIFA"); §
   Apresentação por faixa de tela ("Álbum (todas as seções)" + nota das
   larguras); § Medidas (bullet do FWC no álbum) — todos citando o IDR
   0023.
- Verificação prevista: critérios → teste de `layoutDeSecao`
  (`catalogo.test.js`), teste de `Secao` em disposição álbum e lista
  (`Secao.test.jsx`), teste de classe/medida (`PaginaDoAlbum.test.jsx`),
  busca em `docs/interface.md`; visual manual pendente (sem `.env.local`
  nesta branch, ver Tarefa 0023-0001).
- Riscos: nenhuma figurinha do FWC tem `posicao` fora de 0–19 nas
  fixtures dos testes já existentes que precisam de ajuste — checado
  linha a linha ao editar cada arquivo.
- Desvios: `src/components/Figurinha.test.jsx` (fora de "Arquivos
  impactados") precisou de ajuste — troca de `isPaisagem` para
  `figurinha.paisagem` em `PaginaDoAlbum.jsx` quebrou o teste "PaginaDoAlbum
  repassa nome, nomeLinhas e nomeCurto ao cartão", cuja fixture da 13
  não tinha `paisagem: true`; corrigido acrescentando o campo à fixture,
  sem mudar o que o teste verifica.

## Decisões tomadas
- Prop `comMoldura` em `PaginaDoAlbum` (classe por seção, calculada em
  `CorpoAlbum` a partir de `secao.sigla`) — nível 1, sem registro (a
  tarefa já deixava as duas opções em aberto como nível 1).
- Sem novo token CSS para a casa de 70px ou para a moldura: largura da
  trilha como valor JS (como já era para os 60px), borda/raio/padding
  como valores literais na classe `.pagina-album--fwc` (`--border` já é
  token; raio e recuo pontuais seguem o padrão do restante do arquivo,
  ex. cabeçalho de seção) — nível 1, sem registro.
- `isPaisagem` em `PaginaDoAlbum` passa a vir de `figurinha.paisagem`,
  não de `pos.trilhas === 2` — já é o comportamento exigido pelos
  "Padrões e convenções aplicáveis" da tarefa (IDR 0047, IDR 0009); nível
  1, sem registro (não é decisão nova, é correção de um desvio do código
  atual em relação a decisão vigente que a lista já seguia).
- `catalogo.test.js` › "cada seção com layout": comparação de posições
  passa a usar `secao.inicio ?? 1` em vez de assumir 1-based — correção
  necessária para o teste continuar válido com o FWC (`inicio: 0`) tendo
  layout; nível 1, sem registro (ajuste de teste para cobrir o
  comportamento já decidido no MDR 0006, não uma decisão nova).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

```
$ npm run lint
> iconula@0.0.0 lint
> oxlint
(sem avisos, saída vazia, exit 0)

$ npm run test -- --run
 Test Files  41 passed (41)
      Tests  514 passed (514)
   Duration  23.89s

$ npm run build
✓ 136 modules transformed.
dist/assets/index-CLybKkym.css   28.64 kB │ gzip:   5.51 kB
dist/assets/index-DnSH2VvY.js   440.22 kB │ gzip: 135.51 kB
dist/assets/index.esm-...js     505.90 kB │ gzip: 148.77 kB
✓ built in ~0.5-0.7s
(!) Some chunks are larger than 500 kB after minification — aviso
    pré-existente do chunk lazy do Firestore (`index.esm-*.js`), confirmado
    idêntico no commit base 3d1e0ba (checado com WIP stasheado e restaurado
    via `git stash apply`); não é novo nesta tarefa.
```

`npm run test:rules`: não se aplica — a tarefa não tocou `firestore.rules`.

## Critérios de aceite
- [x] `layoutDeSecao` do FWC com oito páginas nas dimensões da tabela e os 20
      códigos nas posições do IDR 0023 — `src/data/catalogo.test.js`,
      testes "layout do FWC: oito páginas…", "layout do FWC: 20
      posições…" e "layout do FWC: posições conferem com a tabela do IDR
      0023" (`describe("layout de álbum")`)
- [x] Na disposição álbum, o FWC mostra quatro pares e oito páginas, sem
      grade de lista; na disposição lista, continua em lista —
      `src/components/Secao.test.jsx`, teste "FWC usa disposição álbum"
      (`describe("disposição álbum")`)
- [x] Páginas do FWC com casas de 70×70px, 6px de espaçamento e moldura de
      1px em `--border`, recuo 6px e raio 8px; seleções e Coca-Cola sem
      moldura — `src/components/PaginaDoAlbum.css` (classe
      `.pagina-album--fwc`) e `src/components/PaginaDoAlbum.test.jsx`,
      testes "página do FWC com a classe de moldura e trilhas de 70px" e
      "seleção sem moldura" (`describe("FWC (comMoldura)…")`)
- [x] Cartão paisagem do FWC numa casa de uma trilha; BRA13 ainda em duas
      trilhas — `PaginaDoAlbum.test.jsx`, teste "FWC01 paisagem numa casa
      de uma trilha" (`gridColumn: '3 / span 1'`); `catalogo.test.js`,
      teste "layout de seleção: 13 em paisagem nas trilhas 3–4 da linha
      1, página 2" (`trilhas: 2`, já existente e verde)
- [x] Casas vazias sem elemento no DOM (teste: 20 células no FWC) —
      `Secao.test.jsx`, teste "FWC usa disposição álbum"
      (`.pagina-album__celula` com `toHaveLength(20)`)
- [x] `docs/interface.md` sem "lista contínua mesmo nesta disposição", com
      a subseção, o wireframe e as medidas do FWC, citando o IDR 0023 —
      busca (`grep -n "lista contínua mesmo nesta disposição"
      docs/interface.md`, sem resultado); subseções "Extras FIFA — oito
      páginas em quatro pares" (§ Disposição) e "Grupo na disposição
      álbum — Extras FIFA" (§ Wireframe); bullet do FWC em § Medidas —
      todas citando `IDR 0023`
- [ ] Verificação visual em `npm run dev` (disposição álbum, seção FWC) —
      pendente: sem `.env.local` (`VITE_FIREBASE_*`) neste ambiente, o
      login é a guarda do app e a tela do catálogo não é alcançável (mesma
      limitação registrada na Tarefa 0023-0001). Roteiro para quando
      houver ambiente com login:
      1. `npm run dev`, autenticar, disposição álbum, rolar até a seção
         "Extras FIFA" (abre o catálogo).
      2. Acima de 583px de largura: conferir os pares 0|1 e 106|107 lado
         a lado (~492px cada, com a moldura) e o par 2|3 lado a lado
         (~340px); 20px entre os quatro pares.
      3. Abaixo de 583px: os oito paineis empilham, um por linha; a página
         0 mostra 3 linhas vazias abaixo de FWC00 e a página 108 mostra a
         linha 1 vazia acima de FWC14.
      4. FWC00 centralizada na linha 1 da página 0; FWC01–03 em paisagem e
         FWC04 em retrato na coluna 3 da página 1 (linhas 1–4); FWC16 e
         FWC17 na linha 1 da página 109.
      5. Moldura (contorno fino, cantos arredondados) visível nas oito
         páginas do FWC e ausente nas páginas de BRA e COC.
      6. Alternador de filtro de status oculto com a seção FWC em
         disposição álbum.
      7. Cabeçalho da seção lê "Extras FIFA FWC 0 · …".

## Arquivos alterados
- `src/data/catalogoLayout.js` — `layoutFWC()` com as 8 páginas e 20
  posições do IDR 0023 (`trilhas: 1`); `layoutDeSecao` devolve o layout
  do FWC em vez de `null`; comentários de cabeçalho e de campo
  atualizados
- `src/data/catalogo.test.js` — troca "FWC devolve null" por três testes
  do layout do FWC; novo teste de `paresDePaginas` do FWC (4 pares);
  corrige "cada seção com layout" para `secao.inicio ?? 1`
- `src/components/PaginaDoAlbum.jsx` — nova prop `comMoldura` (largura da
  trilha 70/60px, classe `pagina-album--fwc`); `isPaisagem` passa a vir
  de `figurinha.paisagem`
- `src/components/PaginaDoAlbum.css` — nova classe `.pagina-album--fwc`
  (borda, raio, padding da moldura)
- `src/components/PaginaDoAlbum.test.jsx` — fixture `figurinhasBrasil`
  ganha `paisagem`; novo `describe` com os três testes do FWC (moldura,
  paisagem numa trilha, seleção sem moldura)
- `src/components/Secao.jsx` — `CorpoAlbum` recebe `secao` e calcula
  `comMoldura`; comentário sobre "FWC sempre em lista" atualizado
- `src/components/Secao.test.jsx` — troca "FWC sempre usa lista
  contínua…" por "FWC usa disposição álbum" (álbum e volta para lista);
  fixture `figurinhasFwc` ganha `posicao` e `paisagem`
- `src/components/Figurinha.test.jsx` — fixture da 13 ganha
  `paisagem: true` (desvio, ver acima)
- `docs/interface.md` — § Disposição "Como no álbum" (bullet e nova
  subseção "Extras FIFA — oito páginas em quatro pares"); § Wireframe
  (nova subseção "Grupo na disposição álbum — Extras FIFA"); §
  Apresentação por faixa de tela ("Álbum (todas as seções)" e larguras);
  § Medidas (bullet do FWC no álbum)
- `docs/plano/0023-extras-fifa-na-disposicao-album/0003-fwc-na-disposicao-album.md` — status
- `docs/plano/README.md` — status da tarefa 0023-0003
- `docs/plano/0023-extras-fifa-na-disposicao-album/logs/0003-log-fwc-na-disposicao-album.md` — este log (criado)
