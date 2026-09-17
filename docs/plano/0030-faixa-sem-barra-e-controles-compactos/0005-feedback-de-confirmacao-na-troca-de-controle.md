<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0030-0005]: feedback de confirmação na troca de controle

## Status
Concluída

## Objetivo
Ao trocar ordenação, disposição ou filtro, emitir um aviso de **sucesso**
(5s) com a confirmação por extenso: "Ordenado pela página do álbum",
"Ordenado pelo código do país", "Disposição em lista", "Disposição como no
álbum", "Mostrando todas / apenas as faltantes / coladas / repetidas".

## Documentos de referência
- `docs/idr/0059-rotulos-compactos-dos-controles.md` § Decisão — o feedback.
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — o
  evento de sucesso ganha a troca de controle.
- `docs/interface.md` § Avisos — a tabela de eventos de sucesso.

## Padrões e convenções aplicáveis
- Aviso efêmero, em voz do usuário, cabendo numa linha — IDR 0029.
- O estado ativo em dourado continua sendo o indicador permanente; o aviso é a
  confirmação do toque.

## Escopo e instruções de implementação
1. Em `App.jsx`, nos handlers de troca de ordenação/disposição/filtro, emitir
   o aviso de sucesso com o texto correspondente, pela fila de avisos já
   existente.
2. Atualizar `interface.md` § Avisos (adicionar o evento de sucesso "trocou
   ordenação/disposição/filtro").
3. Atualizar/adicionar teste cobrindo a emissão do aviso numa troca.

**Fora do escopo**: a troca em si e os rótulos (Tarefas 0030-0003/0004).

## Decisões já tomadas (não reabrir)
- Feedback de sucesso na troca, pela área de avisos — ver
  `docs/idr/0059-rotulos-compactos-dos-controles.md` e
  `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`.

## Arquivos impactados
- `src/App.jsx` — modificar
- `src/App.test.jsx` — modificar (ou arquivo de teste de integração apropriado)
- `docs/interface.md` — modificar (§ Avisos)

## Critérios de aceite
- [ ] Trocar ordenação emite "Ordenado pela página do álbum" ou "Ordenado
      pelo código do país".
- [ ] Trocar disposição emite "Disposição em lista" ou "Disposição como no
      álbum".
- [ ] Trocar filtro emite "Mostrando todas / apenas as …".
- [ ] O aviso é de sucesso e some em 5s.
- [ ] `npm run lint && npm run test && npm run build` verdes.
