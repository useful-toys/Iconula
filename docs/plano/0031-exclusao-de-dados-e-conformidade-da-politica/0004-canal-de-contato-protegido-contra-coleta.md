<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0004]: canal de contato protegido contra coleta

## Status
Concluída

## Objetivo

Tirar o e-mail do controlador do HTML servido antes de a Tarefa
0031-0005 multiplicar suas ocorrências: o endereço passa a existir em
partes num módulo e a ser montado em runtime por um componente único.

## Documentos de referência

- `docs/tdr/0028-canal-de-contato-montado-em-runtime.md` § Decisão — a
  técnica, e o alcance que ela tem e não tem.
- `docs/adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md`
  — módulos de lógica em `src/lib/`, componentes em `src/components/`.
- `docs/adr/0008-css-modular-por-componente.md` — CSS co-localizado.

## Padrões e convenções aplicáveis

- Componente novo em `src/components/`, com CSS e teste co-localizados.
- Arquivo novo abre com o cabeçalho de copyright.
- Nada de `dangerouslySetInnerHTML` — o lint trata `react/no-danger`
  como erro.

## Escopo e instruções de implementação

1. Criar `src/lib/contato.js` guardando o endereço em partes e expondo
   uma função que as junta em runtime, sem que o endereço completo
   exista como literal contíguo no código. Documentar no próprio módulo
   o alcance da proteção, conforme o TDR 0028.
2. Criar `src/components/LinkDeContato.jsx` (com CSS e teste
   co-localizados) que monta `href` e texto visível pela mesma função e
   marca o link como não seguível.
3. Substituir as duas âncoras `mailto:` literais de
   `PoliticaDePrivacidade.jsx` e `TermosDeUso.jsx` pelo componente.
4. Atualizar `docs/interface.md` §§ Política de privacidade e Termos de
   uso, registrando que o contato é um componente comum às duas vistas;
   e `AGENTS.md` § Onde fica cada coisa, com os dois arquivos novos.

**Fora do escopo**: o conteúdo novo da política e dos termos (Tarefa
0031-0005); qualquer mudança no endereço em si.

## Decisões já tomadas (não reabrir)

- A técnica, e a recusa do formulário de contato e das ofuscações por
  CSS ou entidade HTML — ver
  `docs/tdr/0028-canal-de-contato-montado-em-runtime.md`.
- O e-mail publicado continua sendo o atual — ver
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.

## Arquivos impactados

- `src/lib/contato.js` — criar
- `src/lib/contato.test.js` — criar
- `src/components/LinkDeContato.jsx` — criar
- `src/components/LinkDeContato.css` — criar
- `src/components/LinkDeContato.test.jsx` — criar
- `src/components/PoliticaDePrivacidade.jsx` — modificar
- `src/components/TermosDeUso.jsx` — modificar
- `docs/interface.md` — modificar (§ Política de privacidade, § Termos de
  uso)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite

- [ ] Depois de `npm run build`, uma busca pelo endereço completo em
      `dist/` não encontra nada
- [ ] O teste do componente confirma que o `href` montado é o endereço
      correto e que o texto visível bate com ele
- [ ] Nenhuma âncora `mailto:` literal resta em `src/` (verificável por
      busca)
- [ ] `npm run lint && npm run test && npm run build` verdes
