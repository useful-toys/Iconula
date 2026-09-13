# Tarefa 0001: Dados dos jogadores

## Objetivo

Criar arquivo `src/data/jogadores.js` com os nomes de todas as figurinhas do álbum.

## Escopo

### Estrutura do arquivo

```javascript
// src/data/jogadores.js

// Nomes das figurinhas das seleções (48 seleções × 18 jogadores)
// Mapeamento: Jogador N → Figurinha (N+1) para N=1-11, Figurinha (N+2) para N=12-18
export const jogadoresPorSelecao = {
  ALG: ["Alexis Guendouz", "Ramy Bensebaini", ...], // 18 nomes
  ARG: ["Emiliano Martínez", "Nahuel Molina", ...], // 18 nomes
  // ... 46 outras seleções
};

// Nomes das figurinhas Extras FIFA (20 figurinhas: FWC00-FWC19)
export const jogadoresFWC = [
  "Escudo/Logo Oficial da Panini",
  "Emblema Oficial da FIFA World Cup 2026 (Parte Esquerda)",
  "Emblema Oficial da FIFA World Cup 2026 (Parte Direita / Troféu)",
  "Mascotes Oficiais da Competição",
  "Slogan Oficial (We Are 26)",
  "Bola Oficial do Torneio (Trionda)",
  "Host Countries & Cities – Canadá",
  "Host Countries & Cities – México",
  "Host Countries & Cities – USA",
  "FIFA Museum / Taça Jules Rimet",
  "Pôster Histórico – Uruguai 1950",
  "Pôster Histórico – Alemanha Ocidental 1954",
  "Pôster Histórico – Brasil 1962",
  "Pôster Histórico – Alemanha Ocidental 1974",
  "Pôster Histórico – Argentina 1986",
  "Pôster Histórico – Brasil 1994",
  "Pôster Histórico – Brasil 2002",
  "Pôster Histórico – Itália 2006",
  "Pôster Histórico – França 2018",
  "Pôster Histórico / Último Campeão – Argentina 2022"
];

// Nomes das figurinhas Coca-Cola (14 figurinhas: COC01-COC14)
export const jogadoresCOC = [
  "Lamine Yamal",
  "Joshua Kimmich",
  "Harry Kane",
  "Santiago Giménez",
  "Josko Gvardiol",
  "Federico Valverde",
  "Jefferson Lerma",
  "Enner Valencia",
  "Gabriel Magalhães",
  "Virgil van Dijk",
  "Alphonso Davies",
  "Emiliano Martínez",
  "Raúl Jiménez",
  "Lautaro Martínez"
];
```

### Dados completos

**Seleções (48 × 18 nomes)** - dados fornecidos pelo usuário

**Extras FIFA (20 nomes)** - dados fornecidos pelo usuário

**Coca-Cola (14 nomes)** - dados fornecidos pelo usuário

### Observação sobre Paraguai (PAR)

A lista fornecida tem apenas 13 jogadores. Precisa confirmação:
- Há mais jogadores?
- Ou a seleção tem menos figurinhas?

## Critérios de aceite

- [ ] Arquivo `src/data/jogadores.js` criado
- [ ] 48 seleções com 18 nomes cada (864 nomes)
- [ ] 20 nomes para FWC
- [ ] 14 nomes para COC
- [ ] Nomes correspondem aos dados fornecidos
- [ ] Arquivo exporta 3 constantes: `jogadoresPorSelecao`, `jogadoresFWC`, `jogadoresCOC`
