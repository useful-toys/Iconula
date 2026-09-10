<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0002-0002]: cabeçalho com o título e o placar em linha única

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — o formato exato do título, os glifos `▢` e `×`, e a regra do nome acessível por extenso
- `docs/idr/0007-placar-unico-e-progresso-por-secao.md` § Decisão — placar único sobre as 994, especiais incluídos
- `docs/idr/0021-selo-conta-unidades-sobrando.md` § Decisão — nos títulos, `×` conta **códigos distintos** com contagem ≥ 2
- `docs/interface.md` § Cabeçalho — o que a linha do título contém e em que ordem
- `docs/interface.md` § Medidas — padding do cabeçalho sticky, 15px no título, relógio 13px em `--muted`
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` § Decisão — o relógio é o `updatedAt`; sem carimbo, exibe travessão
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Decisão — cabeçalho sticky é permitido; rolagem própria não

## Objetivo
Entregar o cabeçalho da tela principal: uma linha só com o nome, o placar das 994
e o relógio, em notação compacta, com nome acessível que escreve tudo por extenso.
Nesta fase o relógio exibe sempre o travessão — o `updatedAt` só existe a partir
da Fase 6.

## Padrões e convenções aplicáveis
- Componente novo em `src/components/`, sem router e sem estado global —
  `AGENTS.md` § Convenções
- Notação compacta obrigatória nos títulos: `412/994 · 41% · ▢582 · ×37`, sem
  barra de progresso e sem cartões de estatística — `docs/idr/0018-*` § Decisão
- O nome acessível escreve por extenso o que a notação abrevia
  ("412 de 994, 41 por cento, 582 faltantes, 37 repetidas") —
  `docs/idr/0018-*` § Decisão e `docs/requisitos.md` § Requisitos Não Funcionais
- `×` nos títulos conta **códigos distintos** com contagem ≥ 2, não unidades —
  `docs/idr/0021-*` § Decisão
- Cor só pelos tokens de `docs/interface.md` § Paleta; números em `--cream`,
  separadores e relógio em `--muted` — `docs/idr/0022-*`
- Cabeçalho sticky é permitido, rolagem própria não — `docs/idr/0008-*` § Decisão
- Todo texto visível em PT-BR — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Criar o componente do cabeçalho em `src/components/`, puramente controlado por
   props: recebe os números do placar e o carimbo do relógio, não calcula nada
   sobre a coleção.
2. Renderizar a linha única na ordem de `interface.md`:
   `ICONULA 2026 · <coladas>/994 · <pct>% · ▢<faltantes> · ×<repetidas> · <relógio>`.
3. Calcular o placar em módulo puro, separado do componente: coladas = códigos com
   contagem ≥ 1; faltantes = 994 − coladas; repetidas = códigos com contagem ≥ 2;
   percentual arredondado para inteiro. Cobrir com teste, incluindo a coleção
   vazia (`0/994 · 0% · ▢994 · ×0`).
4. Relógio: nesta fase, sempre `—`. Deixar a prop existindo e documentada para a
   Tarefa 0006-0002 preencher com o `updatedAt`; nada de relógio local do
   navegador, que é justamente o que o IDR 0027 rejeitou.
5. Nome acessível na linha inteira, escrevendo os números por extenso; os glifos
   `▢` e `×` não podem ser a única forma de o leitor de tela entender o valor.
6. Aplicar as medidas de `interface.md`: cabeçalho sticky com
   `padding: 12px clamp(16px, 4vw, 40px) 10px`, borda inferior `--border`,
   título 15px, relógio 13px, `tabular-nums` para os números não dançarem.
7. Sem estado vazio especial: a coleção zerada mostra a tela normal.

**Fora do escopo**: a linha de controles (Fase 3), o botão de desfazer e o menu
de ações (Fase 8), a faixa de bandeiras (Tarefa 0003-0004) e o `updatedAt` real
(Tarefa 0006-0002).

## Decisões já tomadas (não reabrir)
- Título em linha única, sem barra de progresso nem cartões — ver `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Placar único sobre as 994, especiais e Coca-Cola incluídos — ver `docs/idr/0007-placar-unico-e-progresso-por-secao.md`
- Duas leituras do `×`, declaradas: código nos títulos, unidade no cartão — ver `docs/idr/0021-selo-conta-unidades-sobrando.md`
- O relógio é o `updatedAt` do documento, não um relógio de evento local — ver `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`
- Estado vazio não tem tela nem mensagem própria — ver `docs/requisitos.md` § Contagem

## Decisões em aberto nesta tarefa
- Como o título quebra em tela muito estreita (uma linha que não cabe) —
  encaminhamento: quebrar preservando a ordem e sem cortar o placar, como o
  cabeçalho de seção faz; nasce um **IDR** se a solução mudar a forma do título

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
- `src/components/Cabecalho.jsx` — criar
- `src/components/Cabecalho.test.jsx` — criar
- `src/lib/progresso.js` — criar (cálculo do placar, puro)
- `src/lib/progresso.test.js` — criar

## Critérios de aceite
- [ ] O título aparece em uma linha, na ordem e com os glifos de `docs/idr/0018-*`
- [ ] Sem barra de progresso e sem cartões de estatística na tela
- [ ] O `×` do título conta códigos distintos com contagem ≥ 2, comprovado por teste
- [ ] O nome acessível do título escreve os números por extenso
- [ ] Coleção vazia exibe `0/994 · 0% · ▢994 · ×0 · —`, sem mensagem especial
- [ ] Nenhum componente com rolagem própria
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0002-log-cabecalho-e-placar-em-linha-unica.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: o cabeçalho fica colado ao topo ao rolar a
página, o título cabe em uma linha em janela de desktop, os números não mudam de
largura ao trocar de valor e o relógio exibe `—`.
