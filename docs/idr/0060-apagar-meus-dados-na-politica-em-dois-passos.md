<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0060: Apagar meus dados vive na política, em painel de dois passos

## Status

Aceito — implementação na Fase 0031, Tarefa 0031-0003.

## Contexto

- `requisitos.md` § Privacidade declarava a exclusão dentro do app como
  requisito futuro; ela é promovida a requisito vigente nesta mesma
  entrega, para atender o direito de eliminação (LGPD art. 18, VI) sem
  depender de e-mail.
- O menu de ações do cabeçalho ([IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md))
  é o lugar de "Sair da conta" — um comando vizinho e inofensivo. Pôr
  ali um comando irreversível convida ao acidente.
- O [IDR 0010](0010-desfazer-ajustes-em-vez-de-confirmacoes.md) rejeita
  confirmação cega; o [IDR 0041](0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md)
  aceitou `window.confirm()` para a importação, que é substituição, não
  exclusão da conta.
- O [TDR 0020](../tdr/0020-privacidade-como-vista-interna.md) checa a
  vista interna **antes** da guarda de login: a política continua
  montada mesmo depois de a sessão acabar.

## Decisão

- O comando vive na seção "Direitos do titular" da política
  (`PoliticaDePrivacidade.jsx`), **não** no menu de ações.
- Três estados na própria vista, sem `window.confirm()`:
  1. **Repouso** — botão "Apagar meus dados" e uma linha dizendo que
     apaga a coleção e a conta de login, mas não a conta Google.
  2. **Confirmando** — painel que lista o que será apagado, oferece
     "Exportar minha coleção antes" (a mesma exportação do menu de
     ações) e traz "Apagar definitivamente" ao lado de "Cancelar"; os
     botões ficam desabilitados enquanto a operação está em voo.
  3. **Apagado** — "Seus dados foram apagados" e um botão que devolve à
     tela de login.
- O bloco só aparece com sessão: antes de autenticar e na vista aberta
  pelo link do catálogo ([IDR 0055](0055-catalogo-compartilhado-por-link-somente-leitura.md)),
  a seção mostra apenas o canal de contato.

## Consequências

- A confirmação final sobrevive ao fim da sessão: quando
  `onAuthStateChanged` zera o usuário, a política continua montada
  (TDR 0020) e o estado 3 permanece na tela.
- Por isso a mensagem de sucesso **não** usa a fila de avisos
  ([IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md)): `Avisos`
  não é renderizado na tela de login, e o aviso se perderia.
- O menu de ações continua com três itens, sem crescer.
- A exportação passa a ser alcançável de dois lugares — o menu e o
  painel —, sempre pela mesma função.
- A política deixa de ser só leitura: é a primeira vista interna com uma
  ação que altera dados.

## Alternativas consideradas

- **Item no menu de ações (IDR 0024)**: alcance melhor, mas põe uma ação
  irreversível encostada em "Sair da conta", que o usuário aciona com
  frequência — o risco de acidente foi o motivo declarado da recusa.
- **`window.confirm()`, como a importação (IDR 0041)**: reusaria o único
  padrão de confirmação existente, mas o diálogo nativo não comporta a
  explicação do que será apagado nem o atalho de exportar antes.
- **Exigir digitar "APAGAR"**: atrito máximo contra o acidente,
  desproporcional para um app de figurinhas; o painel de dois passos com
  a reautenticação do Google ([TDR 0027](../tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md))
  já são duas barreiras.
- **Aviso de sucesso na fila do IDR 0029**: descartado pelo motivo acima
  — a tela de login não renderiza `Avisos`.
