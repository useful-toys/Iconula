<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0009-0001]: desfazer com histórico das últimas 10

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md` § Decisão e § Consequências — botão no cabeçalho, sempre visível quando há histórico, últimas 10 em memória, descartado ao recarregar
- `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md` § Decisão — nenhum ajuste pede confirmação; o desfazer torna a confirmação desnecessária
- `docs/requisitos.md` § Contagem — desfaz a última alteração e pode ser repetido para as últimas 10, na ordem inversa
- `docs/interface.md` § Cabeçalho e § Medidas — botão de 30×30px na linha de controles, raio 8px, borda e texto em `--gold`
- `docs/idr/0003-gravacao-agrega-ajustes.md` § Contexto — desfazer é um ajuste como qualquer outro: entra na gravação seguinte, sem caso especial
- `docs/persistencia.md` § O que **não** vai para o Firestore — o histórico vive em memória

## Objetivo
Dar ao registro em rajada a sua rede de segurança: um botão que reverte a última
alteração e, repetido, as dez últimas — sem confirmação em lugar nenhum e sem
ruído a cada toque.

## Padrões e convenções aplicáveis
- Botão fixo na linha de controles, **não** um toast que surge a cada ajuste —
  `docs/idr/0012-*` § Decisão
- Histórico das **últimas 10**, em memória; recarregar descarta —
  `docs/idr/0012-*` § Decisão e `docs/persistencia.md`
- Desfazer é ajuste comum: entra na gravação agregada seguinte, sem caminho
  próprio de escrita — `docs/idr/0003-*` § Contexto
- Nenhum ajuste pede confirmação — `docs/idr/0010-*` § Decisão
- Desabilitado quando não há histórico, com estado exposto ao leitor de tela —
  `docs/idr/0012-*` § Decisão e `docs/requisitos.md` § Requisitos Não Funcionais
- O botão tem 30×30px, `--gold`, à direita da linha — `docs/interface.md` § Medidas

## Escopo e instruções de implementação
1. Guardar em memória as últimas 10 alterações: código e a contagem anterior
   bastam para reverter, e evitam ter de saber se foi incremento ou decremento.
2. Desfazer aplica a reversão como um ajuste normal — o mesmo caminho que o toque
   no cartão usa, para que a gravação agregada o leve sem caso especial.
3. Desfazer **não** entra no próprio histórico: repetir dez vezes volta dez
   alterações, não alterna entre duas.
4. Botão `↺` de 30×30px na linha de controles, à direita, junto do espaço já
   reservado na Tarefa 0003-0001; desabilitado quando o histórico está vazio, com
   nome acessível por extenso ("desfazer a última alteração").
5. O histórico é descartado ao recarregar — nada de `localStorage`.
6. Deixar preparado o descarte do histórico pela importação (Tarefa 0009-0005),
   que exige zerá-lo.
7. Testes: dez ajustes e dez desfazer voltam ao estado inicial; o décimo primeiro
   desfazer não faz nada; o botão fica desabilitado sem histórico; a reversão
   entra na gravação agregada; recarregar limpa o histórico.

**Fora do escopo**: refazer, que nenhum registro pede; persistir o histórico; o
menu de ações (Tarefa 0009-0002).

## Decisões já tomadas (não reabrir)
- Botão no cabeçalho, histórico de 10, em memória — ver `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md`
- Sem confirmação para nenhum ajuste — ver `docs/idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md`
- Perder o histórico ao recarregar é aceito: a gravação agregada já persistiu — ver `docs/idr/0012-*` § Consequências
- Não existe ação de zerar contagem — ver `docs/requisitos.md` § Contagem

## Decisões em aberto nesta tarefa
- Se o desfazer tem atalho de teclado — encaminhamento: não implementar; nenhum
  registro pede, e um atalho global conflitaria com o do navegador; registrar no
  log

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
- `src/lib/historico.js` — criar
- `src/lib/historico.test.js` — criar
- `src/components/Controles.jsx` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [x] O botão `↺` aparece na linha de controles e fica desabilitado sem histórico
- [x] Dez ajustes seguidos de dez desfazer voltam ao estado inicial
- [x] O décimo primeiro desfazer não altera nada
- [x] Desfazer não entra no próprio histórico
- [x] A reversão é gravada pela agregação, sem escrita própria
- [x] Recarregar a página limpa o histórico
- [x] Nome acessível por extenso e estado desabilitado exposto
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (nenhum esperado — desenho já fechado pelo IDR 0010/IDR 0012)
- [x] `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0001-log-desfazer-com-historico-de-10.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: lançar sete números como se fosse um
envelope, desfazer sete vezes e conferir que o placar volta ao que era; conferir
na aba Network que isso não gerou uma escrita por desfazer.
