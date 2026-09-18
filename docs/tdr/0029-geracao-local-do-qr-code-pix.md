<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0029: Geração local do QR code Pix, chave aleatória e valor sugerido no payload

## Status

Aceito.

## Contexto

- A vista "Apoie o projeto" ([IDR 0070](../idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md))
  precisa gerar a imagem de um QR code Pix (padrão BR Code / EMV
  QRCPS-MPM do Banco Central) a partir de uma chave Pix.
- O projeto não tem biblioteca de geração de QR code
  (`package.json`: só `@twemoji/api` e `firebase` em `dependencies`).
- NFR de economia de requisições e ausência de backend (plano Spark)
  restringem soluções que dependam de serviço externo ou de servidor
  próprio.
- Precedente de vendorização sem CDN externo: fontes
  ([TDR 0013](0013-tipografia-vendorizada.md)) e ícones
  ([TDR 0026](0026-icones-material-symbols-vendorizados-como-svg.md)) —
  nada de terceiro em runtime.
- O padrão BR Code exige, além da chave, um "nome do recebedor" (até 25
  caracteres) e uma "cidade do recebedor" (até 15 caracteres) no payload.

## Decisão

- **Biblioteca local** (tipo `qrcode`, sem dependências, gera SVG/canvas
  no navegador), sem chamada de rede — mesma lógica de "nada de terceiro
  em runtime" das fontes e dos ícones.
- **Função pura** para montar o payload BR Code (no molde de
  `src/lib/textoDeTroca.js`), incluindo:
  - Chave Pix **aleatória** (nunca CPF, e-mail ou telefone) — evita expor
    outro dado pessoal do mantenedor além do necessário para receber o
    Pix. Valor fornecido pelo humano no esmiuçamento:
    `cdbe7681-fb1a-44f5-8d26-9121ea3d0074`.
  - Valor da transação preenchido com **R$5,00** (campo opcional do BR
    Code) — a maioria dos apps de banco mostra como sugestão editável,
    não trava o valor.
  - Nome do recebedor e cidade, fornecidos pelo humano no esmiuçamento:
    `Daniel Felix Ferber` (19 caracteres) e `Campinas - SP` (13
    caracteres) — dentro dos limites de 25 e 15 caracteres do BR Code.
- A chave, o valor sugerido e o nome/cidade ficam **em código**, não em
  `.env`: são dados públicos por natureza — o propósito é serem vistos
  por qualquer visitante —, não segredos.

## Consequências

- Nova dependência de produção (`qrcode` ou equivalente) — a primeira
  desde `firebase` e `@twemoji/api`.
- Novo módulo `src/lib/pix.js` (nome provisório) com função pura de
  montagem do payload, testável no mesmo padrão de `src/lib/*.test.js`.
- Implementação: a planejar (`/planejar`).

## Alternativas consideradas

- **Serviço externo de geração de imagem** (ex.: api.qrserver.com):
  descartado — manda a chave Pix para um terceiro a cada carregamento da
  vista, abre a CSP para um novo domínio e falha offline.
- **Campo de valor vazio no payload**: descartado pelo humano — prefere o
  valor sugerido preenchido, menos atrito para quem concorda com R$5.
- **Chave por e-mail, telefone ou CPF/CNPJ**: descartada — expõe outro
  dado pessoal do mantenedor além do necessário para receber doações.

## Histórico

- 2026-09-18 — Criado no esmiuçamento de QR code Pix para doações;
  implementação a planejar.
