<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0004-0003: empilhamento das páginas em tela estreita

## Data
2026-09-10

## Resumo
Implementado o empilhamento responsivo das páginas do álbum na disposição
"como no álbum". As duas páginas do spread ficam lado a lado quando cabem na
largura da tela e empilham quando não cabem, com as trilhas de 52px intactas
em ambos os casos.

### O que foi feito

1. **CSS da página do álbum**: adicionado `flex-shrink: 0` em `.pagina-album`
   para garantir que as páginas mantenham sua largura fixa baseada nas trilhas
   de 52px, não encolhendo para caber no contêiner.

2. **Estrutura flex já existente**: o contêiner `.secao__album` já possuía
   `display: flex; flex-wrap: wrap; gap: var(--album-page-gap);`, que é a
   solução CSS pura para empilhamento responsivo. O `flex-wrap: wrap` faz as
   páginas quebrarem para a linha seguinte quando não há espaço horizontal
   suficiente.

3. **Ponto de quebra calculado**: o ponto de quebra não é um breakpoint
   arbitrário, mas decorre da largura real do spread:
   - Seleções (4 trilhas): 2 × (4 × 52px + 3 × 6px) + 20px = 472px
   - Coca-Cola (3 trilhas): 2 × (3 × 52px + 2 × 6px) + 20px = 356px
   - Mais as margens laterais `clamp(16px, 4vw, 40px)`

4. **Ordem das páginas mantida**: a página 1 (figurinhas 01-10) fica acima da
   página 2 (figurinhas 11-20) quando empilhadas, conforme IDR 0015.

5. **Testes adicionados**: 3 testes novos em `Secao.test.jsx` verificam:
   - O contêiner do spread tem a classe correta para flex-wrap
   - As páginas são renderizadas na ordem correta (página 1 antes da página 2)
   - As páginas mantêm largura fixa baseada nas trilhas de 52px

### Decisão encaminhada
A implementação usa `flex-wrap` em vez de consulta de contêiner (container
query). Ambas são soluções CSS puras sem JavaScript, mas `flex-wrap` tem
suporte mais amplo em navegadores evergreen e não requer definição de
breakpoints explícitos. O ponto de quebra é determinado naturalmente pela
largura dos itens flex (as páginas com trilhas fixas). Sem registro novo.

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface foi tomada — todo o
comportamento já estava especificado nos IDRs 0008, 0009 e 0015.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 37 arquivos.
- `vitest run`: 15 arquivos de teste, 111 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (384.13 kB JS,
  8.55 kB CSS).

## Arquivos alterados
- `src/components/PaginaDoAlbum.css` — adicionado `flex-shrink: 0`
- `src/components/Secao.test.jsx` — 3 testes novos para empilhamento
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/0003-empilhamento-das-paginas.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0003 atualizado
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0003-log-empilhamento-das-paginas.md` — este log
