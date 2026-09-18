<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0033-0002]: Sobre no menu de ações

## Status
Pendente

## Objetivo
Acrescentar "Sobre" como segunda porta de entrada da vista criada na
Tarefa 0033-0001, num bloco próprio do menu de ações do cabeçalho, entre o
bloco de exportar/importar e o item isolado "Sair da conta".

## Documentos de referência
- `docs/idr/0063-tela-sobre-com-link-ao-repositorio-e-issues.md` — posição
  no menu (bloco próprio, entre os dois existentes)
- `docs/interface.md` § Menu de ações — estrutura atual dos dois blocos
- `src/components/MenuDeAcoes.jsx` (gerado pela Tarefa 0033-0001: recebe
  `onAbrirSobre` de `App.jsx`, mesmo padrão de `onExportar`/`onImportar`)

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `MenuDeAcoes.jsx`: nova prop `onAbrirSobre`; novo `<button role="menuitem">`
   "Sobre" entre o filete que já separa exportar/importar e o filete que
   isola "Sair da conta" — três blocos agora, dois filetes. Sem `disabled`
   condicional (a vista sempre existe, ao contrário de exportar/importar que
   dependem de callback).
2. Em `App.jsx`: passa `onAbrirSobre={() => setVistaInterna('sobre')}` para
   `MenuDeAcoes`, mesma função da Tarefa 0033-0001.
3. `docs/interface.md` § Menu de ações: acrescenta o item "Sobre" na
   descrição dos blocos, citando o IDR 0063.

**Fora do escopo**: o componente `Sobre.jsx` e o link do rodapé (Tarefa
0033-0001, pré-requisito desta).

## Decisões já tomadas (não reabrir)
- Bloco próprio, entre exportar/importar e sair da conta — ver
  `docs/idr/0063-tela-sobre-com-link-ao-repositorio-e-issues.md`

## Arquivos impactados
- `src/components/MenuDeAcoes.jsx` — modificar
- `src/components/MenuDeAcoes.css` — modificar (filete extra, se preciso)
- `src/components/MenuDeAcoes.test.jsx` — modificar
- `src/App.jsx` — modificar (`onAbrirSobre` para `MenuDeAcoes`)
- `docs/interface.md` — modificar (§ Menu de ações)

## Critérios de aceite
- [ ] O popup do avatar mostra três blocos separados por dois filetes:
      exportar/importar, Sobre, sair da conta — coberto por
      `MenuDeAcoes.test.jsx`
- [ ] Clicar "Sobre" no menu abre a mesma vista do rodapé (`vistaInterna === 'sobre'`) e fecha o popup — coberto por teste
- [ ] `docs/interface.md` § Menu de ações cita o item Sobre e o IDR 0063

## Validação adicional
- Roteiro visual em `npm run dev`: abrir o menu de ações pelo avatar,
  conferir a ordem dos três blocos e que "Sobre" abre a mesma tela do
  rodapé.
