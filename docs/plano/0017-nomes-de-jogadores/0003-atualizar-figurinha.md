# Tarefa 0003: Atualizar componente Figurinha

## Objetivo

Exibir o nome do jogador abaixo do código no cartão da figurinha.

## Escopo

### Arquivo: `src/components/Figurinha.jsx`

#### 1. Adicionar prop `nome`

```javascript
export const Figurinha = memo(function Figurinha({
  codigo,
  contagem,
  metalizada = false,
  variante = 'lista',
  paisagem = false,
  nome = null, // NOVA PROP
  onIncrementar,
  onDecrementar,
}) {
  // ...
});
```

#### 2. Atualizar `propsEquivalentes`

```javascript
function propsEquivalentes(anterior, seguinte) {
  return (
    anterior.codigo === seguinte.codigo &&
    anterior.contagem === seguinte.contagem &&
    anterior.metalizada === seguinte.metalizada &&
    anterior.variante === seguinte.variante &&
    anterior.paisagem === seguinte.paisagem &&
    anterior.nome === seguinte.nome // NOVO
  );
}
```

#### 3. Exibir nome abaixo do código

```jsx
<button
  type="button"
  className="figurinha__corpo"
  ref={corpoRef}
  aria-label={`${sigla} ${numero}${nome ? `, ${nome}` : ''}, ${estadoLabel}`}
  onClick={onIncrementar}
>
  {metalizada && (
    <span className="figurinha__metalizada" aria-hidden="true" />
  )}
  <span className="figurinha__codigo" aria-hidden="true">
    <span className="figurinha__sigla">{sigla}</span>
    <span className="figurinha__numero">{numero}</span>
  </span>
  {nome && (
    <span className="figurinha__nome" aria-hidden="true">
      {nome}
    </span>
  )}
  {contagem >= 2 && (
    <span className="figurinha__selo" aria-hidden="true">
      ×{sobrando}
    </span>
  )}
</button>
```

#### 4. Atualizar aria-label do botão de menos

```jsx
<button
  type="button"
  className="figurinha__menos"
  aria-label={`remover uma unidade de ${sigla} ${numero}${nome ? `, ${nome}` : ''}`}
  onClick={(event) => {
    event.stopPropagation();
    onDecrementar();
    if (contagem === 1) {
      corpoRef.current?.focus();
    }
  }}
>
  −
</button>
```

### Arquivo: `src/components/Secao.jsx` e `src/components/PaginaDoAlbum.jsx`

Passar prop `nome` para `Figurinha`:

```jsx
<Figurinha
  key={figurinha.codigo}
  codigo={figurinha.codigo}
  contagem={contagens[figurinha.codigo] ?? 0}
  metalizada={figurinha.metalizada}
  paisagem={figurinha.paisagem}
  nome={figurinha.nome} // NOVA PROP
  variante="lista"
  onIncrementar={() => onAjustar(figurinha.codigo, 1)}
  onDecrementar={() => onAjustar(figurinha.codigo, -1)}
/>
```

## Critérios de aceite

- [ ] Prop `nome` adicionada ao componente
- [ ] Nome exibido abaixo do código quando presente
- [ ] Aria-label inclui nome do jogador
- [ ] `propsEquivalentes` atualizado
- [ ] Componentes pai passam prop `nome`
- [ ] `npm run test` passando
