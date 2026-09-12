<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0029: Avisos flutuantes na borda inferior, com três severidades

## Status

Aceito — **reverte** a decisão central do
[IDR 0017](0017-aviso-so-na-falha-com-detalhe-tecnico.md) ("só a falha
avisa") e retoma, com 5 segundos, a alternativa que ele havia
descartado. Preserva do 0017 o lugar (borda inferior), o detalhe técnico
ao toque e a proibição de log com scroll.

## Contexto

- O IDR 0017 tirou o aviso de sucesso do caminho: com o relógio no
  título cobrindo toda transação bem-sucedida, um "gravado" na tela
  seria redundância e ruído em rajada de registro. A decisão
  intermediária daquela sessão — sucessos efêmeros de ~4s na borda
  inferior — foi descartada por minimalismo.
- Dois fatos mudaram desde então:
  - O [IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md)
    amarrou o relógio ao `updatedAt` do documento. Ele deixou de tickar
    na carga, e mesmo na gravação o avanço de `12:34` para `12:35` é um
    sinal discreto demais para servir de confirmação
  - O [IDR 0024](0024-acoes-raras-em-menu-do-cabecalho.md) trouxe ações
    que **exigem** confirmação visível e não são persistência: copiar a
    lista de faltantes para a área de transferência não muda nada na
    tela, e sem retorno o usuário não sabe se funcionou
- O usuário decidiu: mensagens de erro, sucesso e aviso, todas
  flutuantes e grudadas na borda inferior; sucesso e aviso somem
  sozinhos em 5 segundos.

## Decisão

- A área de avisos é **flutuante** e fica sempre colada à **borda
  inferior** da janela: sobrepõe o conteúdo, não empurra o layout nem
  rola com a página
- Três severidades:
  - **Sucesso** — some sozinho após **5s**. Cobre gravado, carregado,
    lista copiada, coleção exportada e importada
  - **Aviso** — some sozinho após **5s**. Cobre a recusa esperada, em
    que nada quebrou: arquivo de importação inválido ou de versão
    desconhecida, área de transferência indisponível, e a gravação sem
    rede que ficou enfileirada no cache local (ADR 0008)
  - **Falha** — **persiste** até ser dispensada ou até a operação
    seguinte do mesmo tipo ter sucesso. Cobre o que deveria ter
    funcionado e não funcionou: gravação e carga
- Tocar na falha expande a mensagem técnica original, recolhida por
  padrão (mantido do IDR 0017)
- Poucas mensagens empilham no máximo; **nunca** vira log com scroll
  ([IDR 0008](0008-uma-unica-pagina-scrollavel.md))
- O relógio do título (IDR 0027) continua existindo, agora como registro
  do estado — "quando minha coleção foi salva" —, não mais como o único
  feedback de sucesso

## Consequências

- As ações do menu ganham o retorno que lhes faltava, sem inventar um
  mecanismo só para elas
- Volta algum ruído em rajada de registro: uma confirmação a cada
  gravação agregada. A gravação já é agregada (debounce ~2s, teto ~10s —
  [IDR 0003](0003-gravacao-agrega-ajustes.md)), então a frequência é de
  poucas mensagens por minuto, não uma por toque — foi essa agregação
  que tornou o aviso de sucesso viável de novo
- Flutuante em vez de sticky no fluxo: em telas curtas, a caixa tapa a
  última linha do catálogo enquanto está visível — aceito, já que
  sucesso e aviso duram 5s e a falha pode ser dispensada
- A severidade "aviso", reservada no IDR 0017 para eventos futuros,
  passa a ter uso no MVP
- Os testes cobrem a expiração: sucesso e aviso somem em 5s, falha fica

## Alternativas consideradas

- **Só a falha avisa** (IDR 0017 intacto): mínimo de ruído, mas deixa as
  ações do menu sem retorno e apoia a confirmação de gravação num
  relógio que muda um dígito
- **Sucesso só para as ações do menu**, gravação continuando silenciosa:
  menos ruído, mas duas regras diferentes para a mesma área da tela
- **Barra fixa no fluxo do documento** (sticky, como no protótipo):
  nunca tapa conteúdo, mas some ao rolar em telas longas — o oposto do
  que "sempre grudada na borda inferior" pede
