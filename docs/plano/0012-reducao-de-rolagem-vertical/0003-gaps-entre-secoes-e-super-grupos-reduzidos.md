<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0003]: gaps entre seções e super-grupos reduzidos

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Medidas — "Espaçamentos internos: 14px entre seções
  dentro de um super-grupo, 10px entre o cabeçalho da seção e a sua grade,
  8px entre cartões na disposição lista e 20px entre as duas páginas na
  disposição álbum" e "Corpo: ... 16px entre super-grupos" — valores atuais
- `src/theme.css` — os tokens `--super-group-gap` (16px), `--section-gap`
  (14px), `--section-body-gap` (10px), `--card-gap-list` (8px),
  `--album-page-gap` (20px)
- `src/components/SuperGrupo.css`, `Secao.css` — onde cada token é consumido

## Objetivo
Reduzir os espaçamentos entre blocos do catálogo — super-grupo a
super-grupo, seção a seção, cabeçalho a grade — que se repetem dezenas de
vezes e, somados, custam quase uma tela inteira de rolagem ao longo do
catálogo completo.

## Padrões e convenções aplicáveis
- Cartão a cartão (`--card-gap-list`, 8px) e página a página no álbum
  (`--album-page-gap`, 20px) ficam **fora do escopo** — são espaçamentos
  dentro do conteúdo em si, não entre blocos de moldura; mexer neles arrisca
  a legibilidade da grade de cartões, que não é o problema em questão
- Os tokens já existem em `src/theme.css` — só seus valores mudam, não a
  arquitetura de espaçamento
- Nenhuma mudança pode fazer dois blocos visualmente distintos parecerem um
  só (o espaço ainda precisa separar seção de seção, grupo de grupo)

## Escopo e instruções de implementação
1. Reduzir `--super-group-gap` de 16px para algo como 10-12px.
2. Reduzir `--section-gap` (entre seções dentro de um super-grupo, e entre
   seções soltas na ordenação por sigla) de 14px para 10-12px.
3. Reduzir `--section-body-gap` (cabeçalho da seção → grade; também usado
   como `margin-top` do corpo do super-grupo) de 10px para 6-8px.
4. Conferir em tela real que os blocos continuam se lendo como blocos
   separados — não é só questão de medir, é questão de olhar.
5. Medir a economia total (cada token × número de ocorrências) e registrar no
   log da tarefa.
6. Atualizar `docs/interface.md` § Medidas com os novos valores.

**Fora do escopo**: `--card-gap-list` e `--album-page-gap` (ver acima);
qualquer mudança de padding dentro do cartão ou do cabeçalho de seção (essa
é a Tarefa 0012-0002).

## Decisões já tomadas (não reabrir)
- Os cinco tokens de espaçamento e onde cada um se aplica — ver
  `docs/interface.md` § Medidas e `src/theme.css`

## Decisões em aberto nesta tarefa
Nenhuma — ajuste de medida sobre tokens já decididos, mesmo precedente da
Fase 6 Tarefa 3 (registrado direto em `docs/interface.md`, sem IDR novo).

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
- `src/theme.css` — modificar (tokens)
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Super-grupos, seções e cabeçalho→grade continuam visualmente distintos
      uns dos outros
- [ ] `docs/interface.md` reflete os novos valores
- [ ] Economia total estimada registrada no log

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: rolar pelas duas ordenações (página e
sigla) e pelas duas disposições, conferindo que a separação entre blocos
continua clara.
