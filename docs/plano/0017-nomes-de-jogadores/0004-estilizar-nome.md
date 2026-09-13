# Tarefa 0004: Estilizar nome do jogador

## Objetivo

Criar CSS para exibir o nome do jogador abaixo do código, com truncamento para nomes longos.

## Escopo

### Arquivo: `src/components/Figurinha.css`

```css
.figurinha__nome {
  display: block;
  font-size: 9px;
  color: var(--cream);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
  max-width: 100%;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Ajuste para disposição álbum (cartões menores) */
.figurinha--album .figurinha__nome {
  font-size: 8px;
}
```

### Considerações de design

- **Fonte**: 9px (lista), 8px (álbum) - menor que o código (13px/12px)
- **Cor**: `var(--cream)` - mesma cor do código
- **Truncamento**: `text-overflow: ellipsis` com `white-space: nowrap`
- **Alinhamento**: centralizado
- **Fonte**: `system-ui` - sans-serif para contraste com Poppins do código

## Critérios de aceite

- [ ] Classe `.figurinha__nome` criada
- [ ] Nome truncado com ellipsis quando muito longo
- [ ] Fonte menor que o código
- [ ] Centralizado abaixo do código
- [ ] Ajuste para disposição álbum
- [ ] Visual verificado em `npm run dev`
