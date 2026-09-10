<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0008-0004]: exportar a coleção em JSON

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/requisitos.md` § Portabilidade (sem lock-in) — o formato `{ "versao": 1, "geradoEm": <ISO 8601>, "contagens": { "BRA05": 3 } }`, lossless, versionado, sem dados pessoais
- `docs/requisitos.md` § Diferenciais — sem lock-in: a coleção pertence ao usuário
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` § Decisão — o comando fica no menu, a dois toques
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` § Decisão — "coleção exportada" é aviso de sucesso
- `docs/interface.md` § Demais telas — diálogos de exportação e importação estão pendentes de desenho
- `docs/persistencia.md` § Custos e cotas — export custa 0 operações

## Objetivo
Garantir a propriedade da coleção pelo usuário: um arquivo JSON completo,
versionado e sem dados pessoais, obtido em dois toques a partir do menu.

## Padrões e convenções aplicáveis
- Formato exato de `docs/requisitos.md` § Portabilidade: `versao`, `geradoEm` em
  ISO 8601 e `contagens` — nem mais campo, nem menos
- **Sem dados pessoais**: nada de uid, e-mail, nome ou foto no arquivo —
  `docs/requisitos.md` § Portabilidade
- Lossless: todas as contagens, suficiente para restaurar exatamente —
  `docs/requisitos.md` § Portabilidade
- Disponível sempre, sem etapas adicionais, a dois toques —
  `docs/requisitos.md` § Portabilidade e `docs/idr/0024-*`
- Custa **zero** requisição: lê o estado em memória — `docs/persistencia.md` § Custos e cotas
- Retorno visível na área de avisos — `docs/idr/0029-*` § Decisão

## Escopo e instruções de implementação
1. Criar em `src/lib/` a serialização, pura: recebe o mapa de contagens e devolve
   o objeto no formato especificado, com `geradoEm` em ISO 8601 e as contagens
   esparsas (zeros ausentes, como no Firestore).
2. Ligar o comando "exportar" do menu à geração e ao download do arquivo, com
   nome de arquivo previsível e datado.
3. **Pendência de interface: diálogo de exportação** — resolver por **sem
   diálogo**: exportar baixa o arquivo direto e avisa "coleção exportada".
   `requisitos.md` exige "sem etapas adicionais", e um diálogo seria a etapa que
   ele proíbe. Registrar como **IDR**.
4. Não incluir catálogo, nomes de seção nem qualquer coisa derivável — o arquivo
   é a coleção, não um relatório.
5. Emitir sucesso ao concluir; falha ao gerar ou baixar emite falha vermelha com
   detalhe.
6. Testes: o objeto gerado tem exatamente os três campos; contagens zeradas não
   aparecem; o arquivo de uma coleção conhecida reimportado pela Tarefa 0008-0005
   reproduz a coleção idêntica (teste de ida e volta).

**Fora do escopo**: importar (Tarefa 0008-0005); exportar em outros formatos;
incluir estatísticas ou listas de troca no arquivo.

## Decisões já tomadas (não reabrir)
- Formato versionado com três campos — ver `docs/requisitos.md` § Portabilidade (sem lock-in)
- Sem dados pessoais no arquivo — ver `docs/requisitos.md` § Portabilidade
- O comando vive no menu de ações — ver `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`
- Portabilidade usa JSON; a lista de troca é outra coisa — ver `docs/requisitos.md` § Progresso e listas

## Decisões em aberto nesta tarefa
- Diálogo de exportação — encaminhamento no passo 3: não existe; nasce um **IDR**
- Nome do arquivo — encaminhamento: `iconula-<AAAA-MM-DD>.json`, previsível e
  ordenável; consta no mesmo IDR

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
- `src/lib/portabilidade.js` — criar
- `src/lib/portabilidade.test.js` — criar
- `src/components/MenuDeAcoes.jsx` — modificar
- `src/App.jsx` — modificar

## Critérios de aceite
- [ ] O arquivo tem exatamente `versao`, `geradoEm` (ISO 8601) e `contagens`
- [ ] Contagens zeradas não aparecem no arquivo
- [ ] Nenhum dado pessoal (uid, e-mail, nome, foto) está no arquivo
- [ ] Exportar acontece em dois toques, sem diálogo nem etapa adicional
- [ ] Sucesso emite aviso; falha emite faixa vermelha com detalhe
- [ ] Nenhuma requisição ao Firestore é disparada por exportar
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0008-desfazer-menu-e-portabilidade/logs/0004-log-exportar-colecao-em-json.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: exportar, abrir o arquivo baixado e conferir
os três campos e a ausência de dados pessoais.
