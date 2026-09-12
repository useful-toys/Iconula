<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0001]: grupos de controles como toggle visível

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Controles — os três grupos segmentados (ordenação,
  disposição, filtro) e os rótulos curtos já decididos
- `src/components/Controles.jsx` — cada grupo já é um `role="group"` com
  `aria-label` próprio; a estrutura lógica de agrupamento já existe
- `src/components/Controles.css` — `.controles__segmentado` já tem fundo
  `var(--panel)` e `border-radius: 9px`, mas sem contorno
- `src/theme.css` § Paleta — tokens OKLCH disponíveis (`--panel`, `--border`,
  `--turf`, `--gold`)
- Achado de uso reportado nesta conversa: captura de tela mostrando os três
  grupos sem separação visível entre si e o exemplo de referência (segmented
  control com contorno nítido)

## Objetivo
Tornar visualmente claro que Página/Sigla, Lista/Álbum e Todas/Falt./Col./Rep.
são três grupos de alternância independentes — sem mudar rótulos,
comportamento, `aria-label`, nem introduzir nenhuma dependência nova.

## Padrões e convenções aplicáveis
- Rótulos curtos e a existência dos três grupos já são decisão fechada —
  `docs/interface.md` § Controles — esta tarefa não os reabre
- Cor nunca é o único sinal de estado — `docs/requisitos.md` § Requisitos Não
  Funcionais (o grupo ativo já usa `--gold` de fundo; o contorno é reforço de
  agrupamento, não de estado)
- Sem token de paleta novo — reaproveitar `--border`, já usado em bordas de
  outros elementos do cabeçalho (`.controles__desfazer`)
- Nenhuma mudança de medida do botão em si (`padding`, altura) — apenas o
  contêiner do grupo ganha contorno

## Escopo e instruções de implementação
1. Acrescentar `border: 1px solid var(--border)` a `.controles__segmentado`
   em `src/components/Controles.css`, mantendo fundo e raio atuais.
2. Conferir em `npm run dev` que os três grupos ficam visualmente distintos
   do fundo `--turf` da página, inclusive quando nenhuma opção do grupo está
   ativa (ex.: abrir em disposição álbum, onde o filtro nem aparece — os dois
   grupos restantes continuam legíveis).
3. Medir o contraste do contorno (`--border` sobre `--turf`) — se ficar abaixo
   de 3:1 (WCAG 1.4.11, mesmo padrão usado no IDR 0042 para o realce de foco),
   registrar a medição e sinalizar antes de trocar qualquer token.
4. Atualizar `docs/interface.md` § Controles com uma frase descrevendo o
   contorno do grupo, no mesmo espírito da Fase 6 Tarefa 3 (ajuste de medida
   registrado direto no documento, sem IDR novo).

**Fora do escopo**: mudar rótulos, cores de estado ativo/inativo, ou a ordem
dos grupos; criar um novo componente de "segmented control" genérico.

## Decisões já tomadas (não reabrir)
- Os três grupos e seus rótulos curtos — ver `docs/interface.md` § Controles
- O grupo de filtro só aparece na disposição lista — ver IDR 0023
- Cor de fundo ativa é `--gold` — ver `src/components/Controles.css`

## Decisões em aberto nesta tarefa
Nenhuma — é um refinamento visual de uma estrutura já decidida, sem
alternativa de comportamento a escolher. Não nasce IDR (mesmo precedente da
Fase 6 Tarefa 3, "Faixa de bandeiras mais compacta", que ajustou uma medida
direto em `docs/interface.md`).

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
- `src/components/Controles.css` — modificar
- `docs/interface.md` — modificar (§ Controles)

## Critérios de aceite
- [ ] Os três grupos segmentados têm contorno visível e consistente entre si
- [ ] Nenhum rótulo, comportamento ou `aria-label` mudou
- [ ] Contraste do contorno medido e ≥ 3:1 sobre `--turf`
- [ ] `docs/interface.md` descreve o contorno do grupo

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: conferir os três grupos nas duas
disposições (lista e álbum) e com cada opção ativa.
