<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0003]: gaps entre seções e super-grupos reduzidos

## Status
Pendente

## Objetivo
Reduzir os espaçamentos entre blocos do catálogo — super-grupo a super-grupo,
seção a seção, cabeçalho a grade — que se repetem dezenas de vezes e, somados,
custam quase uma tela inteira de rolagem.

## Documentos de referência
- `docs/interface.md` § Medidas — "Espaçamentos internos: 14px entre seções
  dentro de um super-grupo, 10px entre o cabeçalho da seção e a sua grade, 8px
  entre cartões na disposição lista e 20px entre as duas páginas na disposição
  álbum" e "Corpo: … 16px entre super-grupos"
- `docs/plano/0012-reducao-de-rolagem-vertical/logs/0002-log-cabecalho-de-secao-mais-compacto.md`
  § Decisões tomadas — qual registro lastreia as medidas compactadas da fase
  (gerado pela Tarefa 0012-0002)
- `src/theme.css` — tokens `--super-group-gap` (16px), `--section-gap` (14px),
  `--section-body-gap` (10px), `--card-gap-list` (8px), `--album-page-gap`
  (20px)
- Consumidores dos tokens: `--super-group-gap` em
  `src/components/SuperGrupo.css`; `--section-gap` em
  `src/components/Catalogo.css` (seções soltas na ordenação por sigla) e
  `src/components/SuperGrupo.css`; `--section-body-gap` em
  `src/components/Secao.css` e `src/components/SuperGrupo.css`

## Padrões e convenções aplicáveis
- Cartão a cartão (`--card-gap-list`) e página a página (`--album-page-gap`)
  não mudam: são espaçamentos dentro do conteúdo — `docs/interface.md`
  § Medidas
- Só os valores dos tokens mudam, não a arquitetura de espaçamento —
  `src/theme.css`
- Dois blocos distintos continuam parecendo dois blocos —
  `docs/interface.md` § Corpo

## Escopo e instruções de implementação
1. Reduzir `--super-group-gap` de 16px para 10–12px.
2. Reduzir `--section-gap` (entre seções num super-grupo e entre seções soltas
   na ordenação por sigla) de 14px para 10–12px.
3. Reduzir `--section-body-gap` (cabeçalho da seção → grade; também
   `margin-top` do corpo do super-grupo) de 10px para 6–8px.
4. Medir a economia total (cada token × número de ocorrências) e registrar no
   log.
5. Atualizar o registro escolhido na Tarefa 0012-0002 e `docs/interface.md`
   § Medidas com os novos valores, citando-o.

**Fora do escopo**: `--card-gap-list` e `--album-page-gap`; padding dentro do
cartão ou do cabeçalho de seção (Tarefa 0012-0002).

## Decisões já tomadas (não reabrir)
- Os cinco tokens de espaçamento e onde cada um se aplica — ver
  `docs/interface.md` § Medidas e `src/theme.css`
- O registro que lastreia as medidas compactadas da fase — escolhido na
  Tarefa 0012-0002 (ver o log dela)

## Decisões em aberto nesta tarefa
- **Muda decisão documentada**: o registro escolhido na Tarefa 0012-0002
  (IDR 0022 ou o IDR da compactação vertical) — espaçamentos entre blocos
  16px / 14px / 10px → os novos valores dos três tokens; entrada em
  `## Histórico`.

## Arquivos impactados
- `src/theme.css` — modificar (tokens)
- `docs/interface.md` — modificar (§ Medidas)
- `docs/idr/` — modificar (o registro escolhido na Tarefa 0012-0002)

## Critérios de aceite
- [ ] `--super-group-gap`, `--section-gap` e `--section-body-gap` reduzidos
      nas faixas do escopo
- [ ] `--card-gap-list` e `--album-page-gap` inalterados (conferido no diff)
- [ ] Super-grupos, seções e cabeçalho→grade continuam visualmente distintos
- [ ] Economia total estimada registrada no log

## Validação adicional
Verificação visual em `npm run dev`: rolar pelas duas ordenações (página e
sigla) e pelas duas disposições, conferindo que a separação entre blocos
continua clara.
