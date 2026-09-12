<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0010-0004: fechamento da documentação

## Data
2026-09-12

## Resumo
Tarefa só de documentação: nenhum código em `src/` foi tocado. Percorridas,
item a item, as quatro listas indicadas pela tarefa
(`docs/interface.md` § Pendências de interface, `docs/arquitetura.md` §
Pontos em aberto, `docs/requisitos.md` § Decisões Pendentes,
`docs/persistencia.md` § Pronto × falta), a tabela de alocação de
pendências e a tabela § Onde fica cada coisa/§ Stack do `AGENTS.md`.

### Pendências fechadas, com o registro que as resolveu

**`docs/requisitos.md` § Decisões Pendentes (as três da tarefa):**
- Fonte do checklist incompleta → degradação decidida sem bloquear —
  [TDR 0010](../../../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)
- Política de privacidade depois de autenticado → rodapé da tela principal —
  [IDR 0037](../../../idr/0037-politica-no-rodape-depois-de-autenticado.md)
- Falha ao gravar a atestação de menores → libera o app mesmo em falha —
  [IDR 0036](../../../idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md)

**`docs/interface.md` § Pendências de interface (as quatro que existiam):**
- Link da política pós-login → [IDR 0037](../../../idr/0037-politica-no-rodape-depois-de-autenticado.md)
- Salto para seção ocultada pelo filtro → [IDR 0031](../../../idr/0031-salto-com-filtro-ativo.md)
- Atestação: clique de entrar ou passo explícito → [IDR 0036](../../../idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md)
- Diálogos de exportação e importação → [IDR 0040](../../../idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md)
  (exportar) e [IDR 0041](../../../idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md)
  (importar)

A seção § Pendências de interface fica vazia (todas resolvidas). Também
preenchido § Demais telas com o desenho real de exportação e importação
(a placeholder "a preencher quando desenhados" foi substituída por duas
subseções curtas, cada uma apontando para o IDR correspondente). Conferido
que § Apresentação por faixa de tela já estava atualizado com a decisão do
IDR 0043 (feito na própria Tarefa 0010-0003) — nenhuma mudança necessária
ali.

**`docs/arquitetura.md` § Pontos em aberto (quatro pontos; um deles,
virtualização, já não aparecia mais nesta lista — ver "Achado" abaixo):**
- Router → vista interna, sem router — [TDR 0020](../../../tdr/0020-privacidade-como-vista-interna.md)
- Estado global (Context) → prop-drilling mantido — [TDR 0014](../../../tdr/0014-estado-da-colecao-sem-context.md)
- Geração do catálogo (pipeline) → sem pipeline, escrito à mão + testes de
  invariantes — [TDR 0010](../../../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)
- Aceite dos números do ADR 0008 → **fechado só parcialmente**, ver
  "Pendências que permanecem abertas" abaixo.

A tabela § Decisões-chave e onde vivem ganhou linhas novas para TDR 0010,
0012, 0013, 0014, 0020 e para as decisões de acesso/atestação e de
desfazer/menu/portabilidade da Fase 8/9, além de corrigir o intervalo de
IDRs citado (`0001–0033` → `0001–0043`, já que a Fase 9/10 acrescentou até
o IDR 0043). § Camadas no cliente foi reescrita: saiu o formato "Hoje
(botão) / Alvo (figurinhas)" (o alvo já é o hoje) e entrou uma descrição
direta dos módulos e componentes que existem em `src/data/`, `src/lib/`,
`src/components/` e `App.jsx`. O parágrafo de abertura ("hoje o código
implementado é o app do botão...") também foi corrigido — o botão foi
removido, o produto novo é o que está em produção.

**`docs/persistencia.md` § Pronto × falta**: reescrita para refletir o
produto implementado por completo (persistência, atestação, migração,
export/import); o único item que continua do lado "falta" é a confirmação
em uso real dos números do ADR 0008 (mesmo motivo do ponto em aberto de
`arquitetura.md` acima).

**`AGENTS.md`**: parágrafo de abertura ("O que é este projeto") corrigido —
não menciona mais "login disponível mas ainda não persiste a coleção" nem
"a persistência chega na Fase 7" (já chegou e o resto do produto também).
§ Stack ganhou o bullet de tipografia vendorizada (TDR 0013, que não estava
mencionado) e uma nota de que o login é a guarda do app. A tabela § Onde
fica cada coisa foi reescrita arquivo por arquivo contra `src/` real (ver
"Conferência" abaixo) — trocou as poucas linhas da era do botão (`teams.js`,
`AuthStatus`, um único `App.test.jsx`) pelas ~40 linhas do produto atual
(catálogo, telas de login/atestação/política, cabeçalho/controles/menu de
ações, catálogo/super-grupo/seção/figurinha/página do álbum, persistência,
gravação agregada, desfazer, preferências de vista, portabilidade, textos
de troca, avisos), incluindo os dez arquivos `src/App.*.test.jsx` (um por
funcionalidade) e uma linha genérica para os testes que acompanham cada
componente/módulo (`*.test.jsx`/`*.test.js`), em vez de listar cada um dos
mais de 30 arquivos de teste individualmente.

### Conferência: `src/` real × tabela do AGENTS.md
Listado `find src -type f` (ver saída abaixo) e conferido, arquivo por
arquivo, que todo `.jsx`/`.js`/`.css` de produção tem uma linha (ou está
coberto pela linha genérica de teste do seu par). Nenhum arquivo de
`src/` ficou de fora e nenhuma linha da tabela aponta para um arquivo que
não existe mais (`teams.js`, `userPreferences.js`, `TeamButton.jsx`,
`AuthStatus.jsx` da era do botão já não existiam desde as fases 1–2 e
foram removidos da tabela).

### Achado durante a conferência
`docs/arquitetura.md` § Pontos em aberto, na versão anterior a esta
tarefa, já não listava mais "Virtualização das listas" como item — só
quatro bullets apareciam ali (aceite do ADR 0008, router, Context, geração
do catálogo), embora a tabela de alocação de pendências do
`docs/plano/README.md` (e o texto desta própria tarefa) se referisse a
"cinco pontos". Investigado: a Tarefa 0010-0002 já havia fechado a
virtualização com o [TDR 0021](../../../tdr/0021-desempenho-do-catalogo.md)
e, ao que tudo indica, removeu o bullet de `arquitetura.md` naquele
momento (a linha correspondente já existe em § Decisões-chave e onde
vivem). Não há nada a remover agora — só confirmado e documentado aqui
para não parecer um item esquecido.

## Pendências que permanecem abertas (não fechadas nesta tarefa)
- **Aceite dos números do ADR 0008 em uso real** (debounce ~2s, teto ~10s,
  timeout ~5s sem rede): a *forma* está aceita e os *valores* foram
  aceitos como ponto de partida na Tarefa 0007-0003, mas a confirmação em
  uso real depende de um deploy de produção com usuários reais, que não
  esteve disponível durante a execução automatizada deste plano (mesmo
  limite já registrado no log da Tarefa 0007-0002/0007-0003). Continua
  listada em `docs/arquitetura.md` § Pontos em aberto e em
  `docs/persistencia.md` § Pronto × falta, com o motivo explícito — não
  bloqueia nada, é um acompanhamento operacional pós-deploy.
- **Fonte completa do checklist** (nomes de figurinha, página do FWC,
  metalizadas além da 01): a *decisão* sobre como lidar com a ausência
  está fechada (TDR 0010), mas o *dado* em si continua ausente — não é
  uma pendência de decisão, é uma lacuna de fonte externa que, se
  aparecer, é absorvida sem reabrir nenhum registro (o próprio TDR 0010
  já descreve a mudança contida em `expandirFigurinhas`).

Nenhuma outra pendência foi encontrada nas listas percorridas.

## Decisões tomadas
Nenhuma. Esta tarefa é só reconciliação documental: aponta os registros já
existentes que resolveram cada pendência, sem tomar nenhuma decisão nova
de arquitetura, técnica ou de interface — nenhum ADR/TDR/IDR foi criado.

## Impedimentos
Nenhum nível 2 ou 3. Não foi encontrado nenhum item de `requisitos.md`
não implementado (o produto especificado está completo, à exceção do
acompanhamento operacional acima, que não é requisito).

## Nota sobre concorrência no repositório
Durante a execução desta tarefa, `docs/plano/README.md` já continha, no
próprio diretório de trabalho, alterações não commitadas de outra
sessão/processo (fases 11–13: `docs/plano/0011-*`, `0012-*`, `0013-*`, e as
respectivas linhas na tabela de fases e a nova seção "Fase 11/12/13" no
corpo do arquivo), além de uma pasta nova `docs/algum/`. Nenhum desses
arquivos ou trechos foi tocado, revertido ou incluído nesta tarefa: a
única mudança feita em `docs/plano/README.md` foi a linha da Tarefa
0010-0004 (coluna de status, de `Pendente` para `Concluída`), isolada do
resto do arquivo para o commit (ver "Arquivos alterados").

## Validação
```
npm run lint && npm run test && npm run build
```

Saída real:

```
> iconula@0.0.0 lint
> oxlint

src/components/Catalogo.jsx:195:44: warning react(refs): Cannot access refs during render
help: React refs are values that are not needed for rendering. Refs should only be accessed
outside of render, such as in event handlers or effects. Accessing a ref value (the `current`
property) during render can cause your component not to update as expected

> iconula@0.0.0 test
> vitest run

 RUN  v5.0.0 C:/git/Iconula

 Test Files  35 passed (35)
      Tests  370 passed (370)
   Start at  01:38:54
   Duration  44.20s

> iconula@0.0.0 build
> vite build

✓ 130 modules transformed.
dist/index.html                                     1.01 kB │ gzip:   0.51 kB
dist/assets/index-BCVqlIEu.css                     14.56 kB │ gzip:   3.43 kB
dist/assets/index-DJIz6YfD.js                     408.59 kB │ gzip: 123.27 kB
dist/assets/index.esm-_bVlNUiX.js                 505.90 kB │ gzip: 148.77 kB
✓ built in 465ms
(!) Some chunks are larger than 500 kB after minification [...]
```

O warning de lint (`Catalogo.jsx:195`) e o aviso de chunk grande do build
(SDK do Firestore, carregado sob demanda — ADR 0007) são pré-existentes e
não relacionados a esta tarefa, que não alterou nenhum arquivo de `src/`.

Conferência documental (manual, não é um comando): percorrido `src/`
inteiro (`find src -type f`) e comparado contra a tabela do `AGENTS.md` —
todo arquivo de produção tem linha própria ou está coberto pela linha
genérica de teste do seu par; nenhuma linha da tabela aponta para um
arquivo inexistente. Percorridas as quatro listas de pendências
(`requisitos.md`, `interface.md`, `arquitetura.md`, `persistencia.md`) e
conferido que cada item removido tem, de fato, um registro (ADR/TDR/IDR)
que o resolve, citado no próprio texto.

## Critérios de aceite
- [x] § Pendências de interface só lista o que continua aberto, com motivo
      (fica vazia — nada continua aberto)
- [x] § Pontos em aberto de `arquitetura.md` está vazio ou justificado, com
      registro apontado (três fechados com registro; um — aceite dos
      números do ADR 0008 — justificado como aberto, com motivo)
- [x] § Decisões Pendentes de `requisitos.md` não lista as três resolvidas
- [x] `docs/persistencia.md` § Pronto × falta reflete o produto implementado
- [x] A tabela § Onde fica cada coisa do `AGENTS.md` bate arquivo por
      arquivo com `src/`
- [x] § Stack do `AGENTS.md` descreve o produto atual, não o botão
- [x] O `README.md` do plano tem os status corretos (Tarefa 0010-0004 →
      Concluída; a linha da Fase 10 na tabela principal permanece
      `Pendente` propositalmente — só vira `Concluída` quando o PR da fase
      for mesclado, por convenção do próprio plano)
- [x] O log lista o que permanece aberto, com o motivo
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (nenhum
      esperado — nenhum foi criado)
- [x] `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0004-log-fechamento-da-documentacao.md`
      gerado (este arquivo)

## Arquivos alterados
- `docs/requisitos.md` — § Decisões Pendentes esvaziada, com os registros
- `docs/interface.md` — § Pendências de interface esvaziada; § Demais
  telas preenchida (exportação, importação)
- `docs/arquitetura.md` — § Pontos em aberto reduzida a um item
  justificado; § Decisões-chave e onde vivem ampliada; § Camadas no
  cliente reescrita; parágrafo de abertura corrigido
- `docs/persistencia.md` — § Pronto × falta reescrita
- `AGENTS.md` — parágrafo de abertura e § Stack corrigidos; § Onde fica
  cada coisa reescrita arquivo por arquivo
- `docs/plano/README.md` — status da Tarefa 0010-0004 (só essa linha,
  isolada das mudanças concorrentes de outra sessão — ver nota acima)
- `docs/plano/0010-acabamento-acessibilidade-e-docs/0004-fechamento-da-documentacao.md`
  — `## Status` atualizado para `Concluída`
- `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0004-log-fechamento-da-documentacao.md`
  — este log
