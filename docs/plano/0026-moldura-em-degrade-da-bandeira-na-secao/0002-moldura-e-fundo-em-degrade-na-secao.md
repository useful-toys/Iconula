<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0026-0002]: moldura e fundo em degradê na seção

## Status
Pendente

## Objetivo
Aplicar a moldura e o fundo em degradê de 2-3 cores da bandeira na seção
inteira (título + grade de figurinhas), substituindo a borda sólida e o
fundo tingido de uma cor só que hoje ficam restritos ao cabeçalho da seção.

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § Decisão e § "Hierarquia de cores"
  — desenho da moldura/fundo em degradê e onde ele se aplica (a seção
  inteira, não só o título)
- `src/components/Secao.jsx` linha 46 — hoje o modificador de cor
  (`secao__cabecalho--<sigla>`) está no botão do cabeçalho, não na seção
- `src/components/Secao.jsx` linha 169 — `<section className="secao">`,
  o elemento que precisa da moldura nova (título + `.secao__corpo`, que
  contém `.secao__grade`)
- `src/components/Secao.css` linhas 33-108 — implementação atual (borda
  1px + fundo 45% no `.secao__cabecalho`, 48 classes modificadoras)

## Padrões e convenções aplicáveis
- Cor só pelos tokens OKLCH de `docs/interface.md` § Paleta
- Nenhuma regra que crie contêiner com rolagem própria (IDR 0008) — a
  técnica de anel-gradiente não deve introduzir `overflow` novo

## Escopo e instruções de implementação
1. Em `src/components/Secao.jsx`: mover o modificador de cor
   (`secao--<sigla>`, renomeado do atual `secao__cabecalho--<sigla>`) da
   linha 46 para o `<section className="secao">` da linha 169 — a seção
   inteira recebe a classe, não só o botão do cabeçalho.
2. Em `src/components/Secao.css`:
   - Remover de `.secao__cabecalho` a borda 1px e o fundo tingido 45%
     (linhas 46-47 atuais); manter padding, raio, cursor e o resto do
     layout do botão.
   - No `.secao` (ou num wrapper que o `.secao` passa a fornecer): aplicar
     a técnica de anel-gradiente — `padding` do tamanho da borda (1-2px) +
     duas metades de `linear-gradient` (uma por canto inferior, cada uma
     indo da cor 1 até a cor 2 ou a cor 3), compatível com `border-radius`;
     internamente, um fundo sólido (mesmo `--panel`) revela o anel como
     borda.
   - O fundo tingido acompanha o mesmo desenho em duas metades, com cada
     cor passada por `color-mix(in oklch, cor 25%, --panel)` em vez da cor
     pura.
   - As 48 classes modificadoras (`.secao--alg`, `.secao--arg`, …) passam a
     apontar para os tokens de 2-3 cores da Tarefa 0026-0001, em vez do
     token único `--selection-color` de hoje.
3. Conferir visualmente a compensação do selo "×N" que transborda o canto
   (`--secao-folga-selo`, `Secao.css` linhas 8-20): a moldura nova não pode
   ficar cortada ou deslocada por causa dessa compensação de padding/margem
   negativa.
4. FWC e COC continuam com cor única (sem degradê) — usar
   `--selection-fwc`/`--selection-coc` tanto na moldura quanto no fundo,
   como hoje.

**Fora do escopo**: qualquer mudança nos valores de cor por seleção (já
feita na Tarefa 0026-0001); mudança de padding, raio ou tipografia do
cabeçalho além do necessário para remover a borda/fundo antigos.

## Decisões já tomadas (não reabrir)
- Moldura + fundo em degradê abraçando título e grade, cor 1 no topo, cor 2
  no canto inferior esquerdo, cor 3 no direito — ver
  `docs/idr/0046-cores-de-selecoes.md` § Decisão
- Fundo a 25% de mistura, acompanhando o mesmo degradê da moldura — ver
  `docs/idr/0046-cores-de-selecoes.md` § Decisão
- FWC e COC sem degradê, cor única — ver
  `docs/idr/0045-cores-de-super-grupos.md` § Especiais e
  `docs/idr/0046-cores-de-selecoes.md` § Decisão

## Arquivos impactados
- `src/components/Secao.jsx` — modificar
- `src/components/Secao.css` — modificar
- `docs/interface.md` — modificar, se a descrição do cabeçalho de seção
  citar a borda/fundo antigos

## Critérios de aceite
- [ ] A moldura em degradê envolve o título e a grade de figurinhas da
      seção, não só o cabeçalho
- [ ] O fundo tingido segue o mesmo degradê a 25%, não uma cor sólida
- [ ] `.secao__cabecalho` não tem mais borda nem fundo próprios
- [ ] FWC e COC continuam com moldura/fundo de cor única
- [ ] O selo "×N" não é cortado nem deslocado pela moldura nova
      (verificação visual)

## Validação adicional
Roteiro visual em `npm run dev`: abrir o álbum, conferir pelo menos uma
seção de bandeira com 3 cores distintas (ex. Brasil), uma com 2 cores (ex.
Argentina) e uma com cor clareada (ex. Bélgica ou Alemanha, preto→cinza);
texto do título e dos números legível sobre o fundo tingido em todas.

## Validação
`npm run lint && npm run test && npm run build`.
