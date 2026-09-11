<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0007-0003]: gravação agregada com flush garantido

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — debounce ~2s, teto ~10s, escrita por chaves alteradas, `deleteField`, flush em `pagehide`/`visibilitychange`, flush antes do `signOut`, `increment()` descartado
- `docs/idr/0003-gravacao-agrega-ajustes.md` § Decisão — persistência automática e transparente, sem botões de ler ou salvar
- `docs/persistencia.md` § Operações sobre o formato — o que cada operação custa em escrita
- `docs/persistencia.md` § Custos e cotas — 1 escrita por agregação, no máximo 1 a cada ~10s de atividade contínua
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` § Decisão — uma gravação bem-sucedida move o relógio
- `docs/arquitetura.md` § Pontos em aberto — "Aceite do ADR 0008: revisar os valores numéricos antes de implementar"
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — a interface precisa parar em 99, senão o servidor recusa

## Objetivo
Fazer os ajustes chegarem ao Firestore sem o usuário pedir e sem gastar cota:
uma escrita por agregação, com as chaves alteradas, e garantia de que nada se
perde ao fechar a página ou ao sair da conta.

## Padrões e convenções aplicáveis
- **Nenhuma requisição por figurinha**: a escrita é agregada, independente de
  quantas figurinhas mudaram — `docs/requisitos.md` § Requisitos Não Funcionais
- Escrita por **chaves alteradas** com `updateDoc`, valor absoluto ou
  `deleteField`; `increment()` está descartado — `docs/adr/0008-*` § Decisão
- Contagem que chega a 0 **apaga a chave**; zeros nunca são gravados —
  `docs/persistencia.md` § Formato dos dados
- `updatedAt` é `serverTimestamp()`, e as regras exigem `updatedAt == request.time`
  — `docs/adr/0008-*` e `docs/tdr/0009-*`
- Sair da conta dá **flush antes** do `signOut`: depois dele as regras negam a
  escrita — `docs/adr/0008-*` § Decisão
- Sem botões de ler ou salvar: o usuário nunca dispara gravação —
  `docs/idr/0003-*` § Decisão

## Escopo e instruções de implementação
1. Acumular as chaves alteradas desde a última gravação e agendar a escrita:
   debounce de ~2s após o último ajuste, com teto de espera de ~10s em rajada
   contínua.
2. **Ponto em aberto do `arquitetura.md`: aceite dos números do ADR 0008** —
   resolver aceitando ~2s e ~10s como estão, medindo em uso real e registrando a
   medição no log. O ADR 0008 § Status já permite ajustá-los sem novo ADR; se a
   **forma** mudar (por exemplo, deixar de haver teto), aí nasce um registro.
3. Montar a escrita: `updateDoc` com os caminhos aninhados de `contagens`, valor
   absoluto para contagem ≥ 1 e `deleteField` para a que chegou a 0, mais
   `updatedAt: serverTimestamp()`, numa única operação.
4. A escrita é idempotente: regravar o valor completo depois de uma falha é
   seguro, e é o que a Tarefa 0007-0005 faz.
5. Flush imediato em `pagehide` e `visibilitychange`, e antes do `signOut` — o
   logout não pode descartar ajustes pendentes.
6. Ao gravar com sucesso: mover o relógio do título e emitir o aviso de sucesso.
7. **Revisitar a decisão Context × prop-drilling** tomada na Tarefa 0002-0004:
   agora a coleção é lida e escrita por mais de um ponto. Manter prop-drilling se
   ainda couber; se não couber, introduzir Context só para a coleção e registrar
   a mudança no TDR daquela tarefa.
8. Testes com temporizador falso: N ajustes em rajada geram **uma** escrita;
   atividade contínua não passa do teto sem gravar; a escrita contém só as chaves
   alteradas; chave zerada vai como `deleteField`; `pagehide` força a gravação
   pendente; `signOut` não acontece antes do flush.

**Fora do escopo**: a migração do `teamName` (Tarefa 0007-0004); o comportamento
sem rede e a política de erro (Tarefa 0007-0005); o comando de sair no menu, que
chega na Fase 9 — aqui basta a garantia de flush estar disponível para ele.

## Decisões já tomadas (não reabrir)
- Gravação agregada, sem escrita por clique — ver `docs/idr/0003-gravacao-agrega-ajustes.md`
- Escrita por chaves alteradas, `increment()` descartado — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- Sessões simultâneas não são tratadas: sobre a mesma chave, a última vence — ver `docs/requisitos.md` § Estado da sincronização
- Uma gravação bem-sucedida move o relógio — ver `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`
- O teto de 99 é respeitado pela interface — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`

## Decisões em aberto nesta tarefa
- Aceite dos números do ADR 0008 (debounce, teto) — encaminhamento no passo 2;
  medição registrada no log
- Context × prop-drilling, revisto — encaminhamento no passo 7; atualiza o **TDR**
  criado na Tarefa 0002-0004

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
   **Caso concreto previsto aqui**: qualquer desenho que aumente o número de
   escritas por sessão além de "1 por agregação" tem custo em cota — PARE.

## Arquivos impactados
- `src/lib/colecaoRemota.js` — modificar
- `src/lib/colecaoRemota.test.js` — modificar
- `src/lib/gravacaoAgregada.js` — criar (acúmulo, debounce, teto, flush)
- `src/lib/gravacaoAgregada.test.js` — criar
- `src/App.jsx` — modificar
- `docs/tdr/00NN-estado-da-colecao-sem-context.md` — modificar (revisão do passo 7)

## Critérios de aceite
- [x] Uma rajada de ajustes gera uma única escrita, comprovado por teste
- [x] Atividade contínua grava ao atingir o teto de espera, sem esperar a rajada acabar
- [x] A escrita contém apenas as chaves alteradas, com `deleteField` para as zeradas
- [x] `updatedAt` vai como `serverTimestamp()` e é aceito pelas regras
- [x] `pagehide` e `visibilitychange` forçam a gravação pendente
- [x] O flush acontece antes do `signOut`, nunca depois
- [x] Gravação bem-sucedida move o relógio e emite aviso de sucesso
- [x] Registros ADR/TDR/IDR criados ou atualizados para as decisões tomadas
- [x] `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0003-log-gravacao-agregada-com-flush.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real (não `npm run dev`, que não tem os headers do
Hosting): logar, ajustar dez figurinhas em rajada e conferir na aba Network que
houve **uma** escrita; conferir no console que não houve violação de CSP; fechar
a aba com ajuste pendente e reabrir para ver o valor gravado.
