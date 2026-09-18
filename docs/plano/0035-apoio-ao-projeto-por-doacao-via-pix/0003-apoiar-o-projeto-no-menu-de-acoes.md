<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0035-0003]: Apoiar o projeto no menu de ações

## Status
Pendente

## Objetivo
Acrescentar "Apoiar o projeto" como segunda porta de entrada da vista
criada na Tarefa 0035-0002, num bloco próprio do menu de ações do
cabeçalho, depois do bloco "Sobre" (Fase 33) e antes do item isolado
"Sair da conta".

## Documentos de referência
- `docs/idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md` —
  posição no menu (depois de "Sobre", antes de "Sair")
- `docs/interface.md` § Menu de ações — estrutura dos blocos depois da
  Fase 33 entregue (exportar/importar, Sobre, sair da conta)
- `src/components/MenuDeAcoes.jsx` (modificado pela Tarefa 0033-0002:
  recebe `onAbrirSobre` de `App.jsx`, mesmo padrão de
  `onExportar`/`onImportar`) — padrão a seguir para `onAbrirApoie`

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `MenuDeAcoes.jsx`: nova prop `onAbrirApoie`; novo
   `<button role="menuitem">` "Apoiar o projeto" entre o filete que já
   isola o bloco "Sobre" (Tarefa 0033-0002) e o filete que isola "Sair da
   conta" — quatro blocos agora, três filetes. Sem `disabled`
   condicional, como "Sobre".
2. Em `App.jsx`: passa `onAbrirApoie={() => setVistaInterna('apoie')}`
   para `MenuDeAcoes`, mesma função criada na Tarefa 0035-0002.
3. `docs/interface.md` § Menu de ações: acrescenta o item "Apoiar o
   projeto" na descrição dos blocos, citando o IDR 0070.

**Fora do escopo**: a vista e o link do rodapé (Tarefa 0035-0002,
pré-requisito desta); a existência do bloco "Sobre" (Fase 33,
pré-requisito da fase).

## Decisões já tomadas (não reabrir)
- Bloco próprio, depois de "Sobre" e antes de "Sair da conta" — ver
  `docs/idr/0070-apoio-ao-projeto-rodape-menu-e-vista-com-qr-pix.md`

## Arquivos impactados
- `src/components/MenuDeAcoes.jsx` — modificar
- `src/components/MenuDeAcoes.css` — modificar (filete extra, se
  preciso)
- `src/components/MenuDeAcoes.test.jsx` — modificar
- `src/App.jsx` — modificar (`onAbrirApoie` para `MenuDeAcoes`)
- `docs/interface.md` — modificar (§ Menu de ações)

## Critérios de aceite
- [ ] O popup do avatar mostra quatro blocos separados por três filetes:
      exportar/importar, Sobre, Apoiar o projeto, sair da conta —
      coberto por `MenuDeAcoes.test.jsx`
- [ ] Clicar "Apoiar o projeto" no menu abre a mesma vista do rodapé
      (`vistaInterna === 'apoie'`) e fecha o popup — coberto por teste
- [ ] `docs/interface.md` § Menu de ações cita o item Apoiar o projeto e
      o IDR 0070

## Validação adicional
- Roteiro visual em `npm run dev`: abrir o menu de ações pelo avatar,
  conferir a ordem dos quatro blocos e que "Apoiar o projeto" abre a
  mesma tela do rodapé.
