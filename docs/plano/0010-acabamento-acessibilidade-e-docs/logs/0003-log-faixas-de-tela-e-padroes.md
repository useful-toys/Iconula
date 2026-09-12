<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0010-0003: faixas de tela e padrões de primeira abertura

## Data
2026-09-12

## Resumo
Fechada a última pendência de `docs/interface.md` § Pendências de interface:
qual ordenação e disposição vêm pré-selecionadas na primeira abertura, em
cada faixa de tela (celular, tablet, navegador). Registrado como
[IDR 0043](../../../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md).

Celular e tablet abrem por página do álbum + disposição álbum (aparelho
portátil, comparação com a página física); navegador abre por sigla + lista
(janela larga, visão geral). O filtro permanece sempre "todas". A faixa só
decide o ponto de partida da primeira abertura — lida uma única vez, com
`window.innerWidth`, na mesma inicialização preguiçosa do `useState` que já
lia as preferências guardadas (IDR 0026); redimensionar a janela depois não
recalcula nada, porque não existe listener de `resize`.

Havendo qualquer preferência já guardada no `localStorage` — mesmo uma
gravação com um campo corrompido —, a faixa deixa de importar por completo:
o objeto existente prova que não é mais a primeira abertura.

### Sobre o encaminhamento da tarefa (achado da leitura)
O encaminhamento sugeria reaproveitar "os mesmos pontos de quebra que a
disposição álbum já usa". Na prática, `.secao__album` não usa nenhuma media
query — é `flex-wrap: wrap`, fluido, sem breakpoint escrito em pixels em
lugar nenhum do CSS. O ponto de quebra reaproveitado teve que ser
*derivado* das medidas já fixadas em `interface.md` § Medidas: duas páginas
de 226px (4 trilhas de 52px + 3 gaps de 6px) mais 20px de gap somam 472px
de conteúdo; resolvendo contra a margem lateral mínima do app
(`--page-gutter`), o spread deixa de caber lado a lado por volta de 513px
de largura de janela — arredondado para 512px como limite celular/tablet.
Não existe um segundo ponto de quebra equivalente no app para separar
tablet de navegador (o spread só quebra uma vez); esse segundo limite
(1024px) é uma escolha livre por convenção de mercado, sem precedente
próprio para reaproveitar — documentado como tal no IDR 0043, tratado como
impedimento de nível 1 (ambiguidade menor, reversível, interna).

## Decisões tomadas
- **Par (ordenação, disposição) e limites de faixa**: registrados no
  [IDR 0043](../../../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md),
  com o cálculo completo do limite celular/tablet e o raciocínio de por que
  tablet segue o celular (aparelho portátil), não o navegador.
- **Tablet agrupado com celular, não com navegador**: decisão sem apoio
  textual direto em `requisitos.md`/`interface.md` (que só descrevem os dois
  polos, celular e "janela larga") — ver IDR 0043 § Alternativas
  consideradas. Reversível sem migração: não depende de nenhuma preferência
  já gravada.
- **TDR 0015 substituído**: seu status foi atualizado para apontar para o
  IDR 0043, resolvendo a nota de provisoriedade do log da Tarefa 0003-0001
  (o próprio log histórico não foi reescrito — só o TDR que ele referencia).

## Impedimentos
Nível 1 (ambiguidade menor, reversível, interna): o encaminhamento da
tarefa presumia um breakpoint já existente na disposição álbum, que na
verdade é fluido (sem media query). Resolvido derivando o limite
celular/tablet das medidas já fixadas em `interface.md`, e documentando o
cálculo no IDR 0043 — ver seção acima.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 erros; 1 aviso pré-existente e não relacionado
  (`Catalogo.jsx:195`, acesso a ref durante a renderização — já presente
  antes desta tarefa, arquivo não tocado aqui).
- `vitest run`: 35 arquivos de teste, 370 testes, todos passando (13 novos:
  4 de `faixaDaLargura`, 3 de "sem preferência guardada, cada faixa" e 6
  reescritos/ampliados em `preferenciasDeVista.test.js`; 5 novos em
  `App.test.jsx` cobrindo faixa por faixa, preferência guardada vencendo a
  faixa e redimensionar não alterando a sessão corrente).
- `vite build`: build de produção concluído com sucesso (408.59 kB JS
  principal, aviso pré-existente sobre chunk grande, não relacionado a esta
  tarefa).

Verificação visual manual (`npm run dev` em larguras de celular/tablet/
desktop) não foi executada nesta sessão: o app exige login Google real
antes de mostrar o catálogo (guarda de login, Tarefa 0008-0001), fluxo
interativo que este ambiente de execução não consegue automatizar. O
mesmo roteiro — limpar preferência, abrir em cada largura, escolher outro
par, recarregar — está coberto ponta a ponta pelos testes de integração
novos em `App.test.jsx` (que mockam a autenticação e renderizam a árvore
completa, incluindo `Controles`), exercitando exatamente os três pares por
faixa, a preferência guardada vencendo a faixa e o redimensionamento sem
efeito na sessão corrente.

## Arquivos alterados
- `src/lib/preferenciasDeVista.js` — modificar (padrões por faixa de tela,
  IDR 0043; exporta `faixaDaLargura`)
- `src/lib/preferenciasDeVista.test.js` — modificar (testes de faixa e dos
  casos "sem preferência guardada" reclassificados)
- `src/App.jsx` — modificar (`lerPreferenciasDeVista(window.innerWidth)`)
- `src/App.test.jsx` — modificar (largura de navegador no `beforeEach` para
  não quebrar os testes existentes; novo describe de faixa de tela)
- `docs/interface.md` — modificar (§ Apresentação por faixa de tela
  preenchida; item resolvido removido de § Pendências de interface)
- `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md` — criar
- `docs/tdr/0015-ordenacao-padrao-provisoria-ordem-do-album.md` — modificar
  (status: substituído pelo IDR 0043)
- `docs/plano/0010-acabamento-acessibilidade-e-docs/0003-faixas-de-tela-e-padroes.md` — status atualizado
- `docs/plano/README.md` — status da Tarefa 0003 da Fase 10 atualizado
- `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0003-log-faixas-de-tela-e-padroes.md` — este log
