<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0004-0004]: filtro de status e ocultação de seções vazias

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md` § Decisão — o filtro existe apenas na disposição lista; a álbum nunca é filtrada
- `docs/idr/0025-filtro-oculta-secoes-vazias.md` § Decisão e § Consequências — seção e super-grupo sem resultado somem inteiros; ocultar não é colapsar; o placar não muda
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão — o alternador de filtro fica oculto na disposição álbum
- `docs/interface.md` § Controles — os rótulos `Todas | Falt. | Rep.` e o comportamento da linha quando o filtro some
- `docs/requisitos.md` § Progresso e listas — as listas de faltantes e repetidas em tela realizam-se pelo filtro
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — rótulos abreviados, forma por extenso no nome acessível

## Objetivo
Entregar o filtro de status — todas, faltantes, repetidas — na disposição lista,
com as seções e super-grupos sem resultado desaparecendo da vista. É o que
realiza em tela as listas de faltantes e de repetidas exigidas por
`requisitos.md`.

## Padrões e convenções aplicáveis
- O filtro só existe na disposição lista; com `Álbum` escolhido o alternador
  **não aparece** — `docs/idr/0001-*` § Decisão e `docs/idr/0023-*` § Decisão
- Seção sem nenhuma figurinha no estado filtrado some inteira, cabeçalho
  incluído; super-grupo sem seções visíveis também — `docs/idr/0025-*` § Decisão
- Ocultar por filtro **não** altera o estado aberto/fechado das seções —
  `docs/idr/0025-*` § Decisão
- O placar do título continua sobre as 994: o filtro muda a vista, não os números
  — `docs/idr/0025-*` § Consequências
- Rótulos curtos `Todas | Falt. | Rep.`, forma por extenso só no nome acessível —
  `docs/interface.md` § Controles e `docs/idr/0018-*`
- Filtrar custa zero requisição — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Acrescentar o terceiro grupo segmentado à linha de controles, visível somente
   quando a disposição é lista. Quando ele some, os dois comandos da direita não
   se movem — a linha já foi desenhada assim na Tarefa 0003-0001.
2. Filtrar a grade da seção: `todas` mostra tudo; `faltantes` mostra contagem 0;
   `repetidas` mostra contagem ≥ 2.
3. Ocultar a seção inteira quando o filtro não deixa nenhuma figurinha, e o
   super-grupo quando nenhuma de suas seções sobra.
4. Voltar o filtro para `todas` traz tudo de volta com o mesmo estado de colapso
   de antes — o colapso é ortogonal ao filtro.
5. Coleção completa com filtro em `faltantes` resulta em tela vazia: é a leitura
   correta, e não recebe mensagem nem estado especial.
6. **Fechar a pendência do salto com filtro ativo**, aberta na Tarefa 0003-0004:
   saltar para uma seção oculta pelo filtro volta o filtro para `todas` e então
   rola até ela. Implementar aqui e confirmar o IDR registrado lá.
7. Testes: cada valor do filtro mostra o conjunto certo; seção completa some com
   `faltantes`; super-grupo inteiro some quando todas as suas seções somem; o
   placar do título não muda ao filtrar; saltar para seção oculta limpa o filtro.

**Fora do escopo**: persistir a escolha do filtro (Tarefa 0004-0005); os textos
de troca para WhatsApp, que são outra saída (Tarefa 0008-0003).

## Decisões já tomadas (não reabrir)
- Filtro só na disposição lista — ver `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`
- Seções e super-grupos vazios somem da vista — ver `docs/idr/0025-filtro-oculta-secoes-vazias.md`
- O alternador de filtro fica oculto na disposição álbum, inclusive para o FWC — ver `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- Estado vazio não tem tela nem mensagem especial — ver `docs/requisitos.md` § Contagem

## Decisões em aberto nesta tarefa
- Salto para seção ocultada pelo filtro — encaminhamento no passo 6; o **IDR**
  nasce na Tarefa 0003-0004 e é confirmado aqui pela implementação

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
- `src/components/Controles.jsx` — modificar
- `src/components/Catalogo.jsx` — modificar
- `src/components/Secao.jsx` — modificar
- `src/components/SuperGrupo.jsx` — modificar
- `src/lib/colecao.js` — modificar (predicados de estado)
- `src/lib/colecao.test.js` — modificar

## Critérios de aceite
- [ ] O grupo `Todas | Falt. | Rep.` aparece só quando a disposição é lista
- [ ] Com `Falt.`, seções completas somem inteiras; com `Rep.`, somem as sem repetidas
- [ ] Super-grupo sem nenhuma seção visível também some
- [ ] Voltar para `Todas` restaura tudo, com o colapso anterior preservado
- [ ] O placar do título não muda ao filtrar
- [ ] Saltar para uma seção ocultada pelo filtro volta o filtro para `Todas` e rola até ela
- [ ] Coleção completa com `Falt.` resulta em tela vazia, sem mensagem especial
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0004-log-filtro-de-status-e-secoes-vazias.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com poucas figurinhas registradas, `Rep.`
deixa a página curta e só com as seções que têm repetidas; alternar para `Álbum`
faz o grupo de filtro desaparecer da linha de controles sem mover os comandos da
direita.
