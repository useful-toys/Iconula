# Tarefa 0005: Atualizar testes

## Objetivo

Criar/atualizar testes para validar os dados de jogadores, o campo `nome` no catálogo e a exibição no componente.

## Escopo

### 1. Novo arquivo: `src/data/jogadores.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { jogadoresPorSelecao, jogadoresFWC, jogadoresCOC } from './jogadores.js';
import { secoes } from './catalogo.js';

describe('jogadores', () => {
  describe('jogadoresPorSelecao', () => {
    it('tem 48 seleções', () => {
      expect(Object.keys(jogadoresPorSelecao)).toHaveLength(48);
    });

    it('cada seleção tem 18 jogadores', () => {
      for (const [sigla, jogadores] of Object.entries(jogadoresPorSelecao)) {
        expect(jogadores).toHaveLength(18);
      }
    });

    it('nenhum nome está vazio', () => {
      for (const [sigla, jogadores] of Object.entries(jogadoresPorSelecao)) {
        for (const nome of jogadores) {
          expect(nome).toBeTruthy();
          expect(typeof nome).toBe('string');
        }
      }
    });

    it('contém todas as seleções do catálogo', () => {
      const selecoesCatalogo = secoes
        .filter(s => s.tipo === 'selecao')
        .map(s => s.sigla);
      
      for (const sigla of selecoesCatalogo) {
        expect(jogadoresPorSelecao).toHaveProperty(sigla);
      }
    });
  });

  describe('jogadoresFWC', () => {
    it('tem 20 nomes', () => {
      expect(jogadoresFWC).toHaveLength(20);
    });

    it('primeiro nome é "Escudo/Logo Oficial da Panini"', () => {
      expect(jogadoresFWC[0]).toBe('Escudo/Logo Oficial da Panini');
    });
  });

  describe('jogadoresCOC', () => {
    it('tem 14 nomes', () => {
      expect(jogadoresCOC).toHaveLength(14);
    });

    it('primeiro nome é "Lamine Yamal"', () => {
      expect(jogadoresCOC[0]).toBe('Lamine Yamal');
    });
  });
});
```

### 2. Atualizar: `src/data/catalogo.test.js`

Adicionar testes para o campo `nome`:

```javascript
describe('expandirFigurinhas', () => {
  it('adiciona campo nome a todas as figurinhas', () => {
    const figurinhas = expandirFigurinhas(secoes);
    for (const fig of figurinhas) {
      expect(fig).toHaveProperty('nome');
    }
  });

  it('posição 01 tem "Escudo do time" para seleções', () => {
    const escudos = figurinhas.filter(f => f.posicao === 1 && f.codigo.startsWith('BRA'));
    expect(escudos[0].nome).toBe('Escudo do time');
  });

  it('posição 13 tem "Foto do time" para seleções', () => {
    const fotos = figurinhas.filter(f => f.posicao === 13 && f.codigo.startsWith('BRA'));
    expect(fotos[0].nome).toBe('Foto do time');
  });

  it('FWC00 tem nome correto', () => {
    const fwc00 = figurinhas.find(f => f.codigo === 'FWC00');
    expect(fwc00.nome).toBe('Escudo/Logo Oficial da Panini');
  });

  it('COC01 tem nome correto', () => {
    const coc01 = figurinhas.find(f => f.codigo === 'COC01');
    expect(coc01.nome).toBe('Lamine Yamal');
  });
});
```

### 3. Atualizar: `src/components/Figurinha.test.jsx`

Adicionar testes para exibição do nome:

```javascript
describe('Figurinha', () => {
  it('exibe nome do jogador quando fornecido', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        nome="Gabriel Magalhães"
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />
    );
    expect(screen.getByText('Gabriel Magalhães')).toBeInTheDocument();
  });

  it('inclui nome no aria-label', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        nome="Gabriel Magalhães"
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'BRA 05, Gabriel Magalhães, faltante');
  });

  it('não exibe nome quando não fornecido', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />
    );
    const nomeElement = screen.queryByText(/.+/, { selector: '.figurinha__nome' });
    expect(nomeElement).not.toBeInTheDocument();
  });
});
```

## Critérios de aceite

- [ ] `src/data/jogadores.test.js` criado com testes de dados
- [ ] `src/data/catalogo.test.js` atualizado com testes de campo `nome`
- [ ] `src/components/Figurinha.test.jsx` atualizado com testes de exibição
- [ ] `npm run test` passando
