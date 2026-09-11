<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0008-0004]: política de privacidade e rodapé de marcas

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Privacidade — o que a política precisa declarar: dados tratados, finalidade, retenção, direitos do titular, canal de contato e o tratamento de dados de menores
- `docs/requisitos.md` § Decisões Pendentes — "Política de privacidade depois de autenticado: se e onde ela reaparece"
- `docs/arquitetura.md` § Pontos em aberto — "Router: tela de privacidade como rota ou vista interna"
- `docs/interface.md` § Demais telas — a política está entre as telas a preencher quando desenhadas
- `docs/interface.md` § Camadas — o rodapé não flutua: rola com o conteúdo
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Consequências — o popup é "o lugar natural" para a política depois de autenticado, mas a decisão ficou à parte
- `AGENTS.md` § Convenções — não introduzir router antes de a árvore exigir

## Objetivo
Publicar a política de privacidade exigida pela LGPD, acessível antes de
autenticar, e fechar o aviso de independência e marcas no rodapé das duas telas.

## Padrões e convenções aplicáveis
- A política é acessível **antes** de autenticar — `docs/requisitos.md` § Privacidade
- **Sem router**: a política é vista interna, não rota — `AGENTS.md` § Convenções
  e `docs/arquitetura.md` § Pontos em aberto
- Exclusão de dados dentro do app é requisito **futuro**: a política declara o
  canal de contato, não um botão — `docs/requisitos.md` § Privacidade
- A política declara exatamente o que é tratado: identidade Google (nome, e-mail,
  foto) e a coleção; nada de analytics no MVP — `docs/requisitos.md` § Dados e isolamento
- O rodapé rola com o conteúdo, não flutua — `docs/interface.md` § Camadas
- Todo texto em PT-BR — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. **Ponto em aberto do `arquitetura.md`: router × vista interna** — resolver por
   **vista interna** controlada por estado no `App.jsx`, coerente com a convenção
   do `AGENTS.md`, que proíbe router antes de a árvore exigir. Registrar como
   **TDR**, com o gatilho de revisão (se surgir uma terceira tela endereçável, ou
   necessidade de link direto, reavaliar).
2. Escrever o conteúdo da política cobrindo o que `requisitos.md` exige: dados
   tratados, finalidade, retenção, direitos do titular e como exercê-los pelo
   canal de contato declarado, e o tratamento de dados de menores com a atestação
   do primeiro login.
3. A vista da política tem retorno explícito para a tela de onde veio — login ou
   principal —, sem depender do botão "voltar" do navegador, já que não há rota.
4. **Pendência de requisitos: a política depois de autenticado** — resolver por
   **link no rodapé da tela principal**, junto do aviso de marcas: o rodapé já
   existe nas duas telas e não gasta item do menu de ações, que o IDR 0018
   reservou ao essencial. Registrar como **IDR**, citando o IDR 0024 e dizendo por
   que o menu não foi a escolha.
5. Rodapé nas duas telas com o aviso de independência e marcas — projeto
   independente, sem vínculo com Panini ou FIFA, marcas dos seus titulares
   (Lei 9.279/96, art. 132) —, 11px em `--muted`, com filete superior na tela
   principal e sem filete na de login.
6. Testes: a política é alcançável a partir da tela de login sem sessão; é
   alcançável a partir do rodapé da tela principal; voltar retorna à tela de
   origem; o texto cobre os itens exigidos.

**Fora do escopo**: "apagar meus dados", que é requisito futuro; qualquer coleta
nova de dado; adicionar a política ao menu de ações da Fase 9.

## Decisões já tomadas (não reabrir)
- A política é exigida antes do login — ver `docs/requisitos.md` § Acesso
- Direitos do titular são exercidos por canal de contato declarado na política — ver `docs/requisitos.md` § Privacidade
- Nenhum dado além da identidade Google e da coleção; sem analytics no MVP — ver `docs/requisitos.md` § Dados e isolamento
- Sem router até a árvore exigir — ver `AGENTS.md` § Convenções

## Decisões em aberto nesta tarefa
- Router × vista interna — encaminhamento no passo 1; nasce um **TDR**
- Onde a política reaparece depois de autenticado — encaminhamento no passo 4;
  nasce um **IDR**
- Qual canal de contato é declarado — encaminhamento: um endereço de e-mail do
  responsável pelo projeto; **PARE e pergunte** qual endereço usar, porque é dado
  de contato público e a escolha não é do agente

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
   **Caso concreto previsto aqui**: o canal de contato da política é publicado no
   site — PARE e pergunte qual endereço usar antes de escrever qualquer um.

## Arquivos impactados
- `src/components/PoliticaDePrivacidade.jsx` — criar
- `src/components/PoliticaDePrivacidade.test.jsx` — criar
- `src/components/Rodape.jsx` — criar
- `src/App.jsx` — modificar
- `docs/interface.md` — modificar (§ Demais telas passa a descrever a política)
- `docs/tdr/00NN-privacidade-como-vista-interna.md` — criar (próximo número livre)
- `docs/idr/00NN-politica-no-rodape-depois-de-autenticado.md` — criar (próximo número livre)

## Critérios de aceite
- [ ] A política é alcançável a partir da tela de login, sem sessão
- [ ] A política é alcançável a partir do rodapé da tela principal
- [ ] O conteúdo declara dados tratados, finalidade, retenção, direitos e canal de contato
- [ ] O tratamento de dados de menores está declarado, ligado à atestação
- [ ] Voltar retorna à tela de origem sem depender do histórico do navegador
- [ ] Nenhum router foi introduzido
- [ ] O rodapé de marcas aparece nas duas telas, com o filete só na principal
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0004-log-politica-de-privacidade-e-rodape.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: deslogado, abrir a política pelo link da tela
de login e voltar; logado, abrir pelo rodapé e voltar; conferir que o rodapé rola
com o conteúdo e não flutua.
