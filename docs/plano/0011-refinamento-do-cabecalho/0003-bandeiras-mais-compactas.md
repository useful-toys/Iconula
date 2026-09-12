<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0003]: bandeiras mais compactas

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `src/components/FaixaDeSecoes.css` — `gap: 4px` atual entre as bandeiras
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — tabela de área de toque
  ampliada: o ícone da faixa (30×30px) ganha `::before { inset: -2px }`,
  **exatamente a metade** do gap de 4px, para não sobrepor a área de toque da
  bandeira vizinha
- `docs/plano/0006-ajuste-de-rota/0003-faixa-de-bandeiras-mais-compacta.md` —
  precedente direto: a Fase 6 já reduziu o espaçamento de 8px para 4px pelo
  mesmo motivo (caber mais seções sem rolar), registrado como ajuste de
  medida em `docs/interface.md`, sem IDR novo
- `docs/interface.md` § Medidas — onde o valor do espaçamento é documentado

## Objetivo
Reduzir ainda mais o espaçamento horizontal entre as bandeiras da faixa de
salto, para caber mais seções na largura da tela sem precisar rolar — dando
continuidade ao ajuste da Fase 6 Tarefa 3.

## Padrões e convenções aplicáveis
- O ícone continua 30×30px — só o espaçamento entre eles muda
  (`docs/interface.md` § Medidas não muda o tamanho do alvo)
- A área de toque ampliada da IDR 0042 precisa continuar sendo exatamente a
  metade do novo gap, para preservar a garantia de não sobreposição entre
  bandeiras vizinhas
- Sem rolagem vertical nova nem mudança na rolagem horizontal existente
  (IDR 0008/IDR 0016)

## Escopo e instruções de implementação
1. Reduzir `gap` em `.faixa-de-secoes` (`src/components/FaixaDeSecoes.css`) —
   partir de 2px e conferir em tela real (celular estreito com as 50 seções)
   se o espaçamento ainda separa visualmente uma bandeira da outra; não travar
   o número sem olhar em tela.
2. Ajustar o `inset` do `::before` de `.faixa-de-secoes__botao` (mesma
   regra `@media (pointer: coarse)`) para a metade exata do novo gap — ex.:
   gap 2px → inset -1px — mantendo a mesma garantia de não sobreposição que a
   IDR 0042 já documentou para o valor anterior.
3. Atualizar a tabela de "Área de toque ampliada" no
   `docs/idr/0042-foco-visivel-e-area-de-toque.md` com o novo gap e o novo
   inset (é atualização do registro existente, não um IDR novo — mesmo
   precedente da Fase 6 Tarefa 3).
4. Atualizar `docs/interface.md` § Medidas com o novo valor.

**Fora do escopo**: mudar o tamanho do ícone; mudar a ordem ou o conteúdo da
faixa (IDR 0028).

## Decisões já tomadas (não reabrir)
- Ícone de 30×30px, rolagem horizontal, ordem com 🏆 no início e 🥤 no fim —
  ver `docs/interface.md` § Cabeçalho e IDR 0028
- Precedente de reduzir o espaçamento por motivo idêntico — ver
  `docs/plano/0006-ajuste-de-rota/0003-faixa-de-bandeiras-mais-compacta.md`

## Decisões em aberto nesta tarefa
Nenhuma — mesmo precedente da Fase 6 Tarefa 3: ajuste de medida direto em
`docs/interface.md`, sem IDR novo. A tabela do IDR 0042 é atualizada para
refletir o novo número, não revisada em sua decisão.

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
- `src/components/FaixaDeSecoes.css` — modificar
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — modificar (tabela)
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Espaçamento entre bandeiras reduzido e ainda legível como itens
      separados em tela real
- [ ] Área de toque ampliada continua sendo exatamente a metade do novo gap,
      sem sobrepor a bandeira vizinha
- [ ] `docs/idr/0042-*` e `docs/interface.md` refletem o novo valor

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`, em largura de celular: conferir que mais
seções cabem na faixa sem rolar e que o toque em uma bandeira não aciona a
vizinha.
