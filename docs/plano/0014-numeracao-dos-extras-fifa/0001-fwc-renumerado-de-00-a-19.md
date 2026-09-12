<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0014-0001]: FWC renumerado de FWC00 a FWC19

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md` — a forma do dado, a expansão `SIG01…SIG20`, `FWC01…FWC20`, `COC01…COC14` e a degradação da fonte do checklist
- `docs/requisitos.md` § Glossário — "Especiais: … 'Extras FIFA' (código `FWC`; 20 figurinhas…)"
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` — FWC é a primeira seção nas duas ordenações
- `src/data/catalogo.js`, `src/data/catalogo.test.js`, `src/data/catalogoLayout.js`

## Objetivo
Corrigir a numeração da seção `FWC`: os 20 códigos oficiais vão de **FWC00 a
FWC19** (indexados a partir de zero), não de `FWC01` a `FWC20` como o catálogo
tem hoje. **A quantidade não muda — continuam sendo 20 figurinhas na seção, e
994 no catálogo inteiro.** O que muda é só o deslocamento de um: o código
`FWC01` do app hoje passa a significar o que hoje é `FWC02`, e assim por
diante; o código `FWC00`, que fisicamente existe (o logo da Panini), passa a
existir no app; o `FWC20` do app hoje deixa de existir, porque não corresponde
a nenhuma figurinha real.

Conteúdo real da seção, só para contexto (a interface não exibe nomes —
TDR 0010 — então isto não entra no dado, apenas confirma que são 20 unidades):
logo da Panini (00); emblema oficial em duas partes (1–2); mascotes (3);
slogan oficial (4); bola oficial Trionda (5); três cartões de países-sede —
Canadá, México, EUA (6–8); onze campeãs históricas do FIFA Museum, de Itália
1934 a Argentina 2022 (9–19).

**Por que é urgente e por que não é aditiva** (ao contrário de uma correção que
só acrescenta números que faltavam): um usuário que já tivesse gravado
contagens sob os códigos atuais teria seus números reinterpretados errado se a
correção só trocasse o gerador sem mais nada. **Confirmado com o humano**: não
há uso real em produção hoje, então esta tarefa segue **sem** passo de
migração — decisão registrada aqui e no TDR desta tarefa, para não ficar
implícita.

## Padrões e convenções aplicáveis
- Nenhum literal de figurinha escrito à mão: o array nasce por expansão — TDR 0010
- O catálogo é a única fonte desse dado — `AGENTS.md` § Onde fica cada coisa
- Os testes de invariantes fazem o papel de validação que a ausência de pipeline deixaria sem cobertura — TDR 0010
- Decisão técnica tomada durante a execução vira **TDR** na hora — `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. **`expandirFigurinhas` aceita seção que não começa em 1**: acrescentar um
   campo opcional `inicio` (padrão `1`) e gerar `posicao` de `inicio` a
   `inicio + total − 1`. `total` continua com o significado de **quantidade**
   de figurinhas, não de último número. O código continua sigla + número com
   dois dígitos (`padStart(2, "0")`), o que dá `FWC00` no mesmo formato dos
   demais.
2. **A seção `fwc` ganha `inicio: 0`**, mantendo `total: 20` — **sem mudar**
   nenhum outro campo. `paginas: null` continua como está (TDR 0010).
3. **Não mexer em `metalizada` nem em `paisagem`**: continuam presos a
   `tipo === "selecao"`, e o FWC nunca teve nenhum dos dois.
4. **Atualizar os comentários** que citam a numeração antiga: o cabeçalho de
   `catalogo.js` (a menção a `FWC01…FWC20` vira `FWC00…FWC19`) e qualquer outro
   comentário equivalente encontrado no grep final do passo 7.
5. **Testes de invariantes** (`src/data/catalogo.test.js`): FWC continua com
   **20** figurinhas, mas a primeira é `FWC00` e a última `FWC19`, sem buraco
   na sequência; total do catálogo continua **994**; seleções (20 cada) e COC
   (14) inalterados; nenhum código duplicado; formato três letras + dois
   dígitos vale para todos.
6. **Ajustar os testes que fixam a faixa 1–20 do FWC como literal**, no mesmo
   commit:
   - `src/components/Catalogo.test.jsx` — o rótulo de exemplo com o código
     `FWC 01` (por volta da linha 150) troca para `FWC 00` ou outro código
     coerente com o cenário; o laço que preenche `contagensFwcCompletas`
     (por volta da linha 307, hoje de 1 a 20) passa a ir de 0 a 19.
   - `src/components/Secao.test.jsx` — a seção FWC de exemplo (`figurinhasFwc`,
     por volta da linha 229, hoje gerando código a partir de `i + 1`) passa a
     gerar a partir de `i`; o laço de asserção logo abaixo (hoje de 1 a 20)
     passa a ir de 0 a 19.
   - Os demais arquivos que usam o código `FWC01` só como exemplo qualquer de
     código válido (`App.desfazer.test.jsx`, `App.gravacao.test.jsx`,
     `App.importar.test.jsx`, `App.persistencia.test.jsx`,
     `colecaoRemota.test.js`, `gravacaoAgregada.test.js`, `historico.test.js`,
     `portabilidade.test.js`, `textoDeTroca.test.js`) **não precisam mudar** —
     esse código continua válido e existente depois da renumeração (é o item
     "emblema, parte de cima"); conferir rodando a suíte, não trocar por
     precaução.
7. Conferir com uma busca por `FWC01`, `FWC20` e `FWC00` em `src/` como
   verificação final, para separar o que ainda é código de exemplo válido do
   que precisava mudar.
8. **Registrar TDR** com: o campo `inicio` (por que não escrever os 20 códigos
   como literais), a renumeração da seção FWC para começar em zero, e a
   decisão explícita — confirmada com o humano nesta tarefa — de não migrar
   dado por não haver uso real em produção ainda.

**Fora do escopo**: mudar o total do catálogo (continua 994); mudar as regras
do Firestore (o teto de tamanho já cobria 994 e continua cobrindo); nomes das
figurinhas; marcar quais são brilhantes; a página do FWC no cabeçalho da seção;
os textos de troca (Tarefa 0014-0002).

## Decisões já tomadas (não reabrir)
- Sem pipeline de geração: catálogo à mão, expandido por função pura, validado por testes de invariantes — TDR 0010
- FWC abre o catálogo nas duas ordenações — IDR 0028
- FWC é exibida sempre em lista contínua, inclusive na disposição álbum — IDR 0023
- FWC não tem layout de página do álbum — `catalogoLayout.js`, IDR 0023
- **Sem migração de dado**: confirmado com o humano que não há uso real em
  produção antes desta tarefa; se isso mudar antes da execução, parar e
  reabrir a pergunta (impedimento nível 3 — irreversível)

## Decisões em aberto nesta tarefa
- **Como o dado expressa a numeração que começa em zero**: encaminhamento é o
  campo `inicio` com padrão 1, mantendo `total` como quantidade. Decisão de
  nível 1 — implementar e registrar no TDR da tarefa.

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível — **em
   particular, se houver qualquer indício de dado real gravado em produção sob
   os códigos antigos, parar antes de trocar o gerador.**
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/data/catalogo.js` — modificar
- `src/data/catalogo.test.js` — modificar
- `src/components/Catalogo.test.jsx` — modificar
- `src/components/Secao.test.jsx` — modificar
- `docs/tdr/00NN-renumeracao-do-fwc.md` — criar (próximo número livre: TDR 0022)

## Critérios de aceite
- [ ] `figurinhas` continua com 994 itens; a seção FWC continua com 20, agora de `FWC00` a `FWC19`, sem buraco
- [ ] Seleções (20 cada) e COC (14) permanecem exatamente como estavam
- [ ] Nenhum código duplicado e todos no formato três letras + dois dígitos
- [ ] Nenhuma figurinha do FWC nasce metalizada ou em formato paisagem
- [ ] O placar geral do cabeçalho continua dizendo o total de 994, sem nenhuma outra mudança
- [ ] TDR criado, registrando a renumeração e a decisão de não migrar dado
- [ ] `npm run lint && npm run test && npm run build` verdes
- [ ] `docs/plano/0014-numeracao-dos-extras-fifa/logs/0001-log-fwc-renumerado-de-00-a-19.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: a seção Extras FIFA abre com 20 cartões,
de `FWC 00` a `FWC 19`, em lista contínua nas duas disposições; o progresso da
seção continua lendo 0 de 20 e o placar geral, o total de 994.
