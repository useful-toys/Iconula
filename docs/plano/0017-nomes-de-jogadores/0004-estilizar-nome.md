<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0004]: estilo do nome

## Status
Pendente

## Objetivo
Estilizar `.figurinha__nome` — `system-ui`, menor que o código, centralizado,
truncado com ellipsis — calibrando o tamanho nas duas disposições para o nome
ser legível sem alargar o cartão.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — `system-ui`
  em corpo menor que o código; truncamento com ellipsis
- `docs/interface.md` § Tipografia — "Poppins (600/700) no título, nos códigos
  dos cartões e nos nomes de seção; `system-ui` no restante"
- `docs/interface.md` § Medidas — tamanhos atuais do código do cartão nas
  duas variantes
- `src/components/Figurinha.css` — `.figurinha__codigo` e as variantes
  `figurinha--lista`/`figurinha--album`
- `docs/tdr/0013-tipografia-vendorizada.md` — a Poppins vendorizada não é
  afetada: o nome usa `system-ui`, como o restante não-Poppins

## Padrões e convenções aplicáveis
- `font-family: system-ui, -apple-system, sans-serif` — o nome não entra na
  Poppins — `docs/interface.md` § Tipografia
- Truncamento com `white-space: nowrap; overflow: hidden; text-overflow:
  ellipsis;` — IDR 0047
- Tamanho menor que o código da mesma variante, com o menor valor ainda
  legível: partir de 9px na lista e 8px no álbum e calibrar na verificação
  visual — nomes longos truncam, nunca quebram o layout
- Cor `--cream`, como o código — contraste textual pelos tokens existentes

## Escopo e instruções de implementação
1. Criar `.figurinha__nome` em `Figurinha.css`: bloco, centralizado, cor
   `--cream`, `system-ui`, truncamento com ellipsis, `max-width: 100%`.
2. Ajuste por variante: `.figurinha--album .figurinha__nome` com o tamanho
   menor calibrado.
3. Verificação visual nas duas disposições com os nomes mais longos da fonte
   (ex.: "Trent Alexander-Arnold"): truncados numa linha, sem empurrar o
   layout nem colar no selo `×N`.
4. Registrar os tamanhos finais em `docs/interface.md` § Medidas, citando o
   IDR 0047.

**Fora do escopo**: mudar fonte, tamanho ou cor do código do cartão; o selo
`×N`; o controle de menos.

## Decisões já tomadas (não reabrir)
- `system-ui` para o nome, Poppins restrita a título, códigos e nomes de
  seção — ver `docs/interface.md` § Tipografia e
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Truncamento com ellipsis; o nome completo vive no aria-label — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`

## Decisões em aberto nesta tarefa
- Tamanhos finais por variante — encaminhamento: partir de 9px/8px e calibrar
  na verificação visual com os nomes mais longos da fonte; o valor final fica
  em `docs/interface.md` § Medidas, citando o IDR 0047.

## Arquivos impactados
- `src/components/Figurinha.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Nome em `system-ui`, centralizado, menor que o código da mesma variante
- [ ] Nomes longos truncam com ellipsis numa linha, sem quebrar o layout
      (verificação visual)
- [ ] O tamanho final está em `docs/interface.md` § Medidas, citando o
      IDR 0047

## Validação adicional
Verificação visual em `npm run dev`, nas duas disposições, com uma seção
completa aberta (20 nomes, incluindo os mais longos da fonte) e contagens
variadas — o selo `×N` e o controle de menos continuam nos seus lugares.
