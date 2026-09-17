<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0028-0003]: título de seção sem chevron e identificação em spans

## Status
Concluída

## Objetivo
Remover o chevron `▾`/`▸` do cabeçalho da seção (só nas seções; o super-grupo
mantém o dele) e separar a identificação em spans próprios (nome, sigla,
página), para a Tarefa 0028-0004 aplicar a fonte condensada só à sigla e à
página. Acessibilidade preservada: o cabeçalho segue `<button>` com
`aria-expanded`.

## Documentos de referência
- `docs/idr/0056-titulo-de-secao-em-linha-unica-no-celular.md` § Decisão — sem
  chevron nas seções; identificação em spans.
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão — o
  toque no título continua colapsando/expandindo.

## Padrões e convenções aplicáveis
- Acessibilidade: `aria-expanded` e nome acessível por extenso preservados —
  `docs/requisitos.md` § Requisitos Não Funcionais.
- A dica visual de colapso sai, mas o estado fechado segue evidente (ausência
  dos cartões) — IDR 0056.

## Escopo e instruções de implementação
1. Em `Secao.jsx`, remover o `<span class="secao__chevron">`.
2. Substituir a string única `identificacao` por três spans — nome, sigla e
   página — mantendo a ordem e o texto visível atuais (`Brasil BRA 24`).
3. Remover a regra `.secao__chevron` de `Secao.css`.
4. Atualizar `Secao.test.jsx` (deixa de afirmar `▾`/`▸`) e `interface.md`
   § Corpo (descrição do cabeçalho sem chevron).

**Fora do escopo**: os gaps/glifos/fonte condensada do título (Tarefa
0028-0004); o super-grupo mantém o chevron.

## Decisões já tomadas (não reabrir)
- Sem chevron nas seções, só nelas — ver
  `docs/idr/0056-titulo-de-secao-em-linha-unica-no-celular.md`.

## Arquivos impactados
- `src/components/Secao.jsx` — modificar
- `src/components/Secao.css` — modificar
- `src/components/Secao.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Corpo)

## Critérios de aceite
- [ ] O cabeçalho da seção não exibe `▾` nem `▸`.
- [ ] A identificação continua visível como `Brasil BRA 24`, agora em três
      spans (nome, sigla, página).
- [ ] Tocar no título ainda colapsa/expande; `aria-expanded` e nome acessível
      intactos.
- [ ] `npm run lint && npm run test && npm run build` verdes.
