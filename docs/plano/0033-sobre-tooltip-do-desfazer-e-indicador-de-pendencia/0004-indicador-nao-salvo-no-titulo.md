<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0033-0004]: Indicador "não salvo" no título

## Status
Concluída

## Objetivo
Enquanto houver alguma alteração de contagem ainda não gravada, o relógio do
título (`… · 12:34`) dá lugar ao texto "não salvo" — aviso não bloqueante que,
junto da garantia de flush + cache IndexedDB já existente, dispensa qualquer
popup de aviso ao sair da página.

## Documentos de referência
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` § Decisão —
  formato e regra do novo estado "não salvo"
- `docs/idr/0065-sem-modal-ao-sair-indicador-de-pendencia-no-titulo.md` —
  por que este indicador substitui um popup/modal
- `src/lib/gravacaoAgregada.js` § `temPendencia()` — sinal já existente de
  pendência (não reativo hoje)
- `src/App.jsx` linhas em torno de `atualizadoEm`/`aplicarAjuste` — onde o
  relógio é atualizado hoje (carga e gravação bem-sucedida)
- `src/components/Cabecalho.jsx` § `relogio = atualizadoEm ?? '—'` — onde o
  texto do relógio é montado

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `App.jsx`: novo estado (`useState`) de pendência, por exemplo
   `pendente`. Marcar `true` em `aplicarAjuste` (todo ajuste de contagem, via
   `handleAjustar`/`handleDesfazer`, que já passam por `aplicarAjuste`).
   Marcar `false` só no callback `aoConcluir` da gravação agregada (sucesso);
   uma falha **não** limpa a pendência — o ajuste continua pendente até uma
   gravação seguinte ter sucesso, coerente com IDR 0027.
2. Passar esse estado como nova prop `naoSalvo` (booleano) para `Cabecalho`.
3. Em `Cabecalho.jsx`: `const relogio = naoSalvo ? 'não salvo' : (atualizadoEm ?? '—')`
   — o resto da linha do título (`cabecalho__relogio`) não muda de posição
   nem de estilo. O nome acessível troca `` `atualizado às ${relogio}` `` por
   algo equivalente quando `naoSalvo` (ex.: "não salvo").
4. `docs/interface.md` § Cabeçalho: acrescenta o estado "não salvo" na
   descrição do relógio, citando o IDR 0027 atualizado.

**Fora do escopo**: qualquer diálogo `beforeunload` ou popup de saída
(descartado no IDR 0065); distinguir "esperando debounce" de "gravação em
voo" (um único estado, por decisão do IDR 0027).

## Decisões já tomadas (não reabrir)
- Texto "não salvo", estado único, sem distinguir espera de gravação em voo
  — ver `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`
- Nenhum popup/modal de saída é adicionado — ver
  `docs/idr/0065-sem-modal-ao-sair-indicador-de-pendencia-no-titulo.md`

## Arquivos impactados
- `src/App.jsx` — modificar (estado `pendente`)
- `src/components/Cabecalho.jsx` — modificar (prop `naoSalvo`, texto do
  relógio e nome acessível)
- `src/components/Cabecalho.test.jsx` — modificar
- `src/App.test.jsx` ou `src/App.gravacao.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho)

## Critérios de aceite
- [ ] Após qualquer ajuste de contagem, o título mostra "não salvo" no lugar
      do relógio até a gravação seguinte confirmar sucesso — coberto por
      teste com temporizador falso (mesmo padrão de
      `App.gravacao.test.jsx`)
- [ ] Uma falha de gravação mantém "não salvo" (não volta ao relógio
      antigo) — coberto por teste
- [ ] Sem pendência, o relógio volta a mostrar `updatedAt` normalmente —
      coberto por teste
- [ ] O nome acessível do título reflete "não salvo" quando pendente —
      coberto por teste
- [ ] `docs/interface.md` § Cabeçalho descreve o estado "não salvo", citando
      o IDR 0027

## Validação adicional
- Roteiro visual em `npm run dev`: ajustar uma figurinha e observar o
  título mudar para "não salvo" até a gravação (debounce de ~4s da Tarefa
  0033-0005) confirmar e o relógio voltar.
