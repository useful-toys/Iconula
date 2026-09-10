<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0003-0003]: colapso de seções em qualquer visualização

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Decisão e § Consequências — o que colapsa, o que permanece visível e por que o estado é volátil
- `docs/interface.md` § Corpo — a linha inteira do cabeçalho, chevron incluído, é a área de toque
- `docs/requisitos.md` § Catálogo — seções colapsáveis em qualquer ordenação e disposição, abertas por padrão
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — o resumo que permanece quando a seção fecha
- `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md` § Decisão — o colapso **não** é preferência e não persiste

## Objetivo
Permitir fechar cada seção deixando só o cabeçalho com o resumo, em qualquer
ordenação e disposição. Fechadas, as ~50 linhas de resumo cobrem o catálogo
inteiro e respondem sozinhas à consulta de progresso.

## Padrões e convenções aplicáveis
- O colapso vale em **qualquer** ordenação e disposição, inclusive na álbum —
  `docs/idr/0020-*` § Decisão
- Padrão aberto; o estado vive em memória e some ao recarregar — **não** vai para
  o `localStorage` nem para o Firestore — `docs/idr/0020-*` e `docs/idr/0026-*`
- Fechada, a seção mantém o cabeçalho com o resumo em notação compacta —
  `docs/idr/0020-*` § Decisão
- A linha inteira do cabeçalho, chevron incluído, é a área de toque —
  `docs/interface.md` § Corpo
- Sem conflito de gesto: título da seção colapsa, ícone da faixa salta —
  `docs/idr/0020-*` § Consequências
- Colapsar não pode criar contêiner com rolagem própria nem animação que
  introduza `overflow` — `docs/idr/0008-*` § Decisão

## Escopo e instruções de implementação
1. Acrescentar o colapso ao componente de seção da Tarefa 0002-0004: chevron
   `▾`/`▸` no início da linha, e a linha inteira acionável.
2. Estado de colapso por sigla de seção, em memória, no `App.jsx` ou no componente
   do catálogo — nunca persistido.
3. Acessibilidade: o cabeçalho é um controle com estado expandido/recolhido
   exposto ao leitor de tela, acionável por teclado, e o corpo da seção fica
   associado a ele.
4. Expor uma forma de a Tarefa 0003-0004 expandir programaticamente uma seção
   colapsada, junto com o super-grupo que a contém.
5. Trocar de ordenação ou de disposição não deve embaralhar o estado de colapso:
   ele é endereçado pela sigla da seção, não por posição na lista.
6. Testes: fechar esconde a grade e mantém o resumo; recarregar volta ao padrão
   aberto; o estado sobrevive à troca de ordenação dentro da mesma sessão.

**Fora do escopo**: ocultar seções por filtro, que é outra coisa e não altera o
estado de colapso (Tarefa 0004-0004); o salto (Tarefa 0003-0004).

## Decisões já tomadas (não reabrir)
- Seções colapsáveis em qualquer ordenação e disposição, abertas por padrão — ver `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
- O colapso não persiste, ao contrário das preferências de vista — ver `docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md`
- Ocultar por filtro não é colapsar — ver `docs/idr/0025-filtro-oculta-secoes-vazias.md`

## Decisões em aberto nesta tarefa
- Se existe um comando de "colapsar tudo" — encaminhamento: não implementar;
  `requisitos.md` não pede e o IDR 0018 reserva o espaço da linha de controles ao
  catálogo; se for implementado, nasce um **IDR**

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
- `src/components/Secao.jsx` — modificar
- `src/components/Secao.test.jsx` — modificar
- `src/components/Catalogo.jsx` — modificar

## Critérios de aceite
- [ ] Tocar no cabeçalho de uma seção fecha e abre o corpo, mantendo o resumo
- [ ] O colapso funciona nas duas ordenações e, mais tarde, nas duas disposições
- [ ] O cabeçalho é acionável por teclado e expõe o estado expandido/recolhido
- [ ] Recarregar a página volta todas as seções ao padrão aberto
- [ ] Trocar de ordenação preserva o colapso da mesma seção
- [ ] Nada de colapso é gravado no `localStorage` ou no Firestore
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0003-log-colapso-de-secoes.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com todas as seções fechadas, a página vira
uma lista de resumos; conferir no DevTools que nada de colapso foi para o
`localStorage`.
