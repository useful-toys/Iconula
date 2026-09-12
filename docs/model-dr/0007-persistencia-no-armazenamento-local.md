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
  - Celular (≤512px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Tablet (513–1024px): `ordenacao: 'pagina'`, `disposicao: 'album'`
  - Navegador (>1024px): `ordenacao: 'sigla'`, `disposicao: 'lista'`
  - Filtro sempre começa em `'todas'`
- **Campos inválidos**: se existe um objeto gravado mas algum campo está fora do domínio conhecido, a faixa é ignorada e o campo inválido cai no padrão neutro fixo (`ordenacao: 'pagina'`, `disposicao: 'lista'`, `filtro: 'todas'`).
- **Falha de leitura ou escrita**: ignorada em silêncio, segue com o padrão.
- **Persistência**: por dispositivo, zero requisição ao Firestore.

### IndexedDB — cache do SDK do Firestore

- **Configuração**: `persistentLocalCache` com `persistentMultipleTabManager()`.
- **Propósito**: espelha o documento do Firestore e sustenta o flush de gravações pendentes.
- **Multi-aba obrigatório**: no modo padrão (aba única) a segunda aba não obtém o lease do IndexedDB e perde o cache, e com ele a garantia de flush.
- **Escritas pendentes**: sobrevivem ao fechamento da aba e completam na carga seguinte.
- **Sem rede**: a escrita não falha nem confirma — fica enfileirada no cache local e a promise só resolve quando o servidor responder.

## Consequências

- Preferências de vista são por dispositivo, não seguem o usuário entre dispositivos.
- O colapso de seções e super-grupos é volátil (não persiste).
- O histórico de desfazer é volátil (não persiste).
- Escritas pendentes no Firestore sobrevivem ao fechamento da aba.
- Cargas repetidas podem servir do cache IndexedDB, sem leitura ao servidor.

## Alternativas consideradas

- **Persistir preferências no Firestore**: acompanhariam o usuário entre dispositivos, mas custariam leitura/escrita à toa e não são dados que o usuário espera sincronizar. Descartado.
- **Persistir o histórico de desfazer**: aumentaria a complexidade sem benefício claro — o desfazer é para ajustes imediatos, não para histórico de longo prazo. Descartado.
- **Persistir o colapso de seções**: é volátil por decisão de interface (IDR 0020). Descartado.
- **Fila própria de flush em `localStorage`**: reinventaria a fila que o SDK já mantém com o cache IndexedDB. Descartado.
- **Cache do Firestore sem `persistentMultipleTabManager()`**: a segunda aba perderia o cache e a garantia de flush. Descartado.
