<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0004-0005]: preferências de vista no `localStorage`

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Decisão e § Consequências — o que persiste, onde, e o que fazer quando o storage falha
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão — o colapso **não** persiste
- `docs/persistencia.md` § O que **não** vai para o Firestore — preferências de vista custam zero requisição
- `docs/requisitos.md` § UX — ordenação, disposição e filtro persistem no navegador; o colapso, não
- `docs/requisitos.md` § Requisitos Não Funcionais — economia de requisições

## Objetivo
Fazer o app abrir no modo de trabalho da última sessão: ordenação, disposição e
filtro guardados no navegador e restaurados na abertura seguinte, sem custar
nenhuma requisição ao Firestore e sem quebrar quando o storage não existe.

## Padrões e convenções aplicáveis
- Só ordenação, disposição e filtro persistem; o colapso de seções e
  super-grupos continua volátil — `docs/idr/0026-*` § Decisão e `docs/idr/0020-*`
- Nada disso vai para o Firestore: zero requisição, e a preferência é do
  dispositivo — `docs/idr/0026-*` § Decisão e `docs/persistencia.md`
- Storage ausente ou bloqueado (navegação privada, storage desabilitado) **não
  pode quebrar o app**: falha de leitura ou de escrita cai nos padrões e segue —
  `docs/idr/0026-*` § Consequências
- Sem interface de configuração: a preferência é o próprio último uso dos
  alternadores — `docs/idr/0026-*` § Decisão
- Valor guardado inválido (versão antiga, lixo, valor fora do domínio) é
  descartado em silêncio, como qualquer falha de leitura — `docs/idr/0026-*`

## Escopo e instruções de implementação
1. Criar um módulo em `src/lib/` que leia e grave as três preferências, com toda
   chamada ao `localStorage` dentro de `try/catch` — inclusive o acesso ao objeto,
   que já lança em alguns contextos.
2. Validar o que volta do storage contra o domínio de valores conhecido; qualquer
   coisa fora dele vira o padrão, sem aviso ao usuário e sem `console.error`
   ruidoso.
3. Ligar as três preferências aos alternadores das Tarefas 0003-0001, 0004-0001 e
   0004-0004: mudar o alternador grava; abrir o app lê.
4. Não persistir o colapso — nem por engano, nem "só o dos super-grupos".
5. Usar uma chave nomeada e versionada, para que uma mudança futura de formato
   possa ser ignorada em vez de mal interpretada.
6. Testes: gravar e restaurar cada preferência; `localStorage` que lança em
   leitura e em escrita não quebra a renderização e cai nos padrões; valor
   inválido cai no padrão.

**Fora do escopo**: definir quais são os padrões por faixa de tela — isso é a
Tarefa 0009-0003; aqui os padrões são os provisórios já em uso.

## Decisões já tomadas (não reabrir)
- Preferências de vista no `localStorage`, por dispositivo — ver `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- O colapso é estado de momento e não persiste — ver `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
- Gravar preferência no Firestore está descartado por custo de requisição — ver `docs/idr/0026-*` § Contexto e `docs/persistencia.md`

## Decisões em aberto nesta tarefa
- Uma chave com um objeto × três chaves separadas — encaminhamento: uma chave
  versionada com um objeto, para que a validação e o descarte sejam de uma vez
  só; nasce um **TDR** se a escolha for outra

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/lib/preferenciasDeVista.js` — criar
- `src/lib/preferenciasDeVista.test.js` — criar
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] Trocar ordenação, disposição ou filtro e recarregar restaura a escolha
- [ ] O colapso de seções e super-grupos volta ao padrão aberto ao recarregar
- [ ] `localStorage` indisponível ou lançando exceção não quebra a tela
- [ ] Valor guardado inválido cai no padrão, sem mensagem ao usuário
- [ ] Nenhuma requisição ao Firestore é disparada por troca de preferência
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0005-log-preferencias-de-vista-no-localstorage.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: escolher `Sigla` + `Álbum`, recarregar e
conferir que o app volta assim; abrir numa janela anônima com storage bloqueado e
conferir que o app abre nos padrões sem erro na tela.
