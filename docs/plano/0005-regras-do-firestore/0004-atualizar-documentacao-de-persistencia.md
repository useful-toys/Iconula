<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0005-0004]: atualizar a documentação de persistência

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `AGENTS.md` § Convenções — mudança no ambiente Firebase é refletida no `docs/*.md` correspondente na mesma alteração/PR
- `docs/persistencia.md` § Regras de segurança — o texto que descreve o que muda com o produto novo
- `docs/persistencia.md` § Pronto × falta — a tabela que precisa passar as regras novas para a coluna "pronto"
- `docs/firebase.md` § Regras de segurança e § Deploy das regras — o que está documentado sobre o estado real do projeto
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Consequências — "`requisitos.md` deixa de dizer 'sem teto de contagem'"
- `docs/arquitetura.md` § Decisões-chave e onde vivem — o índice que aponta para as regras

## Objetivo
Deixar a documentação correspondendo ao que está publicado. As regras novas
mudam o estado real do projeto Firebase, e a convenção exige refletir isso no
mesmo PR — inclusive o desfecho da medição da allow-list, que só se sabe agora.

## Padrões e convenções aplicáveis
- Alteração no ambiente Firebase é refletida em `docs/firebase.md` **no mesmo
  PR**; divergência notada se corrige junto — `AGENTS.md` § Convenções
- `docs/persistencia.md` descreve o formato real dos dados e das regras, não a
  intenção — `docs/persistencia.md` § O que é este documento (abertura)
- O texto do "Alvo (especificado)" passa a ser o implementado: a seção "Hoje
  (implementado): a bandeira do botão" deixa de descrever a realidade —
  `docs/persistencia.md` § Formato dos dados
- Registro existente não se reescreve: o ADR 0008 e o TDR 0009 continuam como
  estão; o que muda é a documentação de estado — `AGENTS.md` § Convenções
- Documento de repositório em PT-BR, com o cabeçalho de copyright já presente —
  `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. `docs/persistencia.md`:
   - trocar a seção do formato para refletir que o schema novo é o vigente e que
     o do botão é histórico
   - atualizar § Regras de segurança com as cláusulas realmente publicadas,
     incluindo o desfecho da allow-list (entrou ou não entrou, com o motivo)
   - atualizar a tabela § Pronto × falta: regras novas saem de "falta"
2. `docs/firebase.md` § Regras de segurança: substituir o trecho que exibe as
   regras antigas pelo estado real publicado, e conferir se § Deploy das regras
   continua correto.
3. `docs/requisitos.md`: aplicar o ajuste que o TDR 0009 § Consequências pede —
   o texto não pode dizer "sem teto de contagem". Conferir se a redação atual já
   está correta; se estiver, registrar no log que nada era necessário.
4. `docs/arquitetura.md`: conferir se § Decisões-chave e onde vivem e § Pontos em
   aberto ainda descrevem a realidade depois desta fase — em especial o item
   "Aceite do ADR 0008", que continua aberto até a Fase 7.
5. Não tocar em `docs/gcloud.md` nem em `docs/github.md`: esta fase não muda IAM,
   secrets, workflows nem branch protection. Se tiver mudado, é sinal de que a
   fase saiu do escopo — PARE.

**Fora do escopo**: qualquer mudança em `firestore.rules` (Tarefas 0005-0001 e
0005-0002); documentação da gravação agregada, que só existe na Fase 7.

## Decisões já tomadas (não reabrir)
- A documentação de ambiente acompanha a mudança no mesmo PR — ver `AGENTS.md` § Convenções
- O `requisitos.md` deixa de dizer "sem teto de contagem" — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Consequências
- O deploy das regras acontece no merge, antes do Hosting — ver `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md`

## Decisões em aberto nesta tarefa
- Nenhuma. Se a redação exigir uma decisão nova, ela não é de documentação —
  volte à tarefa que a originou.

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
- `docs/persistencia.md` — modificar
- `docs/firebase.md` — modificar
- `docs/requisitos.md` — modificar (só se o texto ainda disser "sem teto")
- `docs/arquitetura.md` — modificar (se algum item ficou desatualizado)

## Critérios de aceite
- [ ] `docs/persistencia.md` descreve as regras realmente publicadas, com o desfecho da allow-list
- [ ] A tabela Pronto × falta não lista mais as regras novas como pendentes
- [ ] `docs/firebase.md` mostra o ruleset real, não o da era do botão
- [ ] `docs/requisitos.md` não afirma ausência de teto de contagem
- [ ] `docs/gcloud.md` e `docs/github.md` não foram alterados
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas (nenhum esperado)
- [ ] `docs/plano/0005-regras-do-firestore/logs/0004-log-atualizar-documentacao-de-persistencia.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Conferência documental: comparar, trecho a trecho, o `firestore.rules` do
repositório com o que `docs/persistencia.md` e `docs/firebase.md` afirmam.
