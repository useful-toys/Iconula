<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0002-0003]: cartão da figurinha

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` § Decisão e § Consequências — os três estados, o toque que soma, o ícone de menos, e a exigência de reforço não-cromático
- `docs/idr/0021-selo-conta-unidades-sobrando.md` § Decisão — `×N` são as unidades sobrando (contagem − 1), a partir da contagem 2, com caixa fixa de dois dígitos
- `docs/interface.md` § Figurinha — código em duas linhas, bordas perfuradas, marca de metalizada
- `docs/interface.md` § Medidas — cartão 52×66px, raio 5px, tipografia do código, geometria do selo e da marca
- `docs/requisitos.md` § Contagem — incremento para em 99, decremento para em 0, sem ação de zerar
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — por que o teto de 99 existe e por que a interface precisa respeitá-lo

## Objetivo
Entregar o componente que é o coração do produto: o cartão que mostra o estado da
figurinha de longe e aceita o registro num toque. Apresentacional puro — recebe
código, contagem e os dois callbacks, e não conhece a coleção.

## Padrões e convenções aplicáveis
- Componente novo em `src/components/`, controlado por props, sem estado global —
  `AGENTS.md` § Convenções e `docs/tdr/0001-*` § Decisão
- A cor **nunca** é o único sinal: faltante é cartão esvaziado (opacidade
  reduzida, borda tracejada) e colada é preenchido — `docs/idr/0006-*` § Decisão
  e `docs/requisitos.md` § Requisitos Não Funcionais
- `×N` = contagem − 1, aparecendo só a partir de 2, com largura fixa para dois
  dígitos — `docs/idr/0021-*` § Decisão
- Incremento para em 99 sem efeito, decremento para em 0 sem efeito; não existe
  ação de zerar — `docs/requisitos.md` § Contagem e `docs/tdr/0009-*`
- Cor só pelos tokens de `docs/interface.md` § Paleta (`--panel`, `--muted`,
  `--green-card`, `--orange-card`, `--ink-on-light`, `--gold`) — `docs/idr/0022-*`
- Nada de `dangerouslySetInnerHTML`: o efeito de selo é CSS, não HTML bruto —
  `docs/tdr/0003-*` § Decisão

## Escopo e instruções de implementação
1. Criar o cartão em `src/components/`, recebendo `codigo`, `contagem`,
   `metalizada`, `onIncrementar`, `onDecrementar` e uma variante de tamanho
   (lista × álbum, para a Fase 4 reusar sem duplicar componente).
2. Renderizar o código em duas linhas — sigla acima, número abaixo —, com as
   medidas de `interface.md` (lista: sigla 10px sobre número 13px; álbum: 9px
   sobre 12px) e as bordas perfuradas.
3. Três estados: contagem 0 → `--panel` com borda 2px tracejada `--muted`, texto
   `--muted`, opacidade 0.6; contagem 1 → `--green-card` preenchido, texto
   `--ink-on-light`; contagem ≥ 2 → `--orange-card` preenchido, com o selo.
4. Selo `×N` no canto inferior direito, transbordando ~6px, fundo `--turf-deep`,
   borda e texto `--orange-card`, largura fixa de dois dígitos. **N é a contagem
   menos um.** Não exibir selo com contagem 0 ou 1.
5. Marca de metalizada: ponto de 6px em `--gold` no canto superior direito, dentro
   do cartão, sem transbordar.
6. Interação: tocar no cartão incrementa; um controle de menos aparece ao toque e
   decrementa. Ambos são elementos focáveis e acionáveis por teclado, com nome
   acessível próprio ("BRA 05: somar uma unidade" / "remover uma unidade").
7. Nome acessível do cartão escrevendo o estado por extenso — por exemplo
   "BRA 05, colada, 2 sobrando" e "BRA 05, faltante".
8. O componente **não** aplica o teto nem o piso por conta própria: chama os
   callbacks e recebe a contagem já limitada. Cobrir com teste que, em 99, um
   toque não muda a tela, e que em 0 o menos não muda nada.

**Fora do escopo**: a fonte da contagem (Tarefa 0002-0004); desfazer (Fase 8); a
disposição álbum e o tamanho paisagem da figurinha 13 (Fase 4); estados de foco e
hover refinados (Tarefa 0009-0001).

## Decisões já tomadas (não reabrir)
- Três estados por cor mais reforço não-cromático — ver `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md`
- O selo conta unidades sobrando, não a contagem — ver `docs/idr/0021-selo-conta-unidades-sobrando.md`
- Sem ação de zerar e sem confirmação: o desfazer cobre o engano — ver `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md`
- Teto de 99, por causa da validação nas regras — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`
- A contagem em si não aparece na tela; quem tem 3 vê `×2` — ver `docs/idr/0021-*` § Consequências

## Decisões em aberto nesta tarefa
- Como o controle de menos "surge ao tocar" num dispositivo sem toque (mouse e
  teclado) — encaminhamento: visível ao passar o cursor e ao receber foco, além
  do toque, para não deixar o decremento inacessível por teclado; nasce um **IDR**
- Se o toque no cartão em 99 dá algum retorno — encaminhamento: nenhum, como
  manda `requisitos.md` ("sem efeito ao chegar em 99"); registrar no log

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
- `src/components/Figurinha.jsx` — criar
- `src/components/Figurinha.test.jsx` — criar

## Critérios de aceite
- [ ] Contagem 3 exibe `×2`; contagem 2 exibe `×1`; contagens 0 e 1 não exibem selo
- [ ] A caixa do selo não muda de largura entre `×9` e `×10`
- [ ] Faltante tem borda tracejada e opacidade reduzida, além da cor
- [ ] Incrementar e decrementar são acionáveis por teclado, com nome acessível próprio
- [ ] Em 99 o incremento não muda a tela; em 0 o decremento não muda a tela
- [ ] O nome acessível do cartão descreve o estado por extenso
- [ ] Nenhuma cor literal fora dos tokens
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0003-log-cartao-da-figurinha.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: os três estados são distinguíveis com a tela
em escala de cinza (prova do reforço não-cromático), o selo transborda o canto
inferior direito sem cortar, e a marca dourada fica dentro do cartão.
