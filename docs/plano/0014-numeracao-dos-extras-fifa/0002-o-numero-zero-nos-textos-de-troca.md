<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0014-0002]: o número zero nos textos de troca

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Compartilhamento — uma linha por seção, números em ordem crescente, repetidas como `5×2`
- `docs/idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md` — o texto usa sempre a ordem do álbum, independente da tela
- `docs/idr/0021-selo-conta-unidades-sobrando.md` — `×N` são as unidades sobrando (contagem − 1), a mesma leitura do selo do cartão
- `src/lib/textoDeTroca.js`, `src/components/Figurinha.jsx`

## Objetivo
Fechar o único lugar onde o número da figurinha aparece **sem** os dois
dígitos: os textos de troca, que hoje imprimem o número cru. Com `FWC00` no
catálogo a partir da Tarefa 0014-0001, a linha dos Extras FIFA passaria a sair
como `Extras FIFA FWC: 0, 3, 7` — um `0` solto num grupo de WhatsApp lê como
erro de digitação ou como "nenhuma", não como o número da figurinha.

## Padrões e convenções aplicáveis
- O texto é feito para ser colado e comparado entre pessoas — IDR 0039
- O cartão já exibe o número com dois dígitos (`FWC 00`, `BRA 05`) — `src/components/Figurinha.jsx`
- Decisão de apresentação visível ao usuário vira **IDR** — `AGENTS.md` § Convenções
- Todo texto visível em PT-BR — `docs/requisitos.md` § Requisitos Não Funcionais

## Escopo e instruções de implementação
1. Decidir e registrar como **IDR** o formato do número no texto de troca.
   Encaminhamento: **imprimir o número como ele aparece no cartão e no código,
   com dois dígitos, em todas as seções** — `Brasil BRA: 05, 13` e
   `Extras FIFA FWC: 00, 03, 19`. É uma regra só para o app inteiro, alinha o
   texto com o que está impresso na figurinha e resolve o `0` sem criar exceção
   por seção. A alternativa considerada — dois dígitos só no FWC — deixa duas
   convenções convivendo na mesma mensagem colada.
2. Aplicar em `textoDeTroca.js`, nas duas funções: faltantes (`00`) e repetidas
   (`00×2`), preservando a ordem crescente por posição e a ordem do álbum das
   seções (IDR 0039).
3. Conferir os rótulos do cartão com a numeração nova: o nome acessível de
   `FWC00` sai como "FWC 00, faltante" e o do controle de menos como "remover
   uma unidade de FWC 00" — ambos já derivam do próprio código e não devem
   precisar de mudança; se precisarem, é aqui.
4. Testes de `textoDeTroca`: linha do FWC com o `00` incluído (faltantes e
   repetidas), linha de seleção com os dois dígitos, ordem crescente preservada
   e seção sem nada a listar continuando fora do texto.

**Fora do escopo**: mudar a ordem das seções ou das linhas; acrescentar nomes
de figurinha ao texto; mexer no selo `×N` do cartão.

## Decisões já tomadas (não reabrir)
- Ordem do álbum fixa no texto, independente da ordenação da tela — IDR 0039
- Faltantes e repetidas em textos separados — `docs/requisitos.md` § Compartilhamento
- `n×k` são as unidades sobrando, não a contagem — IDR 0021

## Decisões em aberto nesta tarefa
- **Dois dígitos em todas as seções × dois dígitos só no FWC**: encaminhamento
  no passo 1 (todas), com registro em IDR. Se o humano preferir preservar o
  texto atual das seleções, a variante "só no FWC" é aceitável e cabe no mesmo
  IDR — decisão de nível 2: implementar o encaminhamento e deixar explícito no
  log.

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
- `src/lib/textoDeTroca.js` — modificar
- `src/lib/textoDeTroca.test.js` — modificar
- `src/App.copiar.test.jsx` — modificar (se as expectativas casarem com o número sem padding)
- `docs/requisitos.md` § Compartilhamento — modificar (o exemplo `5×2`, se o formato de dois dígitos alterar o exemplo)
- `docs/idr/00NN-numero-de-dois-digitos-no-texto-de-troca.md` — criar (próximo número livre: IDR 0044)

## Critérios de aceite
- [ ] O texto de faltantes lista `00` na linha dos Extras FIFA
- [ ] O texto de repetidas lista `00×2` quando a contagem de `FWC00` é 2
- [ ] O formato do número é o mesmo do cartão, sem exceção por seção (ou a exceção está registrada no IDR)
- [ ] Os rótulos acessíveis de `FWC00` leem "FWC 00"
- [ ] IDR criado
- [ ] `npm run lint && npm run test && npm run build` verdes
- [ ] `docs/plano/0014-numeracao-dos-extras-fifa/logs/0002-log-o-numero-zero-nos-textos-de-troca.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação em `npm run dev`: marcar `FWC00` com 2 unidades, copiar as duas
listas pelo menu de ações e conferir o texto colado num editor.
