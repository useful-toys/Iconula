<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0009-0003]: copiar listas de faltantes e de repetidas

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Compartilhamento — o formato de linha, `Brasil BRA: 5 8 12 19`, o `5×2` das repetidas, textos separados e entrega por área de transferência
- `docs/idr/0021-selo-conta-unidades-sobrando.md` § Decisão — no texto de troca, `×` conta **unidades sobrando**, igual ao selo do cartão
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — os dois comandos ficam no menu
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — "lista copiada" é sucesso; área de transferência indisponível é **aviso**, não falha
- `docs/persistencia.md` § Custos e cotas — texto de troca custa 0 operações: lê o estado em memória
- `docs/requisitos.md` § Progresso e listas — a lista de troca é apenas saída; portabilidade usa JSON

## Objetivo
Entregar o diferencial de troca: dois textos prontos para colar num grupo de
WhatsApp, um com o que falta e outro com o que sobra, copiados num toque a partir
do menu.

## Padrões e convenções aplicáveis
- Uma linha por seção, com nome e sigla no início e os números em sequência —
  `docs/requisitos.md` § Compartilhamento
- No texto, `5×2` são as **unidades sobrando** do número 5 — mesma leitura do
  selo do cartão — `docs/idr/0021-*` § Decisão
- Faltantes e repetidas geram textos **separados**, nunca um só —
  `docs/requisitos.md` § Compartilhamento
- Entrega por área de transferência, sem abrir o WhatsApp —
  `docs/requisitos.md` § Compartilhamento
- Área de transferência indisponível é **aviso** dourado, não falha vermelha —
  `docs/idr/0029-*` § Decisão
- Custa **zero** requisição: lê o estado em memória — `docs/persistencia.md` § Custos e cotas

## Escopo e instruções de implementação
1. Criar em `src/lib/` a geração dos dois textos, pura e testável, a partir do
   mapa de contagens e do catálogo.
2. Faltantes: para cada seção com pelo menos um faltante, uma linha
   `Nome SIG: n n n` com os números em ordem crescente, sem zeros à esquerda
   desnecessários — conferir o exemplo de `requisitos.md`.
3. Repetidas: mesma forma, com `n×k` onde k = contagem − 1, incluindo apenas
   figurinhas com contagem ≥ 2.
4. Seções sem nada a listar não aparecem no texto — uma linha vazia por seção
   seria ruído num grupo de troca.
5. Ligar os dois comandos do menu (Tarefa 0009-0002) à cópia para a área de
   transferência, com aviso de sucesso "lista copiada".
6. Área de transferência indisponível ou negada: aviso dourado, e o texto
   continua obtenível — no mínimo, sem perder o trabalho do usuário.
7. Testes: coleção conhecida gera o texto esperado, linha a linha; `×` do texto é
   contagem − 1; seções vazias não aparecem; cópia bem-sucedida emite sucesso;
   cópia indisponível emite aviso, não falha; nenhuma requisição é disparada.

**Fora do escopo**: importar lista colada do WhatsApp, que é requisito futuro;
export/import JSON (Tarefas 0009-0004 e 0009-0005); abrir o WhatsApp.

## Decisões já tomadas (não reabrir)
- Entrega por copiar, sem abrir o WhatsApp — ver `docs/requisitos.md` § Compartilhamento
- Dois textos separados, um por tipo — ver `docs/requisitos.md` § Compartilhamento
- `×` no texto de troca são unidades sobrando — ver `docs/idr/0021-selo-conta-unidades-sobrando.md`
- A lista de troca é só saída; portabilidade é JSON — ver `docs/requisitos.md` § Progresso e listas
- Copiar precisa de retorno visível — ver `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md`

## Decisões em aberto nesta tarefa
- Se o texto respeita a ordenação vigente ou usa sempre a mesma —
  encaminhamento: usar sempre a mesma ordem (a do álbum, com FWC abrindo e COC
  fechando), para que a lista colada num grupo seja comparável entre pessoas;
  nasce um **IDR**
- O que oferecer quando a área de transferência não funciona — encaminhamento:
  além do aviso, mostrar o texto num campo selecionável para cópia manual, sem
  criar tela nova; consta no mesmo IDR

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
- `src/lib/textoDeTroca.js` — criar
- `src/lib/textoDeTroca.test.js` — criar
- `src/components/MenuDeAcoes.jsx` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [x] O texto de faltantes segue `Nome SIG: n n n`, uma linha por seção
- [x] O texto de repetidas usa `n×k` com k = contagem − 1
- [x] Seções sem itens no estado pedido não aparecem no texto
- [x] Os dois textos são gerados separadamente, por comandos distintos
- [x] Copiar emite aviso de sucesso; área de transferência indisponível emite aviso dourado
- [x] Nenhuma requisição ao Firestore é disparada por copiar
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (IDR 0039)
- [x] `docs/plano/0009-desfazer-menu-e-portabilidade/logs/0003-log-copiar-listas-de-troca.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: com algumas figurinhas registradas, copiar as
duas listas e colar num editor para conferir o formato; conferir na aba Network
que nada foi requisitado.
