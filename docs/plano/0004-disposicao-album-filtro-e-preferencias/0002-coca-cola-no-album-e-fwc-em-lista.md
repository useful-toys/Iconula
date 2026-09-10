<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0004-0002]: Coca-Cola no álbum e Extras FIFA sempre em lista

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão e § Consequências — o arranjo da Coca-Cola, o FWC em lista e a regra do filtro por disposição escolhida
- `docs/interface.md` § Disposição "Como no álbum" → "Coca-Cola — 3 trilhas por página" — as duas páginas e as posições
- `docs/interface.md` § Grupo na disposição álbum — Coca-Cola — o wireframe
- `docs/requisitos.md` § Anexo: seções do catálogo — as páginas 112–113 e a distribuição 6 + 8
- `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md` § Decisão — o filtro pertence à disposição lista
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão — as duas seções continuam nas pontas e colapsáveis como qualquer outra

## Objetivo
Completar a disposição álbum nas duas seções especiais: a Coca-Cola ganha o
próprio spread de 3 trilhas, e os Extras FIFA seguem em lista contínua mesmo com
"Álbum" escolhido — e, ali, sem filtro, porque a disposição escolhida é álbum.

## Padrões e convenções aplicáveis
- A Coca-Cola tem 3 trilhas por página, mesmas medidas das seleções, todas em
  retrato — `docs/interface.md` § Coca-Cola — 3 trilhas por página
- O FWC aparece em lista contínua também na disposição álbum, e essa lista
  **não** é filtrada — `docs/idr/0023-*` § Decisão
- O alternador de filtro permanece oculto quando a disposição é álbum, mesmo
  havendo seção exibida em lista — `docs/idr/0023-*` § Consequências
- FWC e Coca-Cola são seções normais quanto a colapso e posição nas pontas —
  `docs/idr/0028-*` § Decisão
- Nenhum contêiner com rolagem própria — `docs/idr/0008-*` § Decisão
- Cor só pelos tokens de `docs/interface.md` § Paleta — `docs/idr/0022-*`

## Escopo e instruções de implementação
1. Aplicar o layout da Coca-Cola derivado na Tarefa 0001-0003: página 1 com
   01–06 em 2 linhas de 3; página 2 com 07–09, 10–12 e 13–14 nas duas primeiras
   posições da linha 3. Todas em retrato, mesmas trilhas de 52px.
2. Reusar o componente de página do álbum da Tarefa 0004-0001, parametrizado pelo
   número de trilhas — não duplicar componente por seção.
3. FWC: quando a disposição vigente for álbum, renderizar a lista contínua, a
   mesma da Tarefa 0002-0004, e **sem** aplicar filtro algum.
4. Garantir que a regra do filtro seja "por disposição escolhida", não "por como
   a seção aparece": com `Álbum` selecionado, o alternador de filtro não existe
   na tela, e nenhuma seção — nem a lista do FWC — é filtrada.
5. Testes: a Coca-Cola no álbum tem 6 espaços na primeira página e 8 na segunda,
   com 13 e 14 nas duas primeiras posições da linha 3; com disposição álbum, o
   FWC exibe as 20 figurinhas em lista, sem controles de filtro na tela.

**Fora do escopo**: o filtro em si e a ocultação de seções vazias
(Tarefa 0004-0004); o empilhamento responsivo (Tarefa 0004-0003); qualquer
tentativa de inventar um layout de página para o FWC — os dados não existem.

## Decisões já tomadas (não reabrir)
- A Coca-Cola tem disposição álbum; o FWC nunca tem — ver `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- Reproduzir a página do FWC por analogia seria invenção — ver `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md`
- O filtro existe apenas na disposição lista — ver `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`
- FWC abre e Coca-Cola fecha o catálogo — ver `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Decisões em aberto nesta tarefa
- Nenhuma. Se a fonte do checklist trouxer o arranjo físico do FWC, isso reabre o
  IDR 0009 como candidato a extensão — mas é decisão futura, fora desta tarefa.

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
- `src/components/PaginaDoAlbum.jsx` — modificar (número de trilhas por parâmetro)
- `src/components/Secao.jsx` — modificar (FWC cai em lista na disposição álbum)
- `src/components/Secao.test.jsx` — modificar

## Critérios de aceite
- [ ] A Coca-Cola no álbum tem 6 espaços na página 1 e 8 na página 2, com 13 e 14 nas duas primeiras posições da linha 3
- [ ] Com disposição álbum, o FWC aparece em lista contínua com as 20 figurinhas
- [ ] Com disposição álbum, o alternador de filtro não aparece na tela
- [ ] A lista do FWC dentro da disposição álbum não é filtrada em nenhuma hipótese
- [ ] FWC e Coca-Cola continuam colapsáveis e nas pontas do catálogo
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0002-log-coca-cola-no-album-e-fwc-em-lista.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com `Álbum` selecionado, rolar até o fim e
comparar a Coca-Cola com o wireframe; conferir no topo que o FWC está em lista e
que não há nenhum controle de filtro na linha de controles.
