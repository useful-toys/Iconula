<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0010-0002: desempenho das 994 figurinhas

## Data
2026-09-12

## Resumo

Medida a linha de base do catálogo inteiro (994 figurinhas, 50 seções, 12
super-grupos) antes de qualquer mudança, e resolvido o ponto em aberto
"Virtualização das listas" de `docs/arquitetura.md` seguindo a ordem do mais
barato ao mais caro definida pela própria tarefa:

1. **Memoização** de `Figurinha`, `Secao` e `SuperGrupo` (`React.memo` com
   comparadores customizados), mais as identidades estáveis
   (`useCallback`/`useMemo`/`useState` preguiçoso) em `App.jsx` e
   `Catalogo.jsx` necessárias para os comparadores funcionarem. **Sozinha,
   já resolveu** o critério "ajustar uma contagem não rerrenderiza o
   catálogo inteiro": a contagem real de invocações por ajuste caiu de até
   994 `Figurinha` + 50 `Secao` + 12 `SuperGrupo` para exatamente 1 + 1 + (0
   ou 1).
2. **`content-visibility: auto` por seção** (`Secao.css` + token novo em
   `theme.css`), para adiar layout/pintura de seções fora da tela sem criar
   nenhum contêiner com rolagem própria (IDR 0008).
3. **Biblioteca de virtualização — não adotada.** As duas técnicas acima já
   bastaram; nenhuma dependência nova entrou, então não há ADR de
   dependência a registrar.

Decisão completa, com a medição, os comparadores e as alternativas
consideradas, registrada em
[TDR 0021](../../../tdr/0021-desempenho-do-catalogo.md).

## Medição — linha de base (antes de qualquer mudança)

Sem acesso a um dispositivo físico "mais fraco" nem a uma sessão Google
autenticada automatizável neste ambiente (o catálogo só existe atrás do
login — `requisitos.md` § Acesso; abrir o popup real do Google exigiria
credenciais reais, fora do que este agente pode fazer), a medição foi feita
com **Vitest + React Testing Library em jsdom** — o mesmo ambiente já usado
pela suíte de testes do projeto —, montando `<Catalogo>` com o catálogo real
de 994 figurinhas dentro de um componente de apoio que replica o `useState`
de `contagens` de `App.jsx` (mesmo padrão de `Catalogo.test.jsx`, só que com
o catálogo inteiro em vez de uma fatia). O arquivo de medição foi temporário
(`src/_bench.temp.test.jsx`), apagado antes desta validação final e do
commit — não faz parte do código entregue.

jsdom não faz layout nem pintura reais: os números medem o custo de
reconciliação/DOM do React (proxy do trabalho de thread principal), não o
tempo de tela de um aparelho real. **Impedimento nível 2**: premissa mais
conservadora assumida e declarada aqui — a comparação antes/depois continua
válida porque usa exatamente a mesma técnica de medição nos dois lados.

Cada medida é a mediana de 10 amostras (ajuste) ou 3 amostras (primeira
renderização); as demais, amostra única por rodada, repetidas em 2–3
rodadas para checar estabilidade (variação de ruído do jsdom entre 10–40%,
inerente ao ambiente compartilhado da máquina de execução).

| Métrica | Antes (linha de base) |
|---|---:|
| Primeira renderização (994 figurinhas), 3 amostras | 440–715 ms (mediana ~560–715 ms) |
| **Ajuste de 1 contagem**, mediana de 10 cliques | **~68 ms** |
| Trocar ordenação (página → sigla) | ~554–586 ms |
| Trocar disposição (lista → álbum) | ~466–478 ms |
| Trocar filtro (todas → faltantes) | ~174–181 ms |
| Colapsar 1 seção | ~58–65 ms |
| Expandir 1 seção | ~61–73 ms |

Amostra bruta de uma rodada (ajuste de contagem, ms):
`354.1, 163.6, 81.6, 67.4, 65.1, 69.6, 64.3, 62.7, 69.1, 60.5` — os dois
primeiros cliques carregam custo de "aquecimento" do jsdom/V8; a partir do
terceiro clique o custo estabiliza em ~60–70 ms por ajuste, apesar de cada
ajuste tocar uma única figurinha entre 994.

## Medição — depois da memoização + `content-visibility`

| Métrica | Antes | Depois | Variação |
|---|---:|---:|---:|
| Primeira renderização (994 figurinhas) | ~560–715 ms | ~560–665 ms | sem mudança esperada — ver nota |
| **Ajuste de 1 contagem** | **~68 ms** | **~6 ms** | **~11× mais rápido** |
| Trocar ordenação | ~554–586 ms | ~590–710 ms | sem mudança esperada — ver nota |
| Trocar disposição | ~466–478 ms | ~500–590 ms | sem mudança esperada — ver nota |
| Trocar filtro | ~174–181 ms | ~95–120 ms | ~1,7× mais rápido |
| Colapsar 1 seção | ~58–65 ms | ~3–9 ms | mais rápido, efeito colateral (não era alvo desta tarefa) |
| Expandir 1 seção | ~61–73 ms | ~5–16 ms | idem |

Nota sobre "sem mudança esperada": primeira renderização, trocar ordenação
e trocar disposição envolvem legitimamente recriar toda a árvore (o
catálogo muda de estrutura ou aparece pela primeira vez) — a memoização não
reduz esse custo, só evita re-trabalho *desnecessário*. As pequenas
variações entre as rodadas (ex.: 586 ms → 710 ms) são ruído do jsdom
(carga da máquina), não regressão — confirmado repetindo a medição.

### Contagem real de invocações por ajuste (determinística, sem ruído de tempo)

Mais convincente que o tempo de parede: instrumentado temporariamente
`Figurinha.type`, `Secao.type` e `SuperGrupo.type.render` (o corpo real por
trás de cada `memo(...)`) para contar quantas vezes cada um é de fato
chamado. 10 cliques em cartões diferentes, espalhados pelo catálogo:

```
Antes  (sem memo, por inspeção do código — nenhum React.memo existia):
  qualquer ajuste reexecuta as 994 Figurinha + 50 Secao + 12 SuperGrupo

Depois (instrumentado):
  Figurinha:  10 chamadas   (1 por clique — só o cartão tocado)
  Secao:      10 chamadas   (1 por clique — só a seção do cartão tocado)
  SuperGrupo:  9 chamadas   (1 por clique, exceto quando o cartão é de
                             FWC/COC, que ficam fora de super-grupo —
                             explica por que não são 10)
```

Este número confirma o critério de aceite "ajustar uma contagem não
rerrenderiza o catálogo inteiro" de forma direta, sem depender da
variabilidade de tempo do jsdom.

**Achado durante a implementação**, registrado também no TDR: um primeiro
teste desta contagem revelou `SuperGrupo: 120` (12 por clique, todos os
super-grupos, não só o afetado) — a causa foi um `ref` inline recriado a
cada render de `Catalogo` passado a `SuperGrupo`
(`memo(forwardRef(...))`), e o React só pula a re-renderização de um
`memo(forwardRef(...))` se, além das props, o próprio `ref` também for o
mesmo objeto entre renders. Corrigido estabilizando também o `ref` (mapa
montado uma única vez, já que os 12 grupos A–L são fixos).

## Decisões tomadas

- **TDR 0021** — memoização de cartão/seção/super-grupo + `content-visibility`
  por seção, sem biblioteca de virtualização — decisão completa,
  medição, comparadores e alternativas em
  `docs/tdr/0021-desempenho-do-catalogo.md`.

## Impedimentos

1. **Nível 2** (premissa conservadora documentada): medição feita em jsdom
   via Vitest/RTL, não num navegador real num aparelho físico mais fraco —
   o catálogo só existe atrás do login do Firebase Auth
   (`requisitos.md` § Acesso), e abrir o popup real do Google exigiria
   credenciais reais, ação vedada a este agente. A comparação antes/depois
   permanece válida por usar a mesma técnica nos dois lados; documentado
   também no TDR 0021.
2. **Nível 2**: o benefício real de `content-visibility: auto` (adiar
   layout/pintura de seções fora da tela) não pôde ser observado num
   navegador real por causa do mesmo bloqueio de login — a adoção segue a
   especificação de CSS Containment (comportamento documentado para
   Ctrl+F, Tab e navegação por âncora) e a resolução já registrada em
   `docs/plano/README.md` § "Onde cada pendência foi alocada", não uma
   observação direta nesta tarefa. Sinalizado como gatilho de revisão no
   TDR 0021 caso o uso real revele problema.
3. **Nível 1** (decidido e registrado): `App.jsx` e
   `src/components/SuperGrupo.jsx` precisaram ser modificados além da lista
   de "Arquivos impactados" da tarefa — inevitável para que a memoização
   funcionasse com a ordenação padrão (`pagina`, que passa 46 das 50 seções
   por dentro de `SuperGrupo`) e com o callback de ajuste estabilizado.
   Mesmo precedente já aberto pela Tarefa 0010-0001 (lista deliberadamente
   aberta, `src/components/*.jsx`).
4. **Nível 1** (decidido e registrado): dois comparadores customizados de
   `memo` acessam `.current` de um `ref` dentro de um mapa montado uma
   única vez para estabilizar o `ref` de cada `SuperGrupo` — padrão
   oficialmente documentado do React para gerenciar uma coleção de refs
   (o `.current` só é tocado quando o próprio React invoca o callback de
   ref depois do commit, nunca durante esta renderização), mas o `oxlint`
   não distingue esse caso do acesso perigoso de verdade e sinaliza um
   aviso `react(refs)`. `npm run lint` continua saindo com código 0 (é
   aviso, não erro). Aceito e documentado em vez de suprimido inline, por
   não haver precedente de supressão (`eslint-disable`/`oxlint-disable`)
   no repositório.

## Verificações do escopo (passos 3 e 4 da tarefa)

- **Salto para seção com conteúdo fora da tela** (Tarefa 0003-0004):
  coberto pelo teste existente `Catalogo.test.jsx` (`saltarPara`), que
  continua passando com os componentes memoizados — a expansão de
  super-grupo/seção e a rolagem programática não dependem de bail-out do
  `memo` (chamadas diretas via `ref`/`useImperativeHandle`, sempre
  executadas). Verificação visual num navegador real não foi possível
  nesta tarefa pelo mesmo bloqueio de login do Impedimento 1.
- **Busca do navegador (Ctrl+F) e leitores de tela**: nenhuma mudança de
  marcação, `aria-*` ou texto — só memoização (comportamento idêntico) e
  uma dica de CSS (`content-visibility`) cujo comportamento para
  find-in-page/Tab/âncora é definido pela própria especificação de CSS
  Containment (ver TDR 0021). Não verificado ao vivo pelo mesmo motivo.

## Validação

```
npm run lint && npm run test && npm run build
```

- `oxlint`: 1 aviso (`react(refs)`, ver Impedimento 4) — sem erros, código
  de saída 0.
- `vitest run`: 35 arquivos de teste, 359 testes, todos passando (incluindo
  `SuperGrupo.test.jsx`, ajustado para a prop nova `getToggleHandler` no
  lugar de `onToggleSecao`).
- `vite build`: build de produção concluído em ~770 ms (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Saída resumida:

```
> oxlint
src/App.jsx: sem avisos
src/components/Catalogo.jsx:195:44: warning react(refs): Cannot access refs during render
(2 arquivos, 1 aviso aceito — ver Impedimento 4)

> vitest run
 Test Files  35 passed (35)
      Tests  359 passed (359)

> vite build
✓ 130 modules transformed.
✓ built in 769ms
```

Verificação visual em `npm run dev` com painel de performance do navegador:
**não realizada** — o catálogo fica atrás do login do Firebase Auth, e este
agente não pode completar um login real do Google (exigiria credenciais).
Documentado como Impedimento nível 2 acima; a validação funcional e de
desempenho desta tarefa apoiou-se na suíte automatizada (359 testes) e na
medição instrumentada em jsdom.

## Critérios de aceite

- [x] Existe linha de base medida antes da mudança, no log
- [x] A técnica adotada é a mais barata que resolveu, na ordem definida
      (memoização resolveu sozinha o critério de ajuste; `content-visibility`
      cobre o caso de renderização inicial/rolagem; virtualização não
      necessária)
- [x] Nenhum contêiner com rolagem própria foi introduzido
      (`content-visibility: auto` é só uma dica de renderização)
- [x] O salto para seção continua funcionando com conteúdo fora da tela
      (teste automatizado `Catalogo.test.jsx`; verificação visual num
      navegador real não realizada — ver Impedimento 1)
- [x] Ajustar uma contagem não rerrenderiza o catálogo inteiro
      (confirmado por contagem determinística de invocações: 1 Figurinha +
      1 Secao + no máximo 1 SuperGrupo por ajuste, ver acima)
- [x] A medição depois da mudança está no log, comparável com a linha de base
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (TDR 0021)
- [x] Este log gerado

## Arquivos alterados

- `src/App.jsx` — `handleAjustar`/`aplicarAjuste` estabilizados
  (`useCallback`); leitura da contagem anterior via ref sincronizado por
  `useEffect`
- `src/components/Catalogo.jsx` — `estruturada` e `figurinhasPorGrupo`
  memoizados; mapas de callback de toggle e de `ref` de `SuperGrupo`
  montados uma única vez
- `src/components/Secao.jsx` — `Secao` memoizado com comparador customizado
- `src/components/Secao.css` — `content-visibility`/`contain-intrinsic-size`
  em `.secao`
- `src/components/SuperGrupo.jsx` — `SuperGrupo` memoizado com comparador
  customizado; prop `onToggleSecao` renomeada para `getToggleHandler`
- `src/components/SuperGrupo.test.jsx` — ajustado para a prop nova
- `src/components/Figurinha.jsx` — `Figurinha` memoizado com comparador
  customizado
- `src/theme.css` — token `--secao-altura-estimada`
- `docs/tdr/0021-desempenho-do-catalogo.md` — criado
- `docs/arquitetura.md` — ponto em aberto "Virtualização das listas"
  removido; linha nova na tabela "Decisões-chave e onde vivem"
- `docs/plano/0010-acabamento-acessibilidade-e-docs/0002-desempenho-das-994-figurinhas.md` —
  status atualizado
- `docs/plano/README.md` — status da tarefa 0002 da Fase 10 atualizado
- `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0002-log-desempenho-das-994-figurinhas.md` —
  este log
