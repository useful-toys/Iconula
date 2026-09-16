<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0025-0002]: fundo neutro fora do cabeçalho

## Status
Concluída

## Objetivo
Restringir a identidade verde-gramado com dourado ao `.cabecalho` (barra
fixa do topo); neutralizar (croma zero) o fundo do resto da aplicação, para
não competir com as cores de grupo e de seção.

## Documentos de referência
- `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão — quais
  tokens mudam de valor, quais ficam, e onde cada um é usado
- `docs/requisitos.md` § Requisitos Não Funcionais › Aparência — texto já
  atualizado no planejamento, conferir que a implementação bate
- `docs/interface.md` § Paleta — tabela de tokens a atualizar

## Padrões e convenções aplicáveis
- Cor só pelos tokens OKLCH de `docs/interface.md` § Paleta

## Escopo e instruções de implementação
1. Em `src/theme.css`:
   - Criar `--bg: oklch(0.22 0 0)`.
   - Renomear `--turf-deep` para `--bg-deep` e mudar seu valor para
     `oklch(0.15 0 0)`.
   - Mudar `--panel` para `oklch(0.19 0 0)` e `--border` para
     `oklch(0.32 0 0)`.
   - `--turf` **não muda de valor** (`oklch(0.22 0.06 150)`, igual a hoje).
   - `--gold` e os demais tokens não ligados à identidade verde ficam como
     estão.
2. Trocar `var(--turf)` por `var(--bg)` em: `body` (`theme.css`),
   `src/components/TelaDeLogin.css`, `src/components/TermosDeUso.css`,
   `src/components/PoliticaDePrivacidade.css`. `src/components/Cabecalho.css`
   **mantém** `var(--turf)` sem alteração.
3. Trocar `var(--turf-deep)` por `var(--bg-deep)` em
   `src/components/Figurinha.css` (2 ocorrências), `src/components/Controles.css`,
   `src/components/MenuDeCompartilhar.css`, `src/components/MenuDeAcoes.css`.
4. Atualizar `docs/interface.md` § Paleta (tokens novos/renomeados) e a
   descrição da identidade visual, citando o IDR 0022 revisado.

**Fora do escopo**: cores de grupo (Tarefa 0025-0001); cores de seção
(Tarefa 0026-0001); qualquer mudança no próprio `.cabecalho` além de manter
`--turf`.

## Decisões já tomadas (não reabrir)
- `.cabecalho` mantém `--turf` verde-gramado; o resto da aplicação usa
  `--bg`/`--bg-deep` neutros — ver
  `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md` § Decisão
- Mudança de `docs/requisitos.md` § Aparência já aplicada no planejamento

## Impedimentos específicos
- Verificação visual desta tarefa não termina no `npm run dev` local: o
  humano quer ver o fundo neutro funcionando antes de considerar a
  aparência fechada. Isso não é nível 3 (não é uma decisão pendente, é uma
  checagem visual que a tarefa já sabe que vai acontecer) — registre no log
  que a verificação visual foi feita e descreva o que foi observado.

## Arquivos impactados
- `src/theme.css` — modificar
- `src/components/TelaDeLogin.css` — modificar
- `src/components/TermosDeUso.css` — modificar
- `src/components/PoliticaDePrivacidade.css` — modificar
- `src/components/Figurinha.css` — modificar
- `src/components/Controles.css` — modificar
- `src/components/MenuDeCompartilhar.css` — modificar
- `src/components/MenuDeAcoes.css` — modificar
- `docs/interface.md` — modificar (§ Paleta e identidade visual)

## Critérios de aceite
- [ ] `--bg` e `--bg-deep` existem com os valores neutros; `--panel` e
      `--border` estão sem matiz
- [ ] `--turf` continua `oklch(0.22 0.06 150)`, usado só em
      `Cabecalho.css`
- [ ] Nenhuma ocorrência de `var(--turf)` ou `var(--turf-deep)` fora de
      `Cabecalho.css` (busca no código)
- [ ] `docs/interface.md` § Paleta reflete os tokens novos/renomeados

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: o `.cabecalho` continua verde-gramado;
o resto da tela (corpo, tela de login, termos, política, menus, estados da
figurinha) fica em cinza neutro, sem matiz verde.
