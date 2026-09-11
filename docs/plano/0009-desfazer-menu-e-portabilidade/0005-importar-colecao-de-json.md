<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0009-0005]: importar coleção de arquivo JSON

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Portabilidade (sem lock-in) — a importação substitui a coleção inteira após confirmação explícita, descarta o histórico de desfazer, valida a versão e rejeita arquivo inválido sem alterar nada
- `docs/persistencia.md` § Operações sobre o formato — importar **substitui** o campo `contagens` inteiro, sem merge, normalizado, mais `updatedAt`; custa 1 escrita
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — arquivo inválido ou de versão desconhecida é **aviso**, não falha
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — o comando fica no menu e a importação segue pedindo confirmação explícita
- `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md` § Decisão — o histórico que a importação descarta
- `docs/persistencia.md` § Custos e cotas — import é substituição rara, não gravação; usá-lo como "salvar" é risco de cota registrado

## Objetivo
Fechar a portabilidade: trazer de volta uma coleção exportada, substituindo a
atual por inteiro, com confirmação explícita e rejeição segura do que não for
válido.

## Padrões e convenções aplicáveis
- A importação **substitui** a coleção inteira; não faz merge —
  `docs/requisitos.md` § Portabilidade e `docs/persistencia.md`
- Exige **confirmação explícita** antes de aplicar — `docs/requisitos.md` § Portabilidade
- Descarta o histórico de desfazer: o estado anterior deixou de existir —
  `docs/requisitos.md` § Portabilidade
- Arquivo inválido, incompleto ou de versão desconhecida é rejeitado **sem
  alterar a coleção atual**, com **aviso** dourado — `docs/requisitos.md` e `docs/idr/0029-*`
- Custa **1 escrita**: substitui `contagens` e `updatedAt` de uma vez —
  `docs/persistencia.md` § Operações sobre o formato
- Normalizar na entrada: zeros viram chave ausente, e o teto de 99 vale —
  `docs/persistencia.md` e `docs/tdr/0009-*`

## Escopo e instruções de implementação
1. Ler o arquivo escolhido pelo usuário e validar antes de qualquer efeito:
   JSON bem formado; `versao` conhecida; `contagens` presente e do tipo certo;
   chaves pertencentes ao catálogo; valores inteiros entre 1 e 99.
2. Normalizar: descartar chaves de valor 0 ou ausentes do catálogo, e recusar o
   arquivo se houver valor fora da faixa — recusar é mais seguro que corrigir em
   silêncio, porque o usuário perderia dado sem saber.
3. **Confirmação explícita** antes de aplicar, dizendo com clareza que a coleção
   atual será substituída. **Pendência de interface: diálogo de importação** —
   resolver por confirmação mínima, sem tela própria, coerente com o minimalismo
   do IDR 0018. Registrar como **IDR**.
4. Aplicar: substituir o estado em memória, descartar o histórico de desfazer
   (Tarefa 0009-0001) e gravar em **uma** escrita que substitui `contagens` e
   move `updatedAt`.
5. Retorno: sucesso "coleção importada"; arquivo inválido ou de versão
   desconhecida, aviso dourado; falha ao gravar, falha vermelha com detalhe — e,
   nesse caso, a coleção em memória já é a importada, e a gravação seguinte a
   regrava, como qualquer falha.
6. Testes: arquivo válido substitui a coleção e zera o histórico; arquivo com
   versão desconhecida não altera nada e emite aviso; JSON malformado idem;
   valor 100 ou negativo é recusado; a gravação é uma só; ida e volta com o
   arquivo da Tarefa 0009-0004 reproduz a coleção idêntica.

**Fora do escopo**: importar lista colada do WhatsApp, requisito futuro; merge de
coleções; usar a importação como mecanismo de salvamento.

## Decisões já tomadas (não reabrir)
- Substituição integral, com confirmação explícita — ver `docs/requisitos.md` § Portabilidade (sem lock-in)
- O histórico de desfazer é descartado — ver `docs/requisitos.md` § Portabilidade
- Arquivo inválido não altera a coleção atual — ver `docs/requisitos.md` § Portabilidade
- O formato garantido é o exportado pelo próprio app — ver `docs/requisitos.md` § Portabilidade
- Import é 1 escrita e é operação rara — ver `docs/persistencia.md` § Custos e cotas

## Decisões em aberto nesta tarefa
- Diálogo de importação — encaminhamento no passo 3: confirmação mínima, sem tela
  própria; nasce um **IDR**
- O que fazer com chave válida no formato mas ausente do catálogo — encaminhamento:
  descartar a chave e avisar que houve descarte, em vez de recusar o arquivo
  inteiro (é o caso de um catálogo que mudou entre versões); consta no mesmo IDR

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
   **Caso concreto previsto aqui**: a importação sobrescreve a coleção do usuário
   e é irreversível — qualquer dúvida sobre aplicar sem confirmação é motivo de
   PARAR.

## Arquivos impactados
- `src/lib/portabilidade.js` — modificar (validação e normalização)
- `src/lib/portabilidade.test.js` — modificar
- `src/lib/colecaoRemota.js` — modificar (substituição de `contagens`)
- `src/components/MenuDeAcoes.jsx` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] Arquivo válido substitui a coleção inteira, após confirmação explícita
- [ ] O histórico de desfazer é descartado pela importação
- [ ] Versão desconhecida, JSON malformado e valores fora de 1–99 são rejeitados sem alterar nada
- [ ] Rejeição emite aviso dourado, não falha vermelha
- [ ] A gravação é uma única escrita que substitui `contagens` e move `updatedAt`
- [ ] Exportar e reimportar reproduz a coleção idêntica
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0005-log-importar-colecao-de-json.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em preview deploy real: exportar, ajustar algumas figurinhas,
reimportar o arquivo e conferir que a coleção voltou; conferir na aba Network que
houve **uma** escrita; tentar importar um arquivo com `versao: 2` e conferir o
aviso e a coleção intacta.
