<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0028: Canal de contato montado em runtime

## Status

Aceito — implementação na Fase 0031, Tarefa 0031-0004.

## Contexto

- O e-mail do controlador está literal em dois arquivos
  (`PoliticaDePrivacidade.jsx` e `TermosDeUso.jsx`), dentro de
  `<a href="mailto:…">`.
- O [IDR 0061](../idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)
  multiplica as ocorrências: controlador, encarregado e direitos do
  titular passam a citar o mesmo canal.
- Endereço em `mailto:` no HTML servido é o padrão que raspadores de
  e-mail procuram.
- A SPA não renderiza nada sem JavaScript — a tela inteira depende dele
  (ADR 0001).

## Decisão

- `src/lib/contato.js` guarda o endereço em partes (`usuario`,
  `dominio`) e exporta uma função que as junta com
  `String.fromCharCode(64)`; o literal completo deixa de existir
  contíguo no bundle.
- `src/components/LinkDeContato.jsx` monta `href` e texto visível pela
  mesma função e leva `rel="nofollow noreferrer"`; substitui as duas
  âncoras literais.
- Alcance declarado no próprio módulo: derrota o raspador que lê HTML e
  busca padrão de e-mail, **não** o que executa JavaScript.

## Consequências

- Uma busca por texto no `dist/` deixa de encontrar o endereço — é o
  critério de aceite da tarefa.
- O endereço passa a ter um dono único no código: trocá-lo é editar um
  arquivo, não caçar ocorrências.
- Nenhuma perda de acessibilidade: sem JavaScript não há app, então não
  existe usuário que veria o texto e não veria o link.
- Um componente a mais em `src/components/`, com CSS e teste
  co-localizados (ADR 0007, ADR 0009).

## Alternativas consideradas

- **Formulário de contato**: resolveria de vez, sem expor endereço algum,
  mas exige backend para enviar — fora do plano Spark e do escopo do
  projeto.
- **Manter o literal**: nenhum custo de implementação, mas é exatamente
  a forma que os coletores procuram.
- **Ofuscação por CSS (texto invertido) ou entidades HTML**: continuam
  presentes no HTML servido e são desfeitas trivialmente; a entidade HTML
  em especial é normalizada por qualquer parser.
- **Imagem com o endereço**: some para leitor de tela e impede copiar —
  troca um problema por outro pior.
