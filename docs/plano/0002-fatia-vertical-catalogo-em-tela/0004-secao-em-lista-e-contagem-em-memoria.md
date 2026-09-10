<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0002-0004]: seção em lista e contagem em memória

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Corpo — cabeçalho de grupo em uma linha, dois pesos, e a grade de figurinhas
- `docs/interface.md` § Grupo na disposição lista — o wireframe: cards fluem e quebram conforme a largura
- `docs/idr/0011-faltantes-por-secao-no-cabecalho-do-grupo.md` § Decisão — os faltantes aparecem no cabeçalho da seção
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — a mesma notação compacta em todos os títulos
- `docs/requisitos.md` § Contagem — incremento, decremento, teto de 99, piso de 0, ajuste aplicado na hora
- `docs/requisitos.md` § Semântica da contagem — 0 faltante, 1 colada, n ≥ 2 colada + (n−1) repetidas
- `docs/arquitetura.md` § Camadas no cliente e § Pontos em aberto — onde o estado da coleção mora e a questão Context × prop-drilling

## Objetivo
Fechar a fatia vertical: o catálogo inteiro em tela, seção por seção na disposição
lista, com a contagem ajustável e o progresso por seção e no placar reagindo na
hora. Nesta fase a coleção vive só em memória — a persistência chega na Fase 6.

## Padrões e convenções aplicáveis
- Componentes novos em `src/components/`; **sem router e sem estado global nesta
  tarefa** — a coleção mora no `App.jsx` e desce por props —
  `AGENTS.md` § Convenções e `docs/arquitetura.md` § Pontos em aberto
- Notação compacta idêntica à do placar no cabeçalho de cada seção
  (`Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3`), com nome acessível por extenso —
  `docs/idr/0018-*` § Decisão e `docs/idr/0011-*` § Decisão
- No cabeçalho da seção, identificação em `--cream` peso 600 e números em
  `--muted` peso 400 — `docs/interface.md` § Corpo
- A bandeira do cabeçalho é decorativa (`aria-hidden`), com o nome da seção em
  texto — `docs/requisitos.md` § Requisitos Não Funcionais
- Nenhum contêiner com rolagem própria: a grade se abre na página —
  `docs/idr/0008-*` § Decisão
- Teto de 99 e piso de 0 aplicados aqui, na lógica de ajuste —
  `docs/requisitos.md` § Contagem e `docs/tdr/0009-*`

## Escopo e instruções de implementação
1. Criar o componente de seção: cabeçalho em uma linha (ícone Twemoji, nome,
   sigla, número da página quando existir, e o resumo em notação compacta) e a
   grade de figurinhas em sequência de 01 a N, fluindo e quebrando conforme a
   largura, com 8px entre cartões.
2. O número da página é omitido quando a seção não o tem — é o caso do FWC,
   conforme a degradação decidida na Tarefa 0001-0002.
3. Criar o componente do corpo: percorre o catálogo na ordem vigente (nesta fase,
   uma só: a de sigla, com FWC abrindo e COC fechando) e renderiza as 50 seções.
4. Estado da coleção no `App.jsx`: um mapa de código → contagem, **esparso**
   (chave ausente = 0), espelhando desde já o formato que o Firestore vai receber
   (ADR 0008). Ajustar é uma função pura: incrementar limita em 99, decrementar
   remove a chave ao chegar em 0.
5. O progresso por seção usa o mesmo módulo puro do placar (Tarefa 0002-0002),
   agora parametrizado por conjunto de códigos — sem duplicar a regra de contagem.
6. **Ponto em aberto do `arquitetura.md`: Context × prop-drilling** — resolver
   aqui por prop-drilling, e só considerar Context se a coleção precisar
   atravessar mais de três níveis de componente. Registrar a decisão como **TDR**,
   com o critério de reavaliação explícito (revisto na Tarefa 0006-0003).
7. Testes: ajustar uma figurinha muda o cartão, o resumo da seção e o placar na
   mesma renderização; incrementar em 99 e decrementar em 0 não mudam nada; a
   chave some do mapa ao chegar a 0.

**Fora do escopo**: ordenações e super-grupos (Fase 3); colapso (Fase 3); filtro
(Fase 4); disposição álbum (Fase 4); desfazer (Fase 8); qualquer gravação.

## Decisões já tomadas (não reabrir)
- Faltantes no cabeçalho da seção, em notação compacta — ver `docs/idr/0011-*` e `docs/idr/0018-*`
- Mapa esparso: zeros nunca gravados, chave ausente é contagem 0 — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- "Colada" é presunção da contagem, não estado à parte — ver `docs/requisitos.md` § Semântica da contagem
- Sem tela e sem mensagem para o estado vazio — ver `docs/requisitos.md` § Contagem
- Nenhuma requisição por figurinha, em nenhuma hipótese — ver `docs/requisitos.md` § Requisitos Não Funcionais

## Decisões em aberto nesta tarefa
- Context × prop-drilling para a coleção — encaminhamento no passo 6; nasce um **TDR**
- Como o cabeçalho de seção se comporta quando não cabe na largura —
  encaminhamento: quebra em mais de uma linha sem nunca cortar o resumo, como
  `docs/interface.md` § Corpo já descreve; sem registro se seguir isso

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
- `src/components/Secao.jsx` — criar
- `src/components/Secao.test.jsx` — criar
- `src/components/Catalogo.jsx` — criar
- `src/lib/colecao.js` — criar (mapa esparso e ajustes puros)
- `src/lib/colecao.test.js` — criar
- `src/lib/progresso.js` — modificar (progresso por conjunto de códigos)
- `src/App.jsx` — modificar
- `docs/tdr/00NN-estado-da-colecao-sem-context.md` — criar

## Critérios de aceite
- [ ] As 50 seções aparecem na página, com FWC primeiro e Coca-Cola por último
- [ ] O cabeçalho de cada seção traz `nome sigla página · X/N · P% · ▢F · ×R`, com nome acessível por extenso
- [ ] A seção do FWC omite o número da página, sem quebrar o cabeçalho
- [ ] Tocar num cartão atualiza cartão, resumo da seção e placar simultaneamente
- [ ] Contagem que chega a 0 remove a chave do mapa, comprovado por teste
- [ ] Incremento não passa de 99 e decremento não vai abaixo de 0
- [ ] Nenhum componente com rolagem própria e nenhuma requisição de rede por ajuste
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0004-log-secao-em-lista-e-contagem-em-memoria.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: rolar do topo ao fim passa pelas 50 seções
sem nenhuma barra de rolagem interna; ajustar figurinhas do Brasil muda o resumo
do Brasil e o placar do título; recarregar a página zera a coleção — comportamento
esperado até a Fase 6.
