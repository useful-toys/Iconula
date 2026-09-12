<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0002]: cabeçalho de seção mais compacto

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `docs/interface.md` § Medidas — "Cabeçalho de seção: painel com borda, raio
  12px, `padding: 10px 14px`; ícone 18px, nome 14px/600" — valor atual
- `src/components/Secao.css` (`.secao__cabecalho`) — implementação
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — o cabeçalho de seção é um
  `<button>` inteiro (área de toque já generosa, 100% da largura); reduzir o
  padding vertical não encolhe uma área de toque pequena, então não conflita
  com aquele IDR

## Objetivo
Reduzir a altura do cabeçalho de cada seção — repetido 50 vezes no catálogo
inteiro — sem comprometer a legibilidade do resumo nem a área de toque do
botão de colapso.

## Padrões e convenções aplicáveis
- O cabeçalho continua sendo um único `<button>` clicável em toda a largura —
  a área de toque não muda de forma (só de altura, dentro do razoável)
- Cor nunca é o único sinal (não se aplica diretamente aqui, mas nenhuma
  mudança pode remover o ícone ou o chevron, que carregam identidade e estado)
- Ícone (18px) e tipografia (14px/600) não mudam de tamanho — só o respiro em
  volta

## Escopo e instruções de implementação
1. Reduzir `padding` de `.secao__cabecalho` (`src/components/Secao.css`) de
   `10px 14px` para um valor menor — partir de `7px 12px` e conferir em tela
   real (celular, com os 50 cabeçalhos visíveis rolando) se o botão ainda
   parece confortável de tocar e o texto não fica espremido contra a borda.
2. Medir a altura final do cabeçalho antes/depois e registrar a economia por
   seção × 50 no log da tarefa.
3. Atualizar `docs/interface.md` § Medidas com o novo valor.

**Fora do escopo**: mudar o tamanho do ícone, do chevron ou da tipografia;
mudar a borda ou o raio do painel.

## Decisões já tomadas (não reabrir)
- Cabeçalho de seção como botão de largura total, painel com borda e raio
  12px — ver `docs/interface.md` § Medidas
- Ícone 18px, nome 14px/600 — ver `docs/interface.md` § Medidas

## Decisões em aberto nesta tarefa
Nenhuma — ajuste de medida sobre uma estrutura já decidida, mesmo precedente
da Fase 6 Tarefa 3 (registrado direto em `docs/interface.md`, sem IDR novo).

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Cabeçalho de seção mais baixo, sem cortar ícone, texto ou chevron
- [ ] Continua confortável de tocar em tela sensível
- [ ] `docs/interface.md` reflete o novo valor
- [ ] Economia total (px × 50 seções) registrada no log

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`, em largura de celular: rolar por vários
super-grupos e conferir que os cabeçalhos continuam legíveis e fáceis de
tocar.
