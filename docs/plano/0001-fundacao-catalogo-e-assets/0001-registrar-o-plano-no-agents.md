<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0001-0001]: registrar o plano de implementação no AGENTS.md

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `AGENTS.md` § Onde fica cada coisa — formato exato das linhas da tabela (caminho entre crases na primeira coluna, descrição em uma frase na segunda)
- `AGENTS.md` § Convenções — regra de registrar decisões e de manter os documentos correspondentes à realidade
- `docs/plano/README.md` — o que a linha nova precisa descrever

## Objetivo
A tabela "Onde fica cada coisa" do `AGENTS.md` é o índice que um agente lê antes
de qualquer trabalho, e `docs/plano/` não está nela. Acrescentar a linha
correspondente, para que o plano seja encontrável sem depender de alguém saber
que ele existe.

## Padrões e convenções aplicáveis
- A linha nova segue o formato das existentes: caminho entre crases, descrição
  curta, sem parágrafo — `AGENTS.md` § Onde fica cada coisa
- A tabela é ordenada por afinidade (código, depois configuração, depois `docs/`);
  a linha entra junto das demais linhas de `docs/` — `AGENTS.md` § Onde fica cada coisa
- Documento de repositório é Markdown com comentário HTML de copyright; esta
  tarefa não cria arquivo novo, então não há cabeçalho a acrescentar —
  `AGENTS.md` § Convenções
- Esta tarefa não toca build, deploy nem ambiente: nada a refletir em
  `docs/firebase.md`, `docs/gcloud.md` ou `docs/github.md` — `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. Abrir `AGENTS.md` e localizar a tabela "Onde fica cada coisa".
2. Acrescentar, junto das linhas de `docs/`, uma linha para `docs/plano/`
   descrevendo-a como o plano de implementação em fases e tarefas, com o
   `README.md` servindo de índice e de mapa de status.
3. Conferir se alguma outra linha da tabela ficou desatualizada por causa do
   plano (por exemplo, a descrição de `docs/requisitos.md` como fonte de escopo
   continua correta e não deve mudar).
4. Não alterar nenhuma outra seção do `AGENTS.md` nesta tarefa — em especial
   § Como rodar, que só muda na Tarefa 0008-0001.

**Fora do escopo**: qualquer alteração em `src/`, em configuração, ou nas demais
seções do `AGENTS.md`; a criação dos arquivos do plano, que já existe.

## Decisões já tomadas (não reabrir)
- A tabela "Onde fica cada coisa" é o índice canônico do repositório — ver
  `AGENTS.md` § Onde fica cada coisa
- O plano vive em `docs/plano/`, com uma pasta por fase e `logs/` dentro dela —
  ver `docs/plano/README.md`

## Decisões em aberto nesta tarefa
- Nenhuma.

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
- `AGENTS.md` — modificar

## Critérios de aceite
- [x] A tabela "Onde fica cada coisa" tem uma linha para `docs/plano/`, no
      formato das demais
- [x] Nenhuma outra seção do `AGENTS.md` foi alterada
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (nenhum esperado)
- [x] `docs/plano/0001-fundacao-catalogo-e-assets/logs/0001-log-registrar-o-plano-no-agents.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Nenhuma verificação visual: a tarefa só altera documentação.
