<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0004]: controle de menos no canto, revelado só por hover e teclado

## Status
Concluída

## Objetivo
Encostar o controle de menos no canto inferior esquerdo do cartão (recuo 0,
sobre a borda, sem transbordar), longe do toque de soma, e fazer com que ele
apareça só no cartão sob o cursor ou no foco por teclado — hoje o foco deixado
pelo clique de mouse o mantém aceso no cartão anterior.

## Documentos de referência
- `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
  § Decisão e § Consequências — posição e gatilhos de visibilidade
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — área de toque
  ampliada do menos, contida no cartão
- `docs/idr/0051-pressao-longa-decrementa-no-toque.md` § Decisão — gesto que
  não pode ser afetado
- `src/components/Figurinha.css` — `.figurinha__menos` (recuo 3px e 2px),
  `:focus-within`, `(hover: none)` e o `::before` de `(pointer: coarse)`
- `src/components/Figurinha.jsx` — foco devolvido ao corpo no decremento de 1
  para 0
- `docs/interface.md` § Figurinha, § Medidas

## Padrões e convenções aplicáveis
- Menos só com contagem ≥ 1 e nunca transbordando o cartão — IDR 0032
- Em tela sem hover o menos continua sempre visível — IDR 0032
- Área de toque ampliada contida no cartão, sem disputar o vizinho — IDR 0042
- Medidas do círculo e cores não mudam — `docs/interface.md` § Medidas

## Escopo e instruções de implementação
1. Recuo 0 no canto inferior esquerdo, nas variantes lista e álbum.
2. Visibilidade: cursor sobre o cartão; foco por teclado no corpo do cartão
   ou no próprio controle (`:focus-visible`); sempre em `(hover: none)`. O
   foco deixado por clique de mouse não revela o controle.
3. A área de toque ampliada de `(pointer: coarse)` passa a crescer só para
   dentro do cartão (para cima e para a direita), já que o círculo encosta
   nas bordas.
4. O decremento de 1 para 0 continua devolvendo o foco ao corpo.
5. Em `docs/interface.md`, citando o IDR 0032: § Figurinha, o item do
   controle de menos passa a "encostado no canto inferior esquerdo, sobre a
   borda, sem transbordar; aparece no hover e no foco por teclado; sempre
   visível em tela sem hover"; § Medidas, a linha "Controle de menos" troca o
   recuo de 3px/2px por recuo 0 e descreve a área de toque ampliada para
   dentro do cartão.

**Fora do escopo**: clique perto da borda (Tarefa 0019-0005); selo `×N`
(Tarefa 0019-0006); cartão de 60×84px (Tarefa 0017-0004); pressão longa.

## Decisões já tomadas (não reabrir)
- Posição no canto e gatilhos de visibilidade — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
- Área de toque ampliada e foco visível — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`
- Pressão longa em toque — ver
  `docs/idr/0051-pressao-longa-decrementa-no-toque.md`

## Arquivos impactados
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.test.jsx` — modificar, se a estrutura mudar
- `docs/interface.md` — modificar (§ Figurinha, § Medidas)

## Critérios de aceite
- [ ] Recuo 0 no canto inferior esquerdo nas duas variantes (trecho)
- [ ] Nenhum `:focus-within` nem `:focus` simples revelando o menos; foco
      por teclado revela (busca e trecho)
- [ ] Em `(hover: none)` o menos continua sempre visível (trecho)
- [ ] Área de toque ampliada contida no cartão (trecho)
- [ ] Testes existentes de `Figurinha` verdes, inclusive o foco no
      decremento de 1 para 0
- [ ] `docs/interface.md` § Figurinha e § Medidas citando o IDR 0032

## Validação adicional
Verificação visual em `npm run dev`, lista e álbum: clicar num cartão colado,
passar o mouse para outro e conferir o menos apagado no primeiro; Tab até um
cartão e conferir o menos aceso; o círculo encostado no canto sem sair do
cartão; em emulação de toque, menos sempre visível.
