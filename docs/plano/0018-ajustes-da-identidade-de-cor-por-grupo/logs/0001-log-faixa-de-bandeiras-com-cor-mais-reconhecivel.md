<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0018-0001: faixa de bandeiras com cor mais reconhecível

## Data
2026-09-13

## Resumo
Antes: na ordenação por página cada bandeira da faixa do cabeçalho tingia o
fundo com 20% da cor do grupo misturada a `--panel`, sem barra inferior; o
hover era `--border` em todas as bandeiras. Depois: o fundo colorido sobe para
60% da cor, uma barra inferior `::after` de 2px a 80% da cor marca cada
bandeira colorida e o hover intensifica o fundo para 80% da cor. Na ordenação
por sigla nada muda: sem classe de cor, o fundo segue `--panel` (60% de
`--panel` sobre `--panel`), sem barra, e o hover continua `--border`.

Arquivos e papéis: `src/components/FaixaDeSecoes.css` troca o percentual do
fundo para 60%, acrescenta a barra `::after` e o hover colorido a 80%;
`docs/interface.md` § Medidas atualiza a linha "Faixa de bandeiras" citando o
IDR 0045. Nenhum arquivo de código JS nem teste mudou: a classe de cor por
bandeira (Tarefa 0015-0003) continua sendo o gatilho, e o comportamento de CSS
é verificado por leitura e busca, como nas tarefas de estilo anteriores.

Nenhuma divergência entre tarefa, documentação e código. Nota: a linha 90 do
`docs/idr/0046-cores-de-selecoes.md` § Hierarquia de cores ainda cita "cor do
super-grupo com 20%" para a faixa; é divergência antiga fora do escopo desta
tarefa (o IDR 0046 não está em "Arquivos impactados" e sua hierarquia será
revisitada na Fase 16), então vai para `observacoes` do relatório.

## Discovery
- Código: `FaixaDeSecoes.jsx` é função sem estado; monta 50 botões a partir da
  prop `secoes`. Só na ordenação por página soma `faixa-de-secoes__botao--grupo-<chave>`
  (`--grupo-a`…`--grupo-l`, e `--grupo-fwc`/`--grupo-coc` para os especiais),
  que define `--group-color` (`FaixaDeSecoes.jsx:33-37`). O
  `.faixa-de-secoes__botao` já é `position: relative`, com
  `background: color-mix(in oklch, var(--group-color, var(--panel)) 20%, var(--panel))`,
  `border-radius: 8px`, `:hover { background: var(--border) }`,
  `:focus-visible` e um `::before` de área de toque em `pointer: coarse`
  (`FaixaDeSecoes.css:26-131`). O `::before` é a área de toque (IDR 0042), por
  isso a barra nova usa `::after`. `color-mix(in oklch, …)` já é técnica da
  casa (`SuperGrupo.css:21`). Testes de `FaixaDeSecoes.test.jsx` só verificam
  presença/ausência da classe de cor e do início de grupo (Testing Library),
  não valores de CSS; o teste "na ordenação por sigla, nenhuma bandeira recebe
  classe de cor de grupo" segue sendo a garantia de que a barra (presumida só
  com classe) não aparece por sigla. `Cabecalho.test.jsx` e demais consumidores
  não dependem do fundo. Comportamento atual confere com a tarefa: 20% sem
  barra na ordenação por página.
- Documentação: as referências bastaram para a faixa. Confirmei o
  IDR 0045 § Decisão (faixa: 60% + barra de 2px a 80%, hover a 80%, só na
  ordenação por página; por sigla neutra `--panel` e hover `--border`) e
  § Histórico (revisão de 2026-09-13 que motivou a Fase 0018). Confirmei os
  tokens `--panel`, `--border` e `--group-*` em `theme.css` e a linha atual
  "Faixa de bandeiras" em `docs/interface.md:613-620`. Consultei o IDR 0042
  § área de toque para não mexer no `::before` e o IDR 0046 § Hierarquia de
  cores (nota de divergência acima).

## Plano da alteração
1. `src/components/FaixaDeSecoes.css` — no fundo do `.faixa-de-secoes__botao`,
   trocar 20% por 60% (o fallback `var(--group-color, var(--panel))` mantém a
   faixa neutra na ordenação por sigla).
2. `src/components/FaixaDeSecoes.css` — barra inferior via `::after` (o
   `::before` é a área de toque, IDR 0042): o `::after` cobre o botão com o
   mesmo raio de 8px (`border-radius: inherit`) e `pointer-events: none`, e só
   os últimos 2px recebem a cor com um `linear-gradient(to top, color-mix(in
   oklch, var(--group-color) 80%, var(--panel)) 2px, transparent 2px)`,
   aplicado só às bandeiras com classe de cor (por página) por lista `:is()`.
3. `src/components/FaixaDeSecoes.css` — hover das bandeiras com cor para
   `color-mix(in oklch, var(--group-color) 80%, var(--panel))`, depois da regra
   base `.faixa-de-secoes__botao:hover` (mesma especificidade; a ordem faz o
   hover colorido vencer). O hover por sigla segue `--border`.
4. `docs/interface.md` § Medidas — a linha "Faixa de bandeiras" passa a
   descrever 60% de fundo, barra inferior de 2px a 80% e hover a 80% na
   ordenação por página, neutro sem barra por sigla, citando o IDR 0045.
5. Nenhum registro novo: a decisão é o IDR 0045, já revisado no planejamento;
   a tarefa só a implementa. Nenhum teste novo: não há código JS alterado e os
   testes existentes de classe cobrem o gatilho; valores de CSS são verificados
   por leitura e busca.
- Verificação prevista: fundo 60% e barra 80% → leitura/`grep` em
  `FaixaDeSecoes.css`; hover colorido a 80% e hover base `--border` → `grep` do
  trecho; por sigla sem classe/barra → teste existente de ausência de classe;
  doc → leitura do trecho; validação → lint/test/build.
- Riscos: a barra `::after` não pode deslocar o layout nem sobrepor a vizinha —
  `position: absolute` dentro do botão resolve; `:is()` é forgiving e não
  invalida a lista se um seletor falhar; hover colorido com especificidade
  igual exige vir depois da regra base.
- Desvios: a barra não usa `::after` de 2px de altura com cantos próprios como
  o pseudocódigo da tarefa sugeria: um `border-radius` em caixa de 2px de
  altura é achatado pelo navegador (o raio usado cai para ~1px) e, como o
  `border-radius` do pai não recorta pseudo-elementos, os cantos da barra
  apareceriam fora da curva de 8px do botão. O `::after` passou a cobrir o
  botão com `border-radius: inherit` e um gradiente de 2px no rodapé, que
  acompanha exatamente o raio. Efeito visual idêntico ao pedido (barra de 2px
  a 80%, seguindo os cantos), sem o defeito; nada estrutural muda.

## Decisões tomadas
- Nenhuma decisão significativa nova. A fórmula (60% de fundo, barra de 2px a
  80%, hover a 80%, só por página) vem do IDR 0045. A escolha de implementação
  — barra no `::after` e lista `:is()` das 14 classes de cor para a barra e o
  hover (nível 1, interna ao CSS, reversível) — não contraria registro vigente;
  sem registro próprio, como permite o guia. O `::after` com gradiente no
  lugar da caixa de 2px de altura também é nível 1 (contorno de limitação do
  `border-radius` com pseudo-elemento), registrado no "Desvios".

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 49ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  416 passed (416)
   Duration  55.41s
```
Nenhum teste novo (não houve mudança de JS); os 416 incluem os testes de
classe de cor de `FaixaDeSecoes.test.jsx` (por página e ausência por sigla).
Os avisos `act(...)` de `Avisos` são pré-existentes e alheios a esta tarefa.

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-DAo0N7j7.css                     19.66 kB │ gzip:   4.35 kB
dist/assets/index-DsS4l8uf.js                     412.02 kB │ gzip: 124.32 kB
dist/assets/index.esm-CE9cRLy5.js                 505.90 kB │ gzip: 148.77 kB
✓ built in 667ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm`, 505.90 kB), sem relação
com esta tarefa.

### Busca
```
$ Select-String src/components/FaixaDeSecoes.css -Pattern "60%|80%|linear-gradient|--border"
34:  background: color-mix(in oklch, var(--group-color, var(--panel)) 60%, var(--panel));
132: background: linear-gradient(
134:   color-mix(in oklch, var(--group-color) 80%, var(--panel)) 2px,
161: background: var(--border);          # hover base (sigla)
183: background: color-mix(in oklch, var(--group-color) 80%, var(--panel));  # hover colorido
$ Select-String docs/interface.md -Pattern "Faixa de bandeiras: ícones"
-# 613: linha passa a citar 60% de fundo, barra de 2px a 80%, hover a 80% (IDR 0045)
```

### Verificação visual — pendente
Sem navegador/sessão autenticada neste ambiente (o catálogo só existe atrás do
login Google, `requisitos.md` § Acesso), como nos logs das tarefas anteriores.
Roteiro em `npm run dev`: com a ordenação por página, conferir as 50 bandeiras
com fundo a 60% da cor do grupo (FWC em dourado, COC em vermelho no fim) e a
barra inferior de 2px a 80% seguindo os cantos arredondados; passar o mouse e
conferir o fundo intensificando a 80%; alternar para a ordenação por sigla e
conferir a faixa neutra, sem barra, com hover cinza; tocar numa bandeira e
conferir o salto.

## Critérios de aceite
- [x] Na ordenação por página, cada bandeira com fundo
      `color-mix(... 60% ...)` e `::after` de 2px com `color-mix(... 80% ...)`
      — fundo `FaixaDeSecoes.css:34`; barra `FaixaDeSecoes.css:124-141`, com
      `linear-gradient` de 2px e `color-mix(... 80% ...)` (`:132-135`); o
      teste "na ordenação por página, cada bandeira recebe a classe de cor do
      seu grupo" cobre as 50 (incluindo FWC e COC)
- [x] Na ordenação por sigla, nenhuma bandeira com classe de cor nem barra —
      o teste "na ordenação por sigla, nenhuma bandeira recebe classe de cor
      de grupo" passa; a barra só existe sob as classes `--grupo-*`, logo não
      aparece sem elas; o fundo por sigla cai no fallback `--panel`
      (`FaixaDeSecoes.css:34`)
- [x] Hover com cor intensifica a 80%; hover sem cor continua `--border` —
      hover colorido `FaixaDeSecoes.css:163-184` (`color-mix(... 80% ...)`)
      depois da regra base `:hover { background: var(--border) }`
      (`:160-162`), que segue valendo para a ordenação por sigla
- [x] `docs/interface.md` § Medidas descreve a faixa citando o IDR 0045 —
      linha "Faixa de bandeiras" (`interface.md:613-620`) passa a citar fundo
      a 60%, barra de 2px a 80%, hover a 80% por página, neutro sem barra por
      sigla, com `(IDR 0045)`

## Arquivos alterados
- `src/components/FaixaDeSecoes.css` — fundo a 60%; `::after` de 2px a 80% com
  `border-radius: inherit` e gradiente; hover colorido a 80%
- `docs/interface.md` — § Medidas, linha "Faixa de bandeiras"
- `docs/plano/0018-ajustes-da-identidade-de-cor-por-grupo/0001-faixa-de-bandeiras-com-cor-mais-reconhecivel.md`
  — status `Pendente` → `Concluída`
- `docs/plano/README.md` — fase 18 `Pendente` → `Em andamento`; tarefa 0001
  `Pendente` → `Concluída`
- `docs/plano/0018-ajustes-da-identidade-de-cor-por-grupo/logs/0001-log-faixa-de-bandeiras-com-cor-mais-reconhecivel.md`
  — este log (criado)
