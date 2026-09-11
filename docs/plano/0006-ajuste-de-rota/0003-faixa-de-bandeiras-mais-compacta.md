<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0006-0003]: faixa de bandeiras mais compacta

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Medidas — faixa de bandeiras: ícones de 30×30px, raio 8px, **espaçamento 4px**, glifo de 15px
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` § Decisão — a faixa lista as 50 seções e serve ao salto
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Decisão — a faixa é a única exceção ao scroll único; a rolagem horizontal continua existindo
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — espaço otimizado para o catálogo

## Objetivo
Apertar o espaçamento horizontal entre as bandeiras da faixa de salto, de 8px
para 4px, para caber mais seções na largura da tela antes de precisar rolar.

## Padrões e convenções aplicáveis
- A faixa continua listando as **50 seções**, na ordem do catálogo — `docs/idr/0016-*`
  e `docs/idr/0028-*`
- A rolagem horizontal da faixa continua sendo a única exceção ao scroll único —
  `docs/idr/0008-*`
- Medidas do ícone (30×30px, raio 8px, glifo de 15px) **não** mudam — só o
  espaçamento — `docs/interface.md` § Medidas

## Escopo e instruções de implementação
1. Em `FaixaDeSecoes.css`, baixar o `gap` de 8px para 4px. O `padding` vertical
   da faixa e as medidas do ícone ficam como estão.
2. Conferir que dois ícones vizinhos continuam visualmente separados, inclusive
   quando um deles está em destaque (fundo `--gold`).
3. Conferir que o alvo de toque não encolhe: o ícone continua com 30×30px, e o
   que diminui é o espaço morto entre eles.
4. Testes: nenhum teste novo é exigido por uma medida, mas os existentes de
   `FaixaDeSecoes.test.jsx` devem continuar passando sem ajuste.

**Fora do escopo**: mudar o tamanho do ícone, quantas seções a faixa lista, ou
eliminar a rolagem horizontal; área de toque ampliada em tela sensível
(Tarefa 0010-0001).

## Decisões já tomadas (não reabrir)
- A faixa lista sempre as 50 seções e rola para os lados — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- A faixa é exceção declarada ao scroll único — ver
  `docs/idr/0008-uma-unica-pagina-scrollavel.md`

## Decisões em aberto nesta tarefa
- Nenhuma. Espaçamento é medida, não decisão de interface: vive em
  `docs/interface.md` § Medidas e não gera IDR.

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

## Critérios de aceite
- [ ] O espaçamento entre bandeiras é de 4px, e o ícone continua com 30×30px
- [ ] Cabem mais seções na largura da tela do que antes, sem rolar
- [ ] Duas bandeiras vizinhas continuam distinguíveis, inclusive com destaque
- [ ] `docs/interface.md` § Medidas descreve o que o código faz
- [ ] `docs/plano/0006-ajuste-de-rota/logs/0003-log-faixa-de-bandeiras-mais-compacta.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: numa janela larga, contar quantas bandeiras
aparecem sem rolar antes e depois da mudança; em largura de celular, confirmar
que a faixa continua rolando suavemente e que nenhum ícone fica colado no
vizinho.
