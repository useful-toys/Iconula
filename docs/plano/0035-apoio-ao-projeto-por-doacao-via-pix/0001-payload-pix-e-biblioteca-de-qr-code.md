<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0035-0001]: Payload Pix e biblioteca de QR code

## Status
Concluída

## Objetivo
Adicionar a biblioteca `qrcode` e criar a função pura que monta o payload
BR Code (EMV QRCPS-MPM) do Pix a partir da chave, do valor sugerido e dos
dados do recebedor — base para a vista da Tarefa 0035-0002.

## Documentos de referência
- `docs/tdr/0029-geracao-local-do-qr-code-pix.md` — biblioteca, chave,
  valor sugerido e dados do recebedor, todos com o valor exato decidido
- `src/lib/textoDeTroca.js` — exemplo de função pura a partir de dados
  fixos, molde de estilo para `src/lib/*.js`

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada — módulo novo em `src/lib/`, função pura
  e testável (`AGENTS.md` § Onde fica cada coisa).

## Escopo e instruções de implementação
1. `npm install qrcode` (dependência de produção).
2. Criar `src/lib/pix.js`, com os dados fixos como constantes do módulo:
   chave `cdbe7681-fb1a-44f5-8d26-9121ea3d0074`, valor `5.00`, nome do
   recebedor `Daniel Felix Ferber`, cidade `Campinas - SP`. Função pura
   `montarPayloadPix()` monta a string BR Code (EMV), em ordem: Payload
   Format Indicator (`00`); Merchant Account Information (`26`, com GUI
   `br.gov.bcb.pix` no subcampo `00` e a chave no subcampo `01`);
   Merchant Category Code (`52`, `"0000"`); Transaction Currency (`53`,
   `"986"`); Transaction Amount (`54`, `"5.00"`); Country Code (`58`,
   `"BR"`); Merchant Name (`59`, truncado a 25 caracteres); Merchant City
   (`60`, truncado a 15 caracteres); Additional Data Field Template
   (`62`, com txid genérico `"***"` no subcampo `05`); CRC16-CCITT
   (`63`), calculado sobre a string com `"6304"` já anexado ao final.
3. Testes de unidade (`src/lib/pix.test.js`): o payload contém os campos
   e valores esperados; o valor sai formatado com duas casas decimais; um
   nome/cidade maior que o limite é truncado; o CRC16 bate com um valor
   calculado à parte para o payload fixo do app.

**Fora do escopo**: renderização do QR code (Tarefa 0035-0002); qualquer
componente de interface.

## Decisões já tomadas (não reabrir)
- Biblioteca `qrcode`, chave aleatória, valor sugerido e dados do
  recebedor — ver `docs/tdr/0029-geracao-local-do-qr-code-pix.md`

## Arquivos impactados
- `package.json` — modificar (dependência `qrcode`)
- `package-lock.json` — modificar
- `src/lib/pix.js` — criar
- `src/lib/pix.test.js` — criar

## Critérios de aceite
- [ ] `qrcode` aparece em `dependencies` no `package.json` e resolve via
      `npm ls qrcode` — coberto por comando
- [ ] `montarPayloadPix()` retorna uma string BR Code com CRC16 correto
      para os dados fixos do app — coberto por `pix.test.js`
- [ ] O valor sai formatado com duas casas decimais (`5.00`) — coberto
      por teste
- [ ] Nome e cidade maiores que 25/15 caracteres são truncados nesse
      limite — coberto por teste
