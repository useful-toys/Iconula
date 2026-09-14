<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0021-0001]: botão compartilhar com as cópias das listas de troca

## Status
Pendente

## Objetivo
Levar as duas cópias de listas de troca do menu do avatar para um botão
compartilhar próprio, à esquerda do avatar, que abre um popup organizado por
lista. O menu do avatar fica com exportar, importar e sair.

## Documentos de referência
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — os dois
  popups, o ícone e o nome acessível do botão
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão ("Título e
  controles") — botão compartilhar à esquerda do avatar, na primeira linha
- `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md` § Decisão — medidas
  e área de toque do avatar
- `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`
  § Decisão — cópia com reserva em `window.prompt`
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão
- `docs/requisitos.md` § Compartilhamento — comandos no botão compartilhar
- `src/components/MenuDeAcoes.jsx`, `src/components/MenuDeAcoes.css`,
  `src/components/MenuDeAcoes.test.jsx` — popup, fechamento e foco
- `src/components/Cabecalho.jsx`, `src/components/Controles.jsx` — onde o
  avatar está montado depois da Tarefa 0019-0001
- `src/App.jsx` — `handleCopiarFaltantes`, `handleCopiarRepetidas`
- `src/App.copiar.test.jsx` — testes de integração da cópia
- `docs/interface.md` § Cabeçalho, § Controles, § Menu de ações, § Camadas,
  § Wireframe da tela principal › Página inteira, § Medidas

## Padrões e convenções aplicáveis
- O popup de compartilhar fecha ao escolher, ao tocar fora, com `Esc` e ao
  sair pelo teclado, com o foco como no menu de ações — IDR 0024
- Botão de 30×30px com foco visível e área de toque ampliada iguais às do
  avatar, sem sobrepor a do avatar — IDR 0049, IDR 0042
- Ícone SVG inline e `aria-hidden`, sem asset externo nem mudança de CSP —
  IDR 0024
- Popups acima de tudo, sem rolagem própria — `docs/interface.md` § Camadas,
  IDR 0008
- O texto e a cópia não mudam — IDR 0039

## Escopo e instruções de implementação
1. Componente novo `MenuDeCompartilhar.jsx` (com CSS e teste): botão com o
   ícone de três nós ligados e nome acessível "compartilhar listas de troca,
   aberto/fechado", abrindo um popup com "Copiar lista de faltantes", filete,
   "Copiar lista de repetidas"; mesmo comportamento de fechamento e foco do
   `MenuDeAcoes`, alinhado pela direita logo abaixo do botão.
2. `MenuDeAcoes.jsx`: remove as duas cópias e seus props; ficam exportar,
   importar, filete e sair da conta.
3. Montagem: o `MenuDeCompartilhar` fica imediatamente à esquerda do avatar,
   na primeira linha do cabeçalho, onde a Tarefa 0019-0001 deixou o avatar;
   `App.jsx` passa os handlers de cópia a ele.
4. Testes: `MenuDeCompartilhar.test.jsx` (abre, itens, fecha fora/`Esc`,
   foco); `MenuDeAcoes.test.jsx` sem as cópias; `App.copiar.test.jsx` abrindo
   pelo botão compartilhar; ajustes em `Cabecalho.test.jsx` e
   `Controles.test.jsx` que dependem da estrutura.
5. `docs/interface.md`, citando o IDR 0024 e o IDR 0018:
   - § Cabeçalho e § Controles: botão compartilhar à esquerda do avatar;
   - § Menu de ações: três comandos em dois blocos; nova subseção
     "Compartilhar" com o popup por lista;
   - § Camadas: os dois popups acima de tudo;
   - § Wireframe da tela principal › Página inteira: botão na primeira linha;
   - § Medidas: botão compartilhar e o popup.
6. `AGENTS.md` § Onde fica cada coisa: linha de `MenuDeCompartilhar.jsx` e a
   de `MenuDeAcoes.jsx` sem as cópias.

**Fora do escopo**: compartilhar pela folha do sistema (Tarefa 0021-0002);
posição do avatar e do desfazer (Tarefa 0019-0001).

## Decisões já tomadas (não reabrir)
- Botão compartilhar, popup por lista, ícone e menu do avatar com três
  comandos — ver `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Botão compartilhar à esquerda do avatar na primeira linha — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`
- Avatar como gatilho do menu — ver
  `docs/idr/0049-avatar-como-gatilho-do-menu-de-acoes.md`
- Texto de troca e cópia manual de reserva — ver
  `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md`

## Decisões em aberto nesta tarefa
- Desenho exato do SVG de três nós e se o popup reaproveita estilos do
  `MenuDeAcoes` (nível 1) — registrar no log.

## Arquivos impactados
- `src/components/MenuDeCompartilhar.jsx`,
  `src/components/MenuDeCompartilhar.css`,
  `src/components/MenuDeCompartilhar.test.jsx` — criar
- `src/components/MenuDeAcoes.jsx`, `src/components/MenuDeAcoes.test.jsx` —
  modificar
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.test.jsx`,
  `src/components/Controles.jsx`, `src/components/Controles.test.jsx` —
  modificar, conforme onde o avatar está montado
- `src/App.jsx`, `src/App.copiar.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Controles, § Menu de ações,
  § Camadas, § Wireframe da tela principal, § Medidas)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] Botão compartilhar imediatamente antes do avatar na primeira linha
      (teste de estrutura e verificação visual)
- [ ] Popup com as duas cópias separadas por filete; copiar funciona como
      antes, com a reserva do IDR 0039 (testes)
- [ ] Menu do avatar só com exportar, importar e sair (teste)
- [ ] Popup fecha fora, com `Esc` e ao escolher; foco entra no primeiro item
      e volta ao botão (testes)
- [ ] `docs/interface.md` nas seis seções e `AGENTS.md` atualizados

## Validação adicional
Roteiro visual em `npm run dev` a 375×667 e 1440px: título quebrando com
compartilhar e avatar no alto à direita; abrir os dois popups; conferir as
áreas de toque em emulação de toque.
