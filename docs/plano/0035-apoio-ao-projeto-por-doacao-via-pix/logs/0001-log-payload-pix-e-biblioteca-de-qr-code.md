<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0035-0001: Payload Pix e biblioteca de QR code

## Data
2026-09-18

## Resumo
Adiciona a dependência de produção `qrcode` e cria `src/lib/pix.js`, a
função pura que monta o payload BR Code (EMV QRCPS-MPM) do Pix. Antes não
havia biblioteca de QR code nem módulo de Pix no projeto; agora existe a
base para a vista "Apoie o projeto" (Tarefa 0035-0002). Os dados do
recebedor ficam como constantes do módulo, conforme o
[TDR 0029](../../../tdr/0029-geracao-local-do-qr-code-pix.md).

## Discovery
- Código: `src/lib/` segue o padrão `nome.js` + `nome.test.js` com
  `Copyright (c) 2026 Daniel Felix Ferber`, JSDoc e funções puras
  (`src/lib/textoDeTroca.js` foi o molde). `package.json` tinha só
  `@twemoji/api`, `firebase`, `react` e `react-dom` em `dependencies` —
  o comportamento atual confere com a tarefa (não existia `pix.js` nem
  `qrcode`). A Tarefa 0035-0002 chama `montarPayloadPix()` sem argumentos,
  então a assinatura pública precisa continuar compatível.
- Documentação: as referências bastaram; lido ainda o
  [IDR 0070](../../../idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md)
  para confirmar que a vista consome a chave e o payload como conteúdo
  estático, sem Firestore.

## Plano da alteração
1. `npm install qrcode` — dependência de produção, nada de setup de
   infraestrutura remota, registrado em § Setup.
2. Criar `src/lib/pix.js`: constantes da chave, valor, nome e cidade;
   helper de campo `ID + tamanho (2 dígitos) + valor`; CRC16-CCITT; e
   `montarPayloadPix()` na ordem EMV (00, 26/00–01, 52, 53, 54, 58, 59,
   60, 62/05, 63), truncando nome a 25 e cidade a 15.
3. Criar `src/lib/pix.test.js`: campos e valores esperados, valor com
   duas casas, truncamento de nome/cidade e CRC16 conferido por uma
   implementação independente no próprio teste.
4. Atualizar o `## Status` da tarefa, a linha do README (fase e tarefa) e
   este log no commit final.

- Verificação prevista:
  - `qrcode` em `dependencies` → `npm ls qrcode`;
  - payload com CRC correto → teste que recalcula o CRC à parte;
  - valor `5.00` → teste sobre o campo `54`;
  - truncamento 25/15 → teste com nome/cidade longos.
- Riscos: assinatura de `montarPayloadPix()` precisar de parâmetros para
  testar o truncamento (resolvido com overrides opcionais, decisão de
  nível 1); CRC implementado errado passa despercebido se o teste repetir
  a mesma fórmula (resolvido com implementação independente e valor
  esperado fixo).
- Desvios: nenhum.

## Decisões tomadas
- `montarPayloadPix()` aceita `{ nome, cidade }` opcionais (com os dados
  fixos como padrão) para que o truncamento de 25/15 caracteres seja
  testável ponta a ponta pelo payload; a Tarefa 0035-0002 continua
  chamando sem argumentos. Nível 1 (API interna), sem registro próprio.
- O módulo exporta também `chavePix`, para que a vista da Tarefa
  0035-0002 exiba/copie a chave em texto sem recriar o dado — o objetivo
  da tarefa é ser "base para a vista". Nível 1 (API interna), sem
  registro próprio.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum (instalação de dependência de produção local, sem configuração de
ambiente remoto).

## Validação
- `npm install qrcode`:
  ```
  added 20 packages, and audited 224 packages in 3s
  found 0 vulnerabilities
  ```
- `npm ls qrcode`:
  ```
  iconula@0.0.0 /workspaces/Iconula/.worktrees/feature-apoia_projeto_com_doacao_pix-0035
  └── qrcode@1.5.4
  ```
- `npm run lint` (oxlint): sem avisos.
- `npm run test`: `Test Files 51 passed (51)`, `Tests 676 passed (676)`.
- `npm run build`: `✓ built in 1.76s`; aviso de chunk >500 kB já
  pré-existente (bundle do Firebase), não introduzido por esta tarefa —
  `qrcode` ainda não é importado por nenhum componente.

## Critérios de aceite
- [x] `qrcode` aparece em `dependencies` no `package.json` e resolve via
      `npm ls qrcode` — `qrcode@1.5.4`; `package.json` com
      `"qrcode": "^1.5.4"`
- [x] `montarPayloadPix()` retorna uma string BR Code com CRC16 correto
      para os dados fixos do app — `src/lib/pix.test.js:80` confere com
      implementação independente e com o payload fixo `…6304DD5B`
- [x] O valor sai formatado com duas casas decimais (`5.00`) — teste
      `formata o valor com duas casas decimais` (`src/lib/pix.test.js:57`)
- [x] Nome e cidade maiores que 25/15 caracteres são truncados nesse
      limite — teste `trunca nome e cidade nos limites do BR Code`
      (`src/lib/pix.test.js:62`)

## Arquivos alterados
- `package.json` — dependência `qrcode`
- `package-lock.json` — dependência `qrcode`
- `src/lib/pix.js` — novo
- `src/lib/pix.test.js` — novo
