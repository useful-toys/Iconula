<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0005: Representação em memória na SPA

## Status

Aceito.

## Contexto

- A aplicação é uma Single Page Application (SPA) que roda 100% no navegador.
- Os dados precisam ser representados em memória para renderização, interação e cálculo de progresso.
- O estado é concentrado em `App.jsx`, sem Context nem state manager global (ver [TDR 0014](../tdr/0014-estado-da-colecao-sem-context.md)).

## Decisão

- **Coleção em memória**: mapa esparso `Record<string, number>` (código → contagem), espelhando o schema do Firestore (ver [MDR 0002](0002-schema-do-documento-da-colecao.md)). Chave ausente = contagem 0; zeros nunca são guardados; contagem chegando a 0 remove a chave.
- **Estado do App.jsx**:
  - `contagens`: `Record<string, number>` — a coleção em memória.
  - `atualizadoEm`: `string | null` — carimbo formatado da última gravação (não um `Date`).
  - `historico`: array imutável de `{codigo, contagemAnterior}` — últimas 10 alterações, em memória (descartado ao recarregar).
  - `precisaAtestar`: `boolean` — se a conta precisa atestar maiores de idade.
  - `mostrarPolitica`: `boolean` — vista interna da política de privacidade.
  - `ordenacao`: `'pagina' | 'sigla'`.
  - `disposicao`: `'lista' | 'album'`.
  - `filtro`: `'todas' | 'faltantes' | 'coladas' | 'repetidas'`.
  - `user`: objeto do Firebase Auth ou `null`.
  - `authResolvido`: `boolean` — se o `onAuthStateChanged` já emitiu.
- **Preferências de vista**: lidas uma vez do `localStorage` na abertura (chave `iconula.preferencias-vista.v1`), com padrões por faixa de tela na primeira abertura.
- **Gravação agregada**: instância criada uma única vez por sessão, acumulando `alteracoes: Record<string, number>` (chaves alteradas desde a última gravação), com debounce de ~2s e teto de ~10s.
- **Catálogo estático**: embutido no bundle, nunca toca o Firestore — ver [MDR 0006](0006-catalogo-estatico-embutido.md).
- **Derivações do catálogo**: funções puras em `catalogoOrdenacoes.js` (`ordenarPorSigla`, `ordenarPorPagina`, `extrairSecoes`) e `catalogoLayout.js` (posições de página/linha/trilha) — propriedades do dado, sem efeito colateral.
- **Progresso**: calculado sob demanda por `calcularPlacar(contagens, codigosTodasFigurinhas)` → `{coladas, faltantes, repetidas, percentual}`; `percentual` é `Math.round((coladas / total) * 100)`.
- **Textos de troca**: uma linha por seção (`Nome SIG: nn nn nn`), ordem fixa do álbum (FWC abre, COC fecha), independente da ordenação vigente; número com dois dígitos; repetidas usam `nn×k` onde `k` é unidades sobrando (contagem − 1).
- **Avisos**: fila com limite de empilhamento (3), estrutura `{id, severidade, mensagem, detalhe, tipo}`; sucesso e aviso expiram em 5s; falha persiste; sucesso dispensa a falha do mesmo `tipo`; `id` é auto-incremento.
- **Colapso de seções e super-grupos**: volátil, some ao recarregar.

## Consequências

- Todo o estado da coleção vive em `App.jsx`, consumido por prop-drilling (sem Context).
- O histórico de desfazer é volátil — recarregar a página o descarta.
- As preferências de vista persistem no `localStorage`, por dispositivo, e custam zero requisição.
- O catálogo estático é imutável e igual para todos os usuários.
- O progresso é calculado sob demanda, não armazenado.

## Alternativas consideradas

- **Context para a coleção**: a árvore tem até três níveis, o prop-drilling ainda basta (ver [TDR 0014](../tdr/0014-estado-da-colecao-sem-context.md)). Descartado.
- **State manager global (Redux, Zustand)**: a árvore não exige; adicionaria complexidade sem benefício. Descartado.
- **Persistir o colapso de seções**: é volátil por decisão (IDR 0020). Descartado.
- **Persistir o histórico de desfazer**: é volátil por decisão (IDR 0012). Descartado.
