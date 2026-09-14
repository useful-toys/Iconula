<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0019-0002]: tooltip nas bandeiras, com sigla, nome e progresso

## Status
Pendente

## Objetivo
Ao passar o mouse ou chegar por teclado a uma bandeira da faixa, mostrar
abaixo dela `BRA · Brasil · 12/20 · 60% · ▢8 · ×3`, no visual do tooltip dos
controles, para identificar a seção e o seu placar sem saltar até ela.

## Documentos de referência
- `docs/idr/0052-tooltip-nas-bandeiras-da-faixa.md` § Decisão e
  § Consequências — conteúdo, visual, gatilhos e mecanismo
- `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md` § Decisão —
  o tooltip de referência
- `src/components/Controles.css` — regras `.controles__opcao::after`
  (visual, atraso de ~400ms, foco por teclado)
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css` —
  a faixa rolável (`overflow-x: auto`, `overflow-y: hidden`)
- `src/components/Cabecalho.jsx`, `src/App.jsx` — de onde a faixa recebe as
  seções; `App.jsx` guarda as contagens
- `src/lib/progresso.js` — coladas, faltantes, repetidas e percentual
- `src/components/Secao.jsx` — a notação compacta do título da seção e o seu
  nome acessível por extenso
- `docs/tdr/0021-desempenho-do-catalogo.md` § Decisão — memoização do
  catálogo
- `docs/interface.md` § Cabeçalho, § Camadas, § Medidas

## Padrões e convenções aplicáveis
- A faixa segue a única rolagem própria; o tooltip não cria outra — IDR 0008
- Sem tooltip em toque: tocar na bandeira salta — IDR 0052
- A notação do progresso é a mesma dos títulos — IDR 0018
- Ajustar uma contagem não re-renderiza o catálogo inteiro; o comparador dos
  componentes memoizados não perde campo — TDR 0021
- Tocar na bandeira continua saltando, limpando o filtro quando precisa —
  IDR 0016, IDR 0031

## Escopo e instruções de implementação
1. A faixa recebe o que precisa para o progresso de cada seção (as contagens,
   ou o progresso já calculado com `src/lib/progresso.js`), vindo de `App`
   pelo `Cabecalho`.
2. Um único elemento de tooltip, fora do contêiner rolável da faixa, com o
   texto `SIGLA · Nome · coladas/total · percentual% · ▢faltantes ·
   ×repetidas` na mesma formatação do título da seção; especiais com a sua
   sigla e nome (`FWC · Extras FIFA …`, `COC · Coca-Cola …`).
3. Posição calculada ao aparecer: logo abaixo da bandeira, centralizado nela
   e contido na largura da janela, sem estourar as bordas laterais.
4. Gatilhos: ponteiro de mouse sobre a bandeira mostra depois de ~400ms; foco
   por teclado mostra na hora; ponteiro de toque nunca mostra. Some ao sair o
   ponteiro, ao perder o foco, ao rolar a faixa ou a página e ao saltar.
5. Visual do tooltip do IDR 0048 (tokens, 11px/600, raio 6px, sombra); acima
   do cabeçalho sticky e abaixo do menu de ações.
6. Enquanto visível, o texto reflete a contagem vigente.
7. Testes em `FaixaDeSecoes.test.jsx`: texto com sigla, nome e progresso;
   aparece depois do atraso no hover (timers falsos) e na hora no foco; some
   ao sair e ao perder o foco; não aparece com ponteiro de toque; FWC e COC;
   o clique continua chamando o salto.
8. Em `docs/interface.md`, citando o IDR 0052: § Cabeçalho, o item da faixa
   ganha o tooltip (conteúdo e gatilhos); § Camadas, o tooltip da faixa entra
   entre o cabeçalho e o menu de ações; § Medidas, a linha da faixa ganha o
   tooltip no visual do IDR 0048, posicionado fora da faixa.

**Fora do escopo**: o tooltip dos controles (continua só CSS); layout do
cabeçalho (Tarefa 0019-0001); cores e medidas das bandeiras (IDR 0045).

## Decisões já tomadas (não reabrir)
- Conteúdo, visual, gatilhos e mecanismo — ver
  `docs/idr/0052-tooltip-nas-bandeiras-da-faixa.md`
- Visual e gatilhos de referência — ver
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`
- Salto pela faixa e com filtro ativo — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` e
  `docs/idr/0031-salto-com-filtro-ativo.md`
- Memoização do catálogo — ver `docs/tdr/0021-desempenho-do-catalogo.md`

## Decisões em aberto nesta tarefa
- Nome acessível da bandeira (nível 2) — o tooltip mostra sigla e progresso
  que o `Saltar para <nome>` não diz; premissa conservadora: manter o nome
  acessível atual; se incluir sigla e progresso por extenso, registrar IDR
  de nível 2 e sinalizar no relatório.
- Onde montar o elemento do tooltip e como observar a rolagem (nível 1) —
  registrar no log.

## Arquivos impactados
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css`,
  `src/components/FaixaDeSecoes.test.jsx` — modificar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.test.jsx` —
  modificar
- `src/App.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Camadas, § Medidas)

## Critérios de aceite
- [ ] Tooltip com `SIGLA · Nome` e o progresso na notação dos títulos,
      inclusive FWC e COC (teste)
- [ ] Hover mostra depois de ~400ms, foco por teclado na hora, toque nunca;
      some ao sair, ao perder o foco e ao rolar (teste e verificação visual)
- [ ] Um único elemento de tooltip, fora do contêiner rolável (busca e teste)
- [ ] Tooltip inteiro, sem corte, contido na janela nas bandeiras das pontas
      (verificação visual)
- [ ] Clique na bandeira continua saltando (teste existente verde)
- [ ] `docs/interface.md` § Cabeçalho, § Camadas e § Medidas citando o
      IDR 0052

## Validação adicional
Verificação visual em `npm run dev` a 1440px e 768px: hover na primeira, numa
do meio e na última bandeira; Tab até a faixa; rolar a faixa com o tooltip
aberto; ajustar uma figurinha e conferir o progresso atualizado; nas duas
ordenações.
