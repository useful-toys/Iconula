<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0001]: persistência do colapso manual

## Status
Concluída

## Objetivo
Lembrar entre sessões, por dispositivo, as seções e os super-grupos que o
usuário fechou à mão, para que quem trabalha com parte do catálogo fechada
não precise refechar tudo a cada abertura. O padrão continua tudo aberto.

## Documentos de referência
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão e
  § Histórico — o que persiste, padrão aberto, o salto grava "aberta"
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
  § Decisão e § Histórico — colapso manual no `localStorage`, por
  dispositivo, com degradação segura
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` § Decisão — o salto
  expande super-grupo e seção no caminho
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` § Decisão —
  forma versionada das preferências no `localStorage`
- `src/components/Catalogo.jsx` — colapso das seções num `Set` em memória
- `src/components/SuperGrupo.jsx` — colapso do super-grupo como estado
  interno, exposto por `useImperativeHandle` para o salto
- `src/lib/preferenciasDeVista.js` — leitura e gravação de ordenação,
  disposição e filtro
- `docs/tdr/0021-desempenho-do-catalogo.md` § Decisão — comparadores de
  `memo` de `Secao` e `SuperGrupo`
- `docs/interface.md` § Controles — "o colapso das seções, não" (persiste)

## Padrões e convenções aplicáveis
- Armazenamento ausente ou bloqueado cai no padrão aberto e segue, sem
  erro — IDR 0026
- Nenhuma requisição de rede nova — `docs/requisitos.md` § Requisitos Não
  Funcionais
- Prop nova de `Secao`/`SuperGrupo` entra no comparador de `memo` — TDR 0021
- Grava só o que o usuário e o salto mudaram, não o catálogo inteiro na
  abertura — IDR 0020

## Escopo e instruções de implementação
1. Guardar no `localStorage`, junto das preferências de vista ou em chave
   própria, o conjunto de seções (por sigla) e de super-grupos (por letra)
   fechados.
2. Na abertura, seções e super-grupos desse conjunto começam fechados; o
   resto, aberto. Siglas ou letras desconhecidas no conjunto são ignoradas.
3. Tocar no título de uma seção ou super-grupo atualiza o conjunto gravado.
4. O salto pela faixa, ao abrir seção ou super-grupo fechados, grava-os como
   abertos.
5. Testes: fechar e recarregar mantém fechado; reabrir e recarregar mantém
   aberto; salto para seção num super-grupo fechado abre os dois e a
   recarga os mostra abertos; armazenamento indisponível abre tudo sem
   erro; chave desconhecida ignorada.
6. Em `docs/interface.md` § Controles, "o colapso das seções, não" passa a:
   seções e super-grupos fechados à mão também são lembrados, por
   dispositivo; o salto que os abre grava a abertura — citando os IDRs 0020 e
   0026.
7. Se a forma gravada no `localStorage` mudar, atualizar o MDR 0007 e
   `docs/modelo-memoria.md` (decisão de nível 1 da tarefa).

**Fora do escopo**: auto-colapso de seções completas (descartado); valores de
espaçamento (Tarefas 0012-0002 a 0012-0004); sincronizar entre dispositivos.

## Decisões já tomadas (não reabrir)
- O que persiste, padrão aberto e salto gravando abertura — ver
  `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
- Persistência local por dispositivo, sem Firestore — ver
  `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Salto expande super-grupo e seção no caminho — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`

## Decisões em aberto nesta tarefa
- Chave própria ou ampliação da gravação de `preferenciasDeVista.js`, e onde
  mora o estado do super-grupo — nível 1; se virar registro, atualiza o
  MDR 0007 (forma) ou nasce um TDR (estrutura de estado).

## Arquivos impactados
- `src/components/Catalogo.jsx`, `src/components/SuperGrupo.jsx` — modificar
- `src/lib/preferenciasDeVista.js` — modificar, ou módulo novo em `src/lib/`
  — criar
- `src/components/Catalogo.test.jsx`, `src/components/SuperGrupo.test.jsx`,
  teste do módulo de persistência — modificar ou criar
- `docs/interface.md` — modificar (§ Controles)
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md`,
  `docs/modelo-memoria.md` — modificar, se a forma gravada mudar

## Critérios de aceite
- [ ] Seção e super-grupo fechados à mão continuam fechados após recarregar
      (teste com `localStorage`)
- [ ] Reaberto à mão, continua aberto após recarregar (teste)
- [ ] Salto abre seção e super-grupo fechados e a recarga os mostra abertos
      (teste)
- [ ] Sem `localStorage` disponível, tudo abre e nada quebra (teste)
- [ ] Nenhuma requisição de rede nova
- [ ] `docs/interface.md` § Controles descreve a persistência citando os
      IDRs 0020 e 0026

## Validação adicional
Verificação visual em `npm run dev`: fechar duas seções e um super-grupo,
recarregar e conferir; saltar para uma seção dentro do super-grupo fechado,
recarregar e conferir os dois abertos.
