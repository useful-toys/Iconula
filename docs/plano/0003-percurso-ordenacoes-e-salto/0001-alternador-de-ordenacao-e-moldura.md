<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0003-0001]: alternador de ordenação e a moldura do catálogo

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md` § Decisão — as duas ordenações de seções
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão e § Consequências — a moldura não muda com a ordenação
- `docs/interface.md` § Controles — a linha única, os rótulos curtos `Página | Sigla`, o comportamento de quebra e a posição dos comandos à direita
- `docs/interface.md` § Medidas — grupos segmentados sobre `--panel`, raio 9px, item `5px 12px` em 12px/600, ativo em `--gold`
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — rótulos abreviados na tela, forma por extenso só no nome acessível
- `docs/requisitos.md` § Catálogo — as duas ordenações como requisito

## Objetivo
Dar ao usuário as duas ordenações do catálogo e a linha de controles que as
comanda. A moldura é a mesma nas duas: Extras FIFA abrem, Coca-Cola fecha; o que
muda é o miolo das 48 seleções.

## Padrões e convenções aplicáveis
- Rótulos curtos na tela (`Página` | `Sigla`), forma por extenso apenas no nome
  acessível do controle — `docs/idr/0018-*` § Decisão e `docs/interface.md` § Controles
- Os alternadores fluem e quebram de linha; os dois comandos ficam colados à
  direita e não se movem quando um alternador some — `docs/interface.md` § Controles
- FWC primeiro e COC última **nas duas ordenações**; sem super-grupo "Especiais" —
  `docs/idr/0028-*` § Decisão
- Cor só pelos tokens: ativo com fundo `--gold` e texto `--turf-deep`, inativo
  transparente em `--muted` — `docs/interface.md` § Medidas
- Trocar de ordenação custa **zero requisição**: é estado de vista, nunca toca o
  Firestore — `docs/requisitos.md` § Requisitos Não Funcionais e `docs/idr/0026-*`
- Nenhum componente com rolagem própria — `docs/idr/0008-*` § Decisão

## Escopo e instruções de implementação
1. Criar o componente da linha de controles em `src/components/`, logo abaixo do
   título, com o primeiro grupo segmentado: `Página` | `Sigla`.
2. Reservar, já nesta tarefa, o espaço à direita da linha para os dois comandos
   (desfazer e menu), que chegam na Fase 8 — para que a Fase 8 não precise
   redesenhar a linha. Enquanto não existem, a área fica vazia.
3. Ligar o alternador às derivações da Tarefa 0001-0003: a ordenação vigente
   escolhe a sequência de seções que o corpo percorre.
4. Garantir a moldura nas duas ordenações: a primeira seção renderizada é sempre
   o FWC e a última sempre a Coca-Cola. Cobrir com teste nas duas ordenações.
5. Nome acessível de cada botão do grupo escrevendo por extenso ("ordenar pela
   página do álbum", "ordenar pela sigla da seção") e estado de seleção exposto
   ao leitor de tela.
6. A escolha vive em estado local do `App.jsx` nesta tarefa; a persistência da
   preferência é a Tarefa 0004-0005.

**Fora do escopo**: super-grupos (Tarefa 0003-0002); alternador de disposição e
filtro (Fase 4); desfazer e menu (Fase 8); persistir a escolha (Tarefa 0004-0005).

## Decisões já tomadas (não reabrir)
- Duas ordenações: página do álbum e sigla da seção — ver `docs/idr/0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md`
- FWC abre e Coca-Cola fecha o catálogo nas duas — ver `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- Os especiais no começo juntos, do IDR 0013, foram **substituídos** — não reabrir
- Rótulos abreviados na tela — ver `docs/idr/0018-usuario-especialista-e-minimalismo.md`

## Decisões em aberto nesta tarefa
- Qual ordenação é a inicial antes de existir preferência guardada —
  encaminhamento: usar a ordem do álbum provisoriamente e deixar a escolha
  definitiva para a Tarefa 0009-0003, que decide por faixa de tela; registrar a
  provisoriedade no log

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
- `src/components/Controles.jsx` — criar
- `src/components/Controles.test.jsx` — criar
- `src/components/Catalogo.jsx` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] O grupo segmentado `Página | Sigla` aparece na linha de controles, com o ativo em `--gold`
- [ ] Nas duas ordenações, a primeira seção é o FWC e a última é a Coca-Cola
- [ ] A ordenação por sigla lista as 48 seleções em ordem alfabética de sigla entre os especiais
- [ ] Cada botão tem nome acessível por extenso e estado de seleção exposto
- [ ] Trocar de ordenação não dispara nenhuma requisição de rede
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0001-log-alternador-de-ordenacao-e-moldura.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: alternar entre `Página` e `Sigla` reordena o
corpo mantendo 🏆 no topo e 🥤 no fim; em janela estreita, o grupo segmentado
quebra de linha sem empurrar a área reservada à direita.
