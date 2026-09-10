<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0004-0005: preferências de vista no `localStorage`

## Data
2026-09-10

## Resumo
Implementada a persistência das preferências de vista — ordenação, disposição e
filtro — no `localStorage` do navegador, por dispositivo, com degradação segura
quando o storage está ausente ou bloqueado (IDR 0026). O colapso de seções e
super-grupos continua volátil (IDR 0020).

### O que foi feito

1. **`src/lib/preferenciasDeVista.js`** (novo): módulo que lê e grava as três
   preferências numa única chave nomeada e versionada
   (`iconula.preferencias-vista.v1`) guardando um objeto. Decisão da tarefa:
   uma chave com um objeto para que a validação e o descarte sejam de uma vez
   só. Toda chamada ao `localStorage` está dentro de `try/catch`, inclusive o
   acesso ao objeto `window.localStorage`, que já lança em alguns contextos
   (navegação privada, storage desabilitado). Valores fora do domínio
   conhecido, JSON quebrado e objeto não-plano caem no padrão da preferência
   afetada, em silêncio e sem `console.error` ruidoso. Na gravação, valores
   inválidos são substituídos pelo padrão antes de salvar; falha de escrita é
   ignorada.

2. **`src/App.jsx`**: lê as preferências uma vez na abertura (estado inicial
   lazy via `useState(() => lerPreferenciasDeVista())`) e grava em `useEffect`
   que ignora a primeira renderização, disparando só quando o usuário troca um
   alternador. Assim, o app abre no modo da última sessão e cada troca de
   ordenação/disposição/filtro persiste. O colapso de seções não é tocado —
   nenhum estado de colapso passa por essas funções.

3. **Testes**:
   - `preferenciasDeVista.test.js` (10 testes): padrões quando nada gravado,
     grava e restaura cada preferência, valor fora do domínio, JSON quebrado,
     objeto não-plano, `localStorage` que lança em leitura e em escrita, e a
     sanitização na gravação.
   - `App.test.jsx` (2 testes novos): trocar a ordenação grava no
     `localStorage`; abrir com preferências guardadas restaura os três
     alternadores.

### Decisão encaminhada
Uma chave versionada com um objeto — o encaminhamento da própria tarefa. Sem
TDR novo, conforme o texto ("nasce um TDR se a escolha for outra").

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface foi tomada — o
comportamento já estava especificado nos IDRs 0020, 0026, em `persistencia.md`
§ O que não vai para o Firestore e em `requisitos.md` § UX. A escolha "uma
chave com um objeto" seguiu o encaminhamento explícito da tarefa.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 39 arquivos.
- `vitest run`: 16 arquivos de teste, 137 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (386.34 kB JS,
  8.55 kB CSS).

## Arquivos alterados
- `src/lib/preferenciasDeVista.js` — criar
- `src/lib/preferenciasDeVista.test.js` — criar (10 testes)
- `src/App.jsx` — leitura na abertura e gravação ao trocar alternador
- `src/App.test.jsx` — 2 testes novos de persistência
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/0005-preferencias-de-vista-no-localstorage.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0005 atualizado
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0005-log-preferencias-de-vista-no-localstorage.md` — este log