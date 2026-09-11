<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0009-0002]: menu de ações no cabeçalho

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão e § Consequências — os cinco comandos, o fechamento por escolha/toque fora/`Esc`, e a ausência de rolagem própria
- `docs/interface.md` § Menu de ações — os três blocos separados por filete, o "sair da conta" em `--notif-red`, o ancoramento à direita
- `docs/interface.md` § Medidas — painel de largura mínima 230px, raio 10px, itens de `9px 12px` em 13px, filetes com margem `4px 6px`, sombra `0 8px 24px`
- `docs/interface.md` § Camadas — o menu fica acima de tudo enquanto está aberto
- `docs/requisitos.md` § Acesso — sair grava o que estiver pendente antes de sair
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — depois do `signOut` as regras negam a escrita; o flush precisa vir antes

## Objetivo
Criar a porta de entrada das ações raras e mover o "sair da conta" para ela,
aposentando a área de login provisória da tela principal. Os quatro comandos de
conteúdo entram nas tarefas seguintes desta fase.

## Padrões e convenções aplicáveis
- Cinco comandos em três blocos separados por filete; "sair da conta" isolado no
  fim, em `--notif-red`, único item vermelho da tela — `docs/interface.md` § Menu de ações
- Fecha ao escolher um comando, ao tocar fora e com `Esc` —
  `docs/idr/0024-*` § Decisão
- **Sem rolagem própria**: são cinco itens — `docs/idr/0024-*` § Decisão e `docs/idr/0008-*`
- Sair **grava o que estiver pendente antes** de sair; depois do `signOut` as
  regras negam a escrita — `docs/requisitos.md` § Acesso e `docs/adr/0008-*`
- O menu fica acima da área de avisos e do cabeçalho enquanto aberto —
  `docs/interface.md` § Camadas
- Todo comando dá retorno na área de avisos — `docs/interface.md` § Menu de ações

## Escopo e instruções de implementação
1. Criar o botão de ações (30×30px, `--gold`) na linha de controles, ao lado do
   desfazer, no espaço já reservado na Tarefa 0003-0001.
2. Criar o popup ancorado ao botão: alinhado pela borda direita, logo abaixo da
   linha de controles, `--panel` sobre `--border`, com sombra que o descola do
   conteúdo.
3. Os cinco itens nos três blocos: copiar faltantes / copiar repetidas — filete —
   exportar / importar — filete — sair da conta.
4. Nesta tarefa, os quatro primeiros ficam presentes e desabilitados ou ligados a
   uma ação vazia declarada; eles são implementados nas Tarefas 0009-0003 a
   0009-0005 do mesmo PR. Não deixar item que aparente funcionar e não faça nada
   ao fim da fase.
5. Implementar "sair da conta": dar **flush** da gravação pendente (Tarefa
   0007-0003) e só então `signOut`. O logout não pode descartar ajustes.
6. Aposentar a área de login provisória da tela principal (`AuthStatus`), cuja
   única função ali era o botão de sair — limpando imports, estilos e testes
   órfãos.
7. Acessibilidade: o botão expõe estado aberto/fechado, o foco entra no menu ao
   abrir e volta ao botão ao fechar, e `Esc` fecha de qualquer item.
8. Testes: abre e fecha pelos três caminhos; sair chama o flush antes do
   `signOut`, comprovado pela ordem das chamadas; o menu não tem contêiner
   rolável; o foco volta ao botão ao fechar.

**Fora do escopo**: os quatro comandos de conteúdo (Tarefas 0009-0003 a
0009-0005); acrescentar a política de privacidade ao menu — ela ficou no rodapé
(Tarefa 0008-0004).

## Decisões já tomadas (não reabrir)
- Cinco comandos em popup do cabeçalho — ver `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Sair fica longe do toque acidental durante o cadastro em rajada — ver `docs/idr/0024-*` § Consequências
- Sair grava o pendente antes — ver `docs/requisitos.md` § Acesso e `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- A linha de controles permanece com os alternadores e o desfazer — ver `docs/idr/0024-*` § Consequências

## Decisões em aberto nesta tarefa
- O que acontece se o flush falhar na saída — encaminhamento: informar a falha e
  **não** sair, para o usuário decidir; sair descartando ajustes seria a única
  perda de dado silenciosa do app; nasce um **IDR**

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
- `src/components/MenuDeAcoes.jsx` — criar
- `src/components/MenuDeAcoes.test.jsx` — criar
- `src/components/Controles.jsx` — modificar
- `src/components/AuthStatus.jsx` — remover
- `src/components/AuthStatus.test.jsx` — remover
- `src/App.jsx` — modificar
- `AGENTS.md` — modificar (tabela "Onde fica cada coisa")

## Critérios de aceite
- [x] O menu abre pelo botão do cabeçalho e traz os cinco itens em três blocos
- [x] Fecha ao escolher, ao tocar fora e com `Esc`
- [x] "Sair da conta" é o único item vermelho e fica isolado no fim
- [x] Sair dá flush antes do `signOut`, comprovado pela ordem das chamadas
- [x] O menu não tem rolagem própria e fica acima dos avisos e do cabeçalho
- [x] O `AuthStatus` foi removido sem deixar import, estilo ou teste órfão
- [x] O foco entra no menu ao abrir e volta ao botão ao fechar por `Esc` ou
      por escolher um item — ao tocar fora, o foco segue o toque em vez de
      ser roubado de volta ao botão (decisão de nível 2, ver log)
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (IDR 0038)
- [x] `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0002-log-menu-de-acoes-no-cabecalho.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: abrir o menu, conferir os três blocos e o
item vermelho; ajustar uma figurinha e sair imediatamente, conferindo na aba
Network que a escrita aconteceu antes do logout.
