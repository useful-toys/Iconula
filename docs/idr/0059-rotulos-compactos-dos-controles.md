<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0059: Rótulos compactos dos controles, com ícones Material e feedback de confirmação

## Status

Aceito.

## Contexto

- Os controles do cabeçalho usam rótulos de texto — `Página | Sigla`,
  `Lista | Álbum`, `Todas | Falt. | Col. | Rep.` — com o nome por extenso
  no tooltip e no `aria-label`
  ([IDR 0048](0048-contorno-e-tooltip-nos-grupos-de-controles.md)).
- O humano pediu rótulos compactos (ícones) e, para compensar a clareza
  perdida — sobretudo no toque, onde não há tooltip (IDR 0048) —, uma
  mensagem de confirmação ao trocar o controle.
- Hoje não há feedback: a troca aparece no estado ativo em dourado e no
  catálogo re-renderizando.

## Decisão

- Ordenação: `numbers` (página do álbum) | `sort_by_alpha` (sigla) — Material.
- Disposição: `view_list` (lista) | `view_module` (álbum) — Material.
- Filtro: `Todas` (texto) | `▯` (faltantes) | `▮` (coladas) | `×`
  (repetidas) — glifos de texto, ecoando o cartão vazio/preenchido e o
  selo `×N`.
- Ordenação e disposição usam Material Symbols como SVG inline
  ([TDR 0026](../tdr/0026-icones-material-symbols-vendorizados-como-svg.md));
  o filtro usa glifos de texto; o nome por extenso continua no
  `aria-label` e no tooltip (IDR 0048).
- Feedback de confirmação na troca: reusa a área de avisos
  ([IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md)), severidade
  **sucesso** (some em 5s) — "Ordenado pela página do álbum", "Ordenado
  pelo código do país", "Disposição em lista", "Disposição como no
  álbum", "Mostrando todas / apenas as faltantes / coladas / repetidas".
- Espaçamento: `.controles__opcao` `padding` `5px 12px → 4px 10px`;
  `.controles` `gap` `8px → 6px`; os botões do segmentado ganham extensão
  de toque `::before` (`inset: -4px`) em `pointer: coarse`, no padrão do
  desfazer (IDR 0042), para o alvo não encolher junto com o `padding`.

## Consequências

- `Controles.jsx` renderiza os ícones no lugar dos rótulos; `App.jsx`
  emite o aviso de sucesso na troca de cada controle.
- `Controles.css` muda o `padding`/`gap` e ganha a extensão de toque
  `::before`; `interface.md` § Controles e § Avisos mudam; o IDR 0029
  ganha o evento de sucesso "trocou ordenação/disposição/filtro".
- Acessibilidade preservada via `aria-label`; o feedback visual devolve o
  que o rótulo compacto escondeu, também no toque.
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Manter os rótulos de texto sem feedback**: o humano preferiu
  compactar os rótulos e compensar com a confirmação.
- **Tudo em glifos Unicode** (`123`/`A-Z`, `≡`/`▦`, `▯`/`▮`/`×`): zero
  dependência e consistente; adotado só para o filtro — no layout, o
  Material (`view_list`/`view_module`/`sort_by_alpha`) é mais
  reconhecível.
- **Tudo em Material** (checkboxes no filtro): `check_box` vs
  `check_box_outline_blank` é menos significativo que o par `▯`/`▮`, que
  ecoa o cartão vazio/preenchido — recusado para o filtro.
- **Fonte Material Symbols**: mais setup e bundle — recusado (TDR 0026).
- **Sem mensagem de confirmação** (só o estado ativo): recusado — com o
  rótulo virando ícone, o toque perde a explicação.
