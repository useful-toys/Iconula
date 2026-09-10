<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0001-0002]: escrever o catálogo do álbum em `src/data/`

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Anexo: seções do catálogo — a tabela das 48 seleções (código, nome PT-BR, grupo, páginas) e o arranjo da Coca-Cola
- `docs/requisitos.md` § Conceitos (Glossário) — o que é figurinha, seção, seleção e especial; a forma do código (três letras + dois dígitos)
- `docs/requisitos.md` § Catálogo — os totais: 994 figurinhas, 48 × 20 + 20 FWC + 14 COC
- `docs/requisitos.md` § Decisões Pendentes — o que a fonte do checklist ainda não dá e como degradar
- `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md` § A composição dos grupos — a tabela grupo × páginas × seleções, que vai explícita para `src/data/`
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` § Decisão — FWC e COC não pertencem a super-grupo
- `docs/arquitetura.md` § Camadas no cliente — o que se espera de `src/data/` no produto novo
- `docs/tdr/0001-estrutura-inicial-do-projeto.md` § Decisão — o precedente de `src/data/teams.js` como única fonte de dados

## Objetivo
Criar o catálogo embutido: as 50 seções e as 994 figurinhas do álbum, com tudo o
que a interface precisa exibir — sigla, nome em português, ícone, grupo da Copa,
páginas do álbum e posição dentro da seção. É o dado que todas as fases seguintes
consomem, e a identidade da figurinha (o código) nasce aqui, imutável.

## Padrões e convenções aplicáveis
- Arquivo novo abre com `// Copyright (c) 2026 Daniel Felix Ferber` —
  `AGENTS.md` § Convenções
- Conjunto de dados novo vai em `src/data/`, e é a única fonte daquele dado —
  `AGENTS.md` § Convenções e `docs/tdr/0001-*`
- O catálogo é embutido no código, nunca carregado de serviço externo —
  `docs/requisitos.md` § Conteúdo
- Nomes das seções em português como impressos no álbum ("Alemanha", "Estados
  Unidos", "Chéquia") — `docs/requisitos.md` § Catálogo
- Grupo da Copa e páginas vão **explícitos** no dado, não derivados em tempo de
  execução — `docs/idr/0019-*` § A composição dos grupos
- O código da figurinha é a identidade e nunca muda; contagens são endereçadas
  por ele, jamais por índice — `docs/requisitos.md` § Semântica da contagem

## Escopo e instruções de implementação
1. Criar `src/data/catalogo.js` exportando as **seções** com, no mínimo:
   `sigla` (`BRA`, `FWC`, `COC`), `nome` (PT-BR), `tipo` (`selecao` | `especial`),
   `icone` (emoji da bandeira, ou 🏆/🥤 para os especiais), `grupo` (`A`–`L` ou
   `null` para FWC e COC), `paginas` (par de números, ou `null` quando
   desconhecido — o caso do FWC) e `total` de figurinhas da seção.
2. Transcrever as 48 seleções da tabela do Anexo de `requisitos.md` — código,
   nome, grupo e páginas — sem reordenar e sem inventar linha. Conferir cada
   grupo contra a tabela do IDR 0019: as duas precisam concordar seleção por
   seleção. Divergência entre elas é motivo de PARAR e perguntar.
3. Definir as figurinhas: para cada seleção, 20 códigos `SIG01`…`SIG20`; `FWC01`
   a `FWC20`; `COC01` a `COC14`. Total exigido: **994**.
4. Marcar as posições fixas das seleções: `01` é o escudo (metalizada) e `13` é a
   foto da seleção (cromo horizontal, ocupa duas trilhas na disposição álbum).
5. **Pendência da fonte do checklist** (`requisitos.md` § Decisões Pendentes) —
   resolver por degradação, sem bloquear:
   - nomes das figurinhas: **não** entram; a interface especificada não os exibe
   - página do FWC: `paginas: null`; o cabeçalho daquela seção omite o número
   - metalizadas: só a posição `01` de cada seleção; o campo existe para receber
     as demais quando a fonte aparecer
   Registrar essa degradação como TDR, com a estrutura do dado já preparada.
6. **Ponto em aberto do `arquitetura.md`: pipeline de geração do catálogo** —
   resolver por "sem pipeline": o arquivo é escrito à mão a partir do Anexo, e o
   papel de validação fica com os testes de invariantes da Tarefa 0001-0003.
   Registrar no mesmo TDR do item 5 ou num TDR próprio.
7. Preferir gerar as 994 figurinhas por expansão programática das seções (uma
   função pura no próprio módulo) a escrever 994 literais: o dado que varia por
   seção é pouco, e a expansão é conferível pelo teste de invariantes.

**Fora do escopo**: ordenações, agrupamento em super-grupos e layouts de página
(Tarefa 0001-0003); qualquer componente ou uso do catálogo em tela (Fase 2);
remover `src/data/teams.js`, que ainda serve o botão até a Tarefa 0002-0005.

## Decisões já tomadas (não reabrir)
- 994 figurinhas: 48 × 20 + 20 FWC + 14 COC, todas contando no placar — ver
  `docs/requisitos.md` § Catálogo e `docs/idr/0007-placar-unico-e-progresso-por-secao.md`
- Grupo da Copa por seleção, explícito no dado — ver `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md`
- FWC e COC são seções normais, fora de qualquer super-grupo — ver `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- Ícones temáticos 🏆 e 🥤 no lugar da bandeira dos especiais — ver `docs/requisitos.md` § Catálogo
- Sem imagens dos cromos, em nenhuma hipótese — ver `docs/requisitos.md` § Conteúdo

## Decisões em aberto nesta tarefa
- Forma exata do dado (um array de seções com expansão, ou seções + índice de
  códigos pré-expandido) — encaminhamento: o que deixar o teste de invariantes
  mais direto; nasce um **TDR** descrevendo a forma escolhida
- Degradação por falta da fonte do checklist e ausência de pipeline de geração —
  encaminhamento no item 5/6 acima; nasce um **TDR**

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
   **Caso concreto previsto aqui**: divergência entre a tabela do Anexo de
   `requisitos.md` e a tabela de grupos do IDR 0019.

## Arquivos impactados
- `src/data/catalogo.js` — criar
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md` — criar (forma do dado, degradação do checklist, ausência de pipeline)

## Critérios de aceite
- [x] O catálogo tem exatamente 50 seções e 994 códigos
- [x] As 48 seleções batem, linha a linha, com o Anexo de `docs/requisitos.md`
      (código, nome PT-BR, grupo, páginas)
- [x] Os grupos batem com a tabela do IDR 0019, seleção por seleção
- [x] FWC tem 20 figurinhas e `paginas` nulo; COC tem 14
- [x] Toda seleção tem `01` marcada como metalizada e `13` marcada como paisagem
- [x] Nenhum nome de figurinha e nenhuma referência a imagem de cromo no dado
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas
- [x] `docs/plano/0001-fundacao-catalogo-e-assets/logs/0002-log-escrever-o-catalogo-do-album.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
A verificação de conteúdo é a da Tarefa 0001-0003 (testes de invariantes); aqui,
conferir manualmente uma amostra contra o Anexo — `BRA` (grupo C, páginas 24–25),
`MEX` (grupo A, 8–9), `PAN` (grupo L, 104–105) — e que `COC` fecha em 14.
