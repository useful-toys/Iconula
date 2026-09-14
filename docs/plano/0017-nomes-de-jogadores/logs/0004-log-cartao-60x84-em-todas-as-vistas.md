<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0017-0004: cartão de 60×84px em todas as vistas

## Data
2026-09-14

## Resumo
Leva o cartão da figurinha a 60×84px iguais na lista e no álbum, com
tipografia única (sigla 10px sobre número 13px), menos de 18px, selo de
10px e marca de metalizada de 6px, e uma faixa inferior de ~22px livre
para o menos e o selo — o espaço onde o nome entra na Tarefa 0017-0005.
Antes: 52×66px na lista e 52×52px no álbum, com tipografia e marca um
ponto menores no álbum. O álbum acompanha com trilhas de 60px e linhas de
84px, o limite celular/tablet sobe de 512px para 582px (recalculado a
partir do novo spread de 536px) e a altura estimada de seção do
`content-visibility` é recalibrada de 360px para 460px.

`docs/interface.md` reflete as novas medidas e o novo limite, citando os
IDRs 0047, 0015, 0042 e 0043. Além dos arquivos previstos, `docs/modelo-memoria.md`
e o `MDR 0007` foram sincronizados com o novo limite (512→582), que
estava restated nos dois — sem isso, ficariam contradizendo o IDR 0043 já
atualizado no planejamento.

## Discovery
- Código: `Figurinha.css` concentra as medidas do cartão com overrides da
  variante álbum (tipografia, menos, selo, metalizada) e a área de toque
  `pointer: coarse` em duas regras (uma por variante). `PaginaDoAlbum.jsx`
  fixa as colunas do grid em 52px e `PaginaDoAlbum.css` as linhas em 52px;
  `Secao.jsx` monta a lista com a variante `lista` e o álbum com
  `PaginaDoAlbum`. As únicas asserções de medida em testes são
  `gridTemplateColumns` em `PaginaDoAlbum.test.jsx` e `Secao.test.jsx`
  (jsdom não calcula layout, então tamanho de cartão não é aferível por
  teste). `preferenciasDeVista.js` define `LIMITE_CELULAR = 512` com o
  cálculo comentado; `App.test.jsx` só usa larguras 360/800/1280, que
  continuam nas mesmas faixas com o limite novo. `theme.css` guarda
  `--secao-altura-estimada: 360px`, consumido por `.secao`
  (`content-visibility`). Comportamento atual confere com a tarefa.
- Documentação: reli o `IDR 0047` (medidas, composição e tipografia
  única), os Históricos do `IDR 0043` (recálculo para 582px), `IDR 0015`
  (trilhas de 60px) e `IDR 0042` (área de toque), o `TDR 0021` §2 (o que
  o token `--secao-altura-estimada` faz e por que não precisa ser exato) e
  os logs das Tarefas 0012-0002/0012-0003 (precedente de decisão nível 1
  sobre o token). Busquei `512`/`52px` em `docs/` e encontrei o limite
  também em `docs/modelo-memoria.md` e no `MDR 0007`, além do
  `docs/interface.md` — daí a sincronização.

## Plano da alteração
1. `src/components/Figurinha.css` — `.figurinha--lista`/`.figurinha--album`
   com 60×84px; `.figurinha--paisagem` com 126px; `.figurinha__corpo` com
   `padding: 0 0 22px`; sigla/número em regra única (10px/13px); remover
   os overrides de álbum do menos (fica 18px), do selo (10px, raio 8px),
   da metalizada (6px) e da área de toque (uma regra, `inset: -4px`).
2. `src/components/PaginaDoAlbum.jsx` — `gridTemplateColumns` para 60px;
   `PaginaDoAlbum.css` — `grid-template-rows` para 84px.
3. `src/lib/preferenciasDeVista.js` — `LIMITE_CELULAR = 582`, com o
   comentário do cálculo do IDR 0043 (258px/página; spread 536px).
4. `src/theme.css` — `--secao-altura-estimada` de 360px para 460px.
5. Testes — `PaginaDoAlbum.test.jsx` e `Secao.test.jsx` (52px → 60px);
   `preferenciasDeVista.test.js` (512/513 → 582/583).
6. `docs/interface.md` — § Disposição "Como no álbum" (trilhas de 60px),
   § Apresentação por faixa de tela (582/583–1024, spread de 536px),
   § Medidas (cartão único, código único, selo/metalizada/menos sem
   variante), citando 0047/0015/0042/0043.
7. `docs/modelo-memoria.md` e `docs/model-dr/0007` — limite 512→582
   (sincronização do restated do IDR 0043).
8. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critérios de CSS → leitura de `Figurinha.css` e `theme.css`;
  - trilhas/linhas e limite → testes de `PaginaDoAlbum`/`Secao`/
    `preferenciasDeVista`;
  - `docs/interface.md` com os IDRs → leitura da seção;
  - visual → roteiro (sem navegador autenticável no ambiente).
- Riscos: o `padding` inferior de 22px muda a centralização vertical do
  código agora (esperado, é a faixa reservada do IDR 0047); a recalibração
  do token é aproximada por natureza (placeholder; `auto` corrige depois).
  Nenhum risco de layout estrutural (posições explícitas do grid intactas).
- Desvios: `docs/modelo-memoria.md` e o `MDR 0007` não constam em
  "Arquivos impactados", mas restated o limite alterado; mantê-los sem
  sincronizar contradiria o IDR 0043 já atualizado no planejamento.

## Decisões tomadas
- `--secao-altura-estimada` = 460px (nível 1, TDR 0021). Conta: o token
  valia 360px com o cartão de 66px na lista; a altura da seção é dominada
  pelas fileiras de cartões, e o cartão da lista passa a 84px (+18px,
  +27%). Escalando o placeholder pela régua da lista (360 × 84/66 ≈ 458) e
  arredondando → 460px. O álbum cresce mais (+62%), mas o token é único e
  já era uma média grosseira entre as disposições; usar a régua da lista
  evita superestimar a reserva inicial no navegador. O valor é só o
  placeholder antes da primeira medição real (o modificador `auto` do
  `content-visibility` lembra a altura de fato renderizada).
- Faixa inferior reservada com `padding-bottom: 22px` no `.figurinha__corpo`
  (nível 1): é a forma direta de o código (e o nome da Tarefa 0017-0005)
  ficar centralizado no espaço acima da faixa, como o IDR 0047 descreve,
  sem posicionar o código de forma absoluta.
- Variante do cartão mantida só como gancho de classe no CSS (valor único
  nas duas), para não mexer no JSX/`propsEquivalentes` (nível 1).
- Sincronização do limite em `docs/modelo-memoria.md` e no `MDR 0007`
  (nível 1): restated do IDR 0043, que o planejamento já atualizou.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

```
> npm run lint
Found 0 warnings and 0 errors.
Finished in 59ms on 73 files with 105 rules using 4 threads.

> npm run test
 Test Files  37 passed (37)
      Tests  435 passed (435)
(os avisos de act(...) em App.importar/App.copiar/App.gravacao/
App.exportar são pré-existentes, não introduzidos aqui)

> npm run build
✓ 132 modules transformed.
dist/assets/index-FaB8WG40.css                             24.72 kB │ gzip:   5.11 kB
dist/assets/index-jgonXBxj.js                             428.57 kB │ gzip: 132.60 kB
✓ built in 619ms
(o aviso de chunk > 500 kB é pré-existente)
```

`npm run test:rules` não se aplica: `firestore.rules` não foi tocado.

## Critérios de aceite
- [x] Cartão 60×84px nas duas variantes e paisagem 126px (CSS) —
  `src/components/Figurinha.css:17-26` (`.figurinha--lista, .figurinha--album
  { width: 60px; height: 84px }`; `.figurinha--paisagem { width: 126px }`)
- [x] Trilhas de 60px e linhas de 84px no álbum (teste) —
  `src/components/PaginaDoAlbum.jsx:31` (`repeat(${numTrilhas}, 60px)`);
  `src/components/PaginaDoAlbum.css:5` (`repeat(3, 84px)`); asserções de
  `repeat(4, 60px)`/`repeat(3, 60px)` em `PaginaDoAlbum.test.jsx:128,151` e
  `Secao.test.jsx:252,258,317,397`
- [x] `LIMITE_CELULAR` = 582 (teste) — `src/lib/preferenciasDeVista.js:54`;
  `preferenciasDeVista.test.js:25-33` (582 é celular, 583 é tablet)
- [x] Código, menos, selo e metalizada com as medidas únicas (CSS) —
  `Figurinha.css:62-71` (sigla 10px/número 13px em regra única),
  `:96-104` (metalizada 6px), `:107-121` (selo 10px, raio 8px),
  `:124-142` (menos 18px), `:161-170` (área de toque única, `inset: -4px`)
- [x] `--secao-altura-estimada` recalibrado, com a conta no log —
  `src/theme.css:113` (460px); conta em § Decisões tomadas
- [x] `docs/interface.md` atualizado citando os IDRs 0047, 0015 e 0042 —
  § Disposição "Como no álbum" (`docs/interface.md:180`, IDR 0015/0047);
  § Medidas (`:650-666`, IDR 0047 e IDR 0042 no controle de menos);
  § Apresentação por faixa de tela (`:531`, `:539`, IDR 0043)

## Arquivos alterados
- `src/components/Figurinha.css` — cartão 60×84, paisagem 126px,
  tipografia/medidas únicas e faixa inferior de 22px
- `src/components/PaginaDoAlbum.jsx` — colunas do grid em 60px
- `src/components/PaginaDoAlbum.css` — linhas do grid em 84px
- `src/components/PaginaDoAlbum.test.jsx` — asserções de trilha 52→60px
- `src/components/Secao.test.jsx` — asserções de trilha 52→60px
- `src/lib/preferenciasDeVista.js` — `LIMITE_CELULAR` 512→582 e comentário
- `src/lib/preferenciasDeVista.test.js` — faixas 512/513→582/583
- `src/theme.css` — `--secao-altura-estimada` 360→460px
- `docs/interface.md` — trilhas de 60px, limite 582px e medidas do cartão
- `docs/modelo-memoria.md` — limite 512→582
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` — limite
  512→582 e entrada no Histórico
- `docs/plano/0017-nomes-de-jogadores/0004-cartao-60x84-em-todas-as-vistas.md` — status
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0017-nomes-de-jogadores/logs/0004-log-cartao-60x84-em-todas-as-vistas.md` — este log

## Observações
- `docs/interface.md` § Tipografia e `docs/arquitetura.md` ainda citam só a
  Poppins; a § Tipografia é atualizada pela Tarefa 0017-0005 (fora do
  escopo desta), o mesmo valendo para o nome no cartão.
