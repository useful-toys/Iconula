<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0007: Persistência no armazenamento local

## Status

Aceito.

## Contexto

- A aplicação precisa persistir dados entre sessões sem custo de rede.
- Alguns dados são específicos do dispositivo (preferências de vista).
- Outros dados precisam sobreviver ao fechamento da aba (escritas pendentes no Firestore).

## Decisão

### localStorage — preferências de vista

- **Chave**: `iconula.preferencias-vista.v1` (versionada).
- **Formato**: JSON com `{ordenacao, disposicao, filtro}`.
- **Domínios válidos**:
  - `ordenacao`: `'pagina' | 'sigla'`
  - `disposicao`: `'lista' | 'album'`
  - `filtro`: `'todas' | 'faltantes' | 'coladas' | 'repetidas'`
- **Padrões por faixa de tela** (primeira abertura, sem preferência gravada):
  - Celular (≤582px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Tablet (583–1024px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Navegador (>1024px): `ordenacao: 'sigla'`, `disposicao: 'lista'`
  - Filtro sempre começa em `'todas'`
- **Campos inválidos**: se existe um objeto gravado mas algum campo está fora do domínio conhecido, a faixa é ignorada e o campo inválido cai no padrão neutro fixo (`ordenacao: 'pagina'`, `disposicao: 'lista'`, `filtro: 'todas'`).
- **Falha de leitura ou escrita**: ignorada em silêncio, segue com o padrão.
- **Persistência**: por dispositivo, zero requisição ao Firestore.

### localStorage — colapso manual de seções e super-grupos

- **Chave**: `iconula.colapso-manual.v1` (versionada), separada das
  preferências de vista — o dado é um conjunto, não um enum de domínio.
- **Formato**: JSON com `{secoes, grupos}`, listas de siglas de seção
  (ex.: `BRA`) e de letras de super-grupo (ex.: `C`).
- **Semântica**: presente na lista = fechado à mão; ausente = aberto. Só o
  que o usuário (ou o salto, ao abrir o alvo) mudou é gravado; nunca o
  catálogo inteiro.
- **Valores desconhecidos**: siglas e letras fora do catálogo são ignoradas
  na leitura.
- **Falha de leitura ou escrita**: ignorada em silêncio, tudo aberto
  ([IDR 0026](../idr/0026-preferencias-de-vista-persistidas-no-navegador.md)).
- **Persistência**: por dispositivo, zero requisição ao Firestore; o colapso
  é decisão de interface ([IDR 0020](../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md),
  implementação na Fase 0012, Tarefa 0012-0001).

### IndexedDB — cache do SDK do Firestore

- **Configuração**: `persistentLocalCache` com `persistentMultipleTabManager()`.
- **Propósito**: espelha o documento do Firestore e sustenta o flush de gravações pendentes.
- **Multi-aba obrigatório**: no modo padrão (aba única) a segunda aba não obtém o lease do IndexedDB e perde o cache, e com ele a garantia de flush.
- **Escritas pendentes**: sobrevivem ao fechamento da aba e completam na carga seguinte.
- **Sem rede**: a escrita não falha nem confirma — fica enfileirada no cache local e a promise só resolve quando o servidor responder.

## Consequências

- Preferências de vista e o colapso manual são por dispositivo, não seguem o
  usuário entre dispositivos.
- O colapso manual de seções e super-grupos persiste no `localStorage` e volta
  na próxima abertura, em duas chaves versionadas independentes.
- O histórico de desfazer é volátil (não persiste).
- Escritas pendentes no Firestore sobrevivem ao fechamento da aba.
- Cargas repetidas podem servir do cache IndexedDB, sem leitura ao servidor.

## Alternativas consideradas

- **Persistir preferências no Firestore**: acompanhariam o usuário entre dispositivos, mas custariam leitura/escrita à toa e não são dados que o usuário espera sincronizar. Descartado.
- **Persistir o histórico de desfazer**: aumentaria a complexidade sem benefício claro — o desfazer é para ajustes imediatos, não para histórico de longo prazo. Descartado.
- **Guardar o colapso na mesma chave das preferências de vista**: uma chave só, mas misturaria um conjunto sem padrão por faixa de tela com os enums validados por domínio; separado em chave própria. Descartado.
- **Persistir o colapso no Firestore**: sincronizaria entre dispositivos, mas é preferência do aparelho e custaria escrita por toque. Descartado.
- **Fila própria de flush em `localStorage`**: reinventaria a fila que o SDK já mantém com o cache IndexedDB. Descartado.
- **Cache do Firestore sem `persistentMultipleTabManager()`**: a segunda aba perderia o cache e a garantia de flush. Descartado.

## Histórico

- 2026-09-14 — Fase 0017, Tarefa 0017-0004: o limite celular/tablet passa
  de 512px para 582px, com o cartão de 60×84px e as trilhas de 60px do
  [IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md); os padrões
  por faixa não mudam, só o ponto de quebra, recalculado no
  [IDR 0043](../idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md).
- 2026-09-13 — Fase 0012, Tarefa 0012-0001: o colapso manual de seções e
  super-grupos passa a persistir numa segunda chave versionada
  (`iconula.colapso-manual.v1`); antes era volátil (decisão original do
  [IDR 0020](../idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md),
  revista no planejamento das Fases 11–17).
