<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0068: Ordem bandeira, sigla, nome no título de seção de seleção

## Status

Aceito.

## Contexto

- O título da seção mostra hoje "ícone, nome, sigla, número da página"
  (`interface.md` § Corpo, ex.: `Brasil BRA 24`) — implementado em
  `Secao.jsx` (`secao__nome` antes de `secao__sigla`), consequência do
  IDR 0056 (título em linha única).
- O humano pediu inverter nome e sigla nas **seções de seleção**
  (`secao.tipo === "selecao"`, `catalogo.js`): sigla antes do nome —
  quem organiza figurinhas físicas identifica a seção pelo código de três
  letras impresso nela, não pelo nome por extenso, e ter o código logo
  após a bandeira agiliza achar a seção na tela.
- Os especiais (FWC "Extras FIFA", COC "Coca-Cola") não são seleção;
  discutido à parte, o humano decidiu também não mostrar mais a sigla da
  Coca-Cola no título.

## Decisão

- **Seções de seleção**: ordem passa a ser bandeira, sigla, nome, página
  — ex. `🇧🇷 BRA Brasil 24` no lugar de `🇧🇷 Brasil BRA 24`. Só sigla e
  nome trocam de lugar; a página continua por último, antes do separador
  `·` e do resumo.
- **Extras FIFA (FWC)**: sem mudança — continua ícone, nome, sigla,
  página (`🏆 Extras FIFA FWC 1`), porque o código é parte da numeração
  oficial e tem uso real ao organizar as figurinhas dessa seção.
- **Coca-Cola (COC)**: deixa de mostrar a sigla no título — fica ícone,
  nome, página (`🥤 Coca-Cola 112`), sem o código "COC".
- Pesos e cores da identificação (nome 600, resto 400, tudo em
  `--cream`) e a fonte condensada até 582px (IDR 0056) não mudam — só a
  ordem/presença dos elementos.

## Consequências

- `interface.md` § Corpo (linha do cabeçalho de grupo) e § Medidas
  (cabeçalho de seção) passam a descrever a ordem condicional por
  `secao.tipo` e a ausência da sigla na Coca-Cola.
- `Secao.jsx`: a função que monta os spans de identificação
  (`secao__nome`, `secao__sigla`, `secao__pagina` — introduzidos pelo
  IDR 0056) passa a decidir ordem e presença por `secao.tipo`, em vez de
  uma ordem fixa.
- `Secao.test.jsx`: testes que afirmam a ordem/textos do título são
  atualizados para os três casos (seleção, FWC, COC).
- O nome acessível do cabeçalho (`nomeAcessivel` em `Secao.jsx`) não muda
  — já começa pelo nome da seção por extenso, independente da ordem
  visual.
- Implementação: Fase 0034, Tarefa 0034-0001.

## Alternativas consideradas

- **Reordenar também os especiais** (bandeira, sigla, nome nos dois):
  recusada — FWC mantém a ordem atual (o código já é útil ali); só a
  Coca-Cola perde a sigla, por decisão do humano.
- **Página junto da sigla** (bandeira, sigla, página, nome): recusada —
  o humano preferiu manter a página como último elemento da
  identificação, antes do resumo.
