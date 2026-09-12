<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0001]: colapso automático de seções e super-grupos completos, com persistência do colapso manual

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `src/components/Catalogo.jsx` — já centraliza o colapso de **seções** num
  único `Set` (`colapsadas`), com "ausente do Set" significando expandida;
  esta tarefa reaproveita essa estrutura, não a substitui
- `src/components/SuperGrupo.jsx` (linha ~31) — hoje o colapso do
  **super-grupo** é estado **interno** do próprio componente
  (`useState(true)`), exposto só via `useImperativeHandle` (`expandir()`) para
  o salto da Tarefa 0003-0004 — não está no mesmo lugar que o das seções
- `docs/idr/0020-privacidade-como-vista-interna.md` — não é a decisão certa;
  conferir na verdade `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
  § Decisão, onde está escrito que "o colapso das seções... não [persiste]" —
  é exatamente essa frase que esta tarefa revisa
- `src/lib/preferenciasDeVista.js` — mecanismo de leitura/gravação em
  `localStorage` já existente para ordenação/disposição/filtro; esta tarefa
  usa o mesmo padrão, não inventa um novo
- `src/lib/progresso.js` (`calcularPlacar`) — já calcula `coladas`/`total` por
  seção e por super-grupo; "100% completo" é `coladas === total` usando o
  mesmo cálculo, sem lógica nova
- `docs/idr/0025-filtro-oculta-secoes-vazias.md` — precedente próximo: seção
  sem nenhuma figurinha visível no filtro já some inteira; esta tarefa é o
  equivalente para colapso automático, não para ocultação

## Objetivo
Colapsar por padrão as seções e super-grupos já 100% completos (todas as
figurinhas coladas), para que quem consulta ou atualiza a coleção não precise
rolar por blocos inteiros que não têm mais nada a fazer — sem nunca esconder
essa seção por completo, e sem lutar com quem prefere deixá-la aberta.

## Padrões e convenções aplicáveis
- Nunca esconder conteúdo por completo — diferente do filtro (IDR 0025), o
  auto-colapso só recolhe, nunca remove a seção da lista; um toque reabre
- O auto-colapso decide o **estado inicial** da sessão; depois disso, quem
  manda é o toque do usuário — reabrir uma seção completa não pode fechá-la
  sozinha de novo enquanto a sessão estiver aberta (evita "brigar" com quem
  está ajustando contagens que passam a fechar sozinhas a seção embaixo dele)
- Override manual (abrir uma completa, ou fechar uma incompleta) persiste
  entre sessões, no mesmo `localStorage` por dispositivo que já guarda
  ordenação/disposição/filtro (IDR 0026)
- Persistir a **intenção do usuário** (que seções ele tocou manualmente), não
  o resultado final — o resultado depende de `contagens`, que muda a cada
  ajuste; persistir o resultado geraria gravações constantes e um estado que
  não bate mais com a regra assim que a contagem mudar
- Sem nova requisição de rede — tudo client-side, mesmo padrão do IDR 0026

## Escopo e instruções de implementação
1. Registrar **IDR** revisando o trecho "o colapso das seções... não
   [persiste]" do IDR 0026, decidindo:
   a. Regra de "completo": seção com `coladas === total`; super-grupo com
      todas as suas seções completas (mesmo cálculo de `calcularPlacar`)
   b. O auto-colapso só define o estado **na carga da sessão** (ou quando uma
      seção passa de incompleta a completa pela primeira vez?) — decidir e
      justificar; recomendação: só na carga, para não fechar uma seção debaixo
      do dedo de quem acabou de completá-la
   c. O que é persistido: o conjunto de siglas/grupos que o usuário tocou
      manualmente (override), não o estado resultante
   d. Comportamento reservado do FWC e da Coca-Cola (sempre presentes,
      IDR 0028) — participam da mesma regra ou ficam de fora?
2. Levar o colapso do super-grupo para `Catalogo.jsx`, unificando com o `Set`
   que já existe para seções — dois `Set`s (`secoesColapsadas`,
   `gruposColapsados`) ou um único esquema com chave prefixada. Isso também
   simplifica `saltarPara`: expandir um super-grupo deixa de precisar do
   `useImperativeHandle`/ref (`SuperGrupo.jsx` linhas 27-37), virando só
   remover a entrada do `Set`, igual já acontece para seção.
3. Calcular o `Set` inicial de colapsadas a partir de `contagens` (seções e
   grupos 100% completos), mesclado com os overrides manuais lidos do
   `localStorage` (override manual sempre vence a regra automática).
4. Gravar no `localStorage` só quando o usuário alternar manualmente uma
   seção ou super-grupo (o toggle já existente em `Catalogo.jsx` ganha esse
   efeito colateral).
5. Atualizar `docs/interface.md` (o trecho que hoje diz que o colapso não
   persiste) e o `docs/idr/0026-*` com a revisão.

**Fora do escopo**: mudar a regra de "completo" para incluir repetidas de
outro jeito; mudar o comportamento do filtro (IDR 0025), que já é um
mecanismo diferente e não é tocado aqui.

## Decisões já tomadas (não reabrir)
- Ordenação/disposição/filtro persistem; o colapso, até aqui, não — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` (revisado
  nesta tarefa quanto ao colapso, não quanto ao resto)
- Salto expande super-grupo e seção no caminho — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`; continua valendo, só muda
  onde o estado de colapso do super-grupo mora
- FWC abre e Coca-Cola fecha o catálogo, sempre presentes — ver IDR 0028

## Decisões em aberto nesta tarefa
- Regra exata de "completo", momento em que o auto-colapso se aplica, e o que
  persiste — encaminhamento no passo 1; nasce **IDR 0046** (próximo número
  livre), revisando o IDR 0026

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
- `src/components/Catalogo.jsx` — modificar (Set de grupos colapsados, leitura/gravação de override manual)
- `src/components/SuperGrupo.jsx` — modificar (remove estado interno e `useImperativeHandle`, vira controlado)
- `src/lib/preferenciasDeVista.js` — modificar ou arquivo novo `src/lib/colapsoDeVista.js`
- `src/components/Catalogo.test.jsx`, `SuperGrupo.test.jsx` — modificar
- `docs/interface.md` — modificar
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` — modificar (revisão)
- `docs/idr/0046-colapso-automatico-de-completas-e-persistencia-manual.md` — criar

## Critérios de aceite
- [ ] Seção 100% completa abre colapsada na primeira vez que aparece na sessão
- [ ] Super-grupo 100% completo (todas as suas seções completas) idem
- [ ] Reabrir manualmente uma seção completa não a fecha sozinha de novo na
      mesma sessão, mesmo que o usuário continue ajustando outras contagens
- [ ] O override manual (abrir uma completa, ou fechar uma incompleta)
      sobrevive a um recarregamento da página
- [ ] O salto pela faixa de bandeiras continua expandindo super-grupo e seção
      no caminho, agora sem `useImperativeHandle`
- [ ] IDR 0046 registrado, revisando o IDR 0026

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: completar uma seção inteira e conferir
que ela colapsa sozinha só na próxima carga da página; reabri-la manualmente,
recarregar, e conferir que continua aberta; testar o salto pela faixa de
bandeiras chegando numa seção dentro de um super-grupo automaticamente
colapsado.
