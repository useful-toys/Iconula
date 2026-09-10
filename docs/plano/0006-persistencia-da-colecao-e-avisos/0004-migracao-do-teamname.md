<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0006-0004]: migração do `teamName`

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — "ao carregar um documento que ainda o tenha, a primeira gravação do schema novo o apaga (`deleteField`) — regras estritas para sempre depois disso"
- `docs/requisitos.md` § Dados e isolamento — o `teamName` é removido na migração, apagado pela primeira gravação do schema novo
- `docs/persistencia.md` § Custos e cotas — a migração custa 1 escrita única por usuário da era do botão
- `docs/persistencia.md` § Formato dos dados — os únicos campos são `contagens`, `updatedAt` e `atestadoEm`
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — o `hasOnly` dos três campos, que recusa um documento que mantenha `teamName`

## Objetivo
Limpar o resíduo da era do botão sem migração à parte e sem tela: se o documento
carregado ainda tem `teamName`, a primeira gravação do schema novo o apaga junto
com o resto. Uma escrita, uma vez na vida da conta.

## Padrões e convenções aplicáveis
- A migração acontece **na primeira gravação**, não numa rotina própria nem no
  login — `docs/adr/0008-*` § Decisão
- Sem tela, sem aviso e sem mensagem: é invisível ao usuário —
  `docs/requisitos.md` § Dados e isolamento
- Custa **1 escrita**, e ela é a mesma da agregação: não pode virar escrita extra
  — `docs/persistencia.md` § Custos e cotas
- O documento resultante tem só os três campos; um update que mantenha
  `teamName` é negado pelas regras — `docs/tdr/0009-*` § Decisão
- Nada de reintroduzir leitura extra para descobrir se há `teamName`: a carga da
  Tarefa 0006-0002 já traz o documento inteiro — `docs/requisitos.md` § Requisitos
  Não Funcionais

## Escopo e instruções de implementação
1. Na carga (Tarefa 0006-0002), observar se o documento traz `teamName` e guardar
   essa marca no estado — sem leitura adicional.
2. Na primeira gravação agregada depois disso, incluir `teamName: deleteField()`
   junto das chaves alteradas e do `updatedAt`. Uma operação só.
3. Depois de a gravação ter sucesso, limpar a marca: as gravações seguintes não
   repetem o `deleteField`.
4. Se a gravação falhar, a marca permanece e a gravação seguinte tenta de novo —
   é o mesmo caminho de regravação da Tarefa 0006-0005, sem caso especial.
5. Não criar comando, rotina, script nem tela de migração; não migrar em massa.
6. Testes: documento com `teamName` produz uma gravação com `deleteField` junto
   das contagens; documento sem `teamName` não inclui o campo; depois de gravado
   com sucesso, a gravação seguinte não repete o `deleteField`; falha mantém a
   marca.

**Fora do escopo**: qualquer alteração nas regras (Fase 5, já concluída);
migração de dados de outros usuários; qualquer forma de restaurar o
comportamento do botão.

## Decisões já tomadas (não reabrir)
- A migração é a primeira gravação do schema novo — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- O `teamName` não sobrevive: o `hasOnly` das regras o recusa — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`
- O botão e o seu código já saíram na Fase 2 — ver `docs/requisitos.md` § Fora de Escopo
- Nenhuma requisição extra por causa da migração — ver `docs/persistencia.md` § Custos e cotas

## Decisões em aberto nesta tarefa
- O que fazer com um documento que tenha `teamName` e o usuário nunca ajuste nada
  (nenhuma gravação acontece) — encaminhamento: nada; o campo fica lá,
  inofensivo, até a primeira gravação, e forçar uma escrita só para limpá-lo
  gastaria cota sem benefício; registrar no log

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
   **Caso concreto previsto aqui**: apagar dados de usuários é irreversível — se
   a implementação levar a apagar mais do que o `teamName`, PARE.

## Arquivos impactados
- `src/lib/colecaoRemota.js` — modificar
- `src/lib/gravacaoAgregada.js` — modificar
- `src/lib/colecaoRemota.test.js` — modificar

## Critérios de aceite
- [ ] Documento com `teamName` é limpo pela primeira gravação, na mesma operação das contagens
- [ ] Nenhuma leitura ou escrita extra é disparada por causa da migração
- [ ] Depois de migrado, o `deleteField` não é repetido
- [ ] Falha de gravação mantém a marca para a tentativa seguinte
- [ ] Nenhuma tela, aviso ou comando de migração foi criado
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0006-persistencia-da-colecao-e-avisos/logs/0004-log-migracao-do-teamname.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real com uma conta que tenha `teamName` gravado:
ajustar uma figurinha e conferir no console do Firebase que o documento ficou com
`contagens` e `updatedAt` e sem `teamName`, tendo custado uma escrita.
