# Tarefa 0006: Documentar decisão

## Objetivo

Criar IDR documentando a decisão de exibir nomes nas figurinhas e atualizar `interface.md`.

## Escopo

### 1. Criar: `docs/idr/0047-nomes-nas-figurinhas.md`

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0047: Nomes nas figurinhas

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 tem 994 figurinhas. Atualmente, o app exibe apenas o código (ex.: "BRA 05") sem indicar qual jogador ou elemento a figurinha representa. Identificar cada figurinha exige conhecimento prévio do álbum ou consulta externa.

## Decisão

Adicionar o nome do jogador/figurinha abaixo do código em cada cartão, com as seguintes regras:

- **Posição**: Nome abaixo do código (sigla + número)
- **Truncamento**: Ellipsis (...) para nomes longos
- **Disposições**: Visível em lista e álbum
- **Acessibilidade**: Nome incluído no aria-label
- **Fonte**: Sans-serif (system-ui), menor que o código

### Dados

- **Seleções**: 48 × 18 jogadores + "Escudo do time" (01) + "Foto do time" (13)
- **Extras FIFA**: 20 nomes (FWC00-FWC19)
- **Coca-Cola**: 14 nomes (COC01-COC14)

### Mapeamento de posições

Para seleções:
- Posição 01: "Escudo do time"
- Posições 02-12: Jogadores 1-11
- Posição 13: "Foto do time"
- Posições 14-20: Jogadores 12-18

## Consequências

- Identificação visual imediata de cada figurinha
- Melhora a experiência de usuários iniciantes
- Aumenta a largura mínima do cartão (nome pode ser mais largo que o código)
- Nomes longos são truncados, perdendo informação visual (mas acessível via aria-label)

## Alternativas consideradas

- **Tooltip no hover**: Rejeitado - não funciona em mobile, exige interação
- **Nome no lugar do código**: Rejeitado - perde a identificação numérica oficial
- **Nome apenas na disposição álbum**: Rejeitado - inconsistência entre disposições
- **Nome completo sem truncamento**: Rejeitado - quebraria o layout em nomes longos
```

### 2. Atualizar: `docs/interface.md`

Adicionar seção sobre nomes nas figurinhas:

```markdown
### Nomes nas figurinhas

Cada figurinha exibe o nome do jogador/elemento abaixo do código (IDR 0047):

- **Posição**: Abaixo do código (sigla + número)
- **Fonte**: system-ui, 9px (lista) / 8px (álbum)
- **Cor**: `--cream` (mesma do código)
- **Truncamento**: Ellipsis (...) para nomes longos
- **Acessibilidade**: Nome incluído no aria-label

Exemplo:
```
BRA
05
Gabriel Magalhães
```

### Posições fixas das seleções

- **Posição 01**: "Escudo do time"
- **Posição 13**: "Foto do time"
```

### 3. Atualizar: `docs/idr/README.md`

Adicionar linha na tabela:

```markdown
| [IDR 0047](0047-nomes-nas-figurinhas.md) | Nomes nas figurinhas | Aceito | interface, catalogo | Exibe o nome do jogador/elemento abaixo do código em cada figurinha, com truncamento para nomes longos. |
```

## Critérios de aceite

- [ ] `docs/idr/0047-nomes-nas-figurinhas.md` criado
- [ ] `docs/interface.md` atualizado com seção sobre nomes
- [ ] `docs/idr/README.md` atualizado com linha do IDR 0047
