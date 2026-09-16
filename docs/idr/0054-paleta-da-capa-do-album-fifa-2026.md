<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0054: Paleta de referência da capa do álbum físico

## Status

Aceito.

## Contexto

- No planejamento da Fase 0025 (repaletização de grupos e seções), o
  humano trouxe a capa do "Livro Ilustrado Oficial — FIFA World Cup 2026"
  (Panini) como referência do quanto a identidade visual oficial do
  produto já é, por natureza, uma composição saturada e carregada de cor.
- Essa paleta não virou fonte de nenhum token: os grupos A–L usam a
  tabela oficial de sorteio ([IDR 0045](0045-cores-de-super-grupos.md)) e
  as seções usam a cor da bandeira do país
  ([IDR 0046](0046-cores-de-selecoes.md)). Falta, porém, um lugar para
  registrar essa referência — descartá-la perderia o raciocínio por trás
  de "o app não deveria repetir as cores do álbum físico, e sim conviver
  com elas".

## Decisão

Registrar as 15 cores da capa oficial (RGB exato, sampling direto da
imagem) como referência de identidade visual — documentação de contexto,
sem token CSS correspondente e sem obrigação de uso.

| Categoria | RGB | Hex |
|---|---|---|
| Branco (fundo) | 240 240 240 | `#F0F0F0` |
| Preto (texto "2026") | 24 24 24 | `#181818` |
| Laranja | 216 96 0 | `#D86000` |
| Azul acinzentado | 72 72 144 | `#484890` |
| Amarelo/oliva | 192 192 48 | `#C0C030` |
| Vermelho | 216 0 0 | `#D80000` |
| Azul claro | 168 192 216 | `#A8C0D8` |
| Verde médio | 96 168 96 | `#60A860` |
| Azul royal | 24 96 168 | `#1860A8` |
| Lilás/azul claro | 168 168 216 | `#A8A8D8` |
| Vinho/bordô | 120 0 24 | `#780018` |
| Amarelo dourado | 240 216 96 | `#F0D860` |
| Verde água claro | 168 216 192 | `#A8D8C0` |
| Verde escuro | 0 96 72 | `#006048` |
| Laranja avermelhado | 216 72 0 | `#D84800` |

## Consequências

- Nenhum token CSS nasce deste registro; nenhum componente consome estes
  valores diretamente
- Fica registrado por que o produto busca um fundo neutro
  ([IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md)) em vez de
  tentar reproduzir a identidade do álbum físico: a fonte já é saturada
  o bastante, e a aplicação não precisa competir com ela
- Referência disponível para decisões de paleta futuras, sem reabrir a
  extração visual imprecisa que gerou os valores descartados nesta mesma
  conversa (ver [IDR 0045](0045-cores-de-super-grupos.md) § Alternativas
  consideradas)

## Histórico

- 2026-09-16 — Criado no planejamento da Fase 0025.
