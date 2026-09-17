<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0056: Título de seção em linha única no celular

## Status

Aceito.

## Contexto

- O título da seção (cabeçalho de cada seleção) é
  `▾ [bandeira] Nome SIGLA Página · 12/20 60% ▯8 ×3` e, no celular,
  não cabe numa linha: quebra em duas linhas (`flex-wrap`), como
  documentado em `interface.md` § Corpo.
- O humano pediu o título numa linha no celular **sem remover informação
  nem quebrar**, otimizando o espaço horizontal — e vetou reduzir a fonte
  do nome para menos de 14px.
- Em 360px sobram ~244px para o texto; os nomes mais longos
  (Bósnia-Herzegovina, Estados Unidos, Costa do Marfim, Arábia Saudita,
  África do Sul) a 14px ocupam ~300px — a diferença vem do chevron, dos
  gaps e da largura da Poppins nos números e códigos.
- A Roboto Condensed 500 já está vendorizada
  ([TDR 0013](../tdr/0013-tipografia-vendorizada.md)), usada no nome das
  figurinhas.

## Decisão

- Remover o chevron `▾`/`▸` do título da seção — **só nas seções**; o
  super-grupo mantém o seu, e isso ajuda a distinguir linha de grupo de
  linha de seção. O cabeçalho segue `<button>` com `aria-expanded`:
  acessibilidade preservada.
- Reduzir espaçamentos horizontais: `gap` do cabeçalho `8px → 6px`;
  `gap` interno do título `0.35em → 0.22em`.
- Glifos `▯`/`×` em `0.85em`, peso 400 — acompanham os números em
  `--muted`.
- Nome da seção em Poppins 600, 14px — mantém a hierarquia acima do
  super-grupo (13px).
- Em `@media (max-width: 582px)` (limite de celular do
  [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)),
  sigla, página e números do resumo passam a Roboto Condensed 500 no
  lugar de Poppins; o nome segue Poppins.
- Resultado: título numa linha no celular, sem remover informação, sem
  quebrar, sem fonte menor que 14px.

## Consequências

- `interface.md` § Corpo: a descrição do cabeçalho perde o "chevron de
  colapso" e ganha a regra de linha única com fonte condensada no
  celular; § Medidas registra os novos gaps, o tamanho dos glifos e a
  media query.
- `Secao.jsx`: sai o `<span class="secao__chevron">`; `identificacao`
  deixa de ser uma string única e passa a spans separados (nome / sigla /
  página) para aplicar a fonte condensada só a sigla + página no celular.
- `Secao.css`: novos valores de gap e de glifos; nova
  `@media (max-width: 582px)`.
- `Secao.test.jsx`: os testes que afirmam o chevron (`▾`/`▸`) são
  atualizados; `SuperGrupo.test.jsx` segue com o chevron do super-grupo.
- A dica visual de "tocar alterna o colapso" sai da seção; o estado
  fechado continua evidente pela ausência dos cartões, e o
  `aria-expanded` preserva o estado para leitores de tela.
- O encaixe exato dos nomes mais longos em 360px é estimado; confirma-se
  por medição na implementação — se o pior caso ainda estourar por poucos
  px, ajusta-se o gap/tamanho dos glifos, não a fonte do nome.
- Implementação: Fase 0028, Tarefas 0028-0003 e 0028-0004.

## Alternativas consideradas

- **Remover informação** (número da página, sigla ou percentual):
  recusada pelo humano — manter toda a informação.
- **Quebra fixa em duas linhas**: recusada — o humano quer linha única.
- **Fonte menor que 14px** (13/12/11px): recusada — manter 14px; a
  combinação acima já cabe.
- **Omitir `▯`/`×` quando o espaço aperta**: recusada — os glifos dão
  sentido aos números e a notação é uniforme (IDR 0018).
- **Glifos alternativos** para faltantes/repetidas: não há mais
  compactos — o IDR 0018 já rejeitou `−/+` e `✗/♻`.
- **Container query** em vez de media query: mais fiel à largura da
  seção, mas interage com o `content-visibility: auto` (TDR 0021) e é
  mais complexo.
- **Limite de 480px** em vez de 582px: mais preciso, mas criaria um
  segundo limite de largura no CSS além do IDR 0043.
- **Fonte condensada só em sigla e página** (sem os números do resumo):
  economiza menos; o humano estendeu aos números.
