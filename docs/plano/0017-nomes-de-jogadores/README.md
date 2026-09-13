# Fase 17: Nomes de Jogadores nas Figurinhas

## Objetivo

Adicionar o nome do jogador/figurinha abaixo do código em cada cartão da figurinha, facilitando a identificação visual.

## Contexto

Atualmente, as figurinhas exibem apenas o código (ex.: "BRA 05") sem indicar qual jogador ou elemento representa. Com 994 figurinhas, identificar cada uma exige conhecimento prévio do álbum.

## Escopo

### Dados a adicionar

1. **Seleções (48 × 20 = 960 figurinhas)**
   - Posição 01: "Escudo do time"
   - Posições 02-12: Jogadores 1-11
   - Posição 13: "Foto do time"
   - Posições 14-20: Jogadores 12-18

2. **Extras FIFA (FWC00-FWC19 = 20 figurinhas)**
   - FWC00: "Escudo/Logo Oficial da Panini"
   - FWC01: "Emblema Oficial da FIFA World Cup 2026 (Parte Esquerda)"
   - FWC02: "Emblema Oficial da FIFA World Cup 2026 (Parte Direita / Troféu)"
   - FWC03: "Mascotes Oficiais da Competição"
   - FWC04: "Slogan Oficial (We Are 26)"
   - FWC05: "Bola Oficial do Torneio (Trionda)"
   - FWC06: "Host Countries & Cities – Canadá"
   - FWC07: "Host Countries & Cities – México"
   - FWC08: "Host Countries & Cities – USA"
   - FWC09: "FIFA Museum / Taça Jules Rimet"
   - FWC10-FWC19: Pôsteres históricos de copas anteriores

3. **Coca-Cola (COC01-COC14 = 14 figurinhas)**
   - CC1-CC14: Jogadores destacados (Lamine Yamal, Joshua Kimmich, etc.)

### Decisões de design

- **Posição**: Nome abaixo do código (sigla + número)
- **Truncamento**: Ellipsis (...) para nomes longos
- **Disposições**: Visível em lista e álbum
- **Acessibilidade**: Nome incluído no aria-label

## Tarefas

| # | Tarefa | Objetivo | Status |
|---|--------|----------|--------|
| 0001 | [Dados dos jogadores](0001-dados-dos-jogadores.md) | Criar arquivo com nomes de todas as figurinhas | Pendente |
| 0002 | [Modificar catálogo](0002-modificar-catalogo.md) | Adicionar campo "nome" às figurinhas | Pendente |
| 0003 | [Atualizar componente Figurinha](0003-atualizar-figurinha.md) | Exibir nome abaixo do código | Pendente |
| 0004 | [Estilizar nome do jogador](0004-estilizar-nome.md) | CSS para nome e truncamento | Pendente |
| 0005 | [Atualizar testes](0005-atualizar-testes.md) | Testes de dados, catálogo e componente | Pendente |
| 0006 | [Documentar decisão](0006-documentar-decisao.md) | IDR sobre exibição de nomes | Pendente |

## Dependências

- Nenhuma dependência de outras fases
- Pode ser executada em paralelo com outras fases

## Critérios de aceite

- [ ] Todas as 994 figurinhas têm nome
- [ ] Nome visível abaixo do código em lista e álbum
- [ ] Nomes longos truncados com ellipsis
- [ ] Aria-label inclui nome do jogador
- [ ] Testes passando
- [ ] Documentação atualizada
