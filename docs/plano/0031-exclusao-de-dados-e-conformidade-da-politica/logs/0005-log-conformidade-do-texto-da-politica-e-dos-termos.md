<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0005: conformidade do texto da política e dos termos

## Data
2026-09-17

## Resumo
A política e os termos passam a ser documentos de conformidade (IDR 0061).
Antes: a política declarava dados, finalidade, local, retenção e direitos,
mas não dizia quem é o controlador, com que base legal trata, nem que a
identidade é processada fora do Brasil, nem o prazo de retenção; afirmava
"Nenhum outro dado é tratado" — falso, já que há `localStorage` e cache
IndexedDB — e dizia que apagar de dentro do app era "um recurso planejado,
ainda não disponível", contradizendo o painel da Tarefa 0031-0003. Depois:
as duas vistas abrem com "Última atualização" (17 de setembro de 2026, o
mesmo `<time dateTime="2026-09-17">`), e a política ganha as seções
"Controlador e encarregado" (Daniel Felix Ferber, sem CPF nem endereço),
"Base legal" (art. 9º, I, por finalidade), "Operador e transferência
internacional" (Google operador; identidade global pelo Firebase Auth;
cláusulas-padrão) e "Armazenamento local" (`localStorage` e IndexedDB,
funcionais e não enviados, sem banner de cookies); "Retenção" traz os dois
prazos (24 meses sem login; até 90 dias após o encerramento) e "Direitos do
titular" aponta o painel de exclusão e a portabilidade pela exportação JSON
(art. 18, V). `docs/interface.md` passa a listar o conteúdo novo das duas
vistas. Os testes das duas vistas cobrem as seções novas, a data igual e os
prazos; nenhum código de produto mudou além do texto.

## Discovery
- Código: as duas vistas são componentes de apresentação; só a política tem
  estado local (painel "Apagar meus dados", Tarefa 0031-0003). Testes em RTL
  + `userEvent` + `jest-dom`, co-localizados. `TermosDeUso.test.jsx` afirma a
  ordem exata dos `h2` por `container.querySelectorAll(".termos__corpo h2")`
  — inserir seção exige atualizar a lista `SECOES`. `PoliticaDePrivacidade.test.jsx`
  verifica por `getByRole("heading")` e por texto exato (regex) da frase do
  IDR 0055 em "Onde os dados ficam", que permanece; o teste de contato checa
  `dff4321@gmail.com`, preservado. Os CSS já estilizam `h2`, `p`, `a` e
  `code`, então a linha de vigência reusa `.politica__corpo p` /
  `.termos__corpo p`, sem arquivo de estilo novo. Comportamento atual confere
  com a tarefa; nenhum impacto fora de "Arquivos impactados".
  - A frase de "Retenção" hoje diz que apagar é "um recurso planejado, ainda
    não disponível": contradiz o painel entregue na Tarefa 0031-0003 e é
    corrigida aqui (observação das tarefas anteriores).
- Documentação: as referências não bastaram sozinhas — li o IDR 0061 inteiro
  (o conteúdo item a item), `requisitos.md` § Privacidade (os requisitos que o
  texto cumpre, sobretudo base legal, operador/transferência, retenção e
  armazenamento local), o MDR 0007 (o que vive no `localStorage` e no cache
  IndexedDB), o MDR 0009 (a data de vigência em ISO como versão, com o
  exemplo `"2026-09-17"`), a Tarefa 0032-0004 (prazo de 15 dias e
  identificação pelo e-mail da conta ficam fora desta tarefa) e o IDR 0055
  § Decisão › Política de privacidade (as frases de "Onde os dados ficam" e
  de "Link do catálogo", que permanecem).

## Plano da alteração
1. `src/components/PoliticaDePrivacidade.jsx` — "Última atualização" no topo
   (`<time dateTime="2026-09-17">17 de setembro de 2026</time>`); nova seção
   "Controlador e encarregado"; `Dados tratados` sem a frase "Nenhum outro
   dado é tratado"; nova seção "Base legal"; nova seção "Operador e
   transferência internacional"; nova seção "Armazenamento local"; `Retenção`
   com os dois prazos e sem a menção de recurso planejado; `Direitos do
   titular` apontando o painel e a exportação JSON como portabilidade. Mantém
   "Onde os dados ficam" (frase do IDR 0055) e "Link do catálogo".
2. `src/components/TermosDeUso.jsx` — a mesma "Última atualização" no topo e
   o mesmo bloco "Controlador e encarregado".
3. `src/components/PoliticaDePrivacidade.test.jsx` e
   `src/components/TermosDeUso.test.jsx` — cobrir as seções novas, a data
   igual nos dois textos, os dois prazos, a portabilidade e a ausência da
   frase "Nenhum outro dado é tratado".
4. `docs/interface.md` §§ Política de privacidade e Termos de uso — a lista do
   conteúdo de cada vista com as seções novas (lastro: IDR 0061).
5. Validação: `npm run lint && npm run test && npm run build`; buscas dos
   critérios; roteiro visual pendente (sem navegador aqui).
- Verificação prevista: critério 1 → teste das headings + trecho de
  controlador sem CPF/endereço; critério 2 → trecho "Base legal"; critério 3
  → trecho de operador/transferência; critério 4 → trecho de retenção com os
  dois prazos; critério 5 → trecho de portabilidade (art. 18, V); critério 6
  → trecho de armazenamento local sem banner; critério 7 → mesmo `<time>` nos
  dois testes; critério 8 → busca negativa por "Nenhum outro dado".
- Riscos: quebrar a asserção de ordem dos `h2` em `TermosDeUso.test.jsx`
  (tratado ao atualizar `SECOES`); duplicar a data entre as duas vistas e
  divergir (mitigado por usar o mesmo literal `2026-09-17` e por teste).
- Desvios: nenhum.

## Decisões tomadas
- Formato da data de vigência no topo: `<time dateTime="2026-09-17">` com o
  texto "17 de setembro de 2026", reusando os estilos de `p` já existentes
  (sem CSS novo) e com a data legível por máquina que o MDR 0009 espera para
  a versão do aceite — nível 1, apresentação interna.
- Nome e posição das seções novas, seguindo a ordem do IDR 0061 — nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` → `Found 0 warnings and 0 errors.` (96 arquivos, 105 regras).

`npm run test` → `Test Files 47 passed (47)` / `Tests 619 passed (619)`.
Novos: um em `PoliticaDePrivacidade.test.jsx` ("declara o conteúdo de
conformidade do IDR 0061") e um em `TermosDeUso.test.jsx` ("repete o
controlador e a data de vigência da política"); os testes existentes seguem
verdes (as frases do IDR 0055 foram preservadas).

`npm run build` → `✓ built in 556ms`; o mesmo aviso de chunk acima de 500 kB
(`index.esm-*.js`, 505.99 kB), pré-existente e não relacionado a esta tarefa.

Buscas dos critérios (saída real):
- `Nenhum outro dado` em `src/` → só a asserção negativa do teste, nenhuma
  ocorrência no texto renderizado;
- `recurso planejado` em `src/` → nenhuma ocorrência;
- `dateTime="2026-09-17"` → presente em `PoliticaDePrivacidade.jsx:54` e
  `TermosDeUso.jsx:22` (mesma data nos dois textos).

## Critérios de aceite
- [x] A política identifica controlador e encarregado, sem CPF nem endereço —
      seção "Controlador e encarregado" (`PoliticaDePrivacidade.jsx:57`);
      teste "cobre os itens..." verifica a heading e o teste "declara o
      conteúdo..." afirma o nome e nega `CPF`/`endereço`.
- [x] Cada finalidade declarada tem hipótese legal citada — seção "Base
      legal" (`art. 9º, I`, `art. 7º, V`, `art. 7º, I`, `art. 14`); teste
      "declara o conteúdo de conformidade do IDR 0061".
- [x] O texto distingue a região do Firestore do tratamento global da
      identidade e declara o Google como operador — seção "Operador e
      transferência internacional"; teste do mesmo caso.
- [x] A retenção traz os dois prazos — "24 meses sem entrar" e "apagados em
      até 90 dias" (`PoliticaDePrivacidade.jsx`); teste do mesmo caso.
- [x] A exportação JSON aparece como portabilidade (art. 18, V) — "Direitos
      do titular"; teste do mesmo caso.
- [x] O armazenamento local está declarado, com a explicação de por que não
      há banner — seção "Armazenamento local"; teste do mesmo caso.
- [x] Os dois textos exibem a mesma data de vigência — `<time
      dateTime="2026-09-17">` nos dois; testes das duas vistas.
- [x] Nenhuma frase afirma que nenhum outro dado é tratado — busca por
      `Nenhum outro dado` só encontra a asserção negativa do teste.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.

Roteiro visual em `npm run dev` (abrir as duas vistas pelo rodapé e conferir
que rolam inteiras, sem rolagem própria de componente): **pendente** — sem
navegador neste ambiente.

## Arquivos alterados
- `src/components/PoliticaDePrivacidade.jsx` — vigência no topo; seções
  "Controlador e encarregado", "Base legal", "Operador e transferência
  internacional" e "Armazenamento local"; "Dados tratados", "Retenção" e
  "Direitos do titular" reescritos (IDR 0061).
- `src/components/PoliticaDePrivacidade.test.jsx` — headings novas, data de
  vigência e teste "declara o conteúdo de conformidade do IDR 0061".
- `src/components/TermosDeUso.jsx` — vigência no topo e o mesmo bloco
  "Controlador e encarregado".
- `src/components/TermosDeUso.test.jsx` — `SECOES` com a seção nova e teste
  do controlador e da data.
- `docs/interface.md` — §§ Política de privacidade e Termos de uso: lista do
  conteúdo das duas vistas (lastro IDR 0061).
- `docs/plano/0031-.../0005-...md` — status `Em andamento` → `Concluída`.
- `docs/plano/README.md` — linha da tarefa `Em andamento` → `Concluída`.
- `docs/plano/0031-.../logs/0005-...md` — este log (criado).
