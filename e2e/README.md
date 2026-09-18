<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# `e2e/`

Testes end-to-end (Playwright), rodando contra os emuladores do Firebase
(Auth e Firestore). Segunda exceção à co-localização de testes — ver
[ADR 0009](../docs/adr/0009-testes-co-localizados.md) e
[ADR 0010](../docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)
e a visão geral de [docs/teste-e2e.md](../docs/teste-e2e.md).

Specs:

- `catalogo.spec.js` — fumaça: login instantâneo + fixture no placar;
- `catalogoCompartilhado.spec.js` — vista do link sem login
  ([IDR 0055](../docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md));
- `apagarDados.spec.js` — exclusão da coleção e da conta pelo painel da
  política, sem reautenticação (login recente)
  ([IDR 0060](../docs/idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md),
  [TDR 0027](../docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md)).
