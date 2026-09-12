<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0010-0002]: desempenho das 994 figurinhas

## Status
Concluída — ver log em
`docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0002-log-desempenho-das-994-figurinhas.md`
e decisão em `docs/tdr/0021-desempenho-do-catalogo.md`.

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Requisitos Não Funcionais — "catálogo com ~1000 figurinhas renderiza e filtra sem travar; virtualizar listas longas se necessário"
- `docs/arquitetura.md` § Pontos em aberto — "Virtualização das listas: ~1000 figurinhas sem travar, sem criar scroll próprio — escolha de biblioteca na implementação"
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Consequências — "listas densas exigem virtualização que preserve a rolagem da página, sem criar contêiner com overflow próprio"
- `docs/requisitos.md` § Navegadores — evergreen: últimas duas versões de Chrome, Edge, Firefox e Safari, desktop e mobile
- `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md` § Consequências — colapsar já encurta o percurso e reduz o que é renderizado

## Objetivo
Provar, com medição, que o catálogo inteiro renderiza e filtra sem travar — e
adotar a técnica mais barata que resolver, sem inventar rolagem própria e sem
trazer dependência que não se pague.

## Padrões e convenções aplicáveis
- Qualquer solução tem de **preservar a rolagem da página**: nada de contêiner
  com `overflow` — `docs/idr/0008-*` § Consequências
- Medir antes de escolher: "virtualizar se necessário" é condicional, não
  obrigação — `docs/requisitos.md` § Requisitos Não Funcionais
- Suporte alvo são os evergreen; uma técnica sem suporte neles precisa de
  degradação — `docs/requisitos.md` § Navegadores
- Dependência nova é decisão de arquitetura e exige **ADR**, não TDR —
  `AGENTS.md` § Convenções
- Nenhuma otimização pode quebrar acessibilidade nem o realce de foco da
  Tarefa 0010-0001 — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Medir primeiro, no aparelho mais fraco disponível: tempo de primeira
   renderização com as 994; custo de um ajuste de contagem; custo de trocar
   ordenação, disposição e filtro; custo de colapsar e expandir. Registrar
   números no log.
2. **Ponto em aberto do `arquitetura.md`: virtualização** — resolver na ordem do
   mais barato ao mais caro, parando no primeiro que resolver:
   - memoização dos componentes de cartão e de seção, para que um ajuste não
     rerrenderize o catálogo inteiro
   - `content-visibility: auto` com `contain-intrinsic-size` por seção, que
     adia a renderização do que está fora da tela **sem** criar contêiner rolável
   - só então, biblioteca de virtualização — e, se chegar aí, com **ADR**
   Registrar a escolha e a medição que a justificou.
3. Conferir que a técnica escolhida não quebra o salto para seção (Tarefa
   0003-0004): rolar até um elemento ainda não renderizado precisa continuar
   funcionando.
4. Conferir que não quebra a busca do navegador (Ctrl+F) mais do que o
   inevitável, e que não afeta leitores de tela.
5. Remedir depois da mudança e comparar com a linha de base — otimização sem
   número antes e depois é palpite.

**Fora do escopo**: mudar o desenho para reduzir o número de elementos; reduzir o
catálogo; adiar dados por rede, que contraria o catálogo embutido.

## Decisões já tomadas (não reabrir)
- Virtualização, se houver, não pode criar rolagem própria — ver `docs/idr/0008-uma-unica-pagina-scrollavel.md`
- O catálogo é embutido no bundle, não carregado sob demanda de serviço — ver `docs/requisitos.md` § Conteúdo
- Seções e super-grupos colapsáveis já reduzem o que é renderizado — ver `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`

## Decisões em aberto nesta tarefa
- Qual técnica adotar — resolvida pela medição, na ordem do passo 2; nasce um
  **TDR** (ou **ADR**, se entrar dependência nova)

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
- `src/components/Figurinha.jsx` — modificar
- `src/components/Secao.jsx` — modificar
- `src/components/Catalogo.jsx` — modificar
- `src/theme.css` — modificar
- `docs/tdr/00NN-desempenho-do-catalogo.md` — criar (próximo número livre)
- `docs/arquitetura.md` — modificar (o ponto em aberto sai)

## Critérios de aceite
- [ ] Existe linha de base medida antes da mudança, no log
- [ ] A técnica adotada é a mais barata que resolveu, na ordem definida
- [ ] Nenhum contêiner com rolagem própria foi introduzido
- [ ] O salto para seção continua funcionando com conteúdo fora da tela
- [ ] Ajustar uma contagem não rerrenderiza o catálogo inteiro
- [ ] A medição depois da mudança está no log, comparável com a linha de base
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0002-log-desempenho-das-994-figurinhas.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev` com o painel de performance do navegador:
rolar o catálogo inteiro, trocar de ordenação e de filtro e ajustar contagens,
comparando os números com a linha de base registrada.
