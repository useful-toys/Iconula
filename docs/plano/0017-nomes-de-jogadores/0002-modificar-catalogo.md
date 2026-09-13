# Tarefa 0002: Modificar catálogo

## Objetivo

Adicionar campo `nome` às figurinhas no catálogo, usando os dados de `jogadores.js`.

## Escopo

### Arquivo: `src/data/catalogo.js`

#### 1. Importar dados de jogadores

```javascript
import { jogadoresPorSelecao, jogadoresFWC, jogadoresCOC } from './jogadores.js';
```

#### 2. Criar função auxiliar

```javascript
function obterNomeFigurinha(sigla, posicao) {
  // Extras FIFA: FWC00-FWC19
  if (sigla === 'FWC') {
    return jogadoresFWC[posicao] ?? null;
  }
  
  // Coca-Cola: COC01-COC14
  if (sigla === 'COC') {
    return jogadoresCOC[posicao - 1] ?? null;
  }
  
  // Seleções: posições fixas e jogadores
  if (posicao === 1) return 'Escudo do time';
  if (posicao === 13) return 'Foto do time';
  
  // Jogadores 1-11 → posições 02-12
  if (posicao >= 2 && posicao <= 12) {
    return jogadoresPorSelecao[sigla]?.[posicao - 2] ?? null;
  }
  
  // Jogadores 12-18 → posições 14-20
  if (posicao >= 14 && posicao <= 20) {
    return jogadoresPorSelecao[sigla]?.[posicao - 3] ?? null;
  }
  
  return null;
}
```

#### 3. Modificar `expandirFigurinhas()`

```javascript
export function expandirFigurinhas(secoesDoCatalogo) {
  const figurinhas = [];
  for (const secao of secoesDoCatalogo) {
    const inicio = secao.inicio ?? 1;
    for (let posicao = inicio; posicao < inicio + secao.total; posicao += 1) {
      const numero = String(posicao).padStart(2, "0");
      figurinhas.push({
        codigo: `${secao.sigla}${numero}`,
        secao: secao.sigla,
        posicao,
        nome: obterNomeFigurinha(secao.sigla, posicao), // NOVO CAMPO
        metalizada: secao.tipo === "selecao" && posicao === 1,
        paisagem: secao.tipo === "selecao" && posicao === 13,
      });
    }
  }
  return figurinhas;
}
```

## Critérios de aceite

- [ ] Função `obterNomeFigurinha()` criada
- [ ] Campo `nome` adicionado a todas as figurinhas
- [ ] Mapeamento correto: posições 02-12 → jogadores 1-11, posições 14-20 → jogadores 12-18
- [ ] FWC00-FWC19 com nomes corretos
- [ ] COC01-COC14 com nomes corretos
- [ ] Seleções com "Escudo do time" (01) e "Foto do time" (13)
- [ ] `npm run test` passando
