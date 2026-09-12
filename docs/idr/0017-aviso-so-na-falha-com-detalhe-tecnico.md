<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0017: Aviso apenas na falha — com detalhe técnico

## Status

Aceito — resolve a pendência de desenho da área de avisos de
interface.md, refinando o
[IDR 0002](0002-avisos-de-sincronizacao-visiveis.md). Um ponto do
raciocínio foi corrigido pelo
[IDR 0027](0027-relogio-do-titulo-e-o-updatedat-do-documento.md): o
relógio do título é o `updatedAt` do documento, então ele ticka na
gravação, **não** na carga — o feedback de sucesso continua sendo só
ele, mas cobre a escrita, não a leitura. E a decisão central — "só a
falha avisa" — foi **revertida** pelo
[IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md): sucesso e
aviso voltam, flutuantes na borda inferior, sumindo em 5s; a falha
persiste, com o detalhe técnico ao toque, como decidido aqui.

## Contexto

- O IDR 0002 tornou os eventos de persistência visíveis (gravado,
  carregado, falha) — reação à falha invisível da era do botão
  (ADR 0007) —, com o desenho da área em aberto: notificar sem virar
  ruído. Na época, "avisar só em erro" foi descartado: sem um estado
  normal visível, o erro sozinho não dizia se os dados estavam salvos.
- O quadro mudou com o título em linha única (IDR 0018): a data/hora
  passou a cobrir **toda transação bem-sucedida** (leitura ou escrita)
  — ticka a cada gravação e a cada carga. O sucesso ganhou feedback
  permanente e sem ruído; um aviso de "gravado" seria redundância.
  Ficou para o aviso só o que o título não cobre: a falha, que não
  ticka nada.
- Decisão intermediária desta sessão — sucessos efêmeros (~4s) na borda
  inferior — foi descartada pelo usuário por minimalismo: a data no
  título já basta.

## Decisão

- Sucessos (gravado, carregado) **não geram aviso**: a data/hora no
  título atualiza — esse é o feedback
- Só a **falha** avisa: caixa vermelha junto à borda inferior da
  tela, fica até ser dispensada ou até a gravação seguinte ter
  sucesso
- Tocar na caixa de falha expande a mensagem técnica (erro original,
  para diagnóstico) — recolhida por padrão
- Poucas falhas empilham no máximo; nunca log com scroll (IDR 0008)
- Severidades info/warning ficam reservadas a eventos futuros —
  nenhum evento do MVP as usa

## Consequências

- Zero ruído em rajada de registro — o título ticka e pronto
- "Os dados atuais estão salvos?" se lê no título: hora recente =
  salvo; a falha, quando existe, avisa por cima
- Retoma a alternativa "avisar só em erro" descartada pelo IDR 0002 —
  viável agora porque a data/hora do título cobre o estado normal
- Perde-se o evento "carregado" explícito no login — coberto pela
  hora da carga no título
- Fluxos de teste cobrem: sucesso → título atualiza, sem aviso;
  falha → aviso fica + expande

## Alternativas consideradas

- **Sucessos efêmeros (~4s) + falha persistente**: decisão
  intermediária desta sessão — descartada pela redundância com a
  data do título
- **Avisos de todos os eventos (IDR 0002 literal)**: confirmação
  explícita de cada gravação, ruído em rajada
- **Avisos no cabeçalho**: disputariam o espaço mais caro da tela
- **Detalhe técnico sempre visível**: assusta o usuário comum
