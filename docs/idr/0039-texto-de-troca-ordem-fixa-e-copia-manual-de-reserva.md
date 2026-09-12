<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0039: Texto de troca em ordem fixa, com cópia manual de reserva

## Status

Aceito.

## Contexto

A Tarefa 0009-0003 implementa os dois comandos de texto de troca
(`docs/requisitos.md` § Compartilhamento) e deixou duas pendências de
desenho:

1. Se o texto segue a ordenação vigente na tela (página do álbum × sigla)
   ou usa sempre a mesma ordem, independente do que o usuário está vendo.
2. O que oferecer quando a área de transferência não funciona (API
   ausente, permissão negada) — a tarefa já fixa que isso é **aviso**
   dourado, nunca falha (IDR 0029), mas não diz o que acontece com o
   texto em si.

## Decisão

- O texto de troca usa **sempre a ordem do álbum** (FWC abre, COC fecha,
  IDR 0028) — `extrairSecoes(ordenarPorPagina(secoes))` —,
  **independente** da ordenação vigente na tela (`ordenacao` de
  `App.jsx`). Duas pessoas trocando figurinhas comparam listas geradas
  em momentos e preferências de tela diferentes; uma ordem fixa torna as
  listas comparáveis linha a linha.
- Quando `navigator.clipboard.writeText` não existe ou rejeita, além do
  aviso dourado ("Área de transferência indisponível — copie o texto que
  apareceu na tela"), o texto é mostrado num `window.prompt()` — campo de
  texto nativo do navegador, com o conteúdo pré-selecionado na maioria
  dos navegadores, pronto para `Ctrl+C`/`Cmd+C` manual. Sem tela nova, sem
  componente novo.

## Consequências

- `src/lib/textoDeTroca.js` não lê a ordenação vigente — recebe as
  seções já ordenadas por quem chama (`App.jsx`), o que também o mantém
  uma função pura e simples de testar
- O texto de troca pode diferir visualmente da disposição da tela no
  momento (ex.: tela em "Sigla", texto sempre na ordem do álbum) —
  aceito de propósito, é a comparabilidade que se busca
- `window.prompt()` é síncrono e bloqueia a aba até ser dispensado —
  efeito colateral aceitável para um caminho de exceção raro (só
  acontece quando a API de área de transferência já falhou)
- Testes de `App.jsx` que exercitam a falha de cópia precisam stubar
  `window.prompt`, além de `navigator.clipboard`

## Alternativas consideradas

- **Texto na ordenação vigente**: mais "o que você vê é o que copia",
  mas duas pessoas com preferências de tela diferentes gerariam listas
  difíceis de comparar — o objetivo prático de uma lista de troca
- **Tela ou modal dedicado para cópia manual**: mais controle visual,
  mas cria uma tela nova só para um caminho de exceção raro — contra a
  simplicidade que o resto do app persegue (nenhuma tela cresce por
  contas de borda)
- **Nenhuma saída para cópia manual, só o aviso**: o trabalho de gerar
  o texto (que já rodou, é gratuito) se perderia sem alternativa — o
  usuário precisaria repetir a ação depois de resolver a permissão, sem
  garantia de que resolveria
